import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard,
  BellRing,
  PackageCheck,
  Truck,
  Boxes,
  Receipt,
  TrendingUp,
  Users2,
  Globe,
  PackagePlus,
  UserCog,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertTriangle,
  MessageCircle,
  ExternalLink,
  Menu,
  X,
  Store,
  CheckCircle2,
  ArrowUpRight,
  Video,
  Eye,
  KeyRound,
  Sparkles,
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
    footerConfig,
    saveCMSSection,
    addProduct,
    toggleStockStatus,
    deleteProduct,
    updateOrderStatus,
    logoutAdmin,
  } = useStore();

  const role = currentAdmin?.role || "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isStoreManager = role === "STORE_MANAGER";
  const isDispatch = role === "DISPATCH";

  const [activeTab, setActiveTab] = useState(
    isDispatch ? "all_orders" : isStoreManager ? "catalog" : "overview",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  // -------------------------------------------------------------
  // DATA HYDRATION: ROBUST FALLBACK + DYNAMIC SYNC
  // -------------------------------------------------------------
  const [catalogItems, setCatalogItems] = useState([]);
  const [stockList, setStockList] = useState([]);

  const DEFAULT_FARM_PRODUCTS = [
    {
      id: 1,
      name: "Vaagai Wood-Pressed Sesame Oil",
      category: "Wood-Pressed Oils",
      price: 380,
      unit: "1 Litre Glass Bottle",
      inStock: true,
      stock_qty: 18,
      max_stock: 60,
    },
    {
      id: 2,
      name: "Cold-Pressed Groundnut Oil",
      category: "Wood-Pressed Oils",
      price: 320,
      unit: "1 Litre Glass Bottle",
      inStock: true,
      stock_qty: 8,
      max_stock: 50,
    },
    {
      id: 3,
      name: "Native Coconut Oil (Sulphur Free)",
      category: "Wood-Pressed Oils",
      price: 290,
      unit: "1 Litre Glass Bottle",
      inStock: true,
      stock_qty: 24,
      max_stock: 60,
    },
    {
      id: 4,
      name: "Karuppu Kavuni Traditional Rice",
      category: "Heirloom Rice & Millets",
      price: 210,
      unit: "1 kg Cloth Bag",
      inStock: true,
      stock_qty: 5,
      max_stock: 40,
    },
    {
      id: 5,
      name: "Mappillai Samba Heritage Rice",
      category: "Heirloom Rice & Millets",
      price: 160,
      unit: "1 kg Cloth Bag",
      inStock: true,
      stock_qty: 32,
      max_stock: 50,
    },
    {
      id: 6,
      name: "Wild Western Ghats Forest Honey",
      category: "Raw Forest Honey",
      price: 490,
      unit: "500 grams Glass Jar",
      inStock: true,
      stock_qty: 12,
      max_stock: 40,
    },
    {
      id: 7,
      name: "Udangudi Pure Palm Jaggery",
      category: "Artisanal Palm Jaggery",
      price: 190,
      unit: "500 grams Pouch",
      inStock: true,
      stock_qty: 4,
      max_stock: 35,
    },
    {
      id: 8,
      name: "Native Raw Garlic Mango Pickle",
      category: "Native Farm Preserves",
      price: 140,
      unit: "350 grams Glass Jar",
      inStock: true,
      stock_qty: 15,
      max_stock: 30,
    },
  ];

  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0) {
      setCatalogItems(products);
      setStockList(
        products.map((p, idx) => ({
          id: p.id,
          name: p.name || p.title,
          category: p.category || "Wood-Pressed Oils",
          currentStock:
            p.stock_qty !== undefined
              ? Number(p.stock_qty)
              : 16 + ((idx * 6) % 30),
          maxStock: p.max_stock ? Number(p.max_stock) : 60,
          price: p.price,
          unit: p.unit || "1 Litre Glass Bottle",
          inStock: p.inStock !== false && p.in_stock !== false,
        })),
      );
    } else {
      setCatalogItems(DEFAULT_FARM_PRODUCTS);
      setStockList(
        DEFAULT_FARM_PRODUCTS.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          currentStock: p.stock_qty,
          maxStock: p.max_stock,
          price: p.price,
          unit: p.unit,
          inStock: p.inStock,
        })),
      );
    }
  }, [products]);

  // -------------------------------------------------------------
  // 1. DELIVERY PARTNER (TRUE PHYSICAL RADIO BUTTON SWITCH)
  // -------------------------------------------------------------
  const [globalDeliveryMode, setGlobalDeliveryMode] = useState("auto"); // "auto" | "manual"
  const [shiprocketSettings, setShiprocketSettings] = useState({
    email: "dispatch@pureorganics.in",
    apiKey: "SR_LIVE_FREE_TOKEN_9921",
  });
  const [manualSettings, setManualSettings] = useState({
    preferredCourier: "ST Courier",
    avgCostPerKg: 45,
    hubPhone: "+91 98765 43210",
  });

  const [activeDispatchOrder, setActiveDispatchOrder] = useState(null);
  const [manualDispatchForm, setManualDispatchForm] = useState({
    courierName: "ST Courier",
    trackingNo: "",
    shippingCost: "50",
  });

  // -------------------------------------------------------------
  // 2. EXPENSES & FINANCIAL AUDIT LOG
  // -------------------------------------------------------------
  const [expensePeriod, setExpensePeriod] = useState("this_month");
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2026-10-04",
      category: "Raw Crops",
      title: "Native Sesame Seeds (200 kg)",
      amount: 32000,
      paidTo: "Tirunelveli Farmers Market",
    },
    {
      id: 2,
      date: "2026-10-03",
      category: "Packaging",
      title: "1 Litre Glass Bottles (300 units)",
      amount: 7500,
      paidTo: "South Glasspack Ltd",
    },
    {
      id: 3,
      date: "2026-10-03",
      category: "Machinery",
      title: "Vaagai Wood Mortar Rotor Servicing",
      amount: 2800,
      paidTo: "Local Mill Tech",
    },
    {
      id: 4,
      date: "2026-10-02",
      category: "Courier & Dispatch",
      title: "ST Courier Weekly Parcel Booking",
      amount: 3450,
      paidTo: "ST Courier Hub",
    },
    {
      id: 5,
      date: "2026-10-01",
      category: "Farm Electricity",
      title: "Cold-Press Unit Power Bill",
      amount: 4100,
      paidTo: "TNEB",
    },
    {
      id: 6,
      date: "2026-09-28",
      category: "Raw Crops",
      title: "Karuppu Kavuni Paddy Batch (150 kg)",
      amount: 18500,
      paidTo: "Thanjavur Collective",
    },
    {
      id: 7,
      date: "2026-09-25",
      category: "Packaging",
      title: "Corrugated Cardboard Safe Boxes (200 units)",
      amount: 4200,
      paidTo: "Coimbatore Box Works",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Raw Crops",
    amount: "",
    paidTo: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    setExpenses([
      { id: Date.now(), ...newExpense, amount: Number(newExpense.amount) },
      ...expenses,
    ]);
    setNewExpense({
      title: "",
      category: "Raw Crops",
      amount: "",
      paidTo: "",
      date: new Date().toISOString().split("T")[0],
    });
    showToast("Expense logged to accounting ledger");
  };

  const totalExpenseSum = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses],
  );
  const lastMonthExpense = 48200;
  const lastWeekExpense = 19400;

  const allOrdersList = orders || [];
  const totalIncome = useMemo(
    () =>
      allOrdersList.reduce(
        (s, o) => s + Number(o.total_amount || o.total || 0),
        0,
      ),
    [allOrdersList],
  );
  const lastMonthIncome = 14200;
  const lastWeekIncome = 6450;
  const netProfit = totalIncome - totalExpenseSum;

  // -------------------------------------------------------------
  // 3. ORDERS SEGREGATION & CONFIRMATION ENGINE
  // -------------------------------------------------------------
  const [orderShippingFilter, setOrderShippingFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [pendingStatusUpdates, setPendingStatusUpdates] = useState({});

  const filteredOrders = useMemo(() => {
    return allOrdersList.filter((ord) => {
      const isAuto =
        (ord.dispatch_note || "").toLowerCase().includes("shiprocket") ||
        (ord.tracking_id || "").startsWith("SR");
      const matchType =
        orderShippingFilter === "all" ||
        (orderShippingFilter === "delivery_partner" && isAuto) ||
        (orderShippingFilter === "manual_courier" && !isAuto);

      const status = ord.status || "Placed";
      const matchStatus =
        orderStatusFilter === "all" ||
        status.toLowerCase() === orderStatusFilter.toLowerCase();

      return matchType && matchStatus;
    });
  }, [allOrdersList, orderShippingFilter, orderStatusFilter]);

  const handleStageStatusChange = (orderId, newStatus) => {
    setPendingStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleConfirmStatusChange = (orderId, currentNote) => {
    const newStatus = pendingStatusUpdates[orderId];
    if (!newStatus) return;
    updateOrderStatus(orderId, newStatus, currentNote);
    setPendingStatusUpdates((prev) => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
    showToast(`Order status updated to: ${newStatus}`);
  };

  // -------------------------------------------------------------
  // 4. INLINE PRODUCT CATALOG & MULTI-VARIANT EDITING
  // -------------------------------------------------------------
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("All");
  const [editingCatalogProduct, setEditingCatalogProduct] = useState(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);

  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Wood-Pressed Oils",
    price: "",
    unit: "1 Litre Glass Bottle",
    stock_qty: 30,
    inStock: true,
  });

  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingCatalogProduct) return;
    const updated = catalogItems.map((p) =>
      p.id === editingCatalogProduct.id ? editingCatalogProduct : p,
    );
    setCatalogItems(updated);
    setStockList((prev) =>
      prev.map((s) =>
        s.id === editingCatalogProduct.id
          ? {
              ...s,
              name: editingCatalogProduct.name,
              category: editingCatalogProduct.category,
              price: Number(editingCatalogProduct.price),
              unit: editingCatalogProduct.unit,
              currentStock: Number(editingCatalogProduct.stock_qty),
              inStock: editingCatalogProduct.inStock,
            }
          : s,
      ),
    );
    setEditingCatalogProduct(null);
    showToast("Product parameters saved");
  };

  const filteredCatalog = catalogItems.filter((item) => {
    const matchesSearch = (item.name || item.title || "")
      .toLowerCase()
      .includes(catalogSearch.toLowerCase());
    const matchesCategory =
      catalogCategoryFilter === "All" ||
      item.category === catalogCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------------------------
  // 5. CMS STUDIO STATE (ALL 7 SECTIONS)
  // -------------------------------------------------------------
  const [cmsSection, setCmsSection] = useState("hero");

  const [heroCMS, setHeroCMS] = useState({
    tag: heroSlides?.[0]?.tag || "COLD-PRESSED • VIRGIN OIL",
    title: heroSlides?.[0]?.title || "Real Mara Chekku Oils",
    highlight: heroSlides?.[0]?.titleHighlight || "& Heirloom Grains.",
    quote:
      heroSlides?.[0]?.quote ||
      "Crushed in traditional Vaagai wooden chekku below 42°C.",
    price: heroSlides?.[0]?.price || "380",
    unit: heroSlides?.[0]?.unit || "1 Litre Glass Bottle",
    mediaMode: "photo",
    videoUrl: "",
    imageUrl:
      heroSlides?.[0]?.image ||
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
  });

  const [announcementCMS, setAnnouncementCMS] = useState(
    announcements || {
      bannerText: "FLAT 50% OFF ON NATIVE BESTSELLERS",
      badgeText: "Direct Farm",
      couponCode: "HARVEST50",
    },
  );

  const [departmentsCMS, setDepartmentsCMS] = useState([
    { id: 1, name: "Wood-Pressed Oils", tamil: "மரச்செக்கு எண்ணெய்" },
    { id: 2, name: "Heirloom Rice & Millets", tamil: "பாரம்பரிய தானியங்கள்" },
    { id: 3, name: "Raw Forest Honey", tamil: "இயற்கை மலைத்தேன்" },
    { id: 4, name: "Artisanal Palm Jaggery", tamil: "உடன்குடி கருப்பட்டி" },
    { id: 5, name: "Native Farm Preserves", tamil: "பாரம்பரிய பண்ணை ஊறல்" },
  ]);

  const [dietCMS, setDietCMS] = useState(
    healthGoals || {
      heading: "Targeted Wellness from Native Soil",
      subheading:
        "Unpolished grains and cold-pressed extraction selected for your daily diet.",
    },
  );

  const [lineageCMS, setLineageCMS] = useState({
    tag: "Our Lineage Standards",
    heading: "Purity Without Compromise",
    subheading:
      "Slow extraction principles from native seeds without synthetic refining.",
  });

  const [giftingCMS, setGiftingCMS] = useState(
    giftingConfig || {
      badge: "Heritage Farm Box",
      title: "Curated Native Harvest Gift Hampers",
      description:
        "Stone-ground spices, raw unpasteurized honey, and cold-pressed staples.",
    },
  );

  const [footerCMS, setFooterCMS] = useState(
    footerConfig || {
      phone: "+91 98765 43210",
      email: "care@pureorganics.in",
      tagline:
        "Nurturing regional biodiversity and direct harvest trade with South Indian farmers.",
    },
  );

  // -------------------------------------------------------------
  // 6. USER MANAGEMENT
  // -------------------------------------------------------------
  const [teamUsers, setTeamUsers] = useState([
    {
      id: 1,
      name: "Selva Bharathi",
      username: "selva_admin",
      role: "SUPER_ADMIN",
      phone: "9876543210",
    },
    {
      id: 2,
      name: "Arun Kumar",
      username: "arun_ops",
      role: "ADMIN",
      phone: "9876543211",
    },
    {
      id: 3,
      name: "Murugan P",
      username: "murugan_store",
      role: "STORE_MANAGER",
      phone: "9876543212",
    },
    {
      id: 4,
      name: "Karthik R",
      username: "karthik_dispatch",
      role: "DISPATCH",
      phone: "9876543213",
    },
  ]);

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "STORE_MANAGER",
    phone: "",
  });

  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.username || !newUserForm.password) return;
    setTeamUsers([...teamUsers, { id: Date.now(), ...newUserForm }]);
    setNewUserForm({
      name: "",
      username: "",
      password: "",
      role: "STORE_MANAGER",
      phone: "",
    });
    showToast("New staff credentials created");
  };

  // Directory calculation
  const customerMap = {};
  allOrdersList.forEach((ord) => {
    const phone = ord.customer_phone || ord.customer?.phone || "9876543210";
    const name = ord.customer_name || ord.customer?.name || "Customer";
    const amt = Number(ord.total_amount || ord.total || 0);

    if (!customerMap[phone]) {
      customerMap[phone] = { name, phone, orderCount: 0, totalSpend: 0 };
    }
    customerMap[phone].orderCount += 1;
    customerMap[phone].totalSpend += amt;
  });
  const customerList = Object.values(customerMap).sort(
    (a, b) => b.orderCount - a.orderCount,
  );
  const newOrders = allOrdersList.filter(
    (o) => (o.status || "Placed").toLowerCase() === "placed",
  );

  const handleEndSession = () => {
    localStorage.clear();
    if (typeof onLogout === "function") onLogout();
    else if (typeof logoutAdmin === "function") logoutAdmin();
  };

  return (
    <div className="min-h-screen bg-[#070D09] text-stone-200 flex font-sans antialiased selection:bg-emerald-600 selection:text-white">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#122217] text-white px-5 py-3 rounded-xl flex items-center gap-2.5 text-xs font-semibold shadow-2xl border border-emerald-500/30 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR: OBSIDIAN EMERALD HUD */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#09120C] text-stone-300 flex flex-col justify-between border-r border-emerald-950/70 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-500/30 flex items-center justify-center text-white font-black shadow-md">
                <Store size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  Pure Organics
                </h2>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-semibold uppercase">
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-5 space-y-1 overflow-y-auto flex-1 pr-1 text-xs font-medium">
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Executive Overview</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab("new_orders");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "new_orders"
                  ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                  : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <BellRing size={16} />
                <span>New Incoming Orders</span>
              </div>
              {newOrders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold font-mono text-[10px]">
                  {newOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab("all_orders");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === "all_orders"
                  ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                  : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
              }`}
            >
              <PackageCheck size={16} />
              <span>All Orders History</span>
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab("delivery_partner");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "delivery_partner"
                    ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} />
                  <span>Delivery Partner</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${globalDeliveryMode === "auto" ? "bg-emerald-400" : "bg-amber-400"}`}
                />
              </button>
            )}

            {(isSuperAdmin || isStoreManager) && (
              <button
                onClick={() => {
                  setActiveTab("catalog");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                }`}
              >
                <PackagePlus size={16} />
                <span>Products & Edit Weights</span>
              </button>
            )}

            {(isSuperAdmin || isStoreManager) && (
              <button
                onClick={() => {
                  setActiveTab("stocks");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                  activeTab === "stocks"
                    ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                    : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                }`}
              >
                <Boxes size={16} />
                <span>Stocks & Inventory</span>
              </button>
            )}

            {isSuperAdmin && (
              <>
                <button
                  onClick={() => {
                    setActiveTab("expenses");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "expenses"
                      ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                      : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                  }`}
                >
                  <Receipt size={16} />
                  <span>Expenses Ledger</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("income");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "income"
                      ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                      : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                  }`}
                >
                  <TrendingUp size={16} />
                  <span>Income & Profit Report</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("customers");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "customers"
                      ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                      : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                  }`}
                >
                  <Users2 size={16} />
                  <span>Customer Directory</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("cms_builder");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeTab === "cms_builder"
                      ? "bg-emerald-950/90 text-white font-bold border border-emerald-800/60 shadow-xs"
                      : "text-stone-400 hover:text-white hover:bg-emerald-950/30"
                  }`}
                >
                  <Globe size={16} />
                  <span>Website CMS (All 7 Sections)</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Footer: User Roles & Sign Out */}
        <div className="p-4 border-t border-emerald-950/80 bg-[#050C07] space-y-3">
          {isSuperAdmin && (
            <button
              onClick={() => {
                setActiveTab("user_roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTab === "user_roles"
                  ? "bg-amber-400 text-stone-950 border-amber-300 shadow-sm"
                  : "bg-emerald-950/40 text-stone-300 border-emerald-900/40 hover:bg-emerald-900/50"
              }`}
            >
              <UserCog size={15} />
              <span>User Roles & Passwords</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700/50 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase font-mono">
              {currentAdmin?.username?.slice(0, 2) || "SA"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-white truncate">
                {currentAdmin?.name || "Selva Bharathi"}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono tracking-wider">
                {role}
              </p>
            </div>
          </div>

          <button
            onClick={handleEndSession}
            className="w-full py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-900/40 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            <span>End Session</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN OBSIDIAN CONSOLE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-30 bg-[#0A130D]/90 backdrop-blur-md border-b border-emerald-950/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-emerald-900 text-stone-300 hover:bg-emerald-950"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-base font-extrabold text-white tracking-tight capitalize">
              {activeTab === "delivery_partner"
                ? "Delivery Partner"
                : activeTab.replace("_", " ")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#112015] border border-emerald-900 text-xs font-medium text-stone-300">
              <span
                className={`w-2 h-2 rounded-full ${globalDeliveryMode === "auto" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}
              />
              <span>
                Logistics:{" "}
                <strong className="text-white">
                  {globalDeliveryMode === "auto"
                    ? "Shiprocket Automated"
                    : "Manual Local Courier"}
                </strong>
              </span>
            </div>
            <a
              href="https://pure-organics1.vercel.app/#/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-300 hover:bg-emerald-900 transition-colors"
            >
              <span>Visit Live Store</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: EXECUTIVE OVERVIEW (OBSIDIAN DARK METRICS) */}
          {/* ========================================================= */}
          {activeTab === "overview" && isSuperAdmin && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-2">
                  <span className="text-xs font-semibold text-stone-400">
                    Gross Sales Income
                  </span>
                  <p className="text-2xl font-black text-white font-mono mt-1">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <ArrowUpRight size={13} />
                    <span>+20.7% vs last month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-2">
                  <span className="text-xs font-semibold text-stone-400">
                    Total Farm Expenses
                  </span>
                  <p className="text-2xl font-black text-rose-400 font-mono mt-1">
                    ₹{totalExpenseSum.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-400">
                    <span>Crops, bottles, machinery & courier</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-2">
                  <span className="text-xs font-semibold text-stone-400">
                    Net Calculated Profit
                  </span>
                  <p
                    className={`text-2xl font-black font-mono ${netProfit >= 0 ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    ₹{netProfit.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                    <span>Clean operating margin in hand</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-2">
                  <span className="text-xs font-semibold text-stone-400">
                    Pending New Bookings
                  </span>
                  <p className="text-2xl font-black text-amber-400 font-mono mt-1">
                    {newOrders.length}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
                    <span>Requires warehouse dispatch</span>
                  </div>
                </div>
              </div>

              {/* Comparative Trends Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-950">
                    <h3 className="font-extrabold text-sm text-white">
                      Income Velocity
                    </h3>
                    <span className="text-[11px] font-mono text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                      Real-time Revenue
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        This Month
                      </span>
                      <p className="text-base font-black text-white font-mono mt-0.5">
                        ₹{totalIncome.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        Current
                      </span>
                    </div>
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Last Month
                      </span>
                      <p className="text-base font-black text-stone-300 font-mono mt-0.5">
                        ₹{lastMonthIncome.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        +20.8%
                      </span>
                    </div>
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Last Week
                      </span>
                      <p className="text-base font-black text-stone-300 font-mono mt-0.5">
                        ₹{lastWeekIncome.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-stone-400 font-bold">
                        7d Pace
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-semibold text-stone-400">
                      <span>Monthly Growth Target Achieved</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        120.8%
                      </span>
                    </div>
                    <div className="w-full bg-emerald-950/70 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: "84%" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950/80 shadow-md space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-950">
                    <h3 className="font-extrabold text-sm text-white">
                      Expense Distribution
                    </h3>
                    <span className="text-[11px] font-mono text-rose-300 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900">
                      Operational Ledger
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        This Month
                      </span>
                      <p className="text-base font-black text-rose-400 font-mono mt-0.5">
                        ₹{totalExpenseSum.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-rose-400 font-bold">
                        Active
                      </span>
                    </div>
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Last Month
                      </span>
                      <p className="text-base font-black text-stone-300 font-mono mt-0.5">
                        ₹{lastMonthExpense.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-stone-400 font-bold">
                        Baseline
                      </span>
                    </div>
                    <div className="p-3 bg-[#132419] rounded-xl border border-emerald-950">
                      <span className="text-[10px] text-stone-400 font-bold uppercase block">
                        Last Week
                      </span>
                      <p className="text-base font-black text-stone-300 font-mono mt-0.5">
                        ₹{lastWeekExpense.toLocaleString("en-IN")}
                      </p>
                      <span className="text-[10px] text-stone-400 font-bold">
                        7d Pace
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between text-stone-400 font-medium">
                      <span>Raw Seeds & Farm Crops</span>
                      <span className="font-mono font-bold text-white">
                        ₹50,500 (69%)
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-400 font-medium">
                      <span>Packaging Materials & Glass Bottles</span>
                      <span className="font-mono font-bold text-white">
                        ₹11,700 (16%)
                      </span>
                    </div>
                    <div className="flex justify-between text-stone-400 font-medium">
                      <span>Machinery Servicing & Logistics</span>
                      <span className="font-mono font-bold text-white">
                        ₹10,350 (15%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: NEW ORDERS STREAM */}
          {/* ========================================================= */}
          {activeTab === "new_orders" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black text-white">
                  Incoming Unprocessed Orders ({newOrders.length})
                </h2>
                <p className="text-xs text-stone-400">
                  Orders placed by customers awaiting packing and courier
                  handoff.
                </p>
              </div>

              {newOrders.length === 0 ? (
                <div className="p-16 text-center bg-[#0F1B13] rounded-2xl border border-emerald-950">
                  <PackageCheck className="w-10 h-10 text-stone-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-stone-300">
                    No new orders waiting right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newOrders.map((ord) => (
                    <div
                      key={ord.id || ord.tracking_id}
                      className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950 shadow-md space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 font-bold border border-amber-800">
                            NEW #{ord.tracking_id || ord.id}
                          </span>
                          <h4 className="font-extrabold text-sm text-white mt-1">
                            {ord.customer_name || ord.customer?.name}
                          </h4>
                          <p className="text-xs text-stone-400 font-mono">
                            +91 {ord.customer_phone || ord.customer?.phone}
                          </p>
                        </div>
                        <span className="text-base font-black text-emerald-400 font-mono">
                          ₹{ord.total_amount || ord.total || 0}
                        </span>
                      </div>

                      <div className="bg-[#132419] p-3 rounded-xl text-xs text-stone-300 border border-emerald-950">
                        <strong className="text-white">
                          Delivery Address:
                        </strong>{" "}
                        {ord.customer_address ||
                          ord.customer?.address ||
                          "Address not provided"}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-emerald-950">
                        <button
                          onClick={() => setActiveDispatchOrder(ord)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        >
                          <Truck size={14} /> Dispatch Consignment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: ALL ORDERS HISTORY (SEGREGATED + CONFIRMATION OK) */}
          {/* ========================================================= */}
          {activeTab === "all_orders" && (
            <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 overflow-hidden shadow-md">
              <div className="p-5 border-b border-emerald-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#0A140E]">
                <div>
                  <h3 className="font-black text-sm text-white">
                    Consignments Ledger ({filteredOrders.length} orders shown)
                  </h3>
                  <p className="text-xs text-stone-400">
                    Segregated between Delivery Partner and Manual Local
                    Couriers
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex bg-[#122217] p-1 rounded-xl border border-emerald-900 text-xs font-semibold">
                    <button
                      onClick={() => setOrderShippingFilter("all")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        orderShippingFilter === "all"
                          ? "bg-emerald-800 text-white"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      All Channels
                    </button>
                    <button
                      onClick={() => setOrderShippingFilter("delivery_partner")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        orderShippingFilter === "delivery_partner"
                          ? "bg-emerald-700 text-white"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Delivery Partner (Shiprocket)
                    </button>
                    <button
                      onClick={() => setOrderShippingFilter("manual_courier")}
                      className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                        orderShippingFilter === "manual_courier"
                          ? "bg-amber-600 text-white"
                          : "text-stone-400 hover:text-white"
                      }`}
                    >
                      Manual Courier (ST/Local)
                    </button>
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-emerald-900 bg-[#122217] text-xs font-bold text-white focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A140E] border-b border-emerald-950 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Tracking ID</th>
                      <th className="p-4">Customer & Phone</th>
                      <th className="p-4">Logistics Channel</th>
                      <th className="p-4">Status & Confirm Action</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/70 font-medium">
                    {filteredOrders.map((ord) => {
                      const trackingId =
                        ord.tracking_id || ord.trackingId || ord.id;
                      const staged = pendingStatusUpdates[trackingId];
                      const currentStatus = ord.status || "Placed";
                      const phone = (
                        ord.customer_phone ||
                        ord.customer?.phone ||
                        ""
                      ).replace(/\D/g, "");
                      const isAuto =
                        (ord.dispatch_note || "")
                          .toLowerCase()
                          .includes("shiprocket") ||
                        (ord.tracking_id || "").startsWith("SR");

                      return (
                        <tr
                          key={trackingId}
                          className="hover:bg-emerald-950/30"
                        >
                          <td className="p-4 font-mono font-bold text-emerald-400">
                            {trackingId}
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-white">
                              {ord.customer_name || ord.customer?.name}
                            </p>
                            <p className="text-stone-400 font-mono text-[11px]">
                              +91 {phone}
                            </p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                                isAuto
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : "bg-amber-950 text-amber-300 border border-amber-800"
                              }`}
                            >
                              {isAuto
                                ? "Shiprocket API"
                                : ord.dispatch_note || "Manual Courier"}
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <select
                                value={
                                  staged !== undefined ? staged : currentStatus
                                }
                                onChange={(e) =>
                                  handleStageStatusChange(
                                    trackingId,
                                    e.target.value,
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg border border-emerald-900 bg-[#122217] font-semibold text-xs text-white focus:outline-none"
                              >
                                <option value="Placed">Placed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {staged !== undefined &&
                              staged !== currentStatus ? (
                                <button
                                  onClick={() =>
                                    handleConfirmStatusChange(
                                      trackingId,
                                      ord.dispatch_note,
                                    )
                                  }
                                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                                  title="Confirm status update"
                                >
                                  <Check size={13} /> OK
                                </button>
                              ) : (
                                <span className="text-[10px] text-stone-500 font-mono">
                                  Confirmed
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                window.open(
                                  `https://wa.me/91${phone}?text=Hello,%20your%20Pure%20Organics%20order%20(${trackingId})%20status%20is%20now:%20${currentStatus}`,
                                );
                              }}
                              className="px-3 py-1.5 bg-[#25D366] text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#20bd5a] transition-colors"
                            >
                              <MessageCircle size={13} /> WhatsApp
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

          {/* ========================================================= */}
          {/* TAB 4: DELIVERY PARTNER (TRUE TACTILE RADIO SWITCH) */}
          {/* ========================================================= */}
          {activeTab === "delivery_partner" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Delivery Partner Logistics Controller
                </h2>
                <p className="text-xs text-stone-400">
                  Toggle between automated free API fulfillment and self-managed
                  courier dispatches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setGlobalDeliveryMode("auto")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    globalDeliveryMode === "auto"
                      ? "border-emerald-500 bg-[#122317] shadow-lg"
                      : "border-emerald-950 bg-[#0F1B13] hover:border-emerald-900"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            globalDeliveryMode === "auto"
                              ? "border-emerald-400 bg-transparent"
                              : "border-stone-600"
                          }`}
                        >
                          {globalDeliveryMode === "auto" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                          )}
                        </div>
                        <strong className="text-sm font-extrabold text-white">
                          Automated Logistics Partner (Shiprocket)
                        </strong>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-[10px] font-bold">
                        FREE API
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 pl-8 leading-relaxed">
                      Orders automatically push to Shiprocket. The system
                      generates live AWB barcodes, calls for courier doorstep
                      pickup, and handles automated customer tracking
                      notifications.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-950 pl-8 space-y-1 text-xs text-emerald-400 font-semibold">
                    <div>✓ Automated AWB & Shipping Label Generation</div>
                    <div>✓ Automated WhatsApp status sync to buyer</div>
                  </div>
                </div>

                <div
                  onClick={() => setGlobalDeliveryMode("manual")}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    globalDeliveryMode === "manual"
                      ? "border-amber-500 bg-[#1E1C12] shadow-lg"
                      : "border-emerald-950 bg-[#0F1B13] hover:border-emerald-900"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            globalDeliveryMode === "manual"
                              ? "border-amber-400 bg-transparent"
                              : "border-stone-600"
                          }`}
                        >
                          {globalDeliveryMode === "manual" && (
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <strong className="text-sm font-extrabold text-white">
                          Manual Courier Dispatch (Self-Operated)
                        </strong>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono text-[10px] font-bold">
                        SELF MODE
                      </span>
                    </div>
                    <p className="text-xs text-stone-300 pl-8 leading-relaxed">
                      Turns off automated third-party APIs. Your mill staff
                      books parcels locally (ST Courier, Professional Courier,
                      Local Van) and enters docket tracking numbers directly
                      into the order record.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-950 pl-8 space-y-1 text-xs text-amber-300 font-semibold">
                    <div>✓ ST Courier & Professional Courier support</div>
                    <div>✓ Direct booking cost logged to expenses ledger</div>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                <h3 className="font-bold text-sm text-white">
                  {globalDeliveryMode === "auto"
                    ? "Shiprocket Free API Credentials"
                    : "Local Courier Parameters"}
                </h3>

                {globalDeliveryMode === "auto" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Registered Shiprocket Email
                      </label>
                      <input
                        type="email"
                        value={shiprocketSettings.email}
                        onChange={(e) =>
                          setShiprocketSettings({
                            ...shiprocketSettings,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        API Live / Sandbox Token
                      </label>
                      <input
                        type="password"
                        value={shiprocketSettings.apiKey}
                        onChange={(e) =>
                          setShiprocketSettings({
                            ...shiprocketSettings,
                            apiKey: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
                      <button
                        onClick={() =>
                          showToast("Automated logistics profile saved")
                        }
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                      >
                        Save API Configuration
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Default Local Courier Service
                      </label>
                      <input
                        type="text"
                        value={manualSettings.preferredCourier}
                        onChange={(e) =>
                          setManualSettings({
                            ...manualSettings,
                            preferredCourier: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Estimated Cost Per Kg (₹)
                      </label>
                      <input
                        type="number"
                        value={manualSettings.avgCostPerKg}
                        onChange={(e) =>
                          setManualSettings({
                            ...manualSettings,
                            avgCostPerKg: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Local Booking Hub Contact
                      </label>
                      <input
                        type="text"
                        value={manualSettings.hubPhone}
                        onChange={(e) =>
                          setManualSettings({
                            ...manualSettings,
                            hubPhone: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                      <button
                        onClick={() =>
                          showToast("Manual logistics defaults saved")
                        }
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md"
                      >
                        Save Local Courier Parameters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: PRODUCTS CATALOG (EXISTING INVENTORY + IN-LINE EDIT) */}
          {/* ========================================================= */}
          {activeTab === "catalog" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-white">
                    Master Product Catalog & Existing Variants
                  </h2>
                  <p className="text-xs text-stone-400">
                    Edit existing items, weights, units, prices, and stock
                    availability directly.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingNewProduct(!isAddingNewProduct)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Plus size={14} />
                  <span>
                    {isAddingNewProduct
                      ? "Close Product Form"
                      : "Add New Harvest Item"}
                  </span>
                </button>
              </div>

              {/* Add New Product Form */}
              {isAddingNewProduct && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                  <h3 className="font-extrabold text-sm text-white">
                    Register New Farm Harvest Product
                  </h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newProductForm.name || !newProductForm.price) return;
                      await addProduct({
                        ...newProductForm,
                        price: Number(newProductForm.price),
                      });
                      setCatalogItems([
                        {
                          id: Date.now(),
                          ...newProductForm,
                          price: Number(newProductForm.price),
                        },
                        ...catalogItems,
                      ]);
                      setNewProductForm({
                        name: "",
                        category: "Wood-Pressed Oils",
                        price: "",
                        unit: "1 Litre Glass Bottle",
                        inStock: true,
                      });
                      setIsAddingNewProduct(false);
                      showToast("New product published live!");
                    }}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Product Title"
                      value={newProductForm.name}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          name: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                    <select
                      value={newProductForm.category}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          category: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    >
                      <option value="Wood-Pressed Oils">
                        Wood-Pressed Oils
                      </option>
                      <option value="Heirloom Rice & Millets">
                        Heirloom Rice & Millets
                      </option>
                      <option value="Raw Forest Honey">Raw Forest Honey</option>
                      <option value="Artisanal Palm Jaggery">
                        Artisanal Palm Jaggery
                      </option>
                      <option value="Native Farm Preserves">
                        Native Farm Preserves
                      </option>
                    </select>
                    <input
                      type="number"
                      required
                      placeholder="Price (₹)"
                      value={newProductForm.price}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          price: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono font-bold"
                    />
                    <select
                      value={newProductForm.unit}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          unit: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    >
                      <option value="500 ml Glass Bottle">
                        500 ml Glass Bottle
                      </option>
                      <option value="1 Litre Glass Bottle">
                        1 Litre Glass Bottle
                      </option>
                      <option value="2 Litre Food Can">2 Litre Food Can</option>
                      <option value="5 Litre Tin">5 Litre Can / Tin</option>
                      <option value="500 grams Pouch">500 grams Pouch</option>
                      <option value="1 kg Cloth Bag">1 kg Cloth Bag</option>
                      <option value="5 kg Family Sack">5 kg Family Sack</option>
                    </select>
                    <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewProduct(false)}
                        className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-2 px-6 cursor-pointer shadow-md"
                      >
                        Publish Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Master Existing Products Table */}
              <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 overflow-hidden shadow-md">
                <div className="p-4 border-b border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0A140E]">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Search existing products..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-emerald-900 bg-[#122217] text-white text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                      value={catalogCategoryFilter}
                      onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-emerald-900 bg-[#122217] text-white text-xs font-semibold focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Wood-Pressed Oils">
                        Wood-Pressed Oils
                      </option>
                      <option value="Heirloom Rice & Millets">
                        Heirloom Rice & Millets
                      </option>
                      <option value="Raw Forest Honey">Raw Forest Honey</option>
                      <option value="Artisanal Palm Jaggery">
                        Artisanal Palm Jaggery
                      </option>
                      <option value="Native Farm Preserves">
                        Native Farm Preserves
                      </option>
                    </select>
                    <span className="text-xs text-stone-400 font-mono">
                      ({filteredCatalog.length} items)
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0A140E] border-b border-emerald-950 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-4">Product Name</th>
                        <th className="p-4">Department</th>
                        <th className="p-4">Price (₹)</th>
                        <th className="p-4">Weight / Variant</th>
                        <th className="p-4">Stock Units</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-950/70 font-medium">
                      {filteredCatalog.map((item) => {
                        const isLow = (item.stock_qty || 20) <= 10;

                        return (
                          <tr key={item.id} className="hover:bg-emerald-950/30">
                            <td className="p-4">
                              <span className="font-extrabold text-white block">
                                {item.name || item.title}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                SKU: #{item.id}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-md bg-[#132419] text-emerald-300 text-[10px] font-bold border border-emerald-900">
                                {item.category}
                              </span>
                            </td>
                            <td className="p-4 font-mono font-bold text-white text-sm">
                              ₹{item.price}
                            </td>
                            <td className="p-4 font-semibold text-stone-300">
                              {item.unit || "1 Litre Glass Bottle"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`font-mono font-bold ${isLow ? "text-rose-400" : "text-white"}`}
                              >
                                {item.stock_qty || 25} units
                              </span>
                              {isLow && (
                                <span className="block text-[10px] text-rose-400 font-bold">
                                  Low (&lt;30%)
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <button
                                onClick={() => toggleStockStatus(item.id)}
                                className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                                  item.inStock !== false
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900"
                                    : "bg-rose-950 text-rose-300 border border-rose-900 hover:bg-rose-900"
                                }`}
                              >
                                {item.inStock !== false
                                  ? "✓ In Stock"
                                  : "✕ Out of Stock"}
                              </button>
                            </td>
                            <td className="p-4 text-right space-x-1.5">
                              <button
                                onClick={() =>
                                  setEditingCatalogProduct({
                                    ...item,
                                    stock_qty: item.stock_qty || 25,
                                  })
                                }
                                className="px-2.5 py-1 bg-[#132419] hover:bg-[#1a3323] text-stone-200 rounded-lg font-bold inline-flex items-center gap-1 transition-colors cursor-pointer border border-emerald-900"
                              >
                                <Edit3 size={12} /> Edit Details
                              </button>
                              <button
                                onClick={() => deleteProduct(item.id)}
                                className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: STOCKS & INVENTORY HEALTH METERS */}
          {/* ========================================================= */}
          {activeTab === "stocks" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Stock Health & Warehouse Inventory
                </h2>
                <p className="text-xs text-stone-400">
                  Live meters tracking remaining percentages and auto-reorder
                  thresholds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-400">Tracked Items</span>
                  <p className="text-xl font-black text-white mt-0.5">
                    {stockList.length} SKUs
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Healthy (&gt;60%)</span>
                  <p className="text-xl font-black text-emerald-400 mt-0.5">
                    {
                      stockList.filter((s) => s.currentStock / s.maxStock > 0.6)
                        .length
                    }{" "}
                    Items
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Critical Low (&lt;30%)</span>
                  <p className="text-xl font-black text-rose-400 mt-0.5">
                    {
                      stockList.filter(
                        (s) => s.currentStock / s.maxStock <= 0.3,
                      ).length
                    }{" "}
                    Items
                  </p>
                </div>
                <div>
                  <span className="text-stone-400">Urgent Reload</span>
                  <p className="text-xl font-black text-amber-400 mt-0.5">
                    {
                      stockList.filter(
                        (s) => s.currentStock / s.maxStock <= 0.2,
                      ).length
                    }{" "}
                    Batches
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockList.map((stk) => {
                  const percent = Math.round(
                    (stk.currentStock / stk.maxStock) * 100,
                  );
                  const isLow = percent <= 30;

                  return (
                    <div
                      key={stk.id}
                      className="p-5 rounded-2xl bg-[#0F1B13] border border-emerald-950 shadow-md space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-stone-500">
                            {stk.category}
                          </span>
                          <h4 className="font-extrabold text-sm text-white mt-0.5">
                            {stk.name}
                          </h4>
                          <span className="text-xs text-stone-400">
                            {stk.unit}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-sm text-white">
                          ₹{stk.price}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-stone-400">
                            Remaining Balance
                          </span>
                          <span
                            className={
                              isLow
                                ? "text-rose-400 font-extrabold font-mono"
                                : "text-emerald-400 font-mono"
                            }
                          >
                            {percent}% ({stk.currentStock} left)
                          </span>
                        </div>
                        <div className="w-full bg-[#08120A] h-2.5 rounded-full overflow-hidden border border-emerald-950">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow
                                ? "bg-rose-500"
                                : percent <= 60
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>

                      {isLow && (
                        <div className="p-2.5 bg-rose-950/40 border border-rose-900 rounded-xl flex items-center gap-1.5 text-[11px] text-rose-300 font-bold">
                          <AlertTriangle size={13} className="shrink-0" />
                          <span>
                            Stock below 30%! Schedule extraction batch.
                          </span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-emerald-950 flex items-center justify-between">
                        <button
                          onClick={() => {
                            setStockList((prev) =>
                              prev.map((item) =>
                                item.id === stk.id
                                  ? {
                                      ...item,
                                      currentStock: item.currentStock + 10,
                                    }
                                  : item,
                              ),
                            );
                            showToast(`Added +10 to ${stk.name}`);
                          }}
                          className="px-3 py-1 bg-[#132419] hover:bg-[#1a3323] text-stone-200 font-bold text-xs rounded-lg cursor-pointer border border-emerald-900"
                        >
                          +10 Units
                        </button>
                        <button
                          onClick={() => {
                            setStockList((prev) =>
                              prev.map((item) =>
                                item.id === stk.id
                                  ? {
                                      ...item,
                                      currentStock: item.currentStock + 25,
                                    }
                                  : item,
                              ),
                            );
                            showToast(`Added +25 to ${stk.name}`);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg cursor-pointer shadow-md"
                        >
                          +25 Batch Reload
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: EXPENSES LEDGER */}
          {/* ========================================================= */}
          {activeTab === "expenses" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Farm Expenses Ledger
                </h2>
                <p className="text-xs text-stone-400">
                  Itemized ledger covering crops, machinery servicing, packaging
                  materials, and delivery costs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                <h3 className="font-bold text-sm text-white">
                  Record Operational Expense
                </h3>
                <form
                  onSubmit={handleAddExpense}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Expense Description (e.g. 50 kg Sesame Seeds)"
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white sm:col-span-2"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-medium"
                  >
                    <option value="Raw Crops">Raw Crops / Seeds</option>
                    <option value="Packaging">Glass Bottles & Caps</option>
                    <option value="Machinery">Wood-Chekku Maintenance</option>
                    <option value="Courier & Dispatch">
                      Courier & Transport
                    </option>
                    <option value="Farm Electricity">
                      Electricity & Utilities
                    </option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Amount (₹)"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-2 cursor-pointer transition-colors shadow-md"
                  >
                    + Log Expense
                  </button>
                </form>
              </div>

              <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 overflow-hidden shadow-md">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A140E] border-b border-emerald-950 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Vendor / Payee</th>
                      <th className="p-4 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/70 font-medium">
                    {expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td className="p-4 font-mono text-stone-400">
                          {exp.date}
                        </td>
                        <td className="p-4 font-semibold text-stone-300">
                          {exp.category}
                        </td>
                        <td className="p-4 font-bold text-white">
                          {exp.title}
                        </td>
                        <td className="p-4 text-stone-400">{exp.paidTo}</td>
                        <td className="p-4 text-right font-mono font-bold text-rose-400">
                          ₹{exp.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: INCOME REPORT */}
          {/* ========================================================= */}
          {activeTab === "income" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Income & Profitability Analysis
                </h2>
                <p className="text-xs text-stone-400">
                  Gross revenue minus deductions to calculate true profit in
                  hand.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-1">
                  <span className="text-xs text-stone-400 font-medium">
                    Gross Customer Income
                  </span>
                  <p className="text-3xl font-black text-white font-mono">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    From {allOrdersList.length} customer orders
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-1">
                  <span className="text-xs text-stone-400 font-medium">
                    Total Deductions
                  </span>
                  <p className="text-3xl font-black text-rose-400 font-mono">
                    ₹{totalExpenseSum.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Crops, maintenance, bottles & logistics
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#122317] border border-emerald-800 space-y-1">
                  <span className="text-xs text-emerald-300 font-medium">
                    Net Real Profit
                  </span>
                  <p className="text-3xl font-black text-emerald-400 font-mono">
                    ₹{netProfit.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-emerald-300 font-semibold">
                    Net margin in hand
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: CUSTOMERS DIRECTORY */}
          {/* ========================================================= */}
          {activeTab === "customers" && isSuperAdmin && (
            <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 overflow-hidden shadow-md">
              <div className="p-4 border-b border-emerald-950 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Customer Directory ({customerList.length})
                  </h3>
                  <p className="text-xs text-stone-400">
                    Repeat customer frequency and direct WhatsApp messaging.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A140E] border-b border-emerald-950 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Orders Frequency</th>
                      <th className="p-4">Total Revenue</th>
                      <th className="p-4 text-right">Direct WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/70 font-medium">
                    {customerList.map((cust) => (
                      <tr key={cust.phone}>
                        <td className="p-4 font-bold text-white">
                          {cust.name}
                        </td>
                        <td className="p-4 font-mono text-stone-300">
                          +91 {cust.phone}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              cust.orderCount > 1
                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                : "bg-stone-900 text-stone-300"
                            }`}
                          >
                            {cust.orderCount}{" "}
                            {cust.orderCount > 1 ? "Repeat Orders" : "Order"}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          ₹{cust.totalSpend}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              window.open(
                                `https://wa.me/91${cust.phone}?text=Dear%20${encodeURIComponent(cust.name)},%20thank%20you%20for%20regularly%20ordering%20from%20Pure%20Organics!%20Here%20is%20your%20direct%20harvest%20discount%20code.`,
                              )
                            }
                            className="px-3 py-1.5 bg-[#25D366] text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#20bd5a] transition-colors shadow-sm"
                          >
                            <MessageCircle size={13} /> Chat on WhatsApp
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: CMS BUILDER (ALL 7 SECTIONS) */}
          {/* ========================================================= */}
          {activeTab === "cms_builder" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Storefront CMS Builder (All 7 Sections)
                </h2>
                <p className="text-xs text-stone-400">
                  Edit every section of your customer-facing website directly.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 border-b border-emerald-950 pb-3 text-xs font-semibold">
                {[
                  { id: "hero", label: "Hero & Video" },
                  { id: "announcement", label: "Announcement Bar" },
                  { id: "departments", label: "Shop by Department" },
                  { id: "diet", label: "Diet & Health Goals" },
                  { id: "lineage", label: "Lineage Standards" },
                  { id: "gifting", label: "Gifting Hampers" },
                  { id: "footer", label: "Footer Info" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCmsSection(s.id)}
                    className={`px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors ${
                      cmsSection === s.id
                        ? "bg-emerald-600 text-white font-bold shadow-sm"
                        : "bg-[#0F1B13] text-stone-300 hover:bg-[#132419]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {cmsSection === "hero" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                    <h3 className="font-bold text-sm text-white">
                      Hero Section Content & Video Controller
                    </h3>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await saveCMSSection("hero_slides", [heroCMS]);
                        showToast("Hero section updated live");
                      }}
                      className="space-y-3 text-xs"
                    >
                      <div>
                        <label className="block font-semibold text-stone-300 mb-1">
                          Headline Main Title
                        </label>
                        <input
                          type="text"
                          value={heroCMS.title}
                          onChange={(e) =>
                            setHeroCMS({ ...heroCMS, title: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-stone-300 mb-1">
                          Highlight Gold Text
                        </label>
                        <input
                          type="text"
                          value={heroCMS.highlight}
                          onChange={(e) =>
                            setHeroCMS({
                              ...heroCMS,
                              highlight: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                        />
                      </div>

                      <div className="p-4 rounded-xl border border-emerald-800 bg-[#122317] space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-emerald-300">
                          <input
                            type="checkbox"
                            checked={heroCMS.mediaMode === "video"}
                            onChange={(e) =>
                              setHeroCMS({
                                ...heroCMS,
                                mediaMode: e.target.checked ? "video" : "photo",
                              })
                            }
                            className="w-4 h-4 text-emerald-500"
                          />
                          <span>Display Background Video in Hero</span>
                        </label>
                        <p className="text-[11px] text-stone-300">
                          Toggle on to play a continuous farm extraction video
                          stream in the background. Toggle off to use a still
                          photo.
                        </p>
                      </div>

                      {heroCMS.mediaMode === "video" ? (
                        <div>
                          <label className="block font-semibold text-stone-300 mb-1">
                            Video Stream URL (.mp4)
                          </label>
                          <input
                            type="text"
                            placeholder="https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4"
                            value={heroCMS.videoUrl}
                            onChange={(e) =>
                              setHeroCMS({
                                ...heroCMS,
                                videoUrl: e.target.value,
                              })
                            }
                            className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="block font-semibold text-stone-300 mb-1">
                            Background Image URL
                          </label>
                          <input
                            type="text"
                            value={heroCMS.imageUrl}
                            onChange={(e) =>
                              setHeroCMS({
                                ...heroCMS,
                                imageUrl: e.target.value,
                              })
                            }
                            className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                      >
                        Save Hero Section
                      </button>
                    </form>
                  </div>

                  <div className="lg:col-span-6 bg-[#0B140E] p-6 rounded-2xl text-white space-y-4 border border-emerald-950">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Live Hero Preview
                    </span>
                    <div className="bg-[#122016] rounded-xl overflow-hidden p-4 space-y-3 border border-emerald-950">
                      <h4 className="text-lg font-bold">
                        {heroCMS.title}{" "}
                        <span className="text-amber-400">
                          {heroCMS.highlight}
                        </span>
                      </h4>
                      {heroCMS.mediaMode === "video" && heroCMS.videoUrl ? (
                        <video
                          src={heroCMS.videoUrl}
                          autoPlay
                          loop
                          muted
                          className="w-full h-44 object-cover rounded-xl"
                        />
                      ) : (
                        <img
                          src={heroCMS.imageUrl}
                          alt="Preview"
                          className="w-full h-44 object-cover rounded-xl"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Other CMS Sub-panels */}
              {cmsSection === "announcement" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 max-w-2xl space-y-4 shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Announcement Bar Setup
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Headline Text
                      </label>
                      <input
                        type="text"
                        value={announcementCMS.bannerText}
                        onChange={(e) =>
                          setAnnouncementCMS({
                            ...announcementCMS,
                            bannerText: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-300 mb-1">
                          Pill Badge
                        </label>
                        <input
                          type="text"
                          value={announcementCMS.badgeText}
                          onChange={(e) =>
                            setAnnouncementCMS({
                              ...announcementCMS,
                              badgeText: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-300 mb-1">
                          Coupon Code
                        </label>
                        <input
                          type="text"
                          value={announcementCMS.couponCode}
                          onChange={(e) =>
                            setAnnouncementCMS({
                              ...announcementCMS,
                              couponCode: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono font-bold"
                        />
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await saveCMSSection("announcement", announcementCMS);
                        showToast("Announcement bar updated");
                      }}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                    >
                      Save Announcement Bar
                    </button>
                  </div>
                </div>
              )}

              {cmsSection === "departments" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Shop by Department Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {departmentsCMS.map((d, idx) => (
                      <div
                        key={d.id}
                        className="p-3.5 border border-emerald-900 rounded-xl space-y-2 bg-[#122217]"
                      >
                        <input
                          type="text"
                          value={d.name}
                          onChange={(e) => {
                            const copy = [...departmentsCMS];
                            copy[idx].name = e.target.value;
                            setDepartmentsCMS(copy);
                          }}
                          className="w-full p-2 border border-emerald-800 rounded-lg font-bold bg-[#0A140E] text-white"
                        />
                        <input
                          type="text"
                          value={d.tamil}
                          onChange={(e) => {
                            const copy = [...departmentsCMS];
                            copy[idx].tamil = e.target.value;
                            setDepartmentsCMS(copy);
                          }}
                          className="w-full p-2 border border-emerald-800 rounded-lg text-emerald-300 font-serif bg-[#0A140E]"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => showToast("Categories updated")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Save Category Names
                  </button>
                </div>
              )}

              {cmsSection === "diet" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 max-w-2xl space-y-4 text-xs shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Diet & Health Preferences Section
                  </h3>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={dietCMS.heading}
                      onChange={(e) =>
                        setDietCMS({ ...dietCMS, heading: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Subtext
                    </label>
                    <textarea
                      rows="2"
                      value={dietCMS.subheading}
                      onChange={(e) =>
                        setDietCMS({ ...dietCMS, subheading: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      await saveCMSSection("health_goals", dietCMS);
                      showToast("Health goals narrative updated");
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Save Dietary Section
                  </button>
                </div>
              )}

              {cmsSection === "lineage" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 max-w-2xl space-y-4 text-xs shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Lineage Standards & Trust Pillars
                  </h3>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Pill Tag
                    </label>
                    <input
                      type="text"
                      value={lineageCMS.tag}
                      onChange={(e) =>
                        setLineageCMS({ ...lineageCMS, tag: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Heading
                    </label>
                    <input
                      type="text"
                      value={lineageCMS.heading}
                      onChange={(e) =>
                        setLineageCMS({
                          ...lineageCMS,
                          heading: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="2"
                      value={lineageCMS.subheading}
                      onChange={(e) =>
                        setLineageCMS({
                          ...lineageCMS,
                          subheading: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <button
                    onClick={() => showToast("Lineage standards saved")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Save Lineage Standards
                  </button>
                </div>
              )}

              {cmsSection === "gifting" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 max-w-2xl space-y-4 text-xs shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Harvest Gift Hampers
                  </h3>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.title}
                      onChange={(e) =>
                        setGiftingCMS({ ...giftingCMS, title: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="2"
                      value={giftingCMS.description}
                      onChange={(e) =>
                        setGiftingCMS({
                          ...giftingCMS,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      await saveCMSSection("gifting_banner", giftingCMS);
                      showToast("Gifting configuration updated");
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Save Gifting Section
                  </button>
                </div>
              )}

              {cmsSection === "footer" && (
                <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 max-w-2xl space-y-4 text-xs shadow-md">
                  <h3 className="font-bold text-sm text-white">
                    Footer Information & Support Desk
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={footerCMS.phone}
                        onChange={(e) =>
                          setFooterCMS({ ...footerCMS, phone: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-300 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={footerCMS.email}
                        onChange={(e) =>
                          setFooterCMS({ ...footerCMS, email: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-300 mb-1">
                      Mission Tagline
                    </label>
                    <textarea
                      rows="2"
                      value={footerCMS.tagline}
                      onChange={(e) =>
                        setFooterCMS({ ...footerCMS, tagline: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      await saveCMSSection("footer", footerCMS);
                      showToast("Footer details updated");
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                  >
                    Save Footer Information
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: USER ROLES & TEAM PASSWORDS */}
          {/* ========================================================= */}
          {activeTab === "user_roles" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-white">
                  Team Credentials & Role-Based Permissions
                </h2>
                <p className="text-xs text-stone-400">
                  Create staff logins, update names, reset passwords, or delete
                  credentials.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0F1B13] border border-emerald-950 space-y-4 shadow-md">
                <h3 className="font-bold text-sm text-white">
                  Create Team Account
                </h3>
                <form
                  onSubmit={handleCreateUser}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Staff Full Name"
                    value={newUserForm.name}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, name: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Username for Login"
                    value={newUserForm.username}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        username: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                  />
                  <input
                    type="password"
                    required
                    placeholder="Temporary Password"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                  />
                  <select
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, role: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                  >
                    <option value="STORE_MANAGER">Store Manager</option>
                    <option value="DISPATCH">Dispatch Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                  <div className="sm:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-2 px-6 cursor-pointer transition-colors shadow-md"
                    >
                      + Create Account
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 overflow-hidden shadow-md">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0A140E] border-b border-emerald-950 text-stone-400 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Staff Name</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Assigned Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-950/70 font-medium">
                    {teamUsers.map((st) => (
                      <tr key={st.id}>
                        <td className="p-4 font-bold text-white">{st.name}</td>
                        <td className="p-4 font-mono text-stone-300">
                          {st.username}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                            {st.role}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => setEditingUser(st)}
                            className="px-2.5 py-1 bg-[#132419] hover:bg-[#1a3323] text-stone-200 rounded-lg font-bold inline-flex items-center gap-1 transition-colors cursor-pointer border border-emerald-900"
                          >
                            Edit Password / Role
                          </button>
                          <button
                            onClick={() => {
                              setTeamUsers(
                                teamUsers.filter((u) => u.id !== st.id),
                              );
                              showToast("Team account deleted");
                            }}
                            className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* DISPATCH ACTION MODAL */}
      {activeDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-stone-200">
            <div className="flex justify-between items-center border-b border-emerald-950 pb-3">
              <h3 className="font-extrabold text-sm text-white">
                Dispatch Order #
                {activeDispatchOrder.tracking_id || activeDispatchOrder.id}
              </h3>
              <button
                onClick={() => setActiveDispatchOrder(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {globalDeliveryMode === "auto" ? (
              <div className="p-4 bg-[#122217] border border-emerald-800 rounded-xl space-y-2">
                <p className="font-bold text-emerald-300">
                  Shiprocket Automated Logistics Engine
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Confirming will auto-generate an AWB code, book a pickup at
                  the farm facility, and send tracking links to the customer via
                  WhatsApp.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Local Courier Service
                  </label>
                  <select
                    value={manualDispatchForm.courierName}
                    onChange={(e) =>
                      setManualDispatchForm({
                        ...manualDispatchForm,
                        courierName: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                  >
                    <option value="ST Courier">ST Courier</option>
                    <option value="The Professional Couriers">
                      The Professional Couriers
                    </option>
                    <option value="India Post Speed Post">
                      India Post Speed Post
                    </option>
                    <option value="Direct Farm Van Delivery">
                      Direct Farm Van Delivery
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Docket / Tracking Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ST98765432IN"
                    value={manualDispatchForm.trackingNo}
                    onChange={(e) =>
                      setManualDispatchForm({
                        ...manualDispatchForm,
                        trackingNo: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Courier Charge Incurred (₹)
                  </label>
                  <input
                    type="number"
                    value={manualDispatchForm.shippingCost}
                    onChange={(e) =>
                      setManualDispatchForm({
                        ...manualDispatchForm,
                        shippingCost: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-emerald-950">
              <button
                type="button"
                onClick={() => setActiveDispatchOrder(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const tracking =
                    globalDeliveryMode === "auto"
                      ? `SR${Math.floor(10000000 + Math.random() * 90000000)}`
                      : manualDispatchForm.trackingNo || "MANUAL-DISPATCH";

                  updateOrderStatus(
                    activeDispatchOrder.tracking_id || activeDispatchOrder.id,
                    "Shipped",
                    globalDeliveryMode === "auto"
                      ? "Shiprocket Automated"
                      : `${manualDispatchForm.courierName} - ${tracking}`,
                  );

                  if (
                    globalDeliveryMode === "manual" &&
                    manualDispatchForm.shippingCost
                  ) {
                    setExpenses([
                      {
                        id: Date.now(),
                        date: new Date().toISOString().split("T")[0],
                        category: "Courier & Dispatch",
                        title: `Parcel booking for order #${activeDispatchOrder.id || activeDispatchOrder.tracking_id}`,
                        amount: Number(manualDispatchForm.shippingCost),
                        paidTo: manualDispatchForm.courierName,
                      },
                      ...expenses,
                    ]);
                  }

                  showToast("Order dispatched and tracking updated");
                  setActiveDispatchOrder(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-WEIGHT PRODUCT EDIT MODAL FOR OLD / EXISTING PRODUCTS */}
      {editingCatalogProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-stone-200">
            <div className="flex justify-between items-center border-b border-emerald-950 pb-3">
              <h3 className="font-extrabold text-sm text-white">
                Edit Product: {editingCatalogProduct.name}
              </h3>
              <button
                onClick={() => setEditingCatalogProduct(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3">
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={
                    editingCatalogProduct.name || editingCatalogProduct.title
                  }
                  onChange={(e) =>
                    setEditingCatalogProduct({
                      ...editingCatalogProduct,
                      name: e.target.value,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCatalogProduct.price}
                    onChange={(e) =>
                      setEditingCatalogProduct({
                        ...editingCatalogProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-300 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCatalogProduct.stock_qty || 25}
                    onChange={(e) =>
                      setEditingCatalogProduct({
                        ...editingCatalogProduct,
                        stock_qty: Number(e.target.value),
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Packaging Weight / Volume
                </label>
                <select
                  value={editingCatalogProduct.unit}
                  onChange={(e) =>
                    setEditingCatalogProduct({
                      ...editingCatalogProduct,
                      unit: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-semibold"
                >
                  <option value="500 ml Glass Bottle">
                    500 ml Glass Bottle
                  </option>
                  <option value="1 Litre Glass Bottle">
                    1 Litre Glass Bottle
                  </option>
                  <option value="2 Litre Food Can">2 Litre Food Can</option>
                  <option value="5 Litre Tin">5 Litre Can / Tin</option>
                  <option value="500 grams Pouch">500 grams Pouch</option>
                  <option value="1 kg Cloth Bag">1 kg Cloth Bag</option>
                  <option value="5 kg Family Sack">5 kg Family Sack</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Department
                </label>
                <select
                  value={editingCatalogProduct.category}
                  onChange={(e) =>
                    setEditingCatalogProduct({
                      ...editingCatalogProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-semibold"
                >
                  <option value="Wood-Pressed Oils">Wood-Pressed Oils</option>
                  <option value="Heirloom Rice & Millets">
                    Heirloom Rice & Millets
                  </option>
                  <option value="Raw Forest Honey">Raw Forest Honey</option>
                  <option value="Artisanal Palm Jaggery">
                    Artisanal Palm Jaggery
                  </option>
                  <option value="Native Farm Preserves">
                    Native Farm Preserves
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setEditingCatalogProduct(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER ACCOUNT MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1B13] rounded-2xl border border-emerald-950 max-w-sm w-full p-6 space-y-4 text-xs shadow-2xl text-stone-200">
            <div className="flex justify-between items-center border-b border-emerald-950 pb-3">
              <h3 className="font-extrabold text-sm text-white">
                Edit Team Member
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTeamUsers((prev) =>
                  prev.map((u) => (u.id === editingUser.id ? editingUser : u)),
                );
                setEditingUser(null);
                showToast("Account credentials updated");
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Staff Name
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={editingUser.password || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-300 mb-1">
                  Role Permission
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-emerald-900 bg-[#122217] text-white font-bold"
                >
                  <option value="STORE_MANAGER">Store Manager</option>
                  <option value="DISPATCH">Dispatch Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-emerald-950">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
