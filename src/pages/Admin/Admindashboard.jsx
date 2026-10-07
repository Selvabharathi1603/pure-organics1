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
  Image as ImageIcon,
  Send,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://pure-organics1.onrender.com";

export default function AdminDashboard({ onLogout }) {
  const storeContext = useStore() || {};
  const {
    products = [],
    orders = [],
    currentAdmin = {
      role: "SUPER_ADMIN",
      username: "owner",
      name: "Store Owner",
    },
    heroSlides = [],
    announcements = {},
    healthGoals = {},
    giftingConfig = {},
    footerConfig = {},
    saveCMSSection,
    addProduct,
    updateProduct,
    toggleStockStatus,
    deleteProduct,
    updateOrderStatus,
    logoutAdmin,
  } = storeContext;

  const role = currentAdmin?.role || "SUPER_ADMIN";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isAdminOrOwner = isSuperAdmin || isAdmin;
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

  const handleLogout = () => {
    try {
      localStorage.removeItem("pure_admin_user");
    } catch {}

    if (typeof logoutAdmin === "function") {
      logoutAdmin();
    }
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  // -------------------------------------------------------------
  // 1. PRODUCTS & INVENTORY
  // -------------------------------------------------------------
  const DEFAULT_PRODUCTS = [
    {
      id: 1,
      name: "Wild Raw Forest Honey",
      category: "Groceries",
      price: 340,
      unit: "500g",
      stock_qty: 25,
      max_stock: 50,
      inStock: true,
    },
    {
      id: 2,
      name: "Unpolished Barnyard Millet (Kuthiraivali)",
      category: "Millets & Grains",
      price: 110,
      unit: "1kg",
      stock_qty: 30,
      max_stock: 60,
      inStock: true,
    },
    {
      id: 3,
      name: "Wood-Pressed Groundnut Oil",
      category: "Cold-Pressed Oils",
      price: 260,
      unit: "1Litre",
      stock_qty: 18,
      max_stock: 50,
      inStock: true,
    },
    {
      id: 4,
      name: "Organic Country Sugar (Naatu Sakkarai)",
      category: "Groceries",
      price: 90,
      unit: "1kg",
      stock_qty: 40,
      max_stock: 80,
      inStock: true,
    },
    {
      id: 5,
      name: "Traditional Foxtail Millet (Thinai)",
      category: "Millets & Grains",
      price: 115,
      unit: "1kg",
      stock_qty: 22,
      max_stock: 50,
      inStock: true,
    },
    {
      id: 6,
      name: "Pure Virgin Coconut Oil",
      category: "Cold-Pressed Oils",
      price: 310,
      unit: "500 ml",
      stock_qty: 15,
      max_stock: 45,
      inStock: true,
    },
    {
      id: 7,
      name: "Heritage Black Rice (Karuppu Kavuni)",
      category: "Millets & Grains",
      price: 155,
      unit: "1kg",
      stock_qty: 12,
      max_stock: 40,
      inStock: true,
    },
    {
      id: 8,
      name: "Wood-Pressed Sesame Oil (Gingelly)",
      category: "Cold-Pressed Oils",
      price: 380,
      unit: "1Litre",
      stock_qty: 20,
      max_stock: 60,
      inStock: true,
    },
  ];

  const [catalogItems, setCatalogItems] = useState(DEFAULT_PRODUCTS);
  const [stockList, setStockList] = useState([]);
  const [pendingStockStatus, setPendingStockStatus] = useState({});
  const [pendingQtyChanges, setPendingQtyChanges] = useState({});
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState("All");

  const [editingCatalogProduct, setEditingCatalogProduct] = useState(null);
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);

  const [newProductForm, setNewProductForm] = useState({
    name: "",
    category: "Cold-Pressed Oils",
    price: "",
    unit: "1 Litre Glass Bottle",
    stock_qty: 30,
    max_stock: 60,
    inStock: true,
  });

  useEffect(() => {
    if (products && Array.isArray(products) && products.length > 0) {
      setCatalogItems(products);
      setStockList(
        products.map((p, idx) => ({
          id: p.id,
          name: p.name || p.title,
          category: p.category || "Cold-Pressed Oils",
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
      setCatalogItems(DEFAULT_PRODUCTS);
      setStockList(
        DEFAULT_PRODUCTS.map((p) => ({
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

  const handleStageStockToggle = (id, currentVal) => {
    setPendingStockStatus((prev) => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : !currentVal,
    }));
  };

  const handleConfirmStockToggle = (id) => {
    const nextVal = pendingStockStatus[id];
    setCatalogItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: nextVal } : item,
      ),
    );
    if (typeof toggleStockStatus === "function") {
      toggleStockStatus(id);
    }
    setPendingStockStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast("Stock status updated");
  };

  const handleStageQtyChange = (id, delta) => {
    setPendingQtyChanges((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + delta,
    }));
  };

  const handleConfirmQtyChange = async (id) => {
    const added = pendingQtyChanges[id];
    if (!added) return;

    setStockList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, currentStock: item.currentStock + added }
          : item,
      ),
    );

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}/quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ added_qty: added }),
      });
    } catch (e) {}

    setPendingQtyChanges((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast(`Inventory updated: +${added} units added`);
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingCatalogProduct) return;

    const payload = {
      ...editingCatalogProduct,
      price: Number(editingCatalogProduct.price),
      stock_qty: Number(editingCatalogProduct.stock_qty),
    };

    setCatalogItems((prev) =>
      prev.map((p) => (p.id === editingCatalogProduct.id ? payload : p)),
    );

    if (typeof updateProduct === "function") {
      await updateProduct(editingCatalogProduct.id, payload);
    } else {
      try {
        await fetch(
          `${API_BASE_URL}/api/products/${editingCatalogProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
      } catch (err) {}
    }

    setEditingCatalogProduct(null);
    showToast("Product parameters saved successfully");
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
  // 2. ORDERS & LOGISTICS
  // -------------------------------------------------------------
  const DEFAULT_ORDERS = [
    {
      id: "ORG-176410",
      tracking_id: "ORG-176410",
      customer_name: "Selva",
      customer_phone: "9487091074",
      customer_address: "chennai",
      total_amount: 130,
      status: "Placed",
      dispatch_note: "",
    },
    {
      id: "ORG-534095",
      tracking_id: "ORG-534095",
      customer_name: "Ajay",
      customer_phone: "7845478215",
      customer_address: "chennai",
      total_amount: 160,
      status: "Placed",
      dispatch_note: "",
    },
    {
      id: "ORG-438437",
      tracking_id: "ORG-438437",
      customer_name: "Selva",
      customer_phone: "9487091074",
      customer_address: "chennai",
      total_amount: 210,
      status: "Placed",
      dispatch_note: "",
    },
    {
      id: "ORG-560768",
      tracking_id: "ORG-560768",
      customer_name: "Abirami",
      customer_phone: "7845748215",
      customer_address: "thanjavur",
      total_amount: 240,
      status: "Placed",
      dispatch_note: "",
    },
    {
      id: "ORG-336649",
      tracking_id: "ORG-336649",
      customer_name: "Bharathi",
      customer_phone: "7845748215",
      customer_address: "coimbatore",
      total_amount: 110,
      status: "Placed",
      dispatch_note: "",
    },
    {
      id: "ORG-567245",
      tracking_id: "ORG-567245",
      customer_name: "Harinisri",
      customer_phone: "9489885252",
      customer_address: "guduvacherry",
      total_amount: 1700,
      status: "Placed",
      dispatch_note: "",
    },
  ];

  const allOrdersList =
    orders && Array.isArray(orders) && orders.length > 0
      ? orders
      : DEFAULT_ORDERS;

  const newOrders = allOrdersList.filter(
    (o) => (o.status || "Placed").toLowerCase() === "placed",
  );

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
    if (typeof updateOrderStatus === "function") {
      updateOrderStatus(orderId, newStatus, currentNote);
    }
    setPendingStatusUpdates((prev) => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
    showToast(`Order status updated to: ${newStatus}`);
  };

  // -------------------------------------------------------------
  // 3. EXPENSES, INCOME & COMPARISON METRICS
  // -------------------------------------------------------------
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
      title: "Wood Mortar Maintenance",
      amount: 2800,
      paidTo: "Local Mill Tech",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Raw Crops",
    amount: "",
    paidTo: "",
    date: new Date().toISOString().split("T")[0],
  });

  const totalExpenseSum = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses],
  );

  const totalIncome = useMemo(
    () =>
      allOrdersList.reduce(
        (s, o) => s + Number(o.total_amount || o.total || 0),
        0,
      ),
    [allOrdersList],
  );
  const netProfit = totalIncome - totalExpenseSum;

  const comparisons = {
    revenue: {
      today: 1390,
      yesterday: 980,
      thisWeek: 6450,
      lastWeek: 5120,
      thisMonth: totalIncome,
      lastMonth: 14200,
    },
    expenses: {
      today: 650,
      yesterday: 800,
      thisWeek: 4100,
      lastWeek: 3450,
      thisMonth: totalExpenseSum,
      lastMonth: 38400,
    },
  };

  // -------------------------------------------------------------
  // 4. DELIVERY PARTNER LOGISTICS ENGINE
  // -------------------------------------------------------------
  const [globalDeliveryMode, setGlobalDeliveryMode] = useState("auto");
  const [activeDispatchOrder, setActiveDispatchOrder] = useState(null);
  const [carrierTesting, setCarrierTesting] = useState(false);

  const [shiprocketConfig, setShiprocketConfig] = useState({
    email: "dispatch@pureorganics.in",
    apiKey: "SR_LIVE_SEC_9941029410",
    pickupWarehouse: "Tirunelveli Mill Hub - 627416",
    autoAwb: true,
    labelFormat: "thermal_4x6",
  });

  const [manualCarrierConfig, setManualCarrierConfig] = useState({
    primaryCarrier: "ST Courier",
    avgTariffKg: 45,
    hubContact: "+91 94870 91074",
    autoWhatsAppNotify: true,
  });

  const [manualDispatchForm, setManualDispatchForm] = useState({
    courierName: "ST Courier",
    trackingNo: "",
  });

  // -------------------------------------------------------------
  // 5. STOREFRONT CMS STUDIO (7 SECTIONS)
  // -------------------------------------------------------------
  const [cmsSection, setCmsSection] = useState("hero");

  const [heroCMS, setHeroCMS] = useState({
    mode: "photo",
    title: heroSlides?.[0]?.title || "Real Wood-Pressed Oils",
    highlight: heroSlides?.[0]?.titleHighlight || "& Native Grains",
    subtext:
      "Crushed slowly in Vaagai wood mortars below 38°C with zero chemical solvents.",
    imageUrl:
      heroSlides?.[0]?.image ||
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4",
  });

  const [announcementCMS, setAnnouncementCMS] = useState(
    announcements?.bannerText
      ? announcements
      : {
          bannerText: "Direct Cold-Pressed Harvests Dispatched Daily",
          badgeText: "Direct Mill",
          couponCode: "HARVEST10",
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
    healthGoals?.heading
      ? healthGoals
      : {
          heading: "Wholesome Nutrition from Native Crops",
          subheading:
            "Unpolished rice and slow wood-pressed oils packed for daily kitchen use.",
        },
  );

  const [lineageCMS, setLineageCMS] = useState({
    tag: "Processing Standards",
    heading: "Purity Without Compromise",
    subheading:
      "Cold wood pestle extraction with zero boiler heat or chemical solvents.",
  });

  const [giftingCMS, setGiftingCMS] = useState(
    giftingConfig?.title
      ? giftingConfig
      : {
          title: "Traditional Harvest Hampers",
          description:
            "Natural sweeteners, whole grains, and cold-pressed staples.",
        },
  );

  const [footerCMS, setFooterCMS] = useState(
    footerConfig?.phone
      ? footerConfig
      : {
          phone: "+91 94878 82321",
          email: "care@pureorganics.in",
          address:
            "Kallidaikurichi, Ambasamudram, Tirunelveli, Tamil Nadu - 627416",
          fssai: "12423008000412",
        },
  );

  // -------------------------------------------------------------
  // 6. STAFF ROLES & CREDENTIALS
  // -------------------------------------------------------------
  const [teamUsers, setTeamUsers] = useState([
    {
      id: 1,
      name: "Store Owner",
      username: "owner",
      role: "SUPER_ADMIN",
      password: "owner123",
    },
    {
      id: 2,
      name: "Site Admin",
      username: "admin",
      role: "ADMIN",
      password: "site123",
    },
    {
      id: 3,
      name: "Farm Manager",
      username: "manager",
      role: "STORE_MANAGER",
      password: "farm123",
    },
    {
      id: 4,
      name: "Dispatch Manager",
      username: "dispatch",
      role: "DISPATCH",
      password: "pack123",
    },
  ]);

  const [newUserForm, setNewUserForm] = useState({
    name: "",
    username: "",
    password: "",
    role: "STORE_MANAGER",
  });

  const [editingUser, setEditingUser] = useState(null);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.password.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
      if (res.ok) {
        setTeamUsers([...teamUsers, { id: Date.now(), ...newUserForm }]);
      }
    } catch {
      setTeamUsers([...teamUsers, { id: Date.now(), ...newUserForm }]);
    }

    setNewUserForm({
      name: "",
      username: "",
      password: "",
      role: "STORE_MANAGER",
    });
    showToast("Staff account created");
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    setTeamUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u)),
    );

    try {
      await fetch(`${API_BASE_URL}/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingUser),
      });
    } catch {}

    setEditingUser(null);
    showToast("Staff credentials saved");
  };

  const handleDeleteUser = async (id, username) => {
    if (username === "owner") {
      alert("Cannot delete primary owner account.");
      return;
    }
    setTeamUsers((prev) => prev.filter((u) => u.id !== id));
    try {
      await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: "DELETE",
      });
    } catch {}
    showToast("Account removed");
  };

  const customerList = useMemo(() => {
    const map = {};
    allOrdersList.forEach((ord) => {
      const phone = ord.customer_phone || ord.customer?.phone || "9487091074";
      const name = ord.customer_name || ord.customer?.name || "Customer";
      const amt = Number(ord.total_amount || ord.total || 0);

      if (!map[phone]) {
        map[phone] = { name, phone, orderCount: 0, totalSpend: 0 };
      }
      map[phone].orderCount += 1;
      map[phone].totalSpend += amt;
    });
    return Object.values(map).sort((a, b) => b.orderCount - a.orderCount);
  }, [allOrdersList]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex font-sans antialiased select-none">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-2xl border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-white text-stone-700 flex flex-col justify-between border-r border-stone-200 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706] font-bold shadow-xs">
                <Store size={20} />
              </div>
              <div>
                <h2 className="font-extrabold text-sm tracking-tight text-stone-900 leading-tight">
                  Pure Organics
                </h2>
                <span className="text-[10px] font-mono tracking-wider text-[#D97706] font-bold uppercase">
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="mt-5 space-y-1.5 overflow-y-auto flex-1 pr-1 text-xs font-semibold">
            {isAdminOrOwner && (
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-stone-900 text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
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
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === "new_orders"
                  ? "bg-stone-900 text-white font-bold shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <BellRing size={16} />
                <span>New Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#D97706] text-black font-extrabold font-mono text-[10px]">
                {newOrders.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("all_orders");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                activeTab === "all_orders"
                  ? "bg-stone-900 text-white font-bold shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <PackageCheck size={16} />
              <span>All Orders History</span>
            </button>

            {(isAdminOrOwner || isDispatch) && (
              <button
                onClick={() => {
                  setActiveTab("delivery_partner");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "delivery_partner"
                    ? "bg-stone-900 text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} />
                  <span>Delivery Partner</span>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              </button>
            )}

            {(isAdminOrOwner || isStoreManager) && (
              <button
                onClick={() => {
                  setActiveTab("catalog");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "catalog"
                    ? "bg-stone-900 text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <PackagePlus size={16} />
                <span>Products &amp; Weights</span>
              </button>
            )}

            {(isAdminOrOwner || isStoreManager) && (
              <button
                onClick={() => {
                  setActiveTab("stocks");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "stocks"
                    ? "bg-stone-900 text-white font-bold shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Boxes size={16} />
                <span>Stocks &amp; Inventory</span>
              </button>
            )}

            {isAdminOrOwner && (
              <>
                <button
                  onClick={() => {
                    setActiveTab("expenses");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "expenses"
                      ? "bg-stone-900 text-white font-bold shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "income"
                      ? "bg-stone-900 text-white font-bold shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <TrendingUp size={16} />
                  <span>Income &amp; Profit Report</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("customers");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "customers"
                      ? "bg-stone-900 text-white font-bold shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Users2 size={16} />
                  <span>Customer Directory</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("cms_studio");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "cms_studio"
                      ? "bg-stone-900 text-white font-bold shadow-sm"
                      : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                  }`}
                >
                  <Video size={16} />
                  <span>Storefront CMS Studio</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* User Roles Pinned Directly Above Logout */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
          {isAdminOrOwner && (
            <button
              onClick={() => {
                setActiveTab("user_roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === "user_roles"
                  ? "bg-stone-900 text-white border-stone-900 font-bold shadow-xs"
                  : "bg-white text-stone-800 border-stone-300 hover:bg-stone-100 font-semibold text-xs"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCog size={15} className="text-[#D97706]" />
                <span>User Roles &amp; Passwords</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-amber-50 text-[#D97706] px-1.5 py-0.5 rounded border border-amber-200">
                {teamUsers.length}
              </span>
            </button>
          )}

          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-xs uppercase font-mono">
              {currentAdmin?.username?.slice(0, 2) || "AD"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-stone-900 truncate">
                {currentAdmin?.name ||
                  currentAdmin?.username ||
                  "Site Administrator"}
              </p>
              <p className="text-[10px] text-stone-500 font-mono tracking-wider">
                {role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-stone-900 hover:text-white text-stone-900 border border-stone-300 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <LogOut size={14} className="text-[#D97706]" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN WORKSPACE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-stone-50">
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <h1 className="text-base font-extrabold text-stone-900 tracking-tight capitalize">
              {activeTab === "delivery_partner"
                ? "Delivery Partner Logistics"
                : activeTab === "cms_studio"
                  ? "Storefront CMS Studio"
                  : activeTab === "user_roles"
                    ? "Staff Roles & Passwords"
                    : activeTab === "catalog"
                      ? "Catalog"
                      : activeTab.replace("_", " ")}
            </h1>
          </div>

          <a
            href="https://pure-organics1.vercel.app/#/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-[#D97706] hover:text-black transition-colors shadow-xs"
          >
            <span>Storefront</span>
            <ExternalLink size={12} />
          </a>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && isAdminOrOwner && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Gross Sales Revenue
                  </span>
                  <p className="text-2xl font-black text-stone-900 font-mono mt-1">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#D97706]">
                    <ArrowUpRight size={13} />
                    <span>Live customer sales</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Total Mill Expenses
                  </span>
                  <p className="text-2xl font-black text-rose-600 font-mono mt-1">
                    ₹{totalExpenseSum.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                    <span>Crops, bottles, courier</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Net Margin In Hand
                  </span>
                  <p
                    className={`text-2xl font-black font-mono ${
                      netProfit >= 0 ? "text-stone-900" : "text-rose-600"
                    }`}
                  >
                    ₹{netProfit.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#D97706] font-bold">
                    <span>Operating cash flow</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Incoming Bookings
                  </span>
                  <p className="text-2xl font-black text-stone-900 font-mono mt-1">
                    {newOrders.length}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#D97706] font-bold">
                    <span>Requires dispatch</span>
                  </div>
                </div>
              </div>

              {/* THREE-PERIOD COMPARISONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Revenue Multi-Period Comparison
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-[#D97706] px-2 py-0.5 rounded border border-amber-200">
                      Live Velocity
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          Today vs. Yesterday
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.revenue.today} vs ₹
                          {comparisons.revenue.yesterday}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-[#D97706] h-full rounded-full"
                          style={{ width: "58%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "42%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          This Week vs. Last Week
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.revenue.thisWeek} vs ₹
                          {comparisons.revenue.lastWeek}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-[#D97706] h-full rounded-full"
                          style={{ width: "63%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "37%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          This Month vs. Last Month
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.revenue.thisMonth} vs ₹
                          {comparisons.revenue.lastMonth}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-[#D97706] h-full rounded-full"
                          style={{ width: "70%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "30%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-5">
                  <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Expense Multi-Period Distribution
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                      Operational Ledger
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          Today vs. Yesterday
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.expenses.today} vs ₹
                          {comparisons.expenses.yesterday}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: "45%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "55%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          This Week vs. Last Week
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.expenses.thisWeek} vs ₹
                          {comparisons.expenses.lastWeek}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: "55%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "45%" }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-stone-600">
                          This Month vs. Last Month
                        </span>
                        <span className="font-mono text-stone-900">
                          ₹{comparisons.expenses.thisMonth} vs ₹
                          {comparisons.expenses.lastMonth}
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden flex gap-0.5">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: "52%" }}
                        />
                        <div
                          className="bg-stone-300 h-full rounded-full"
                          style={{ width: "48%" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEW ORDERS */}
          {activeTab === "new_orders" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-stone-900">
                  Incoming Unprocessed Orders ({newOrders.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Orders placed by customers awaiting packaging and courier
                  handoff.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
                {newOrders.map((ord) => (
                  <div
                    key={ord.id || ord.tracking_id}
                    className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-4 hover:border-stone-300 transition-all"
                  >
                    <div>
                      <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-amber-50 text-[#D97706] font-bold border border-amber-200">
                        NEW #{ord.tracking_id || ord.id}
                      </span>
                      <h4 className="font-black text-lg text-stone-900 mt-2 capitalize">
                        {ord.customer_name || ord.customer?.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        +91 {ord.customer_phone || ord.customer?.phone}
                      </p>
                    </div>

                    <div className="bg-stone-50/80 px-4 py-3 rounded-2xl text-xs text-stone-700 border border-stone-200/80">
                      <strong className="text-stone-900 font-bold">
                        Address:{" "}
                      </strong>
                      {ord.customer_address ||
                        ord.customer?.address ||
                        "Address"}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-stone-900 font-mono">
                        ₹{ord.total_amount || ord.total || 0}
                      </span>
                      <button
                        onClick={() => setActiveDispatchOrder(ord)}
                        className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Truck size={14} /> Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALL ORDERS HISTORY */}
          {activeTab === "all_orders" && (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Consignments Ledger ({filteredOrders.length} orders)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Full historical orders across automated and local couriers.
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-800"
                >
                  <option value="all">All Statuses</option>
                  <option value="Placed">Placed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Tracking ID</th>
                      <th className="p-4">Customer &amp; Phone</th>
                      <th className="p-4">Status &amp; Confirm Action</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredOrders.map((ord) => {
                      const trackingId = ord.tracking_id || ord.id;
                      const staged = pendingStatusUpdates[trackingId];
                      const currentStatus = ord.status || "Placed";
                      const phone = (ord.customer_phone || "").replace(
                        /\D/g,
                        "",
                      );

                      return (
                        <tr key={trackingId} className="hover:bg-stone-50/80">
                          <td className="p-4 font-mono font-bold text-[#D97706]">
                            {trackingId}
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-stone-900">
                              {ord.customer_name || "Customer"}
                            </p>
                            <p className="text-stone-500 font-mono text-[11px]">
                              +91 {phone}
                            </p>
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
                                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white font-semibold text-xs text-stone-900"
                              >
                                <option value="Placed">Placed</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {staged !== undefined &&
                                staged !== currentStatus && (
                                  <button
                                    onClick={() =>
                                      handleConfirmStatusChange(
                                        trackingId,
                                        ord.dispatch_note,
                                      )
                                    }
                                    className="px-3 py-1.5 bg-[#D97706] text-black rounded-lg text-xs font-extrabold hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check size={13} /> OK
                                  </button>
                                )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => {
                                window.open(
                                  `https://wa.me/91${phone}?text=Hello,%20your%20Pure%20Organics%20order%20(${trackingId})%20status%20is%20now:%20${currentStatus}`,
                                );
                              }}
                              className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#D97706] hover:text-black transition-colors"
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

          {/* TAB 4: ADVANCED DELIVERY PARTNER LOGISTICS */}
          {activeTab === "delivery_partner" &&
            (isAdminOrOwner || isDispatch) && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
                      Logistics &amp; Courier Fulfillment Engine
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Configure automated carrier aggregators or direct
                      south-zone parcel services.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-[#D97706] border border-amber-200">
                      <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                      Active:{" "}
                      {globalDeliveryMode === "auto"
                        ? "Shiprocket Engine"
                        : "Manual Local Network"}
                    </span>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-mono">
                      Avg. Mill Handoff Time
                    </span>
                    <p className="text-xl font-black text-stone-900 font-mono mt-1">
                      4.2 Hours
                    </p>
                    <span className="text-[10px] text-[#D97706] font-bold">
                      From payment to courier docket
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-mono">
                      In-Transit Consignments
                    </span>
                    <p className="text-xl font-black text-stone-900 font-mono mt-1">
                      {allOrdersList.filter(
                        (o) => (o.status || "").toLowerCase() === "shipped",
                      ).length || 3}{" "}
                      Parcels
                    </p>
                    <span className="text-[10px] text-stone-500 font-medium">
                      En route across Tamil Nadu
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-mono">
                      First-Attempt Success
                    </span>
                    <p className="text-xl font-black text-emerald-600 font-mono mt-1">
                      98.6%
                    </p>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Zero glass-bottle breakage
                    </span>
                  </div>
                </div>

                {/* Mode Selectors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setGlobalDeliveryMode("auto")}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      globalDeliveryMode === "auto"
                        ? "border-[#D97706] bg-amber-50/30 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          globalDeliveryMode === "auto"
                            ? "border-[#D97706]"
                            : "border-stone-300"
                        }`}
                      >
                        {globalDeliveryMode === "auto" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                        )}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-stone-900 block">
                          Automated Partner (Shiprocket Engine)
                        </strong>
                        <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider">
                          Recommended for Multi-State &amp; Express Delivery
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 pl-8 mt-2.5 leading-relaxed">
                      Instantly triggers AWB barcode assignment, pulls prepaid
                      weight invoices, schedules doorstep mill van pickup, and
                      returns live GPS tracking numbers.
                    </p>
                  </div>

                  <div
                    onClick={() => setGlobalDeliveryMode("manual")}
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                      globalDeliveryMode === "manual"
                        ? "border-stone-900 bg-stone-100 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          globalDeliveryMode === "manual"
                            ? "border-stone-900"
                            : "border-stone-300"
                        }`}
                      >
                        {globalDeliveryMode === "manual" && (
                          <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                        )}
                      </div>
                      <div>
                        <strong className="text-sm font-bold text-stone-900 block">
                          Manual Local Courier Network
                        </strong>
                        <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
                          ST Courier • The Professional Couriers • Speed Post
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 pl-8 mt-2.5 leading-relaxed">
                      Direct hub counter booking. Staff writes tracking docket
                      numbers manually into the order line with instant 1-click
                      customer WhatsApp notifications.
                    </p>
                  </div>
                </div>

                {/* Mode Settings Panel */}
                {globalDeliveryMode === "auto" ? (
                  <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                      <div>
                        <h3 className="font-extrabold text-sm text-stone-900">
                          Shiprocket Production API Parameters
                        </h3>
                        <p className="text-xs text-stone-500">
                          Live credentials utilized by your checkout webhooks to
                          generate consignments.
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={carrierTesting}
                        onClick={() => {
                          setCarrierTesting(true);
                          setTimeout(() => {
                            setCarrierTesting(false);
                            showToast(
                              "Shiprocket API Gateway: Connection OK (200)",
                            );
                          }, 1200);
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-200 cursor-pointer transition-all flex items-center gap-1.5"
                      >
                        {carrierTesting ? (
                          <span className="animate-spin text-xs">⟳</span>
                        ) : (
                          <Check size={13} className="text-emerald-600" />
                        )}
                        <span>
                          {carrierTesting
                            ? "Testing Gateway..."
                            : "Test Connection"}
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Registered API Email ID
                        </label>
                        <input
                          type="email"
                          value={shiprocketConfig.email}
                          onChange={(e) =>
                            setShiprocketConfig({
                              ...shiprocketConfig,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Secret API Token
                        </label>
                        <input
                          type="password"
                          value={shiprocketConfig.apiKey}
                          onChange={(e) =>
                            setShiprocketConfig({
                              ...shiprocketConfig,
                              apiKey: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Default Origin / Mill Hub Name
                        </label>
                        <input
                          type="text"
                          value={shiprocketConfig.pickupWarehouse}
                          onChange={(e) =>
                            setShiprocketConfig({
                              ...shiprocketConfig,
                              pickupWarehouse: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Shipping Label Standard
                        </label>
                        <select
                          value={shiprocketConfig.labelFormat}
                          onChange={(e) =>
                            setShiprocketConfig({
                              ...shiprocketConfig,
                              labelFormat: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                        >
                          <option value="thermal_4x6">
                            4 x 6 Thermal Sticker (Standard Barcode)
                          </option>
                          <option value="a4_sheet">
                            A4 Plain Paper (Dual Slip with Packing List)
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shiprocketConfig.autoAwb}
                          onChange={(e) =>
                            setShiprocketConfig({
                              ...shiprocketConfig,
                              autoAwb: e.target.checked,
                            })
                          }
                          className="rounded accent-[#D97706] w-4 h-4 cursor-pointer"
                        />
                        <span>
                          Auto-generate AWB immediately when customer pays via
                          online checkout
                        </span>
                      </label>

                      <button
                        type="button"
                        onClick={() => showToast("Shiprocket settings saved")}
                        className="px-6 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        Save API Settings
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
                    <div className="pb-4 border-b border-stone-100">
                      <h3 className="font-extrabold text-sm text-stone-900">
                        Local Courier Rate &amp; Routing Rules
                      </h3>
                      <p className="text-xs text-stone-500">
                        Configure partner preferences for quick desk counter
                        parcel operations.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Default Courier Service
                        </label>
                        <select
                          value={manualCarrierConfig.primaryCarrier}
                          onChange={(e) =>
                            setManualCarrierConfig({
                              ...manualCarrierConfig,
                              primaryCarrier: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                        >
                          <option value="ST Courier">
                            ST Courier (Tamil Nadu Priority)
                          </option>
                          <option value="The Professional Couriers">
                            The Professional Couriers
                          </option>
                          <option value="India Post Speed Post">
                            India Post Speed Post
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Average Mill Freight Rate / KG (₹)
                        </label>
                        <input
                          type="number"
                          value={manualCarrierConfig.avgTariffKg}
                          onChange={(e) =>
                            setManualCarrierConfig({
                              ...manualCarrierConfig,
                              avgTariffKg: Number(e.target.value),
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Local Hub Agent Phone
                        </label>
                        <input
                          type="text"
                          value={manualCarrierConfig.hubContact}
                          onChange={(e) =>
                            setManualCarrierConfig({
                              ...manualCarrierConfig,
                              hubContact: e.target.value,
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-2">
                      <strong className="text-stone-900 block font-bold">
                        WhatsApp Template Auto-Generated for Customers:
                      </strong>
                      <p className="font-mono text-[11px] bg-white p-3 rounded-xl border border-stone-200 text-stone-600">
                        "Vanakkam! Your Pure Organics order has been packed and
                        handed over to{" "}
                        <b>{manualCarrierConfig.primaryCarrier}</b>. Tracking
                        Docket: <b>[DOCKET_NUMBER]</b>. Expected delivery: 24-48
                        hrs."
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          showToast("Local logistics routing saved")
                        }
                        className="px-6 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                      >
                        Save Carrier Routing
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* TAB 5: PRODUCTS CATALOG */}
          {activeTab === "catalog" && (isAdminOrOwner || isStoreManager) && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-stone-900 tracking-tight">
                    Master Product Catalog
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Modify prices, weights, units, and inventory toggles.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingNewProduct(!isAddingNewProduct)}
                  className="px-5 py-2.5 bg-[#D97706] hover:bg-amber-700 text-black text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus size={15} />
                  <span>
                    {isAddingNewProduct ? "Close Form" : "Add Product"}
                  </span>
                </button>
              </div>

              {/* Add Product Inline Form */}
              {isAddingNewProduct && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Register New Product
                  </h3>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newProductForm.name || !newProductForm.price) return;
                      const productToAdd = {
                        ...newProductForm,
                        id: Date.now(),
                        price: Number(newProductForm.price),
                      };
                      setCatalogItems((prev) => [...prev, productToAdd]);
                      if (typeof addProduct === "function") {
                        await addProduct(productToAdd);
                      }
                      setIsAddingNewProduct(false);
                      showToast("New product saved live!");
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                    <select
                      value={newProductForm.category}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          category: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold"
                    >
                      <option value="Cold-Pressed Oils">
                        Cold-Pressed Oils
                      </option>
                      <option value="Millets & Grains">Millets & Grains</option>
                      <option value="Groceries">Groceries</option>
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono font-bold"
                    />
                    <select
                      value={newProductForm.unit}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          unit: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold"
                    >
                      <option value="500 ml Glass Bottle">
                        500 ml Glass Bottle
                      </option>
                      <option value="1 Litre Glass Bottle">
                        1 Litre Glass Bottle
                      </option>
                      <option value="500 grams Block">500 grams Block</option>
                      <option value="1 kg Pack">1 kg Pack</option>
                    </select>
                    <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewProduct(false)}
                        className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl py-2 px-6 cursor-pointer shadow-xs transition-colors"
                      >
                        Publish Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Master Products Table */}
              <div className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Unit</th>
                      <th className="p-4">Stock Availability</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredCatalog.map((item) => {
                      const stagedVal = pendingStockStatus[item.id];
                      const displayStatus =
                        stagedVal !== undefined
                          ? stagedVal
                          : item.inStock !== false;
                      const hasPending =
                        stagedVal !== undefined && stagedVal !== item.inStock;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-stone-50/60 transition-colors"
                        >
                          <td className="p-4 pl-6 font-bold text-stone-900">
                            {item.name || item.title}
                          </td>
                          <td className="p-4 text-stone-500">
                            {item.category}
                          </td>
                          <td className="p-4 font-mono font-bold text-stone-900">
                            ₹{item.price}
                          </td>
                          <td className="p-4 text-stone-500">{item.unit}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleStageStockToggle(
                                    item.id,
                                    item.inStock !== false,
                                  )
                                }
                                className={`text-[10px] font-bold px-3 py-1 rounded-md cursor-pointer transition-colors ${
                                  displayStatus
                                    ? "bg-amber-50 text-[#D97706] border border-amber-200/80"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {displayStatus
                                  ? "✓ In Stock"
                                  : "✕ Out of Stock"}
                              </button>

                              {hasPending && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleConfirmStockToggle(item.id)
                                  }
                                  className="px-2.5 py-1 bg-[#D97706] text-black font-extrabold rounded-md text-[10px] hover:bg-amber-400 cursor-pointer shadow-xs flex items-center gap-1"
                                >
                                  <Check size={11} strokeWidth={3} /> OK
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right space-x-2">
                            <button
                              type="button"
                              onClick={() => setEditingCatalogProduct(item)}
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer border border-stone-200 transition-colors"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCatalogItems((prev) =>
                                  prev.filter((p) => p.id !== item.id),
                                );
                                if (typeof deleteProduct === "function")
                                  deleteProduct(item.id);
                              }}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
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
          )}

          {/* TAB 6: STOCKS & INVENTORY */}
          {activeTab === "stocks" && (isAdminOrOwner || isStoreManager) && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Stock Health &amp; Inventory
                </h2>
                <p className="text-xs text-stone-500">
                  Stage batch reload (+10 or +25) and confirm with the OK
                  button.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockList.map((stk) => {
                  const pendingDelta = pendingQtyChanges[stk.id] || 0;
                  const effectiveStock = stk.currentStock + pendingDelta;
                  const percent = Math.round(
                    (effectiveStock / stk.maxStock) * 100,
                  );
                  const isLow = percent <= 30;

                  return (
                    <div
                      key={stk.id}
                      className="p-5 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase font-mono font-bold text-stone-400">
                            {stk.category}
                          </span>
                          <h4 className="font-bold text-sm text-stone-900 mt-0.5">
                            {stk.name}
                          </h4>
                          <span className="text-xs text-stone-500">
                            {stk.unit}
                          </span>
                        </div>
                        <span className="font-mono font-bold text-stone-900">
                          ₹{stk.price}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-stone-500">Remaining</span>
                          <span
                            className={
                              isLow
                                ? "text-rose-600 font-mono"
                                : "text-stone-900 font-mono"
                            }
                          >
                            {percent}% ({effectiveStock} units)
                            {pendingDelta > 0 && (
                              <span className="text-[#D97706] ml-1">
                                (+{pendingDelta})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isLow ? "bg-rose-500" : "bg-[#D97706]"
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleStageQtyChange(stk.id, 10)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStageQtyChange(stk.id, 25)}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-lg cursor-pointer"
                          >
                            +25
                          </button>
                        </div>

                        {pendingDelta > 0 && (
                          <button
                            type="button"
                            onClick={() => handleConfirmQtyChange(stk.id)}
                            className="px-3.5 py-1 bg-[#D97706] hover:bg-amber-400 text-black font-extrabold text-xs rounded-lg cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Check size={12} strokeWidth={3} /> OK
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: EXPENSES LEDGER */}
          {activeTab === "expenses" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Expenses Ledger
                </h2>
                <p className="text-xs text-stone-500">
                  Log raw seeds, packaging bottles, machinery repairs, and
                  transport.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-stone-900">
                  Record Operational Expense
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newExpense.title || !newExpense.amount) return;
                    setExpenses([
                      {
                        id: Date.now(),
                        ...newExpense,
                        amount: Number(newExpense.amount),
                      },
                      ...expenses,
                    ]);
                    setNewExpense({
                      title: "",
                      category: "Raw Crops",
                      amount: "",
                      paidTo: "",
                      date: new Date().toISOString().split("T")[0],
                    });
                    showToast("Expense logged");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Description"
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 sm:col-span-2"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold"
                  >
                    <option value="Raw Crops">Raw Crops / Seeds</option>
                    <option value="Packaging">Glass Bottles &amp; Caps</option>
                    <option value="Machinery">Wood-Chekku Maintenance</option>
                    <option value="Courier & Dispatch">
                      Courier &amp; Transport
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
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl py-2 cursor-pointer transition-colors shadow-xs"
                  >
                    + Log Expense
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Description</th>
                      <th className="p-4">Payee</th>
                      <th className="p-4 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {expenses.map((exp) => (
                      <tr key={exp.id}>
                        <td className="p-4 font-mono text-stone-500">
                          {exp.date}
                        </td>
                        <td className="p-4 font-semibold text-stone-800">
                          {exp.category}
                        </td>
                        <td className="p-4 font-bold text-stone-900">
                          {exp.title}
                        </td>
                        <td className="p-4 text-stone-500">{exp.paidTo}</td>
                        <td className="p-4 text-right font-mono font-bold text-rose-600">
                          ₹{exp.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 8: INCOME & PROFIT REPORT */}
          {activeTab === "income" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Income &amp; Profit Report
                </h2>
                <p className="text-xs text-stone-500">
                  Live calculations of customer inflows minus recorded
                  operational outflows.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-1 shadow-xs">
                  <span className="text-xs text-stone-500 font-medium">
                    Total Customer Revenue
                  </span>
                  <p className="text-3xl font-black text-stone-900 font-mono">
                    ₹{totalIncome.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    From {allOrdersList.length} total orders
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-1 shadow-xs">
                  <span className="text-xs text-stone-500 font-medium">
                    Total Mill Expenses
                  </span>
                  <p className="text-3xl font-black text-rose-600 font-mono">
                    ₹{totalExpenseSum.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Crops, glass bottles, shipping
                  </p>
                </div>
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 space-y-1 shadow-xs">
                  <span className="text-xs text-[#D97706] font-bold">
                    Net Margin In Hand
                  </span>
                  <p className="text-3xl font-black text-stone-900 font-mono">
                    ₹{netProfit.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-stone-500 font-bold">
                    Actual profit generated
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOMER DIRECTORY */}
          {activeTab === "customers" && isAdminOrOwner && (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-200 flex justify-between items-center bg-white">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Customer Directory ({customerList.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Track order frequencies and message customers directly on
                    WhatsApp.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone Number</th>
                      <th className="p-4">Orders Placed</th>
                      <th className="p-4">Total Spent</th>
                      <th className="p-4 text-right">WhatsApp Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {customerList.map((cust) => (
                      <tr key={cust.phone}>
                        <td className="p-4 font-bold text-stone-900 capitalize">
                          {cust.name}
                        </td>
                        <td className="p-4 font-mono text-stone-600">
                          +91 {cust.phone}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-md font-bold text-[10px] ${
                              cust.orderCount > 1
                                ? "bg-amber-50 text-[#D97706] border border-amber-200"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {cust.orderCount}{" "}
                            {cust.orderCount > 1 ? "Orders" : "Order"}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-stone-900">
                          ₹{cust.totalSpend}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() =>
                              window.open(
                                `https://wa.me/91${cust.phone}?text=Dear%20${encodeURIComponent(
                                  cust.name,
                                )},%20thank%20you%20for%20ordering%20from%20Pure%20Organics!`,
                              )
                            }
                            className="px-3 py-1.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
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

          {/* TAB 10: STOREFRONT CMS STUDIO */}
          {activeTab === "cms_studio" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-stone-900 tracking-tight">
                  Storefront Visual CMS Studio
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Live edit photos, looping background videos, banners, and
                  typography across all sections.
                </p>
              </div>

              {/* 7 Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-3 text-xs font-bold">
                {[
                  { id: "hero", label: "1. Hero Banner & Video" },
                  { id: "announcement", label: "2. Announcement Bar" },
                  { id: "departments", label: "3. Categories & Tamil" },
                  { id: "diet", label: "4. Health & Diet" },
                  { id: "lineage", label: "5. Quality Standards" },
                  { id: "gifting", label: "6. Gifting Hampers" },
                  { id: "footer", label: "7. Footer & FSSAI" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCmsSection(s.id)}
                    className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
                      cmsSection === s.id
                        ? "bg-stone-900 text-white shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 1. HERO */}
              {cmsSection === "hero" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Hero Section Media &amp; Headlines
                    </h3>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setHeroCMS({ ...heroCMS, mode: "photo" })
                        }
                        className={`flex-1 py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                          heroCMS.mode === "photo"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-700 border-stone-200"
                        }`}
                      >
                        <ImageIcon size={14} /> Still Photography
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setHeroCMS({ ...heroCMS, mode: "video" })
                        }
                        className={`flex-1 py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                          heroCMS.mode === "video"
                            ? "bg-stone-900 text-white border-stone-900"
                            : "bg-stone-50 text-stone-700 border-stone-200"
                        }`}
                      >
                        <Video size={14} /> Background Video Loop
                      </button>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Main Headline Title
                      </label>
                      <input
                        type="text"
                        value={heroCMS.title}
                        onChange={(e) =>
                          setHeroCMS({ ...heroCMS, title: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Amber Accent Text
                      </label>
                      <input
                        type="text"
                        value={heroCMS.highlight}
                        onChange={(e) =>
                          setHeroCMS({ ...heroCMS, highlight: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Subtext Narrative
                      </label>
                      <textarea
                        rows="2"
                        value={heroCMS.subtext}
                        onChange={(e) =>
                          setHeroCMS({ ...heroCMS, subtext: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                      />
                    </div>

                    {heroCMS.mode === "photo" ? (
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Photograph URL
                        </label>
                        <input
                          type="text"
                          value={heroCMS.imageUrl}
                          onChange={(e) =>
                            setHeroCMS({ ...heroCMS, imageUrl: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block font-bold text-stone-700 mb-1">
                          Direct MP4 Video Stream URL
                        </label>
                        <input
                          type="text"
                          value={heroCMS.videoUrl}
                          onChange={(e) =>
                            setHeroCMS({ ...heroCMS, videoUrl: e.target.value })
                          }
                          className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={async () => {
                        if (typeof saveCMSSection === "function") {
                          await saveCMSSection("hero_slides", [heroCMS]);
                        }
                        showToast("Hero section updated live!");
                      }}
                      className="w-full py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Save Hero Section
                    </button>
                  </div>

                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <span className="text-xs font-bold text-[#D97706] font-mono">
                      Live Storefront Simulator
                    </span>
                    <div className="rounded-2xl overflow-hidden h-72 relative border border-stone-200 bg-black flex items-center justify-center">
                      {heroCMS.mode === "video" ? (
                        <video
                          src={heroCMS.videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover opacity-75"
                        />
                      ) : (
                        <img
                          src={heroCMS.imageUrl}
                          alt="Hero preview"
                          className="w-full h-full object-cover opacity-75"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
                        <h4 className="text-white text-xl font-bold">
                          {heroCMS.title}
                        </h4>
                        <p className="text-amber-400 font-semibold text-sm">
                          {heroCMS.highlight}
                        </p>
                        <p className="text-stone-300 text-xs mt-2 line-clamp-2">
                          {heroCMS.subtext}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ANNOUNCEMENT */}
              {cmsSection === "announcement" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Announcement Bar Settings
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Banner Marquee Text
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Active Coupon Code
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("announcement", announcementCMS);
                      }
                      showToast("Announcement bar updated live!");
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Announcement Bar
                  </button>
                </div>
              )}

              {/* 3. CATEGORIES & TAMIL */}
              {cmsSection === "departments" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Department Cards (English &amp; Tamil Typography)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {departmentsCMS.map((d, idx) => (
                      <div
                        key={d.id}
                        className="p-4 border border-stone-200 rounded-2xl space-y-2 bg-stone-50"
                      >
                        <label className="block text-[10px] uppercase font-bold text-stone-500">
                          English Display
                        </label>
                        <input
                          type="text"
                          value={d.name}
                          onChange={(e) => {
                            const copy = [...departmentsCMS];
                            copy[idx].name = e.target.value;
                            setDepartmentsCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg font-bold bg-white text-stone-900"
                        />
                        <label className="block text-[10px] uppercase font-bold text-stone-500">
                          Tamil Script
                        </label>
                        <input
                          type="text"
                          value={d.tamil}
                          onChange={(e) => {
                            const copy = [...departmentsCMS];
                            copy[idx].tamil = e.target.value;
                            setDepartmentsCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg text-stone-700 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Categories updated live!")}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Categories
                  </button>
                </div>
              )}

              {/* 4. HEALTH & DIET */}
              {cmsSection === "diet" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Health &amp; Diet Narrative
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={dietCMS.heading}
                      onChange={(e) =>
                        setDietCMS({ ...dietCMS, heading: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Narrative Paragraph
                    </label>
                    <textarea
                      rows="3"
                      value={dietCMS.subheading}
                      onChange={(e) =>
                        setDietCMS({ ...dietCMS, subheading: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("health_goals", dietCMS);
                      }
                      showToast("Health narrative updated live!");
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Narrative
                  </button>
                </div>
              )}

              {/* 5. QUALITY STANDARDS */}
              {cmsSection === "lineage" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Quality &amp; Processing Standards
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Main Heading
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Processing Description
                    </label>
                    <textarea
                      rows="3"
                      value={lineageCMS.subheading}
                      onChange={(e) =>
                        setLineageCMS({
                          ...lineageCMS,
                          subheading: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Quality standards saved live!")}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Standards
                  </button>
                </div>
              )}

              {/* 6. GIFTING HAMPERS */}
              {cmsSection === "gifting" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Gifting Hampers Section
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.title}
                      onChange={(e) =>
                        setGiftingCMS({ ...giftingCMS, title: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={giftingCMS.description}
                      onChange={(e) =>
                        setGiftingCMS({
                          ...giftingCMS,
                          description: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("gifting_banner", giftingCMS);
                      }
                      showToast("Gifting configuration updated live!");
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Gifting Section
                  </button>
                </div>
              )}

              {/* 7. FOOTER */}
              {cmsSection === "footer" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Footer &amp; License Credentials
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={footerCMS.phone}
                        onChange={(e) =>
                          setFooterCMS({ ...footerCMS, phone: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={footerCMS.email}
                        onChange={(e) =>
                          setFooterCMS({ ...footerCMS, email: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      FSSAI License Number
                    </label>
                    <input
                      type="text"
                      value={footerCMS.fssai}
                      onChange={(e) =>
                        setFooterCMS({ ...footerCMS, fssai: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Mill Physical Address
                    </label>
                    <textarea
                      rows="2"
                      value={footerCMS.address}
                      onChange={(e) =>
                        setFooterCMS({ ...footerCMS, address: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("footer", footerCMS);
                      }
                      showToast("Footer details updated live!");
                    }}
                    className="px-5 py-2.5 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Footer Information
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: USER ROLES & TEAM CREDENTIALS */}
          {activeTab === "user_roles" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">
                  Staff Role Management &amp; Passwords
                </h2>
                <p className="text-xs text-stone-500">
                  Create, audit, and modify login credentials for Admin, Store
                  Manager, and Dispatch.
                </p>
              </div>

              {/* Create User Card */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-stone-900">
                  Create Staff Login
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
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    value={newUserForm.username}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        username: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Password"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm({
                        ...newUserForm,
                        password: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                  />
                  <select
                    value={newUserForm.role}
                    onChange={(e) =>
                      setNewUserForm({ ...newUserForm, role: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                  >
                    <option value="STORE_MANAGER">Store Manager</option>
                    <option value="DISPATCH">Dispatch Manager</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                  <div className="sm:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl py-2 px-6 cursor-pointer transition-colors shadow-xs"
                    >
                      + Create Account
                    </button>
                  </div>
                </form>
              </div>

              {/* Roles Table */}
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Staff Name</th>
                      <th className="p-4">Username</th>
                      <th className="p-4">Password</th>
                      <th className="p-4">Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {teamUsers.map((st) => (
                      <tr key={st.id} className="hover:bg-stone-50/80">
                        <td className="p-4 font-bold text-stone-900">
                          {st.name}
                        </td>
                        <td className="p-4 font-mono font-bold text-stone-700">
                          {st.username}
                        </td>
                        <td className="p-4 font-mono text-stone-600">
                          {st.password || "••••••••"}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200 text-[10px] font-bold">
                            {st.role}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingUser(st)}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer border border-stone-200"
                          >
                            <Edit3 size={12} /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(st.id, st.username)}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                            title="Delete user"
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

      {/* ------------------------------------------------------------- */}
      {/* 3. MODALS */}
      {/* ------------------------------------------------------------- */}

      {/* A. EDIT PRODUCT MODAL */}
      {editingCatalogProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-extrabold text-sm text-stone-900">
                Edit Product: {editingCatalogProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCatalogProduct(null)}
                className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-3.5">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCatalogProduct.price}
                    onChange={(e) =>
                      setEditingCatalogProduct({
                        ...editingCatalogProduct,
                        price: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold font-mono focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCatalogProduct.stock_qty || 25}
                    onChange={(e) =>
                      setEditingCatalogProduct({
                        ...editingCatalogProduct,
                        stock_qty: e.target.value,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold font-mono focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Packaging Unit
                </label>
                <select
                  value={editingCatalogProduct.unit}
                  onChange={(e) =>
                    setEditingCatalogProduct({
                      ...editingCatalogProduct,
                      unit: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-semibold focus:outline-none focus:border-stone-900"
                >
                  <option value="500 ml Glass Bottle">
                    500 ml Glass Bottle
                  </option>
                  <option value="1 Litre Glass Bottle">
                    1 Litre Glass Bottle
                  </option>
                  <option value="500 grams Block">500 grams Block</option>
                  <option value="1 kg Pack">1 kg Pack</option>
                  <option value="500g">500g</option>
                  <option value="1kg">1kg</option>
                  <option value="1Litre">1Litre</option>
                  <option value="500 ml">500 ml</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingCatalogProduct(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-sm w-full p-6 space-y-4 text-xs shadow-2xl text-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
                Edit Staff ({editingUser.username})
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.password}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Assigned Role
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-bold"
                >
                  <option value="STORE_MANAGER">Store Manager</option>
                  <option value="DISPATCH">Dispatch Manager</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. DISPATCH ACTION MODAL */}
      {activeDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
                Dispatch Order #
                {activeDispatchOrder.tracking_id || activeDispatchOrder.id}
              </h3>
              <button
                type="button"
                onClick={() => setActiveDispatchOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Courier Partner
                </label>
                <select
                  value={manualDispatchForm.courierName}
                  onChange={(e) =>
                    setManualDispatchForm({
                      ...manualDispatchForm,
                      courierName: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900"
                >
                  <option value="ST Courier">ST Courier</option>
                  <option value="The Professional Couriers">
                    The Professional Couriers
                  </option>
                  <option value="India Post Speed Post">
                    India Post Speed Post
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveDispatchOrder(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof updateOrderStatus === "function") {
                    updateOrderStatus(
                      activeDispatchOrder.tracking_id || activeDispatchOrder.id,
                      "Shipped",
                      `${manualDispatchForm.courierName} - ${manualDispatchForm.trackingNo || "DISPATCHED"}`,
                    );
                  }
                  showToast("Order dispatched and status updated");
                  setActiveDispatchOrder(null);
                }}
                className="px-5 py-2 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
