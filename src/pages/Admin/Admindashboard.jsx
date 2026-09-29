import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  Truck,
  Palette,
  LogOut,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  MessageCircle,
  Printer,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Cake,
  Menu,
  X,
  Store,
  Save,
  Tag,
  Phone,
  Percent,
  ChevronRight,
  Eye,
  Heart,
  Gift,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function AdminDashboard({ onLogout }) {
  const {
    products,
    orders,
    currentAdmin,
    announcements,
    heroSlides,
    healthGoals,
    giftingConfig,
    discountConfig,
    footerConfig,
    saveCMSSection,
    addProduct,
    toggleStockStatus,
    deleteProduct,
    updateOrderStatus,
    logoutAdmin,
  } = useStore();

  const API_BASE_URL = "https://pure-organics1.onrender.com";

  const role = currentAdmin?.role || "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isStoreManager = role === "STORE_MANAGER";
  const isDispatch = role === "DISPATCH";

  const [activeNav, setActiveNav] = useState(
    isDispatch
      ? "logistics"
      : isStoreManager
        ? "catalog"
        : isAdmin
          ? "cms"
          : "overview",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [logisticsFilter, setLogisticsFilter] = useState("All");

  const [toastMsg, setToastMsg] = useState("");
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const [leads, setLeads] = useState([]);
  const [searchInsights, setSearchInsights] = useState({
    topKeywords: [],
    topCategories: [],
  });

  // Product Management Form
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Cold-Pressed Oils",
    price: "",
    unit: "1 Litre Bottle",
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  // Split-Screen Interactive CMS Form States
  const [cmsTab, setCmsTab] = useState("announcement");
  const [announcementForm, setAnnouncementForm] = useState(
    announcements || {
      bannerText: "FLAT 50% OFF ON OUR PURE ORGANIC BESTSELLERS",
      badgeText: "Harvest Special",
      couponCode: "HARVEST50",
    },
  );

  const [heroForm, setHeroForm] = useState(
    heroSlides?.[0] || {
      tag: "BESTSELLER #1 • COLD-PRESSED",
      title: "Vaagai Wood-Pressed",
      titleHighlight: "Sesame Oil",
      price: "380",
      originalPrice: "450",
      unit: "1 Litre Glass Bottle",
      quote:
        "Milled in traditional vaagai wood mortars to retain rich polyphenols & aroma.",
    },
  );

  const [healthGoalsForm, setHealthGoalsForm] = useState(
    healthGoals || {
      heading: "Targeted Wellness from Native Soil",
      subheading:
        "Curated unpolished grains and cold-pressed oils aligned to your dietary vitality.",
    },
  );

  const [giftingForm, setGiftingForm] = useState(
    giftingConfig || {
      badge: "Heritage Farm Box",
      title: "Curated Native Harvest Gift Hampers",
      description:
        "Gift natural wellness with stone-ground spices, raw honey, and wood-pressed staples.",
    },
  );

  const [discountForm, setDiscountForm] = useState(
    discountConfig || {
      title: "Unlock ₹100 Welcome Harvest Voucher",
      subtitle:
        "Pure chemical-free farm staples delivered fresh to your doorstep.",
      couponCode: "HARVEST10",
    },
  );

  const [footerForm, setFooterForm] = useState(
    footerConfig || {
      farmTagline:
        "Nurturing regional native biodiversity and fair prices for local farm collectives.",
      contactPhone: "+91 98765 43210",
      contactEmail: "care@pureorganics.in",
    },
  );

  // Synchronize state when context loads
  useEffect(() => {
    if (announcements) setAnnouncementForm(announcements);
    if (heroSlides?.[0]) setHeroForm(heroSlides[0]);
    if (healthGoals) setHealthGoalsForm(healthGoals);
    if (giftingConfig) setGiftingForm(giftingConfig);
    if (discountConfig) setDiscountForm(discountConfig);
    if (footerConfig) setFooterForm(footerConfig);
  }, [
    announcements,
    heroSlides,
    healthGoals,
    giftingConfig,
    discountConfig,
    footerConfig,
  ]);

  useEffect(() => {
    let isMounted = true;

    fetch(`${API_BASE_URL}/api/leads`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (isMounted && Array.isArray(d)) setLeads(d);
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/admin/search-insights`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (isMounted && d) setSearchInsights(d);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // In-Place Session Termination
  const handleEndSession = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    localStorage.removeItem("pure_admin_user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("pure_organics_admin");

    if (typeof onLogout === "function") {
      onLogout();
    } else if (typeof logoutAdmin === "function") {
      logoutAdmin();
    }
  };

  const grossRevenue = Math.round(
    orders.reduce((sum, o) => sum + Number(o.total || o.total_amount || 0), 0),
  );
  const outOfStockItems = products.filter(
    (p) => p.inStock === false || p.in_stock === false,
  );
  const avgOrderValue =
    orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;
  const grossProfit = Math.round(grossRevenue * 0.42);
  const todaysBirthdays = leads.filter((l) => l.is_birthday_today === 1);

  // Live Product PUT Update
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editingProduct,
            price: Number(editingProduct.price),
          }),
        },
      );

      if (res.ok) {
        triggerToast("Product updated in live database!");
        setEditingProduct(null);
      } else {
        alert("Failed to update product details.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching backend server.");
    }
  };

  // WhatsApp Alert
  const sendWhatsAppUpdate = (order) => {
    const rawPhone = (
      order.customer?.phone ||
      order.customer_phone ||
      ""
    ).replace(/\D/g, "");
    if (!rawPhone) {
      alert("No customer phone number available.");
      return;
    }
    const phone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const trackingId = order.trackingId || order.tracking_id;
    const name = order.customer?.name || order.customer_name || "Valued Patron";
    const status = order.status || "Placed";
    const total = Math.round(Number(order.total || order.total_amount || 0));
    const address =
      order.customer?.address || order.customer_address || "Customer Address";

    const msg = `🌿 *Pure Organics - Order ${status}!*

Hello *${name}*,
Your native farm harvest consignment (*${trackingId}*) status is now: *${status}*.
• *Total Payable:* ₹${total}
• *Destination:* ${address}

Live tracking: https://pure-organics1.vercel.app/#/track?id=${trackingId}`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  // Manifest Print
  const printManifest = (order) => {
    const trackingId = order.trackingId || order.tracking_id;
    const name = order.customer?.name || order.customer_name || "Customer";
    const phone = order.customer?.phone || order.customer_phone || "N/A";
    const address =
      order.customer?.address || order.customer_address || "Customer Address";
    const total = Math.round(Number(order.total || order.total_amount || 0));

    const slip = window.open("", "_blank");
    slip.document.write(`
      <html>
        <head><title>Manifest - ${trackingId}</title></head>
        <body style="font-family: system-ui, -apple-system, sans-serif; padding: 24px; color: #111;">
          <h2>Pure Organics - Consignment Manifest</h2>
          <hr style="margin: 12px 0;" />
          <p>Consignment ID: <b>${trackingId}</b></p>
          <p>Customer: <b>${name}</b> (+91 ${phone})</p>
          <p>Address: ${address}</p>
          <h3 style="margin-top: 16px;">Total Collectable (COD): ₹${total}</h3>
          <script>window.print();</script>
        </body>
      </html>
    `);
    slip.document.close();
  };

  const navItems = [
    ...(isSuperAdmin
      ? [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }]
      : []),
    ...(isStoreManager || isSuperAdmin
      ? [{ id: "catalog", label: "Catalog & Stock", icon: Package }]
      : []),
    ...(isDispatch || isSuperAdmin
      ? [{ id: "logistics", label: "Orders & Shipping", icon: Truck }]
      : []),
    ...(isAdmin || isSuperAdmin
      ? [{ id: "cms", label: "Storefront CMS Studio", icon: Palette }]
      : []),
  ];

  const categories = [
    "All",
    "Cold-Pressed Oils",
    "Native Rice",
    "Millets & Grains",
    "Natural Sweeteners",
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(catalogSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredOrders = orders.filter((o) =>
    logisticsFilter === "All"
      ? true
      : (o.status || "Placed") === logisticsFilter,
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-800 flex font-sans antialiased">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs font-medium shadow-2xl animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left Navigation Sidebar */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                  Pure Organics
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-700 font-semibold">
                  Farm Admin
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase">
              {currentAdmin?.username?.slice(0, 2) || "AD"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {currentAdmin?.name || "Operations Desk"}
              </p>
              <span className="text-[10px] inline-block px-1.5 py-0.2 bg-white rounded border border-slate-200 text-slate-600 font-mono">
                {role}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* End Session Button */}
        <button
          type="button"
          onClick={handleEndSession}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" /> End Session
        </button>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-slate-900">
              {navItems.find((n) => n.id === activeNav)?.label || "Dashboard"}
            </h1>
          </div>

          <a
            href="https://pure-organics1.vercel.app/#/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>
        </header>

        <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* MODULE 1: EXECUTIVE PULSE */}
          {activeNav === "overview" && isSuperAdmin && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Total Revenue
                    </span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="my-3">
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{grossRevenue.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    100% Native Wood-Pressed
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Average Order Value
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="my-3">
                    <p className="text-2xl font-bold text-slate-900">
                      ₹{avgOrderValue.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {orders.length} total orders recorded
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Gross Margin (42%)
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="my-3">
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹{grossProfit.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Net operational margin
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Out of Stock
                    </span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="my-3">
                    <p className="text-2xl font-bold text-rose-600">
                      {outOfStockItems.length}
                    </p>
                  </div>
                  <span className="text-[11px] text-rose-600 font-medium">
                    Replenishment needed
                  </span>
                </div>
              </div>

              {todaysBirthdays.length > 0 && (
                <div className="p-5 rounded-2xl bg-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Loyalty Trigger
                    </span>
                    <h3 className="text-base font-bold mt-0.5">
                      {todaysBirthdays.length} Customers Celebrating Today
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    {todaysBirthdays.map((b) => (
                      <a
                        key={b.id}
                        href={`https://wa.me/91${b.phone}?text=Dear%20Valued%20Customer,%20Warmest%20birthday%20greetings%20from%20the%20Pure%20Organics%20farm%20family!%20%F0%9F%8E%82%20Enjoy%20a%20special%2020%25%20birthday%20harvest%20discount%20using%20coupon:%20BDAY20`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <Cake className="w-4 h-4" /> Send BDAY20 to {b.phone}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 2: CATALOG & INVENTORY */}
          {activeNav === "catalog" && (isStoreManager || isSuperAdmin) && (
            <div className="space-y-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Add New Farm Product
                  </h3>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newProduct.name || !newProduct.price) return;
                    await addProduct({
                      ...newProduct,
                      price: Number(newProduct.price),
                    });
                    setNewProduct({
                      name: "",
                      category: "Cold-Pressed Oils",
                      price: "",
                      unit: "1 Litre Bottle",
                      image: "",
                    });
                    triggerToast("New product published live!");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Product Title (e.g. Vaagai Sesame Oil)"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="Cold-Pressed Oils">Cold-Pressed Oils</option>
                    <option value="Native Rice">Native Rice</option>
                    <option value="Millets & Grains">Millets & Grains</option>
                    <option value="Natural Sweeteners">
                      Natural Sweeteners
                    </option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Price (₹)"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                  <input
                    type="text"
                    placeholder="Packaging (e.g. 1L Glass Bottle)"
                    value={newProduct.unit}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, unit: e.target.value })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200"
                  />
                  <div className="sm:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Publish to Catalog
                    </button>
                  </div>
                </form>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-slate-900 text-white font-semibold"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search catalog..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                          {p.category || "Native Harvest"}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleStockStatus(p.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                            p.inStock !== false && p.in_stock !== false
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {p.inStock !== false && p.in_stock !== false
                            ? "✓ In Stock"
                            : "✕ Out of Stock"}
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {p.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {p.unit || "1 Unit"}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                      <span className="text-base font-bold text-slate-900">
                        ₹{p.price}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3 text-slate-500" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-sm text-slate-900">
                        Edit Product Details
                      </h3>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="p-1 text-slate-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form
                      onSubmit={handleUpdateProduct}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Product Title
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-medium"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            required
                            value={editingProduct.price || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                price: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Packaging Unit
                          </label>
                          <input
                            type="text"
                            value={editingProduct.unit || ""}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                unit: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODULE 3: LOGISTICS & SHIPPING */}
          {activeNav === "logistics" && (isDispatch || isSuperAdmin) && (
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Order Logistics Hub ({orders.length} Consignments)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live order fulfillment and WhatsApp alerts
                  </p>
                </div>
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                  {["All", "Placed", "Packed", "Shipped", "Delivered"].map(
                    (st) => (
                      <button
                        key={st}
                        onClick={() => setLogisticsFilter(st)}
                        className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          logisticsFilter === st
                            ? "bg-white text-slate-900 font-bold shadow-2xs"
                            : "text-slate-600"
                        }`}
                      >
                        {st}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                    <tr>
                      <th className="px-5 py-3">Tracking ID</th>
                      <th className="px-5 py-3">Recipient Details</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Transit Note</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => {
                      const trackingId = ord.trackingId || ord.tracking_id;
                      const name =
                        ord.customer?.name || ord.customer_name || "Customer";
                      const phone =
                        ord.customer?.phone || ord.customer_phone || "";
                      const status = ord.status || "Placed";
                      const note = ord.dispatchNote || ord.dispatch_note || "";

                      return (
                        <tr
                          key={trackingId}
                          className="hover:bg-slate-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono font-bold text-emerald-800">
                            {trackingId}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-slate-900">
                              {name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {phone}
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <select
                              value={status}
                              onChange={(e) =>
                                updateOrderStatus(
                                  trackingId,
                                  e.target.value,
                                  note,
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 font-medium cursor-pointer"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5">
                            <input
                              type="text"
                              defaultValue={note}
                              placeholder="e.g. Verified at Hub"
                              onBlur={(e) =>
                                updateOrderStatus(
                                  trackingId,
                                  status,
                                  e.target.value,
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 w-56 text-xs"
                            />
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => sendWhatsAppUpdate(ord)}
                              className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                            >
                              <MessageCircle className="w-3 h-3" /> WA Alert
                            </button>
                            <button
                              type="button"
                              onClick={() => printManifest(ord)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3 h-3" /> Manifest
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MODULE 4: STOREFRONT CMS STUDIO */}
          {activeNav === "cms" && (isAdmin || isSuperAdmin) && (
            <div className="space-y-6">
              <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-100 p-1.5 rounded-xl w-fit text-xs">
                {[
                  {
                    id: "announcement",
                    label: "Top Announcement Bar",
                    icon: Tag,
                  },
                  { id: "hero", label: "Hero Showcase Slide", icon: Sparkles },
                  {
                    id: "philosophy",
                    label: "Health Philosophy Banner",
                    icon: Heart,
                  },
                  { id: "gifting", label: "Harvest Gift Hampers", icon: Gift },
                  {
                    id: "discount",
                    label: "Welcome Voucher Popup",
                    icon: Percent,
                  },
                  {
                    id: "footer",
                    label: "Footer, Mission & Support",
                    icon: Phone,
                  },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setCmsTab(s.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                        cmsTab === s.id
                          ? "bg-white text-slate-900 font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  {/* Announcement Form */}
                  {cmsTab === "announcement" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection(
                          "announcement",
                          announcementForm,
                        );
                        if (success)
                          triggerToast(
                            "Announcement updated live in database!",
                          );
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Announcement Bar Editor
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Top-most ticker shown across every customer page
                        </p>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Banner Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={announcementForm.bannerText || ""}
                          onChange={(e) =>
                            setAnnouncementForm({
                              ...announcementForm,
                              bannerText: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Pill Badge Text
                          </label>
                          <input
                            type="text"
                            required
                            value={announcementForm.badgeText || ""}
                            onChange={(e) =>
                              setAnnouncementForm({
                                ...announcementForm,
                                badgeText: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Promo Coupon Code
                          </label>
                          <input
                            type="text"
                            required
                            value={announcementForm.couponCode || ""}
                            onChange={(e) =>
                              setAnnouncementForm({
                                ...announcementForm,
                                couponCode: e.target.value.toUpperCase(),
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Announcement Bar
                      </button>
                    </form>
                  )}

                  {/* Hero Form */}
                  {cmsTab === "hero" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection("hero_slides", [
                          heroForm,
                        ]);
                        if (success)
                          triggerToast("Hero banner updated in database!");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Hero Slide Showcase
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Primary visual hook on the customer storefront
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Tagline Pill
                          </label>
                          <input
                            type="text"
                            value={heroForm.tag || ""}
                            onChange={(e) =>
                              setHeroForm({ ...heroForm, tag: e.target.value })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Highlighted Title
                          </label>
                          <input
                            type="text"
                            value={heroForm.titleHighlight || ""}
                            onChange={(e) =>
                              setHeroForm({
                                ...heroForm,
                                titleHighlight: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Main Heading
                        </label>
                        <input
                          type="text"
                          value={heroForm.title || ""}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, title: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Heritage Story Quote
                        </label>
                        <textarea
                          rows="2"
                          value={heroForm.quote || ""}
                          onChange={(e) =>
                            setHeroForm({ ...heroForm, quote: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Price (₹)
                          </label>
                          <input
                            type="number"
                            value={heroForm.price || ""}
                            onChange={(e) =>
                              setHeroForm({
                                ...heroForm,
                                price: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Original Price (₹)
                          </label>
                          <input
                            type="number"
                            value={heroForm.originalPrice || ""}
                            onChange={(e) =>
                              setHeroForm({
                                ...heroForm,
                                originalPrice: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Hero Showcase
                      </button>
                    </form>
                  )}

                  {/* Philosophy Form */}
                  {cmsTab === "philosophy" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection(
                          "health_goals",
                          healthGoalsForm,
                        );
                        if (success)
                          triggerToast("Philosophy section saved live!");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Health Philosophy Section
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Narrative explaining benefits of unpolished grains
                        </p>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={healthGoalsForm.heading || ""}
                          onChange={(e) =>
                            setHealthGoalsForm({
                              ...healthGoalsForm,
                              heading: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Supporting Subtext
                        </label>
                        <textarea
                          rows="3"
                          value={healthGoalsForm.subheading || ""}
                          onChange={(e) =>
                            setHealthGoalsForm({
                              ...healthGoalsForm,
                              subheading: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Philosophy Section
                      </button>
                    </form>
                  )}

                  {/* Gifting Form */}
                  {cmsTab === "gifting" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection(
                          "gifting_banner",
                          giftingForm,
                        );
                        if (success) triggerToast("Gifting banner saved live!");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Gifting Hampers Section
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Curated heritage farm gift box promotion
                        </p>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={giftingForm.badge || ""}
                          onChange={(e) =>
                            setGiftingForm({
                              ...giftingForm,
                              badge: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Heading
                        </label>
                        <input
                          type="text"
                          value={giftingForm.title || ""}
                          onChange={(e) =>
                            setGiftingForm({
                              ...giftingForm,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Description
                        </label>
                        <textarea
                          rows="2"
                          value={giftingForm.description || ""}
                          onChange={(e) =>
                            setGiftingForm({
                              ...giftingForm,
                              description: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Gifting Banner
                      </button>
                    </form>
                  )}

                  {/* Discount Form */}
                  {cmsTab === "discount" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection(
                          "discount_modal",
                          discountForm,
                        );
                        if (success)
                          triggerToast("Welcome voucher saved live!");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Welcome Discount Voucher
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Popup incentive for new first-time store visitors
                        </p>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Offer Title
                        </label>
                        <input
                          type="text"
                          value={discountForm.title || ""}
                          onChange={(e) =>
                            setDiscountForm({
                              ...discountForm,
                              title: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Coupon Code
                        </label>
                        <input
                          type="text"
                          value={discountForm.couponCode || ""}
                          onChange={(e) =>
                            setDiscountForm({
                              ...discountForm,
                              couponCode: e.target.value.toUpperCase(),
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono font-bold"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Terms Subtext
                        </label>
                        <input
                          type="text"
                          value={discountForm.subtitle || ""}
                          onChange={(e) =>
                            setDiscountForm({
                              ...discountForm,
                              subtitle: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Discount Voucher
                      </button>
                    </form>
                  )}

                  {/* Footer Form */}
                  {cmsTab === "footer" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const success = await saveCMSSection(
                          "footer",
                          footerForm,
                        );
                        if (success)
                          triggerToast("Footer configuration saved live!");
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          Footer & Help Desk
                        </h3>
                        <p className="text-slate-500 mt-0.5">
                          Bottom brand anchor, mission message, and contacts
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Helpline Phone
                          </label>
                          <input
                            type="text"
                            value={footerForm.contactPhone || ""}
                            onChange={(e) =>
                              setFooterForm({
                                ...footerForm,
                                contactPhone: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Care Email
                          </label>
                          <input
                            type="email"
                            value={footerForm.contactEmail || ""}
                            onChange={(e) =>
                              setFooterForm({
                                ...footerForm,
                                contactEmail: e.target.value,
                              })
                            }
                            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Farm Heritage Mission Tagline
                        </label>
                        <textarea
                          rows="2"
                          value={footerForm.farmTagline || ""}
                          onChange={(e) =>
                            setFooterForm({
                              ...footerForm,
                              farmTagline: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" /> Save Footer Settings
                      </button>
                    </form>
                  )}
                </div>

                {/* Real-Time Preview Pane */}
                <div className="lg:col-span-6 bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Live Storefront Preview ({cmsTab.toUpperCase()})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Real-Time Sync
                    </span>
                  </div>

                  <div className="bg-[#faf8f5] text-slate-800 rounded-2xl p-5 border border-slate-200 shadow-inner min-h-[340px] flex flex-col justify-center">
                    {/* Announcement Preview */}
                    {cmsTab === "announcement" && (
                      <div className="space-y-3 w-full animate-in fade-in duration-200">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">
                          Top Header Bar Preview
                        </p>
                        <div className="bg-[#1b3b27] text-white p-3 rounded-xl text-center flex items-center justify-center gap-2 shadow-sm">
                          <span className="bg-[#c58f38] text-slate-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {announcementForm.badgeText || "Special"}
                          </span>
                          <span className="text-xs font-medium truncate">
                            {announcementForm.bannerText ||
                              "Enter announcement text..."}
                          </span>
                          <span className="font-mono text-xs font-bold underline text-[#f4e3b2]">
                            {announcementForm.couponCode || "CODE"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hero Preview */}
                    {cmsTab === "hero" && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs w-full animate-in fade-in duration-200">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase bg-emerald-50 px-2 py-0.5 rounded">
                          {heroForm.tag || "TAGLINE"}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 leading-tight">
                          {heroForm.title || "Headline"}{" "}
                          <span className="text-emerald-700 italic">
                            {heroForm.titleHighlight || "Highlight"}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-600 italic">
                          "{heroForm.quote || "Story quote goes here..."}"
                        </p>
                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <div>
                            <span className="text-base font-extrabold text-slate-900">
                              ₹{heroForm.price || "0"}
                            </span>
                            {heroForm.originalPrice && (
                              <s className="text-slate-400 text-xs ml-1.5 font-normal">
                                ₹{heroForm.originalPrice}
                              </s>
                            )}
                          </div>
                          <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {heroForm.unit || "1 Unit"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Health Philosophy Preview */}
                    {cmsTab === "philosophy" && (
                      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 w-full animate-in fade-in duration-200">
                        <Heart className="w-6 h-6 text-emerald-700 mx-auto" />
                        <h5 className="text-sm font-bold text-emerald-950">
                          {healthGoalsForm.heading || "Philosophy Headline"}
                        </h5>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          {healthGoalsForm.subheading ||
                            "Supporting philosophy description text..."}
                        </p>
                      </div>
                    )}

                    {/* Gifting Preview */}
                    {cmsTab === "gifting" && (
                      <div className="bg-white border border-amber-200 rounded-xl p-5 space-y-2.5 w-full shadow-xs animate-in fade-in duration-200">
                        <span className="text-[10px] font-mono text-amber-800 font-bold uppercase bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                          {giftingForm.badge || "GIFT BOX"}
                        </span>
                        <h4 className="text-base font-bold text-slate-900">
                          {giftingForm.title || "Curated Hampers"}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {giftingForm.description ||
                            "Gifting package details..."}
                        </p>
                      </div>
                    )}

                    {/* Welcome Voucher Preview */}
                    {cmsTab === "discount" && (
                      <div className="bg-white border-2 border-emerald-600/30 rounded-2xl p-6 shadow-lg text-center space-y-3 w-full animate-in zoom-in-95 duration-200">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                          <Percent className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                          Welcome Bonus Modal
                        </span>
                        <h4 className="text-base font-bold text-slate-900 leading-tight">
                          {discountForm.title || "Enter voucher title"}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {discountForm.subtitle ||
                            "Enter voucher terms and description"}
                        </p>
                        <div className="p-2.5 bg-slate-50 border border-dashed border-emerald-400 rounded-xl inline-block px-6">
                          <span className="text-xs text-slate-500 block mb-0.5">
                            Use code at checkout
                          </span>
                          <span className="font-mono text-sm font-extrabold text-emerald-800 tracking-widest">
                            {discountForm.couponCode || "HARVEST10"}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Footer Preview */}
                    {cmsTab === "footer" && (
                      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 w-full animate-in fade-in duration-200">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Footer Preview
                        </p>
                        <p className="text-xs text-slate-700 italic border-l-2 border-emerald-600 pl-3">
                          "
                          {footerForm.farmTagline ||
                            "Enter farm collective tagline..."}
                          "
                        </p>
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap justify-between text-xs text-slate-600 font-mono">
                          <span>
                            Phone: {footerForm.contactPhone || "Not set"}
                          </span>
                          <span>
                            Email: {footerForm.contactEmail || "Not set"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
