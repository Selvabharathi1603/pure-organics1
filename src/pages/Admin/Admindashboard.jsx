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
  CreditCard,
  Banknote,
  ShieldCheck,
  Sparkles,
  Layers,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Star,
  Gift,
  ChevronDown,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://pure-organics1.onrender.com";

const PRODUCT_CATEGORIES = [
  "Cold-Pressed Oils",
  "Millets & Grains",
  "Groceries",
  "Natural Sweeteners",
  "Forest Raw Honey",
  "Farm Preserves",
];

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
    isCodEnabled = true,
    toggleCodStatus,
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
    if (typeof logoutAdmin === "function") logoutAdmin();
    if (typeof onLogout === "function") onLogout();
  };

  // -------------------------------------------------------------
  // SYSTEM ESCALATIONS (STORE MANAGER & DISPATCH -> SUPER ADMIN)
  // -------------------------------------------------------------
  const [adminNotifications, setAdminNotifications] = useState([
    {
      id: "ALERT-1",
      from: "Store Manager (farm)",
      type: "STOCK",
      title: "Out of Stock Warning: Wood-Pressed Sesame Oil",
      message: "Batch running under 5 units at the Ambasamudram mill.",
      time: "10:15 AM",
      read: false,
    },
    {
      id: "ALERT-2",
      from: "Dispatch Manager (pack)",
      type: "DISPATCH",
      title: "Consignment Transit Delay at ST Courier Madurai",
      message: "Order #ORG-560768 parcel held for hub verification.",
      time: "Yesterday",
      read: false,
    },
  ]);

  const [storeManagerNotice, setStoreManagerNotice] = useState("");
  const [issueQueryText, setIssueQueryText] = useState("");
  const [issueQueryTopic, setIssueQueryTopic] = useState("Transit Delay");

  const sendEscalationToSuperAdmin = (title, message, type) => {
    const newAlert = {
      id: `ALERT-${Date.now()}`,
      from: `${currentAdmin.name || "Staff"} (${role})`,
      type,
      title,
      message,
      time: "Just now",
      read: false,
    };
    setAdminNotifications((prev) => [newAlert, ...prev]);
    showToast("Notification escalated to Super Admin successfully");
  };

  // -------------------------------------------------------------
  // 1. PRODUCTS & INVENTORY DATA (FIXED ADD & DOUBLE-CLICK OK)
  // -------------------------------------------------------------
  const [catalogItems, setCatalogItems] = useState(products || []);
  const [stockList, setStockList] = useState([]);
  const [stagedStockStatus, setStagedStockStatus] = useState({});
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
    image: "",
    description: "",
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
    }
  }, [products]);

  const handleDoubleClickStock = (id, currentInStock) => {
    const toggled =
      stagedStockStatus[id] !== undefined
        ? !stagedStockStatus[id]
        : !currentInStock;
    setStagedStockStatus((prev) => ({
      ...prev,
      [id]: toggled,
    }));
    showToast("Status change staged. Click 'OK' to confirm.");
  };

  const handleConfirmStockStatus = (id) => {
    const nextVal = stagedStockStatus[id];
    if (nextVal === undefined) return;

    setCatalogItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, inStock: nextVal } : item,
      ),
    );

    if (typeof toggleStockStatus === "function") {
      toggleStockStatus(id);
    }

    setStagedStockStatus((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    showToast(
      `Product stock status saved as: ${nextVal ? "In Stock" : "Out of Stock"}`,
    );
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
      category: editingCatalogProduct.category || "Cold-Pressed Oils",
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

  const handleCreateNewProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim() || !newProductForm.price) return;

    const itemToSave = {
      ...newProductForm,
      id: Date.now(),
      price: Number(newProductForm.price),
      stock_qty: Number(newProductForm.stock_qty || 30),
      max_stock: Number(newProductForm.max_stock || 60),
      inStock: newProductForm.inStock !== false,
      image:
        newProductForm.image ||
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=300&q=80",
    };

    setCatalogItems((prev) => [itemToSave, ...prev]);

    if (typeof addProduct === "function") {
      await addProduct(itemToSave);
    } else {
      try {
        await fetch(`${API_BASE_URL}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(itemToSave),
        });
      } catch (err) {}
    }

    setNewProductForm({
      name: "",
      category: "Cold-Pressed Oils",
      price: "",
      unit: "1 Litre Glass Bottle",
      stock_qty: 30,
      max_stock: 60,
      inStock: true,
      image: "",
      description: "",
    });

    setIsAddingNewProduct(false);
    showToast("New Product created and published live!");
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
  // 2. ORDERS & LOGISTICS DATA (WITH STAGED OK CONFIRMATION)
  // -------------------------------------------------------------
  const allOrdersList = orders || [];
  const newOrders = allOrdersList.filter(
    (o) => (o.status || "Placed").toLowerCase() === "placed",
  );

  const [orderShippingFilter, setOrderShippingFilter] = useState("all");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [stagedOrderStatuses, setStagedOrderStatuses] = useState({});

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

  const handleStageOrderStatus = (orderId, newStatus) => {
    setStagedOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleConfirmOrderStatus = (orderId, currentNote) => {
    const newStatus = stagedOrderStatuses[orderId];
    if (!newStatus) return;

    if (typeof updateOrderStatus === "function") {
      updateOrderStatus(orderId, newStatus, currentNote);
    }

    setStagedOrderStatuses((prev) => {
      const copy = { ...prev };
      delete copy[orderId];
      return copy;
    });
    showToast(`Order status updated to: ${newStatus}`);
  };

  // -------------------------------------------------------------
  // 3. EXPENSES, INCOME & INFLOW LOGGING
  // -------------------------------------------------------------
  const [financeTimeframe, setFinanceTimeframe] = useState("month");

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2026-10-10",
      category: "Raw Crops",
      title: "Native Sesame Seeds (250 kg)",
      amount: 40000,
      paidTo: "Tirunelveli Farmers Market",
    },
    {
      id: 2,
      date: "2026-10-09",
      category: "Packaging",
      title: "1 Litre Glass Bottles (400 units)",
      amount: 10000,
      paidTo: "South Glasspack Ltd",
    },
    {
      id: 3,
      date: "2026-10-08",
      category: "Machinery",
      title: "Vaagai Wood Mortar Maintenance",
      amount: 3200,
      paidTo: "Local Mill Tech",
    },
    {
      id: 4,
      date: "2026-10-06",
      category: "Courier & Dispatch",
      title: "ST Courier Prepaid Consignment Slips",
      amount: 5400,
      paidTo: "ST Courier Hub Ambasamudram",
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Raw Crops",
    amount: "",
    paidTo: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [manualInflows, setManualInflows] = useState([
    {
      id: "IN-201",
      date: "2026-10-10",
      source: "Counter Sales (Ambasamudram Mill)",
      product: "Groundnut Oil 5L Canister",
      amount: 1450,
      paymentMode: "UPI QR",
    },
    {
      id: "IN-202",
      date: "2026-10-09",
      source: "Bulk Farm Hamper Booking",
      product: "Karupatti & Ghee Combo Box",
      amount: 2800,
      paymentMode: "Direct Bank Transfer",
    },
  ]);

  const [newInflow, setNewInflow] = useState({
    source: "",
    product: "",
    amount: "",
    paymentMode: "UPI QR",
    date: new Date().toISOString().split("T")[0],
  });

  const totalExpenseSum = useMemo(
    () => expenses.reduce((s, e) => s + Number(e.amount || 0), 0),
    [expenses],
  );

  const totalManualInflow = useMemo(
    () => manualInflows.reduce((s, i) => s + Number(i.amount || 0), 0),
    [manualInflows],
  );

  const totalIncome = useMemo(
    () =>
      allOrdersList.reduce(
        (s, o) => s + Number(o.total_amount || o.total || 0),
        0,
      ) + totalManualInflow,
    [allOrdersList, totalManualInflow],
  );

  const netProfit = totalIncome - totalExpenseSum;

  const analyticsData = {
    day: {
      income: 3450,
      expense: 1400,
      net: 2050,
      incomePoints: [25, 45, 65, 50, 85, 95, 75],
      expensePoints: [15, 20, 35, 30, 45, 50, 40],
      labels: ["6 AM", "9 AM", "12 PM", "3 PM", "6 PM", "9 PM", "11 PM"],
    },
    week: {
      income: 24600,
      expense: 11200,
      net: 13400,
      incomePoints: [45, 60, 80, 70, 95, 85, 100],
      expensePoints: [30, 40, 45, 35, 60, 50, 55],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    month: {
      income: totalIncome || 62400,
      expense: totalExpenseSum || 28600,
      net: totalIncome - totalExpenseSum || 33800,
      incomePoints: [50, 65, 55, 80, 90, 100, 115],
      expensePoints: [35, 45, 40, 50, 65, 70, 60],
      labels: ["W1", "W2", "W3", "W4", "W5"],
    },
    year: {
      income: 684000,
      expense: 310000,
      net: 374000,
      incomePoints: [45, 60, 75, 70, 85, 95, 110, 125, 105, 120, 135, 145],
      expensePoints: [30, 40, 45, 50, 55, 60, 70, 80, 65, 75, 85, 90],
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
  };

  const activeAnalytics = analyticsData[financeTimeframe];

  // -------------------------------------------------------------
  // 4. DELIVERY PARTNER & COD TRANSACTION CALCULATIONS
  // -------------------------------------------------------------
  const [globalDeliveryMode, setGlobalDeliveryMode] = useState("auto");
  const [activeDispatchOrder, setActiveDispatchOrder] = useState(null);

  const shiprocketOrdersCount = useMemo(() => {
    return allOrdersList.filter(
      (o) =>
        (o.dispatch_note || "").toLowerCase().includes("shiprocket") ||
        (o.tracking_id || "").startsWith("SR"),
    ).length;
  }, [allOrdersList]);

  const manualCourierOrdersCount = useMemo(() => {
    return allOrdersList.length - shiprocketOrdersCount;
  }, [allOrdersList, shiprocketOrdersCount]);

  const codOrdersList = useMemo(() => {
    return allOrdersList.filter((o) =>
      (o.payment_method || "").toLowerCase().includes("cash"),
    );
  }, [allOrdersList]);

  const codOrdersCount = codOrdersList.length;
  const codTotalAmount = codOrdersList.reduce(
    (sum, o) => sum + Number(o.total_amount || o.total || 0),
    0,
  );

  const prepaidOrdersCount = allOrdersList.length - codOrdersCount;
  const prepaidTotalAmount = Math.max(0, totalIncome - codTotalAmount);

  const [manualDispatchForm, setManualDispatchForm] = useState({
    courierName: "ST Courier",
    trackingNo: "",
  });

  // -------------------------------------------------------------
  // 5. NILA AI CUSTOMER INQUIRIES INTELLIGENCE
  // -------------------------------------------------------------
  const [nilaQueries, setNilaQueries] = useState([
    {
      id: "NQ-1092",
      userPhone: "+91 94870 91074",
      question: "Which cold-pressed oil is best for daily deep frying?",
      nilaAnswer:
        "Wood-Pressed Groundnut Oil has a high smoke point (approx 225°C) and zero trans fats, making it ideal for traditional South Indian deep frying.",
      category: "Oil Recommendations",
      timestamp: "Today, 10:14 AM",
    },
    {
      id: "NQ-1093",
      userPhone: "+91 78454 78215",
      question: "How should I cook Karuppu Kavuni black rice for porridge?",
      nilaAnswer:
        "Soak Karuppu Kavuni rice for at least 6 to 8 hours. Pressure cook with 4:1 water ratio for 6 whistles, then temper with coconut milk or country sugar.",
      category: "Recipe Guidance",
      timestamp: "Today, 09:30 AM",
    },
  ]);

  // -------------------------------------------------------------
  // 6. STOREFRONT VISUAL CMS STUDIO (ALL 10 SECTIONS + PREVIEWS)
  // -------------------------------------------------------------
  const [cmsSection, setCmsSection] = useState("hero");

  // 1. Hero Showcase
  const [heroCMS, setHeroCMS] = useState({
    mode: "photo",
    title: heroSlides?.[0]?.title || "Real Mara Chekku Oils",
    highlight: heroSlides?.[0]?.titleHighlight || "& Heirloom Grains.",
    subtext:
      "Wood-pressed exclusively from native sun-dried red-skin peanuts. Settled naturally in sunlight without synthetic degumming or solvent extraction.",
    imageUrl:
      heroSlides?.[0]?.image ||
      "https://t3.ftcdn.net/jpg/02/71/72/06/360_F_271720694_xeOnMuwr2oiP9PG7yn8cKet1upl76QOu.jpg",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4",
  });

  // 2. Announcement Bar & Ticker
  const [announcementCMS, setAnnouncementCMS] = useState(
    announcements?.bannerText
      ? announcements
      : {
          bannerText:
            "Direct Cold-Pressed Harvests Dispatched Daily • 100% Mara Chekku",
          badgeText: "Native Harvest · Autumn 2026 Batch",
          couponCode: "HARVEST10",
          freeShippingThreshold: 499,
        },
  );

  // 3. Trust Badge Marquee (Certifications)
  const [trustBadgesCMS, setTrustBadgesCMS] = useState([
    {
      id: 1,
      name: "FSSAI Government License",
      imageUrl: "https://pure-organics1.vercel.app/assets/image_5dcbfe.png",
    },
    {
      id: 2,
      name: "100% Organic Certified",
      imageUrl: "https://pure-organics1.vercel.app/assets/image_5dcfbf.png",
    },
    {
      id: 3,
      name: "Healthy Food Seal",
      imageUrl: "https://pure-organics1.vercel.app/assets/image_5dd09c.png",
    },
    {
      id: 4,
      name: "Gluten Free Authentic",
      imageUrl: "https://pure-organics1.vercel.app/assets/image_5dd39c.png",
    },
    {
      id: 5,
      name: "BIO Product Standards",
      imageUrl: "https://pure-organics1.vercel.app/assets/image_5dd437.png",
    },
  ]);

  // 4. Shop by Department (Categories & Imagery)
  const [departmentsCMS, setDepartmentsCMS] = useState([
    {
      id: 1,
      category_key: "oils",
      name: "Wood-Pressed Oils",
      tamil: "மரச்செக்கு எண்ணெய்",
      count: "6 Cold Batches",
      imageUrl:
        "https://media.istockphoto.com/id/1395867248/photo/rosemary-essential-oil-or-infusion-on-an-old-wooden-table.jpg?s=612x612&w=0&k=20&c=-QggcpSyV91hemES4cCqmHfdnkFNW4kmgP89IVEGeg8=",
    },
    {
      id: 2,
      category_key: "grains",
      name: "Heirloom Rice & Millets",
      tamil: "பாரம்பரிய தானியங்கள்",
      count: "9 Heritage Grains",
      imageUrl:
        "https://media.istockphoto.com/id/671580278/photo/varieties-of-grains-seeds-and-raw-quino.jpg?s=612x612&w=0&k=20&c=ATTVKd0ls6JoL4AvGZ-K6bs_q8rlkJDEyzOLu0d2vrA=",
    },
    {
      id: 3,
      category_key: "honey",
      name: "Raw Forest Honey",
      tamil: "இயற்கை மலைத்தேன்",
      count: "Wild Cliff Harvest",
      imageUrl:
        "https://media.istockphoto.com/id/598241944/photo/honey-in-jar-and-bunch-of-dry-lavender.jpg?s=612x612&w=0&k=20&c=gVg1BaJ78uniQbpfdFiYvMzim98gREdx-5c4ENBp2tE=",
    },
    {
      id: 4,
      category_key: "sweeteners",
      name: "Artisanal Palm Jaggery",
      tamil: "உடன்குடி கருப்பட்டி",
      count: "Iron Pan Boiled",
      imageUrl:
        "https://media.istockphoto.com/id/869266164/photo/jaggery-sugar-and-cane.jpg?s=2048x2048&w=is&k=20&c=Xa-DIQ73T41G4JDIBWhI-1-gkrpXct1I7FkehubDMUQ=",
    },
    {
      id: 5,
      category_key: "pickle",
      name: "Native Farm Preserves",
      tamil: "பாரம்பரிய பண்ணை ஊறல்",
      count: "Authentic Taste",
      imageUrl:
        "https://media.istockphoto.com/id/1338316600/photo/image-glass-jar-of-green-mango-chutney-recipe-with-hessian-lid-pickle-with-chopped-raw-mango.jpg?s=2048x2048&w=is&k=20&c=2EGNmLNNt2zC0utGXglHoaTog--981l9Wxatly2DuYw=",
    },
  ]);

  // 5. Mill Heritage (Photos & Machinery Video)
  const [millHeritageCMS, setMillHeritageCMS] = useState({
    title: "Explore Our Mill Heritage",
    subtitle:
      "Every harvest begins with traditional stone sun-drying and ends with cold Vaagai wood pressing below 38°C.",
    badge: "Tradition Since 1954",
    mediaMode: "photo",
    imageUrl: "https://pure-organics1.vercel.app/assets/DM.jpg",
    videoUrl:
      "https://assets.mixkit.co/videos/preview/mixkit-farm-field-4248-large.mp4",
    gallery: [
      {
        id: 1,
        title: "Glass Bottle Racks",
        url: "https://pure-organics1.vercel.app/assets/img1.jpeg",
      },
      {
        id: 2,
        title: "Storage Vessels",
        url: "https://pure-organics1.vercel.app/assets/img2.jpeg",
      },
      {
        id: 3,
        title: "Solar Drying Tower",
        url: "https://pure-organics1.vercel.app/assets/img3.jpeg",
      },
      {
        id: 4,
        title: "Wood Mortar Extraction",
        url: "https://pure-organics1.vercel.app/assets/img4.jpg",
      },
    ],
  });

  // 6. Partner Platforms (Also Available On with AA1 to AA5 images)
  const [platformsCMS, setPlatformsCMS] = useState({
    title: "Also available on",
    subtitle:
      "Order our fresh mara chekku harvest directly to your doorstep in 10 minutes",
    partners: [
      {
        name: "Blinkit",
        logoUrl: "https://pure-organics1.vercel.app/assets/AA1.jpeg",
      },
      {
        name: "Swiggy Instamart",
        logoUrl: "https://pure-organics1.vercel.app/assets/AA2.jpeg",
      },
      {
        name: "BigBasket",
        logoUrl: "https://pure-organics1.vercel.app/assets/AA3.png",
      },
      {
        name: "DMart Ready",
        logoUrl: "https://pure-organics1.vercel.app/assets/AA4.jpeg",
      },
      {
        name: "Amazon",
        logoUrl: "https://pure-organics1.vercel.app/assets/AA5.jpeg",
      },
    ],
  });

  // 7. Diet & Lifestyle Concerns (Botanicals Dp1, Dp2, Dp3)
  const [dietCMS, setDietCMS] = useState(
    healthGoals?.heading
      ? healthGoals
      : {
          tag: "Healthy Inside, Happy Outside",
          heading: "Shop by Diet & Lifestyle Concern",
          subheading:
            "Every harvest is crushed fresh in traditional Vaagai wooden pestles, delivering honest native staples directly to your kitchen.",
          pillars: [
            {
              step: "01",
              tagline: "TRADITIONAL COLD EXTRACTION",
              title: "FORMULATED FOR DAILY SOUTH INDIAN COOKING",
              summary:
                "Wood-pressed in slow Vaagai pestles under 38°C with zero chemical heat. Retains authentic dense aroma for everyday sambar, rasam, and dosa crisping.",
              schedule: "Daily seasoning, hot tiffin frying",
              botanicalUrl:
                "https://pure-organics1.vercel.app/assets/Dp1.png.png",
            },
            {
              step: "02",
              tagline: "UNPOLISHED ANCESTRAL HARVESTS",
              title: "LOW GLYCEMIC CARE & SLOW-RELEASE STAPLES",
              summary:
                "Unpolished whole grains releasing sustained energy without blood sugar spikes. Pure dietary fiber harvests naturally rich in iron and zinc.",
              schedule: "Replacement for polished rice at lunch",
              botanicalUrl:
                "https://pure-organics1.vercel.app/assets/Dp2.png.png",
            },
            {
              step: "03",
              tagline: "RAW VASCULAR NUTRITION",
              title: "COLD-DECANTED CARDIO & ESSENTIAL LIPIDS",
              summary:
                "Raw cold extractions loaded with active phytosterols and unheated fatty acids to naturally nourish cellular and cardiac vitality.",
              schedule: "1 spoon raw or gentle low-heat sauteing",
              botanicalUrl:
                "https://pure-organics1.vercel.app/assets/Dp3.png.png",
            },
          ],
        },
  );

  // 8. Quality Standards & Manifesto
  const [manifestoCMS, setManifestoCMS] = useState({
    heading: "Purity Without Compromise.",
    point1Title: "Native Heritage Seeds",
    point1Desc:
      "Harvested directly from local rain-fed soils without synthetic sprays or chemical fertilizers.",
    point2Title: "Vaagai Wood Chekku",
    point2Desc:
      "Gently crushed in native Vaagai wooden pestles, preserving natural taste and aroma below 38°C.",
    point3Title: "Direct from Village Farmers",
    point3Desc:
      "Sourced straight from grower families across Tirunelveli and Thanjavur with fair farmgate payments.",
  });

  // 9. Gifting Hampers & Scratch Card (Combos Cover & Gold Texture)
  const [giftingCMS, setGiftingCMS] = useState(
    giftingConfig?.title
      ? giftingConfig
      : {
          title: "Pantry Bundles & Daily Staples",
          scratchPrompt: "Scratch to reveal our value-added combos",
          rewardCode: "HARVEST10",
          rewardDiscount: "10% OFF",
          coverImage:
            "https://pure-organics1.vercel.app/assets/COMBOS%20FOR%20YOU.jpeg",
          scratchTextureUrl:
            "https://pure-organics1.vercel.app/assets/gold%20texture%20Scratch.jpeg",
        },
  );

  // 10. Nila Assistant Callout Component
  const [nilaCalloutCMS, setNilaCalloutCMS] = useState({
    badge: "Ask Nila • Product Assistant",
    headline: "Unsure which native staple suits your family?",
    subtext:
      "Ask Nila for guidance on picking the right cooking oils, preparing Karuppu Kavuni rice, or understanding our cold-press process.",
    characterImgUrl: "https://pure-organics1.vercel.app/assets/NILA.png",
    suggestedQueries: [
      "Which oil for daily cooking?",
      "Karuppu Kavuni benefits",
      "Cold-press vs regular oils",
    ],
  });

  // 11. Footer & Licenses
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
  // 7. STAFF CREDENTIALS
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
    if (!isSuperAdmin) {
      alert("Unauthorized: Only Super Admin can provision staff accounts.");
      return;
    }
    if (!newUserForm.username.trim() || !newUserForm.password.trim()) return;

    try {
      await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserForm),
      });
    } catch {}

    setTeamUsers([...teamUsers, { id: Date.now(), ...newUserForm }]);
    setNewUserForm({
      name: "",
      username: "",
      password: "",
      role: "STORE_MANAGER",
    });
    showToast("Staff account created successfully");
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
    showToast("Staff credentials updated");
  };

  const handleDeleteUser = async (id, username) => {
    if (!isSuperAdmin) {
      alert("Unauthorized: Only Super Admin can delete credentials.");
      return;
    }
    if (username === "owner") {
      alert("Primary Super Admin account cannot be deleted.");
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
    <div className="min-h-screen bg-[#EFE9DD] text-stone-900 flex font-sans antialiased selection:bg-[#D97706] selection:text-white">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#1A1613] text-stone-100 px-5 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold shadow-2xl border border-[#D97706]/40">
          <CheckCircle2 className="w-4 h-4 text-[#D97706] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT SIDEBAR (ROASTED ESPRESSO) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#1A1613] text-stone-300 flex flex-col justify-between border-r border-stone-800 transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#D97706]/15 border border-[#D97706]/30 flex items-center justify-center text-[#D97706] font-bold shadow-xs">
                <Store size={20} />
              </div>
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="font-bold text-base tracking-wide text-stone-100 leading-tight"
                >
                  Pure Organics
                </h2>
                <span className="text-[10px] font-mono tracking-wider text-[#D97706] font-bold uppercase">
                  {role.replace("_", " ")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
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
                    ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-900"
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
                  ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-stone-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <BellRing size={16} />
                <span>New Orders</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-200/20 text-[#F59E0B] font-extrabold font-mono text-[10px] border border-[#D97706]/40">
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
                  ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                  : "text-stone-300 hover:text-white hover:bg-stone-900"
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
                    ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} />
                  <span>Delivery Partner</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
              </button>
            )}

            {isSuperAdmin && (
              <button
                onClick={() => {
                  setActiveTab("payment_settings");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeTab === "payment_settings"
                    ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Banknote size={16} />
                  <span>Payment Gateway (COD)</span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCodEnabled
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-rose-500"
                  }`}
                />
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
                    ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-900"
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
                    ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                    : "text-stone-300 hover:text-white hover:bg-stone-900"
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
                      ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
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
                      ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <TrendingUp size={16} />
                  <span>Income &amp; Analytics</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("customers");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "customers"
                      ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <Users2 size={16} />
                  <span>Customer Directory</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("nila_logs");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "nila_logs"
                      ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={16} />
                    <span>Nila AI Inquiries</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-400 font-bold border border-emerald-400/30">
                    Live
                  </span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("cms_studio");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${
                    activeTab === "cms_studio"
                      ? "bg-[#D97706] text-stone-950 font-bold shadow-sm"
                      : "text-stone-300 hover:text-white hover:bg-stone-900"
                  }`}
                >
                  <Layers size={16} />
                  <span>Storefront CMS Studio</span>
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Roles & Admin Log Out */}
        <div className="p-4 border-t border-stone-800 bg-[#14110E] space-y-3">
          {isAdminOrOwner && (
            <button
              onClick={() => {
                setActiveTab("user_roles");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                activeTab === "user_roles"
                  ? "bg-[#D97706] text-stone-950 border-[#D97706] font-bold shadow-xs"
                  : "bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800 font-semibold text-xs"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UserCog size={15} />
                <span>User Roles &amp; Passwords</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-[#D97706]/20 text-[#D97706] px-1.5 py-0.5 rounded border border-[#D97706]/40">
                {teamUsers.length}
              </span>
            </button>
          )}

          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-xl bg-stone-800 text-amber-200 border border-stone-700 flex items-center justify-center font-bold text-xs uppercase font-mono">
              {currentAdmin?.username?.slice(0, 2) || "AD"}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-stone-100 truncate">
                {currentAdmin?.name ||
                  currentAdmin?.username ||
                  "Site Administrator"}
              </p>
              <p className="text-[10px] text-stone-400 font-mono tracking-wider">
                {role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-[#D97706] hover:text-stone-950 text-stone-300 border border-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <LogOut size={14} className="text-[#D97706]" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ------------------------------------------------------------- */}
      {/* 2. RIGHT WORKSPACE (BG: #EFE9DD - SHOP BY DIET PALETTE) */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#EFE9DD]">
        <header className="sticky top-0 z-30 bg-[#EFE9DD]/95 backdrop-blur-md border-b border-stone-300/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <h1
              style={{ fontFamily: "'Newsreader', Georgia, serif" }}
              className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight capitalize"
            >
              {activeTab === "delivery_partner"
                ? "Delivery Partner Logistics"
                : activeTab === "cms_studio"
                  ? "Storefront CMS Studio"
                  : activeTab === "user_roles"
                    ? "Staff Roles & Passwords"
                    : activeTab === "nila_logs"
                      ? "Customer Inquiries (Nila AI)"
                      : activeTab === "payment_settings"
                        ? "Checkout Payment Controls (Super Admin)"
                        : activeTab === "catalog"
                          ? "Products & Weights"
                          : activeTab === "stocks"
                            ? "Stocks & Inventory Health"
                            : activeTab.replace("_", " ")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1613] text-stone-200 text-xs font-mono border border-stone-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
              <span className="text-[11px] text-stone-400">Mode:</span>
              <span className="font-bold text-amber-300 uppercase">
                {globalDeliveryMode === "auto"
                  ? "Shiprocket Engine"
                  : "Manual Local Courier"}
              </span>
            </div>

            <a
              href="https://pure-organics1.vercel.app/#/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D97706] text-stone-950 text-xs font-bold hover:bg-amber-600 transition-colors shadow-xs"
            >
              <span>Live Storefront</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* TIER NOTIFICATIONS BANNER (SUPER ADMIN VIEW) */}
          {isSuperAdmin &&
            adminNotifications.filter((n) => !n.read).length > 0 && (
              <div className="p-4 rounded-3xl bg-amber-100 border border-amber-300 text-stone-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold flex items-center gap-2 text-stone-950">
                    <AlertCircle className="w-4 h-4 text-[#D97706]" />
                    Incoming Tier Escalations (
                    {adminNotifications.filter((n) => !n.read).length})
                  </span>
                  <button
                    onClick={() =>
                      setAdminNotifications((prev) =>
                        prev.map((n) => ({ ...n, read: true })),
                      )
                    }
                    className="text-[11px] text-[#D97706] font-bold hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {adminNotifications
                    .filter((n) => !n.read)
                    .map((alert) => (
                      <div
                        key={alert.id}
                        className="bg-white p-3 rounded-2xl border border-stone-200 text-xs space-y-1 shadow-2xs"
                      >
                        <div className="flex justify-between font-bold text-stone-900">
                          <span>{alert.title}</span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {alert.time}
                          </span>
                        </div>
                        <p className="text-stone-600">{alert.message}</p>
                        <span className="text-[10px] text-[#D97706] font-mono font-bold block pt-1">
                          Reported by: {alert.from}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* STORE MANAGER NOTIFICATION DISPATCH BAR */}
          {isStoreManager && (
            <div className="p-4 rounded-2xl bg-white border border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#D97706]" />
                <span className="font-bold text-stone-900">
                  Need to notify Super Admin regarding Mill Batch or Stock
                  Depletion?
                </span>
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                <input
                  type="text"
                  placeholder="Enter notice/stock message..."
                  value={storeManagerNotice}
                  onChange={(e) => setStoreManagerNotice(e.target.value)}
                  className="p-2 rounded-xl border border-stone-300 text-xs bg-[#FAF9F5] flex-1 sm:w-64"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!storeManagerNotice.trim()) return;
                    sendEscalationToSuperAdmin(
                      "Store Manager Notice",
                      storeManagerNotice,
                      "STOCK",
                    );
                    setStoreManagerNotice("");
                  }}
                  className="px-4 py-2 bg-[#1A1613] hover:bg-[#D97706] text-white hover:text-stone-950 font-bold rounded-xl text-xs"
                >
                  Send Notice
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === "overview" && isAdminOrOwner && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
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

                <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Total Mill Outflow
                  </span>
                  <p className="text-2xl font-black text-rose-600 font-mono mt-1">
                    ₹{totalExpenseSum.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                    <span>Raw crops, bottles, freight</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Net Operating Margin
                  </span>
                  <p
                    className={`text-2xl font-black font-mono ${
                      netProfit >= 0 ? "text-stone-900" : "text-rose-600"
                    }`}
                  >
                    ₹{netProfit.toLocaleString("en-IN")}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#D97706] font-bold">
                    <span>Operating cash in hand</span>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-2">
                  <span className="text-xs font-semibold text-stone-500">
                    Incoming Bookings
                  </span>
                  <p className="text-2xl font-black text-stone-900 font-mono mt-1">
                    {newOrders.length}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-[#D97706] font-bold">
                    <span>Requires packing / dispatch</span>
                  </div>
                </div>
              </div>

              {/* ADVANCED MULTI-TIMEFRAME VISUAL GRAPH */}
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
                  <div>
                    <h3
                      style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      className="text-lg font-bold text-stone-900"
                    >
                      Store Performance &amp; Revenue vs. Cost Trajectory
                    </h3>
                    <p className="text-xs text-stone-500">
                      Real-time interactive trend graph tracking customer
                      inflows versus production outlays.
                    </p>
                  </div>

                  <div className="inline-flex items-center p-1 bg-[#EFE9DD] border border-stone-300 rounded-2xl text-xs font-bold">
                    {[
                      { key: "day", label: "Day" },
                      { key: "week", label: "Week" },
                      { key: "month", label: "Month" },
                      { key: "year", label: "Year" },
                    ].map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => setFinanceTimeframe(t.key)}
                        className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                          financeTimeframe === t.key
                            ? "bg-[#1A1613] text-amber-300 shadow-xs"
                            : "text-stone-700 hover:text-stone-950"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block">
                      Period Gross Inflow
                    </span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      ₹{activeAnalytics.income.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200">
                    <span className="text-[10px] uppercase font-mono font-bold text-stone-500 block">
                      Period Recorded Outflow
                    </span>
                    <span className="text-xl font-bold font-mono text-rose-600">
                      ₹{activeAnalytics.expense.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                    <span className="text-[10px] uppercase font-mono font-bold text-[#D97706] block">
                      Net Retained Margin
                    </span>
                    <span className="text-xl font-bold font-mono text-stone-900">
                      ₹{activeAnalytics.net.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="h-56 w-full flex items-end gap-3 sm:gap-6 px-2 border-b border-stone-200 pb-2">
                    {activeAnalytics.labels.map((label, idx) => {
                      const inVal = activeAnalytics.incomePoints[idx] || 40;
                      const exVal = activeAnalytics.expensePoints[idx] || 25;
                      return (
                        <div
                          key={label}
                          className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                        >
                          <div className="flex items-end gap-1 w-full justify-center h-full">
                            <div
                              title={`Inflow: ${inVal}%`}
                              className="w-1/2 max-w-[14px] rounded-t-lg bg-gradient-to-t from-[#D97706] to-amber-300 transition-all duration-300 group cursor-pointer hover:opacity-90"
                              style={{ height: `${Math.min(inVal, 100)}%` }}
                            />
                            <div
                              title={`Outflow: ${exVal}%`}
                              className="w-1/2 max-w-[14px] rounded-t-lg bg-gradient-to-t from-rose-500 to-rose-300 transition-all duration-300 group cursor-pointer hover:opacity-90"
                              style={{ height: `${Math.min(exVal, 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-stone-500 font-bold truncate max-w-full">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-end gap-4 pt-3 text-[11px] font-mono font-bold">
                    <span className="flex items-center gap-1.5 text-stone-800">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />{" "}
                      Revenue Inflow
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-600">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />{" "}
                      Operational Outflow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NEW ORDERS */}
          {activeTab === "new_orders" && (
            <div className="space-y-4">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Incoming Orders ({newOrders.length})
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
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
                      <h4 className="font-bold text-lg text-stone-900 mt-2 capitalize">
                        {ord.customer_name || ord.customer?.name}
                      </h4>
                      <p className="text-xs text-stone-500 font-mono mt-0.5">
                        +91 {ord.customer_phone || ord.customer?.phone}
                      </p>
                    </div>

                    <div className="bg-[#FAF9F5] px-4 py-3 rounded-2xl text-xs text-stone-700 border border-stone-200/80">
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
                        className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Truck size={14} /> Dispatch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALL ORDERS HISTORY (WITH STAGED OK CONFIRMATION) */}
          {activeTab === "all_orders" && (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Consignments Ledger ({filteredOrders.length} orders)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Select a new status and confirm with the 'OK' button to
                    commit changes.
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-xs font-bold text-stone-800"
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
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
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
                      const staged = stagedOrderStatuses[trackingId];
                      const currentStatus = ord.status || "Placed";
                      const phone = (ord.customer_phone || "").replace(
                        /\D/g,
                        "",
                      );

                      return (
                        <tr key={trackingId} className="hover:bg-amber-50/20">
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
                                  handleStageOrderStatus(
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
                                      handleConfirmOrderStatus(
                                        trackingId,
                                        ord.dispatch_note,
                                      )
                                    }
                                    className="px-3 py-1.5 bg-[#D97706] text-stone-950 rounded-lg text-xs font-extrabold hover:bg-amber-400 flex items-center gap-1 cursor-pointer"
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
                              className="px-3 py-1.5 bg-[#1A1613] text-stone-200 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer hover:bg-[#D97706] hover:text-stone-950 transition-colors"
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

          {/* TAB 4: DELIVERY PARTNER ENGINE */}
          {activeTab === "delivery_partner" &&
            (isAdminOrOwner || isDispatch) && (
              <div className="space-y-6">
                <div>
                  <h2
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-2xl font-bold text-stone-900"
                  >
                    Logistics &amp; Courier Fulfillment Engine
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Choose the active courier engine. View live consignment
                    metrics processed through each network.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      globalDeliveryMode === "auto"
                        ? "border-[#D97706] bg-amber-50/40 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="delivery_engine_mode"
                        value="auto"
                        checked={globalDeliveryMode === "auto"}
                        onChange={() => {
                          setGlobalDeliveryMode("auto");
                          showToast(
                            "Active Mode: Shiprocket Automated Gateway",
                          );
                        }}
                        className="mt-1 w-4 h-4 accent-[#D97706] cursor-pointer"
                      />
                      <div className="space-y-1">
                        <strong className="text-sm font-bold text-stone-900 block">
                          Automated Partner (Shiprocket Engine)
                        </strong>
                        <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase tracking-wider block">
                          Auto AWB • Doorstep Mill Pickup • Live GPS
                        </span>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          Generates barcode slips and handles multi-state
                          express routes automatically upon checkout.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">
                        Consignments Handled:
                      </span>
                      <span className="font-mono font-bold text-stone-900 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                        {shiprocketOrdersCount} Orders Assigned
                      </span>
                    </div>
                  </label>

                  <label
                    className={`p-6 rounded-3xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      globalDeliveryMode === "manual"
                        ? "border-[#1A1613] bg-stone-100 shadow-xs"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="delivery_engine_mode"
                        value="manual"
                        checked={globalDeliveryMode === "manual"}
                        onChange={() => {
                          setGlobalDeliveryMode("manual");
                          showToast(
                            "Active Mode: Manual Local Courier Network",
                          );
                        }}
                        className="mt-1 w-4 h-4 accent-[#1A1613] cursor-pointer"
                      />
                      <div className="space-y-1">
                        <strong className="text-sm font-bold text-stone-900 block">
                          Manual Local Courier Network
                        </strong>
                        <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider block">
                          ST Courier • The Professional Couriers • Speed Post
                        </span>
                        <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                          Direct desk booking at local hubs with manual docket
                          entries and WhatsApp customer alerts.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">
                        Consignments Handled:
                      </span>
                      <span className="font-mono font-bold text-stone-900 bg-white px-2.5 py-0.5 rounded-full border border-stone-200">
                        {manualCourierOrdersCount} Orders Assigned
                      </span>
                    </div>
                  </label>
                </div>

                {isDispatch && (
                  <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
                    <h3 className="font-bold text-sm text-stone-900">
                      Report Dispatch Issue / Route Delay to Super Admin
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <select
                        value={issueQueryTopic}
                        onChange={(e) => setIssueQueryTopic(e.target.value)}
                        className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                      >
                        <option value="Transit Delay">Transit Delay</option>
                        <option value="Bottle Breakage">
                          Bottle Breakage Report
                        </option>
                        <option value="Pin-code Lockout">
                          Pin-code Service Lockout
                        </option>
                        <option value="Address Unreachable">
                          Address Unreachable
                        </option>
                      </select>
                      <input
                        type="text"
                        placeholder="Describe issue (e.g., Courier parcel held at hub)"
                        value={issueQueryText}
                        onChange={(e) => setIssueQueryText(e.target.value)}
                        className="sm:col-span-2 p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!issueQueryText.trim()) return;
                          sendEscalationToSuperAdmin(
                            `Dispatch Issue: ${issueQueryTopic}`,
                            issueQueryText,
                            "DISPATCH",
                          );
                          setIssueQueryText("");
                        }}
                        className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl text-xs cursor-pointer"
                      >
                        Send Escalation to Super Admin
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          {/* TAB: PAYMENT SETTINGS (COD / PREPAID METRICS & TOGGLE) */}
          {activeTab === "payment_settings" && isSuperAdmin && (
            <div className="space-y-6">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Checkout &amp; Payment Gateway Controls
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Manage Cash on Delivery visibility and monitor historical
                  transactional volume.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 max-w-4xl shadow-xs space-y-6">
                <div className="flex items-start justify-between gap-6 pb-6 border-b border-stone-100">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706]">
                      <Banknote className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                        Master Payment Switch
                      </span>
                    </div>
                    <h3 className="text-lg font-extrabold text-stone-900">
                      Cash on Delivery (COD) Checkout Option
                    </h3>
                    <p className="text-xs text-stone-600 max-w-xl leading-relaxed">
                      Toggle whether customers can choose COD. Turning off
                      enforces instant online prepayments (Razorpay UPI, Cards,
                      NetBanking).
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const next = !isCodEnabled;
                        if (typeof toggleCodStatus === "function")
                          toggleCodStatus(next);
                        showToast(
                          `COD status updated: ${next ? "ENABLED" : "DISABLED"}`,
                        );
                      }}
                      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        isCodEnabled ? "bg-[#D97706]" : "bg-stone-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                          isCodEnabled ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                    <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">
                      {isCodEnabled ? "Active: ON" : "Active: OFF"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 space-y-1 text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-stone-500 block">
                      Cash on Delivery (COD) Volume
                    </span>
                    <p className="text-2xl font-black font-mono text-stone-900">
                      ₹{codTotalAmount.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[11px] text-stone-500 block">
                      {codOrdersCount} Customer Consignments
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D97706] block">
                      Prepaid Online Settlement Volume
                    </span>
                    <p className="text-2xl font-black font-mono text-stone-900">
                      ₹{prepaidTotalAmount.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[11px] text-stone-600 block">
                      {prepaidOrdersCount} Settled via Razorpay UPI &amp; Cards
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRODUCTS & WEIGHTS */}
          {activeTab === "catalog" && (isAdminOrOwner || isStoreManager) && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-2xl font-bold text-stone-900"
                  >
                    Master Product Catalog &amp; Weights
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Double-click 'Stock' to stage status, then click 'OK' to
                    save.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingNewProduct(!isAddingNewProduct)}
                  className="px-5 py-2.5 bg-[#D97706] hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Plus size={15} />
                  <span>
                    {isAddingNewProduct ? "Close Form" : "Add Product"}
                  </span>
                </button>
              </div>

              {isAddingNewProduct && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Register &amp; Publish New Product
                  </h3>
                  <form
                    onSubmit={handleCreateNewProduct}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Product Name (e.g. Mara Chekku Gingelly Oil)"
                      value={newProductForm.name}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          name: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 sm:col-span-2 font-bold"
                    />

                    <select
                      value={newProductForm.category}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          category: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                    >
                      {PRODUCT_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                    />

                    <input
                      type="text"
                      placeholder="Packaging Unit (e.g. 1 Litre Glass Bottle)"
                      value={newProductForm.unit}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          unit: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />

                    <input
                      type="text"
                      placeholder="Image URL"
                      value={newProductForm.image}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          image: e.target.value,
                        })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 sm:col-span-2 font-mono"
                    />

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
                        className="bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl py-2 px-6 cursor-pointer shadow-xs transition-colors"
                      >
                        Publish Product
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4 pl-6">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (₹)</th>
                      <th className="p-4">Unit</th>
                      <th className="p-4">Stock Availability (Double Click)</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {filteredCatalog.map((item) => {
                      const staged = stagedStockStatus[item.id];
                      const isItemInStock =
                        staged !== undefined ? staged : item.inStock !== false;
                      const isStagedPending =
                        staged !== undefined && staged !== item.inStock;

                      return (
                        <tr key={item.id} className="hover:bg-amber-50/20">
                          <td className="p-4 pl-6 font-bold text-stone-900">
                            {item.name}
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
                                onDoubleClick={() =>
                                  handleDoubleClickStock(
                                    item.id,
                                    item.inStock !== false,
                                  )
                                }
                                title="Double-click to change stock state"
                                className={`text-[10px] font-bold px-3 py-1 rounded-md cursor-pointer transition-colors ${
                                  isItemInStock
                                    ? "bg-amber-50 text-[#D97706] border border-amber-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {isItemInStock
                                  ? "✓ In Stock"
                                  : "✕ Out of Stock"}
                              </button>

                              {isStagedPending && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleConfirmStockStatus(item.id)
                                  }
                                  className="px-2.5 py-1 bg-[#D97706] text-stone-950 rounded font-bold text-[10px] hover:bg-amber-400 cursor-pointer flex items-center gap-1 shadow-xs"
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
                              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 size={13} /> Edit
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
              <div className="flex justify-between items-center">
                <div>
                  <h2
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-2xl font-bold text-stone-900"
                  >
                    Stock Health &amp; Batch Reloads
                  </h2>
                  <p className="text-xs text-stone-500">
                    Stage batch reloads (+10 / +25) and commit. Store Managers
                    can escalate low stock alerts.
                  </p>
                </div>
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
                        {pendingDelta > 0 ? (
                          <button
                            type="button"
                            onClick={() => handleConfirmQtyChange(stk.id)}
                            className="px-3.5 py-1 bg-[#D97706] hover:bg-amber-400 text-stone-950 font-extrabold text-xs rounded-lg cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <Check size={12} strokeWidth={3} /> OK
                          </button>
                        ) : (
                          isStoreManager &&
                          isLow && (
                            <button
                              type="button"
                              onClick={() =>
                                sendEscalationToSuperAdmin(
                                  `Low Stock: ${stk.name}`,
                                  `Only ${effectiveStock} units remain in inventory at the mill.`,
                                  "STOCK",
                                )
                              }
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-lg hover:bg-rose-100 cursor-pointer"
                            >
                              Alert Super Admin
                            </button>
                          )
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
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Expenses Ledger &amp; Outflow Logging
                </h2>
                <p className="text-xs text-stone-500">
                  Log operational outlays and analyze production burn rate.
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
                    showToast("Expense logged successfully!");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Expense Description"
                    value={newExpense.title}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, title: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 sm:col-span-2"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-semibold"
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
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl py-2 cursor-pointer transition-colors shadow-xs"
                  >
                    + Log Expense
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
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

          {/* TAB 8: INCOME & ANALYTICS (WITH MANUAL INFLOW LOGGING) */}
          {activeTab === "income" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Income &amp; Customer Inflow Ledger
                </h2>
                <p className="text-xs text-stone-500">
                  Track online customer orders, record counter sales, and
                  analyze top revenue sources.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs">
                <h3 className="font-bold text-sm text-stone-900">
                  + Record Inflow Transaction (Counter Sale / Bulk Order)
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newInflow.source || !newInflow.amount) return;
                    setManualInflows([
                      {
                        id: `IN-${Date.now().toString().slice(-4)}`,
                        ...newInflow,
                        amount: Number(newInflow.amount),
                      },
                      ...manualInflows,
                    ]);
                    setNewInflow({
                      source: "",
                      product: "",
                      amount: "",
                      paymentMode: "UPI QR",
                      date: new Date().toISOString().split("T")[0],
                    });
                    showToast("Inflow transaction logged successfully!");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Customer / Channel Source"
                    value={newInflow.source}
                    onChange={(e) =>
                      setNewInflow({ ...newInflow, source: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Items Purchased"
                    value={newInflow.product}
                    onChange={(e) =>
                      setNewInflow({ ...newInflow, product: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                  />
                  <select
                    value={newInflow.paymentMode}
                    onChange={(e) =>
                      setNewInflow({
                        ...newInflow,
                        paymentMode: e.target.value,
                      })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                  >
                    <option value="UPI QR">UPI QR</option>
                    <option value="Cash at Counter">Cash at Counter</option>
                    <option value="Direct Bank Transfer">
                      Direct Bank Transfer
                    </option>
                  </select>
                  <input
                    type="number"
                    required
                    placeholder="Amount (₹)"
                    value={newInflow.amount}
                    onChange={(e) =>
                      setNewInflow({ ...newInflow, amount: e.target.value })
                    }
                    className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                  />
                  <button
                    type="submit"
                    className="bg-[#D97706] hover:bg-amber-600 text-stone-950 font-bold rounded-xl py-2 cursor-pointer shadow-xs transition-colors"
                  >
                    + Log Inflow
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-4">Ref Code</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Source / Customer</th>
                      <th className="p-4">Harvest Items</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4 text-right">Inflow Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {manualInflows.map((item) => (
                      <tr key={item.id}>
                        <td className="p-4 font-mono font-bold text-[#D97706]">
                          {item.id}
                        </td>
                        <td className="p-4 font-mono text-stone-500">
                          {item.date}
                        </td>
                        <td className="p-4 font-bold text-stone-900">
                          {item.source}
                        </td>
                        <td className="p-4 text-stone-600">{item.product}</td>
                        <td className="p-4 font-mono">{item.paymentMode}</td>
                        <td className="p-4 text-right font-mono font-bold text-emerald-700">
                          +₹{item.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: CUSTOMER DIRECTORY */}
          {activeTab === "customers" && isAdminOrOwner && (
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-200">
                <h3 className="font-bold text-sm text-stone-900">
                  Customer Directory ({customerList.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Track repeat customer frequencies and direct WhatsApp
                  communication.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
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
                          <span className="px-2.5 py-0.5 rounded-md font-bold text-[10px] bg-amber-50 text-[#D97706] border border-amber-200">
                            {cust.orderCount} Orders
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
                            className="px-3 py-1.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
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

          {/* TAB: NILA AI CUSTOMER INQUIRIES */}
          {activeTab === "nila_logs" && isAdminOrOwner && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Nila Assistant Customer Questions Log
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Direct intelligence on what shoppers are asking our AI
                  assistant on the storefront.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {nilaQueries.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-stone-100 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#D97706]/15 text-[#D97706] font-mono text-[10px] font-bold border border-[#D97706]/30">
                          {item.id}
                        </span>
                        <span className="text-xs font-bold text-stone-800">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-400">
                        {item.timestamp} • Customer: {item.userPhone}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-[#FAF9F5] p-3 rounded-xl border border-stone-200/80">
                        <span className="text-[10px] font-bold uppercase text-stone-500 block mb-0.5">
                          Customer Asked:
                        </span>
                        <p className="text-xs font-bold text-stone-900">
                          "{item.question}"
                        </p>
                      </div>

                      <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-200/60">
                        <span className="text-[10px] font-bold uppercase text-[#D97706] block mb-0.5">
                          Nila's AI Recommendation:
                        </span>
                        <p className="text-xs text-stone-700 leading-relaxed">
                          {item.nilaAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: COMPLETE STOREFRONT CMS STUDIO */}
          {activeTab === "cms_studio" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Storefront Visual CMS Studio
                </h2>
                <p className="text-xs text-stone-600 mt-0.5">
                  Update media, headlines, Tamil scripts, and harvest
                  disclosures across all 10 homepage components.
                </p>
              </div>

              {/* Sub-tabs */}
              <div className="flex flex-wrap gap-2 border-b border-stone-300 pb-3 text-xs font-bold">
                {[
                  { id: "hero", label: "1. Hero Showcase" },
                  { id: "announcement", label: "2. Announcement Bar" },
                  { id: "marquee", label: "3. Trust Marquee" },
                  { id: "departments", label: "4. Category Hubs" },
                  { id: "heritage", label: "5. Mill Heritage" },
                  { id: "platforms", label: "6. Platforms (Quick Delivery)" },
                  { id: "diet", label: "7. Diet & Lifestyle" },
                  { id: "manifesto", label: "8. Purity Manifesto" },
                  { id: "gifting", label: "9. Gifting & Scratch" },
                  { id: "nila_callout", label: "10. Nila AI Callout" },
                  { id: "footer", label: "11. Footer & FSSAI" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCmsSection(s.id)}
                    className={`px-3.5 py-2 rounded-xl cursor-pointer transition-all ${
                      cmsSection === s.id
                        ? "bg-[#D97706] text-stone-950 font-bold shadow-xs"
                        : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* 1. HERO SHOWCASE */}
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
                            ? "bg-[#1A1613] text-white border-[#1A1613]"
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
                            ? "bg-[#1A1613] text-white border-[#1A1613]"
                            : "bg-stone-50 text-stone-700 border-stone-200"
                        }`}
                      >
                        <Video size={14} /> Background Video Loop
                      </button>
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={heroCMS.title}
                        onChange={(e) =>
                          setHeroCMS({ ...heroCMS, title: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
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
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Subtext Narrative
                      </label>
                      <textarea
                        rows="3"
                        value={heroCMS.subtext}
                        onChange={(e) =>
                          setHeroCMS({ ...heroCMS, subtext: e.target.value })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        {heroCMS.mode === "photo"
                          ? "Photograph URL"
                          : "Direct MP4 Video Stream URL"}
                      </label>
                      <input
                        type="text"
                        value={
                          heroCMS.mode === "photo"
                            ? heroCMS.imageUrl
                            : heroCMS.videoUrl
                        }
                        onChange={(e) =>
                          heroCMS.mode === "photo"
                            ? setHeroCMS({
                                ...heroCMS,
                                imageUrl: e.target.value,
                              })
                            : setHeroCMS({
                                ...heroCMS,
                                videoUrl: e.target.value,
                              })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        if (typeof saveCMSSection === "function") {
                          await saveCMSSection("hero_slides", [heroCMS]);
                        }
                        showToast("Hero section updated live!");
                      }}
                      className="w-full py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Save Hero Section
                    </button>
                  </div>

                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-3">
                    <span className="text-xs font-bold text-[#D97706] font-mono">
                      Live Storefront Simulator
                    </span>
                    <div className="rounded-2xl overflow-hidden h-80 relative border border-stone-200 bg-black flex items-center justify-center">
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

              {/* 2. ANNOUNCEMENT BAR */}
              {cmsSection === "announcement" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-2xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Announcement Bar &amp; Promo Code
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Ticker Headline
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
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
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Free Shipping Threshold (₹)
                      </label>
                      <input
                        type="number"
                        value={announcementCMS.freeShippingThreshold || 499}
                        onChange={(e) =>
                          setAnnouncementCMS({
                            ...announcementCMS,
                            freeShippingThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("announcement", announcementCMS);
                      }
                      showToast("Announcement bar updated live!");
                    }}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Announcement Bar
                  </button>
                </div>
              )}

              {/* 3. TRUST MARQUEE */}
              {cmsSection === "marquee" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs text-xs">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Trust Badges &amp; Certifications Marquee
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setTrustBadgesCMS([
                          ...trustBadgesCMS,
                          {
                            id: Date.now(),
                            name: "New Quality Seal",
                            imageUrl: "",
                          },
                        ])
                      }
                      className="px-3 py-1 bg-[#D97706] text-stone-950 rounded-lg font-bold"
                    >
                      + Add Badge
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trustBadgesCMS.map((badge, idx) => (
                      <div
                        key={badge.id}
                        className="p-4 border border-stone-200 rounded-2xl space-y-2 bg-[#FAF9F5] relative"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setTrustBadgesCMS(
                              trustBadgesCMS.filter((b) => b.id !== badge.id),
                            )
                          }
                          className="absolute top-3 right-3 text-stone-400 hover:text-rose-600"
                        >
                          <Trash2 size={13} />
                        </button>
                        <label className="block text-[10px] uppercase font-bold text-stone-500">
                          Seal Title
                        </label>
                        <input
                          type="text"
                          value={badge.name}
                          onChange={(e) => {
                            const copy = [...trustBadgesCMS];
                            copy[idx].name = e.target.value;
                            setTrustBadgesCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg font-bold bg-white text-stone-900"
                        />
                        <label className="block text-[10px] uppercase font-bold text-stone-500">
                          Image URL
                        </label>
                        <input
                          type="text"
                          value={badge.imageUrl}
                          onChange={(e) => {
                            const copy = [...trustBadgesCMS];
                            copy[idx].imageUrl = e.target.value;
                            setTrustBadgesCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg text-stone-600 bg-white font-mono text-[11px]"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Trust marquee saved live!")}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Trust Marquee
                  </button>
                </div>
              )}

              {/* 4. CATEGORIES & TAMIL */}
              {cmsSection === "departments" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs text-xs">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Category Hubs (English, Tamil Script &amp; Photos)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {departmentsCMS.map((d, idx) => (
                        <div
                          key={d.id}
                          className="p-4 border border-stone-200 rounded-2xl space-y-2 bg-[#FAF9F5]"
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
                          <label className="block text-[10px] uppercase font-bold text-stone-500">
                            Category Photo URL
                          </label>
                          <input
                            type="text"
                            value={d.imageUrl}
                            onChange={(e) => {
                              const copy = [...departmentsCMS];
                              copy[idx].imageUrl = e.target.value;
                              setDepartmentsCMS(copy);
                            }}
                            className="w-full p-2 border border-stone-200 rounded-lg text-stone-600 bg-white font-mono text-[11px]"
                          />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast("Category Hubs updated live!")}
                      className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Save Categories
                    </button>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
                    <span className="text-xs font-bold text-[#D97706] font-mono">
                      Live Circular Preview
                    </span>
                    <div className="grid grid-cols-2 gap-4">
                      {departmentsCMS.slice(0, 4).map((cat) => (
                        <div
                          key={cat.id}
                          className="flex flex-col items-center text-center p-3 rounded-2xl bg-[#FAF9F5] border border-stone-200"
                        >
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D97706] bg-stone-100">
                            <img
                              src={cat.imageUrl}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-xs font-bold text-stone-900 mt-2 truncate max-w-full">
                            {cat.name}
                          </span>
                          <span className="text-[10px] text-stone-500">
                            {cat.tamil}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. MILL HERITAGE */}
              {cmsSection === "heritage" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs text-xs">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Mill Heritage (Story &amp; Gallery Frames)
                    </h3>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={millHeritageCMS.title}
                        onChange={(e) =>
                          setMillHeritageCMS({
                            ...millHeritageCMS,
                            title: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Heritage Narrative
                      </label>
                      <textarea
                        rows="3"
                        value={millHeritageCMS.subtitle}
                        onChange={(e) =>
                          setMillHeritageCMS({
                            ...millHeritageCMS,
                            subtitle: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Main Backdrop URL
                      </label>
                      <input
                        type="text"
                        value={millHeritageCMS.imageUrl}
                        onChange={(e) =>
                          setMillHeritageCMS({
                            ...millHeritageCMS,
                            imageUrl: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                      />
                    </div>

                    <div className="pt-2 border-t border-stone-100">
                      <label className="block font-bold text-stone-900 mb-2">
                        4 Mill Process Photographs
                      </label>
                      <div className="space-y-2">
                        {millHeritageCMS.gallery.map((g, idx) => (
                          <div key={g.id} className="flex gap-2">
                            <input
                              type="text"
                              value={g.title}
                              onChange={(e) => {
                                const copy = { ...millHeritageCMS };
                                copy.gallery[idx].title = e.target.value;
                                setMillHeritageCMS(copy);
                              }}
                              className="w-1/3 p-2 border border-stone-200 rounded-lg font-bold bg-[#FAF9F5]"
                            />
                            <input
                              type="text"
                              value={g.url}
                              onChange={(e) => {
                                const copy = { ...millHeritageCMS };
                                copy.gallery[idx].url = e.target.value;
                                setMillHeritageCMS(copy);
                              }}
                              className="w-2/3 p-2 border border-stone-200 rounded-lg font-mono text-[11px] bg-[#FAF9F5]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast("Mill Heritage saved live!")}
                      className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Save Mill Heritage
                    </button>
                  </div>

                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4">
                    <span className="text-xs font-bold text-[#D97706] font-mono">
                      Live Gallery Simulator
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {millHeritageCMS.gallery.map((g) => (
                        <div
                          key={g.id}
                          className="rounded-xl overflow-hidden border border-stone-200 bg-[#FAF9F5]"
                        >
                          <div className="h-28 overflow-hidden">
                            <img
                              src={g.url}
                              alt={g.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="p-2 text-[11px] font-bold text-stone-800 text-center truncate">
                            {g.title}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 6. PARTNER PLATFORMS (WITH IMAGES AA1 TO AA5) */}
              {cmsSection === "platforms" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-4xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Partner Platforms (Also Available On)
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={platformsCMS.title}
                      onChange={(e) =>
                        setPlatformsCMS({
                          ...platformsCMS,
                          title: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    {platformsCMS.partners.map((p, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-[#FAF9F5] rounded-xl border border-stone-200"
                      >
                        <div className="w-12 h-12 bg-white rounded-lg border border-stone-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={p.logoUrl}
                            alt={p.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const copy = { ...platformsCMS };
                            copy.partners[idx].name = e.target.value;
                            setPlatformsCMS(copy);
                          }}
                          className="w-1/3 p-2 border border-stone-200 rounded-lg font-bold bg-white"
                        />
                        <input
                          type="text"
                          value={p.logoUrl}
                          onChange={(e) => {
                            const copy = { ...platformsCMS };
                            copy.partners[idx].logoUrl = e.target.value;
                            setPlatformsCMS(copy);
                          }}
                          className="w-2/3 p-2 border border-stone-200 rounded-lg font-mono text-[11px] bg-white"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast("Platforms saved live!")}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Platforms
                  </button>
                </div>
              )}

              {/* 7. DIET & LIFESTYLE (WITH BOTANICALS DP1, DP2, DP3) */}
              {cmsSection === "diet" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Diet &amp; Lifestyle Concerns (Text &amp; Botanical Leaves)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {dietCMS.pillars.map((pil, idx) => (
                      <div
                        key={pil.step}
                        className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold font-mono text-[#D97706]">
                            {pil.step}
                          </span>
                          <div className="w-10 h-10 overflow-hidden rounded-lg bg-white border border-stone-200 p-1">
                            <img
                              src={pil.botanicalUrl}
                              alt="Leaf"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={pil.title}
                          onChange={(e) => {
                            const copy = { ...dietCMS };
                            copy.pillars[idx].title = e.target.value;
                            setDietCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg font-bold bg-white text-stone-900"
                        />
                        <textarea
                          rows="3"
                          value={pil.summary}
                          onChange={(e) => {
                            const copy = { ...dietCMS };
                            copy.pillars[idx].summary = e.target.value;
                            setDietCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg bg-white text-stone-700"
                        />
                        <label className="block text-[10px] uppercase font-bold text-stone-500">
                          Botanical Leaf Image URL
                        </label>
                        <input
                          type="text"
                          value={pil.botanicalUrl}
                          onChange={(e) => {
                            const copy = { ...dietCMS };
                            copy.pillars[idx].botanicalUrl = e.target.value;
                            setDietCMS(copy);
                          }}
                          className="w-full p-2 border border-stone-200 rounded-lg font-mono text-[11px] bg-white"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("health_goals", dietCMS);
                      }
                      showToast("Diet preferences saved live!");
                    }}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Diet Section
                  </button>
                </div>
              )}

              {/* 8. PURITY MANIFESTO */}
              {cmsSection === "manifesto" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Purity Manifesto (3 Core Standards)
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Main Header
                    </label>
                    <input
                      type="text"
                      value={manifestoCMS.heading}
                      onChange={(e) =>
                        setManifestoCMS({
                          ...manifestoCMS,
                          heading: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Pillar 1: Native Heritage Seeds
                    </label>
                    <textarea
                      rows="2"
                      value={manifestoCMS.point1Desc}
                      onChange={(e) =>
                        setManifestoCMS({
                          ...manifestoCMS,
                          point1Desc: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Pillar 2: Vaagai Wood Chekku
                    </label>
                    <textarea
                      rows="2"
                      value={manifestoCMS.point2Desc}
                      onChange={(e) =>
                        setManifestoCMS({
                          ...manifestoCMS,
                          point2Desc: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Manifesto standards saved live!")}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Manifesto
                  </button>
                </div>
              )}

              {/* 9. GIFTING HAMPERS & SCRATCH CARD */}
              {cmsSection === "gifting" && (
                <div className="p-6 rounded-3xl bg-white border border-stone-200 max-w-xl space-y-4 shadow-xs text-xs">
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Gifting Hampers &amp; Scratch Card (Cover &amp; Gold Foil)
                  </h3>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Pantry Title
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.title}
                      onChange={(e) =>
                        setGiftingCMS({ ...giftingCMS, title: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Cover Artwork URL
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.coverImage}
                      onChange={(e) =>
                        setGiftingCMS({
                          ...giftingCMS,
                          coverImage: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Gold Scratch Texture Foil URL
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.scratchTextureUrl}
                      onChange={(e) =>
                        setGiftingCMS({
                          ...giftingCMS,
                          scratchTextureUrl: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Unlocked Coupon Code
                    </label>
                    <input
                      type="text"
                      value={giftingCMS.rewardCode}
                      onChange={(e) =>
                        setGiftingCMS({
                          ...giftingCMS,
                          rewardCode: e.target.value,
                        })
                      }
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("gifting_banner", giftingCMS);
                      }
                      showToast("Gifting configuration saved live!");
                    }}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Gifting Section
                  </button>
                </div>
              )}

              {/* 10. NILA CALLOUT COMPONENT */}
              {cmsSection === "nila_callout" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4 text-xs">
                    <h3 className="font-extrabold text-sm text-stone-900">
                      Nila Assistant Callout Banner Settings
                    </h3>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={nilaCalloutCMS.headline}
                        onChange={(e) =>
                          setNilaCalloutCMS({
                            ...nilaCalloutCMS,
                            headline: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Subtext Narrative
                      </label>
                      <textarea
                        rows="3"
                        value={nilaCalloutCMS.subtext}
                        onChange={(e) =>
                          setNilaCalloutCMS({
                            ...nilaCalloutCMS,
                            subtext: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Nila Character Image URL (Transparent PNG)
                      </label>
                      <input
                        type="text"
                        value={nilaCalloutCMS.characterImgUrl}
                        onChange={(e) =>
                          setNilaCalloutCMS({
                            ...nilaCalloutCMS,
                            characterImgUrl: e.target.value,
                          })
                        }
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        showToast("Nila Assistant Callout saved live!")
                      }
                      className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                    >
                      Save Nila Callout
                    </button>
                  </div>

                  <div className="lg:col-span-6 p-6 rounded-3xl bg-[#1A1613] text-white border border-stone-800 shadow-xs space-y-4 flex flex-col justify-between">
                    <span className="text-xs font-bold text-[#D97706] font-mono">
                      Live Nila Callout Simulator
                    </span>
                    <div className="flex items-center gap-4">
                      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-black/40 border border-amber-500/30 flex items-center justify-center p-2">
                        <img
                          src={nilaCalloutCMS.characterImgUrl}
                          alt="Nila"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-stone-100">
                          {nilaCalloutCMS.headline}
                        </h4>
                        <p className="text-stone-400 text-[11px] leading-snug line-clamp-3">
                          {nilaCalloutCMS.subtext}
                        </p>
                      </div>
                    </div>
                    <button className="py-2.5 rounded-full bg-[#D97706] text-stone-950 font-bold text-xs uppercase tracking-wider">
                      Chat With Nila
                    </button>
                  </div>
                </div>
              )}

              {/* 11. FOOTER & FSSAI */}
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
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
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
                        className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono font-bold"
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
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      if (typeof saveCMSSection === "function") {
                        await saveCMSSection("footer", footerCMS);
                      }
                      showToast("Footer credentials saved live!");
                    }}
                    className="px-5 py-2.5 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                  >
                    Save Footer Information
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 11: USER ROLES */}
          {activeTab === "user_roles" && isAdminOrOwner && (
            <div className="space-y-6">
              <div>
                <h2
                  style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                  className="text-2xl font-bold text-stone-900"
                >
                  Staff Role Management &amp; Passwords
                </h2>
                <p className="text-xs text-stone-500">
                  {isSuperAdmin
                    ? "Provision, audit, and modify login credentials for Admin, Store Manager, and Dispatch."
                    : "Read-only staff registry. Only Super Admin can provision new users."}
                </p>
              </div>

              {isSuperAdmin && (
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
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
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
                    />
                    <select
                      value={newUserForm.role}
                      onChange={(e) =>
                        setNewUserForm({ ...newUserForm, role: e.target.value })
                      }
                      className="p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                    >
                      <option value="STORE_MANAGER">Store Manager</option>
                      <option value="DISPATCH">Dispatch Manager</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    <div className="sm:col-span-4 flex justify-end">
                      <button
                        type="submit"
                        className="bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl py-2 px-6 cursor-pointer transition-colors shadow-xs"
                      >
                        + Create Account
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
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
                      <tr key={st.id} className="hover:bg-amber-50/20">
                        <td className="p-4 font-bold text-stone-900">
                          {st.name}
                        </td>
                        <td className="p-4 font-mono font-bold text-stone-700">
                          {st.username}
                        </td>
                        <td className="p-4 font-mono text-stone-600">
                          {isSuperAdmin
                            ? st.password || "••••••••"
                            : "••••••••"}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-[#D97706] border border-amber-200 text-[10px] font-bold">
                            {st.role}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {isSuperAdmin && (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingUser(st)}
                                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteUser(st.id, st.username)
                                }
                                className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
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
      {/* 3. MODALS (EDIT PRODUCT WITH CATEGORY SELECTOR / DISPATCH) */}
      {/* ------------------------------------------------------------- */}
      {editingCatalogProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 space-y-4 text-xs shadow-2xl text-stone-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="font-bold text-sm text-stone-900">
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Product Category
                </label>
                <select
                  value={editingCatalogProduct.category || "Cold-Pressed Oils"}
                  onChange={(e) =>
                    setEditingCatalogProduct({
                      ...editingCatalogProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold"
                >
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold font-mono"
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
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-bold font-mono"
                  />
                </div>
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
                  className="px-5 py-2 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER CREDENTIALS MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
                />
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
                  className="px-5 py-2 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCH ACTION MODAL */}
      {activeDispatchOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900"
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
                  className="w-full p-2.5 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-900 font-mono"
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
                      `${manualDispatchForm.courierName} - ${
                        manualDispatchForm.trackingNo || "DISPATCHED"
                      }`,
                    );
                  }
                  showToast("Order dispatched and status updated");
                  setActiveDispatchOrder(null);
                }}
                className="px-5 py-2 bg-[#1A1613] hover:bg-[#D97706] hover:text-stone-950 text-white font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
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
