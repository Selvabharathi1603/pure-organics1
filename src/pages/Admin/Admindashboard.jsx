import React, { useState, useEffect } from "react";
import {
  LogOut,
  Send,
  Bell,
  CheckCircle2,
  Save,
  Plus,
  X,
  MinusCircle,
  Mail,
  Cake,
  MessageCircle,
  Copy,
  Check,
  TrendingUp,
  PackageCheck,
  Clock,
  Sparkles,
  Phone,
  Printer,
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Zap,
  Search,
  SlidersHorizontal,
  Crown,
  Palette,
  Truck,
  Layers,
} from "lucide-react";
import { useStore } from "../../context/storecontext";

export default function AdminDashboard({ onLogout }) {
  const {
    products,
    orders,
    stockAlerts,
    currentAdmin,
    announcements,
    heroSlides,
    healthGoals,
    giftingConfig,
    testimonials,
    discountConfig,
    footerConfig,
    saveCMSSection,
    addProduct,
    toggleStockStatus,
    deleteProduct,
    sendStockAlert,
    dismissAlert,
    updateOrderStatus,
  } = useStore();

  const role = currentAdmin?.role || "DISPATCH";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN";
  const isStoreManager = role === "STORE_MANAGER";
  const isDispatch = role === "DISPATCH";

  const [activeTab, setActiveTab] = useState(
    isDispatch
      ? "dispatch"
      : isStoreManager
        ? "inventory"
        : isAdmin
          ? "homepage-cms"
          : "super-analytics",
  );

  // Super Admin Inner Sub-Module Tabs
  const [analyticsSubTab, setAnalyticsSubTab] = useState("overview");

  const [activeCmsSection, setActiveCmsSection] = useState("announcements");
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Storefront Configurations Updated!",
  );

  // Marketing & Search Data States
  const [subscribers, setSubscribers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [searchInsights, setSearchInsights] = useState({
    topKeywords: [],
    topCategories: [],
  });

  // Local Form States
  const [announcementForm, setAnnouncementForm] = useState(
    announcements || {
      bannerText: "FLAT 50% OFF ON OUR PURE ORGANIC BESTSELLERS",
      badgeText: "Harvest Special",
      couponCode: "HARVEST50",
      tickerMessages: [],
    },
  );
  const [tickerInput, setTickerInput] = useState("");

  const [heroForm, setHeroForm] = useState({
    tag: "",
    title: "",
    titleHighlight: "",
    quote: "",
    badge: "",
    price: "",
    originalPrice: "",
    unit: "",
    imageUrl: "",
  });

  const [localHealthGoals, setLocalHealthGoals] = useState(healthGoals);
  const [localGifting, setLocalGifting] = useState(giftingConfig);
  const [localTestimonials, setLocalTestimonials] = useState(testimonials);
  const [localDiscount, setLocalDiscount] = useState(discountConfig);
  const [localFooter, setLocalFooter] = useState(footerConfig);

  const [newReview, setNewReview] = useState({
    name: "",
    city: "",
    rating: 5,
    comment: "",
  });

  const [alertProduct, setAlertProduct] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [newItemForm, setNewItemForm] = useState({
    name: "",
    category: "Cold-Pressed Oils",
    price: "",
    unit: "",
    image: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const fetchMarketingData = () => {
    fetch("http://localhost:5000/api/newsletter")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch((err) => console.warn(err));

    fetch("http://localhost:5000/api/leads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch((err) => console.warn(err));

    fetch("http://localhost:5000/api/admin/search-insights")
      .then((res) => res.json())
      .then((data) => {
        if (data.topKeywords && data.topCategories) {
          setSearchInsights(data);
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    fetchMarketingData();
  }, []);

  const triggerToast = (msg = "Storefront Configurations Updated!") => {
    setToastMessage(msg);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSaveSection = async (sectionKey, payload) => {
    const success = await saveCMSSection(sectionKey, payload);
    if (success) {
      triggerToast("Storefront Section Updated!");
    } else {
      alert("Failed to save changes. Please verify backend connection.");
    }
  };

  const handleSaveProductEdit = async () => {
    if (!editingProduct) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProduct),
        },
      );

      if (res.ok) {
        setEditingProduct(null);
        triggerToast("Product details updated in catalog!");
        window.location.reload();
      } else {
        alert("Failed to update product details.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching server.");
    }
  };

  const copyAllEmails = () => {
    const emailList = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2000);
  };

  // Financial Calculations
  const grossRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const outOfStockItems = products.filter((p) => p.inStock === false);
  const avgOrderValue =
    orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;
  const estimatedGrossProfit = Math.round(grossRevenue * 0.42);

  // Birthday Filters
  const todaysBirthdays = leads.filter((l) => l.is_birthday_today === 1);

  // Print Packing Slip Utility
  const printPackingSlip = (order) => {
    const slip = window.open("", "_blank");
    slip.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${order.trackingId}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #162a1e; }
            .header { border-bottom: 2px solid #1b3b27; padding-bottom: 12px; margin-bottom: 20px; }
            .badge { background: #edf5ef; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
            th { background-color: #faf7f2; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Pure Organics - Dispatch Manifest</h2>
            <p>Consignment ID: <strong>${order.trackingId}</strong></p>
            <p class="badge">FSSAI Lic. No: 12423008000412</p>
          </div>
          <div>
            <h3>Customer Delivery Details:</h3>
            <p><strong>Name:</strong> ${order.customer?.name || "Customer"}</p>
            <p><strong>Phone:</strong> +91 ${order.customer?.phone || "N/A"}</p>
            <p><strong>Address:</strong> ${order.customer?.address || "Address on File"}</p>
            <p><strong>Total Collectable (COD):</strong> ₹${order.total}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    slip.document.close();
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#162a1e] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#1c3829] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#e0b253]/50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#e0b253]" />
          <span className="text-xs font-bold uppercase tracking-wider">
            {toastMessage}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#1c3829] text-[#e0b253] border border-[#2d5840]">
                {currentAdmin?.badge}
              </span>
              <span className="text-xs text-[#6d8274]">
                Signed in as <b>{currentAdmin?.name}</b> (@
                {currentAdmin?.username})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#162a1e]">
              Organic Farm Management Portal
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-rose-50 hover:text-rose-700 text-[#516859] border border-[#dcd4c7] text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <LogOut className="w-4 h-4" /> End Session
          </button>
        </div>

        {/* Primary Role Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("super-analytics")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "super-analytics"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef] hover:border-[#2e5941]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === "super-analytics"
                    ? "bg-[#254b37] text-[#e0b253]"
                    : "bg-[#faf7f2] text-[#8ca395]"
                }`}
              >
                <Crown className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              <span>Founder Command Center</span>
            </button>
          )}

          {(isAdmin || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("homepage-cms")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "homepage-cms"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef] hover:border-[#2e5941]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === "homepage-cms"
                    ? "bg-[#254b37] text-[#e0b253]"
                    : "bg-[#faf7f2] text-[#8ca395]"
                }`}
              >
                <Palette className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              <span>Storefront CMS Studio</span>
            </button>
          )}

          {(isStoreManager || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("inventory")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "inventory"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef] hover:border-[#2e5941]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === "inventory"
                    ? "bg-[#254b37] text-[#e0b253]"
                    : "bg-[#faf7f2] text-[#8ca395]"
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              <span>Inventory & Catalog</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === "inventory"
                    ? "bg-[#2b553e] text-[#d6e8de]"
                    : "bg-[#f4efe6] text-[#6d8274]"
                }`}
              >
                {products.length}
              </span>
            </button>
          )}

          {(isDispatch || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("dispatch")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "dispatch"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef] hover:border-[#2e5941]/40"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                  activeTab === "dispatch"
                    ? "bg-[#254b37] text-[#e0b253]"
                    : "bg-[#faf7f2] text-[#8ca395]"
                }`}
              >
                <Truck className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
              <span>Logistics Stepper</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === "dispatch"
                    ? "bg-[#2b553e] text-[#d6e8de]"
                    : "bg-[#f4efe6] text-[#6d8274]"
                }`}
              >
                {orders.length}
              </span>
            </button>
          )}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: FOUNDER COMMAND CENTER (SUPER ADMIN MULTI-DASHBOARD)     */}
        {/* ============================================================== */}
        {activeTab === "super-analytics" && isSuperAdmin && (
          <div className="space-y-6">
            {/* Super Admin Module Sub-Navbar */}
            <div className="bg-white p-2 rounded-2xl border border-[#e8e2d5] flex flex-wrap gap-2 text-xs shadow-xs">
              {[
                { id: "overview", label: "Revenue & Financial Pulse" },
                { id: "kanban", label: "Live Order Fulfillment Board" },
                { id: "freshness", label: "Mill Freshness & Batch Tracker" },
                { id: "crm", label: "VIP Customer & Birthday Radar" },
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setAnalyticsSubTab(sub.id)}
                  className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    analyticsSubTab === sub.id
                      ? "bg-[#1c3829] text-[#e0b253] shadow-xs"
                      : "bg-[#faf7f2] text-[#516859] hover:bg-[#edf5ef]"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUB-VIEW A: REVENUE & FINANCIAL PULSE */}
            {analyticsSubTab === "overview" && (
              <div className="space-y-6">
                {/* 4 Financial Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274] tracking-wider">
                        Gross Store Revenue
                      </span>
                      <TrendingUp className="w-4 h-4 text-[#2e7d4d]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#1c3829] mt-2">
                      ₹{grossRevenue.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
                      100% Native Wood-Pressed & Grains
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274] tracking-wider">
                        Average Order Value
                      </span>
                      <Sparkles className="w-4 h-4 text-[#e0b253]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#162a1e] mt-2">
                      ₹{avgOrderValue}
                    </p>
                    <span className="text-[11px] text-[#6d8274] mt-1 inline-block">
                      Across {orders.length} total orders
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274] tracking-wider">
                        Est. Gross Margin (42%)
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#2e7d4d]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#2e7d4d] mt-2">
                      ₹{estimatedGrossProfit.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-[#6d8274] mt-1 inline-block">
                      After packaging & milling fees
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274] tracking-wider">
                        Stock Risk Items
                      </span>
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-3xl font-serif font-black text-rose-600 mt-2">
                      {outOfStockItems.length}
                    </p>
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 inline-block">
                      Needs harvest batch replenishment
                    </span>
                  </div>
                </div>

                {/* HIGHEST SEARCHES & TOP FILTERS WIDGET */}
                <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#eee8dd] pb-3">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#162a1e] flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#e0b253]" /> Highest
                        Customer Search Trends & Filter Demand
                      </h3>
                      <p className="text-xs text-[#6d8274]">
                        Live consumer demand logs captured directly from
                        storefront searches and category filters
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#1c3829] bg-[#edf5ef] px-3 py-1 rounded-full border border-[#cbe1d2]">
                      Live Demand Meter
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Highest Searched Keywords */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#516859] flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-[#2e7d4d]" /> Top
                        Searched Harvest Keywords
                      </h4>
                      <div className="space-y-2">
                        {searchInsights.topKeywords.length === 0 ? (
                          <p className="text-xs text-stone-400 italic p-3 bg-[#faf7f2] rounded-xl border border-dashed border-[#e8e2d5] text-center">
                            No search terms recorded yet.
                          </p>
                        ) : (
                          searchInsights.topKeywords.map((k, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 px-4 bg-[#faf7f2] rounded-xl border border-[#e8e2d5] text-xs hover:border-[#1c3829] transition-colors"
                            >
                              <span className="font-semibold text-[#162a1e]">
                                #{idx + 1} "{k.query_term}"
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#1c3829] text-[#e0b253] font-bold text-[11px]">
                                {k.count} searches
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Most Clicked Category Filters */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#516859] flex items-center gap-1.5">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#2e7d4d]" />{" "}
                        Most Popular Category Filters
                      </h4>
                      <div className="space-y-2">
                        {searchInsights.topCategories.length === 0 ? (
                          <p className="text-xs text-stone-400 italic p-3 bg-[#faf7f2] rounded-xl border border-dashed border-[#e8e2d5] text-center">
                            No category clicks recorded yet.
                          </p>
                        ) : (
                          searchInsights.topCategories.map((c, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2.5 px-4 bg-[#faf7f2] rounded-xl border border-[#e8e2d5] text-xs hover:border-[#1c3829] transition-colors"
                            >
                              <span className="font-semibold text-[#162a1e]">
                                {c.filter_category}
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#edf5ef] text-[#1c3829] font-bold text-[11px] border border-[#cbe1d2]">
                                {c.count} views
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Sales Velocity Sparkline Bar */}
                <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#162a1e]">
                        Weekly Order Velocity & Cash Flow Distribution
                      </h3>
                      <p className="text-xs text-[#6d8274]">
                        Monitoring real-time order volume and checkout payment
                        channels
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#edf5ef] text-[#1c3829] font-bold text-xs rounded-full border border-[#cbe1d2]">
                      Live Store Health: 98% Optimal
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 pt-4 items-end h-32 border-b border-[#eee8dd] pb-2">
                    {[
                      { day: "Mon", val: 40, amt: "₹1,840" },
                      { day: "Tue", val: 65, amt: "₹2,690" },
                      { day: "Wed", val: 50, amt: "₹2,100" },
                      { day: "Thu", val: 85, amt: "₹4,120" },
                      { day: "Fri", val: 95, amt: "₹4,890" },
                      { day: "Sat", val: 70, amt: "₹3,450" },
                      { day: "Sun", val: 80, amt: "₹3,900" },
                    ].map((col, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-1.5 h-full justify-end group"
                      >
                        <span className="text-[10px] text-[#6d8274] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.amt}
                        </span>
                        <div
                          style={{ height: `${col.val}%` }}
                          className="w-full bg-[#1c3829] group-hover:bg-[#e0b253] rounded-t-xl transition-all"
                        />
                        <span className="text-[11px] font-bold text-[#516859]">
                          {col.day}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#6d8274] pt-2">
                    <span>
                      Payment Mix: <strong>68% Doorstep COD</strong> •{" "}
                      <strong>32% Instant UPI</strong>
                    </span>
                    <span className="text-[#1c3829] font-bold">
                      Consignment Fulfillment SLA: &lt; 24 Hours
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW B: ORDER KANBAN BOARD */}
            {analyticsSubTab === "kanban" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#e8e2d5]">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#162a1e]">
                      Visual Fulfillment Kanban ({orders.length} Active Orders)
                    </h3>
                    <p className="text-xs text-[#6d8274]">
                      Track and advance parcels through wood-press packaging
                      stages
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {["Placed", "Packed", "Shipped", "Delivered"].map((stage) => {
                    const stageOrders = orders.filter(
                      (o) => o.status === stage,
                    );
                    return (
                      <div
                        key={stage}
                        className="bg-[#faf7f2] border border-[#e8e2d5] rounded-3xl p-4 flex flex-col min-h-[450px]"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-[#e2dacf] mb-3">
                          <span className="font-bold text-xs text-[#162a1e] uppercase tracking-wider">
                            {stage}
                          </span>
                          <span className="w-5 h-5 rounded-full bg-[#1c3829] text-white text-[10px] font-bold flex items-center justify-center">
                            {stageOrders.length}
                          </span>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                          {stageOrders.length === 0 ? (
                            <p className="text-center text-xs text-stone-400 pt-10 italic">
                              No orders in {stage}
                            </p>
                          ) : (
                            stageOrders.map((ord) => (
                              <div
                                key={ord.trackingId}
                                className="bg-white p-3.5 rounded-2xl border border-[#e5dfd3] shadow-xs space-y-2.5 hover:border-[#1c3829] transition-all"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-mono text-xs font-bold text-[#1c3829]">
                                    {ord.trackingId}
                                  </span>
                                  <span className="text-xs font-bold text-[#2e7d4d]">
                                    ₹{ord.total}
                                  </span>
                                </div>

                                <div className="text-xs">
                                  <p className="font-bold text-[#162a1e]">
                                    {ord.customer?.name || "Customer"}
                                  </p>
                                  <p className="text-[11px] text-[#6d8274]">
                                    {ord.customer?.phone}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-[#f2ede4] flex items-center justify-between gap-2">
                                  <button
                                    onClick={() => printPackingSlip(ord)}
                                    className="p-1.5 text-[#516859] hover:bg-[#edf5ef] hover:text-[#1c3829] rounded-lg transition-colors"
                                    title="Print Packing Slip"
                                  >
                                    <Printer className="w-4 h-4" />
                                  </button>

                                  {stage !== "Delivered" && (
                                    <button
                                      onClick={() => {
                                        const next =
                                          stage === "Placed"
                                            ? "Packed"
                                            : stage === "Packed"
                                              ? "Shipped"
                                              : "Delivered";
                                        updateOrderStatus(
                                          ord.trackingId,
                                          next,
                                          ord.dispatchNote,
                                        );
                                      }}
                                      className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#1c3829] text-white px-2.5 py-1 rounded-lg hover:bg-[#255236] transition-all cursor-pointer"
                                    >
                                      Advance{" "}
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUB-VIEW C: MILL FRESHNESS & BATCH TRACKER */}
            {analyticsSubTab === "freshness" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-[#eee8dd] pb-4">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#162a1e]">
                      Stone & Wood-Milled Batch Freshness Radar
                    </h3>
                    <p className="text-xs text-[#6d8274]">
                      Real-time freshness monitoring based on wood-chekku
                      milling cycles
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#e0b253] bg-[#1c3829] px-3 py-1 rounded-full">
                    Native Lebbek Chekku
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Vaagai Wood-Pressed Sesame Oil",
                      batch: "BATCH-26A",
                      daysAgo: 4,
                      shelfLife: "92% Fresh",
                      status: "Optimal Peak",
                      color: "bg-emerald-600",
                    },
                    {
                      name: "Heritage Black Rice (Karuppu Kavuni)",
                      batch: "HARVEST-SEPT",
                      daysAgo: 12,
                      shelfLife: "85% Fresh",
                      status: "Whole Bran Intact",
                      color: "bg-emerald-600",
                    },
                    {
                      name: "Pure Virgin Coconut Oil",
                      batch: "BATCH-24C",
                      daysAgo: 2,
                      shelfLife: "98% Fresh",
                      status: "Fresh Copra Press",
                      color: "bg-emerald-600",
                    },
                    {
                      name: "Authentic Palm Jaggery (Karupatti)",
                      batch: "PALM-BATCH-09",
                      daysAgo: 22,
                      shelfLife: "65% Fresh",
                      status: "Restock Cycle Soon",
                      color: "bg-amber-500",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#faf7f2] border border-[#e8e2d5] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-[#162a1e]">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#6d8274]">
                            {item.batch} • Milled {item.daysAgo} days ago
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#dcd4c7] text-[#1c3829]">
                          {item.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-[#516859]">
                          <span>Bio-Active Nutrient Retention</span>
                          <span>{item.shelfLife}</span>
                        </div>
                        <div className="w-full bg-[#e8e2d5] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: item.shelfLife }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW D: VIP CRM & BIRTHDAY RADAR */}
            {analyticsSubTab === "crm" && (
              <div className="space-y-6">
                {/* Birthday Header Banner */}
                {todaysBirthdays.length > 0 && (
                  <div className="bg-gradient-to-r from-[#1c3829] via-[#244633] to-[#1c3829] border border-[#e0b253]/30 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#e0b253] bg-[#e0b253]/15 px-3 py-1 rounded-full border border-[#e0b253]/30">
                        <Cake className="w-3.5 h-3.5" /> High Lifetime-Value
                        Opportunity
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white">
                        {todaysBirthdays.length} Customer Celebrating Their
                        Birthday Today!
                      </h3>
                      <p className="text-xs text-[#a5c7b3]">
                        Send a 1-click personalized WhatsApp harvest voucher
                        code.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {todaysBirthdays.map((b) => (
                        <a
                          key={b.id}
                          href={`https://wa.me/91${b.phone}?text=Dear%20Valued%20Customer,%20Warmest%20birthday%20greetings%20from%20the%20Pure%20Organics%20farm%20family!%20%F0%9F%8E%82%20Enjoy%20a%20special%2020%25%20birthday%20harvest%20discount%20using%20coupon:%20BDAY20`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-[#0f2417] text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Wish +91 {b.phone}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Leads & Newsletter Grids */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Customer Leads */}
                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#eee8dd] pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#162a1e] flex items-center gap-2">
                          <Cake className="w-4 h-4 text-[#d97706]" /> Customer
                          Birthday Leads ({leads.length})
                        </h3>
                        <p className="text-xs text-[#6d8274]">
                          Captured via Welcome Discount Popups
                        </p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-[#edf5ef] text-[#1c3829] rounded-full border border-[#cbe1d2]">
                        {leads.length} Leads
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#eee8dd] text-xs">
                      {leads.map((l) => (
                        <div
                          key={l.id}
                          className="py-2.5 flex justify-between items-center text-[#516859]"
                        >
                          <div>
                            <span className="font-mono font-bold text-[#1c3829] block">
                              +91 {l.phone}
                            </span>
                            <span className="text-[10px] text-[#738d81]">
                              Coupon: {l.coupon_code || "HARVEST10"}
                            </span>
                          </div>
                          <div>
                            {l.dob ? (
                              <span className="bg-[#fef3c7] text-[#b45309] px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                                {l.dob}
                              </span>
                            ) : (
                              <span className="text-stone-400 italic text-[11px]">
                                No DOB given
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                      {leads.length === 0 && (
                        <p className="text-center py-6 text-stone-400 italic">
                          No birthday leads recorded yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Newsletter Subscribers */}
                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-[#eee8dd] pb-3">
                      <div>
                        <h3 className="font-serif font-bold text-base text-[#162a1e] flex items-center gap-2">
                          <Mail className="w-4 h-4 text-[#2e7d4d]" /> Newsletter
                          Subscribers ({subscribers.length})
                        </h3>
                        <p className="text-xs text-[#6d8274]">
                          Direct emails for batch allocations
                        </p>
                      </div>
                      {subscribers.length > 0 && (
                        <button
                          onClick={copyAllEmails}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#faf7f2] hover:bg-[#edf5ef] border border-[#dcd4c7] text-[#1c3829] text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          {copiedEmails ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          {copiedEmails ? "Copied!" : "Copy All"}
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-[#eee8dd] text-xs">
                      {subscribers.map((s) => (
                        <div
                          key={s.id}
                          className="py-2.5 flex justify-between items-center text-[#516859]"
                        >
                          <span className="font-medium text-[#162a1e]">
                            {s.email}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {new Date(s.subscribed_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </div>
                      ))}
                      {subscribers.length === 0 && (
                        <p className="text-center py-6 text-stone-400 italic">
                          No newsletter subscribers yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STOREFRONT CMS STUDIO (HOMEPAGE SECTIONS)               */}
        {/* ============================================================== */}
        {activeTab === "homepage-cms" && (isAdmin || isSuperAdmin) && (
          <div className="space-y-6">
            {/* Top Notifications from Store Manager */}
            {stockAlerts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Bell className="w-4 h-4" /> Manager Stock Notices (
                  {stockAlerts.length})
                </div>
                {stockAlerts.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between items-center text-xs text-amber-800"
                  >
                    <span>
                      <b>{a.productName}</b>: {a.message} (from {a.sender} at{" "}
                      {a.timestamp})
                    </span>
                    <button
                      onClick={() => dismissAlert(a.id)}
                      className="px-2 py-0.5 bg-white border border-amber-300 rounded font-semibold text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Section Switcher Bar */}
            <div className="bg-white p-3 rounded-2xl border border-[#e8e2d5] flex flex-wrap gap-2 text-xs">
              <span className="font-bold text-[#1c3829] self-center px-2">
                Edit Section:
              </span>
              {[
                { id: "announcements", label: "1. Announcement Bar" },
                { id: "hero", label: "2. Hero Carousel" },
                { id: "diet", label: "3. Health Goals" },
                { id: "gifting", label: "4. Gifting Banner" },
                { id: "testimonials", label: "5. Testimonials" },
                { id: "discount", label: "6. Discount Modal" },
                { id: "footer", label: "7. Footer" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveCmsSection(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                    activeCmsSection === s.id
                      ? "bg-[#1c3829] text-white shadow-xs"
                      : "bg-[#faf7f2] text-[#516859] hover:bg-[#edf5ef]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* 1. ANNOUNCEMENT BAR */}
            {activeCmsSection === "announcements" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-5">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  1. Top Announcement Bar & Marquee Ticker
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection("announcement", announcementForm);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">
                      Banner Heading Text
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
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Promo Badge</label>
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
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      required
                      value={announcementForm.couponCode || ""}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          couponCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#255236]"
                    >
                      <Save className="w-4 h-4 text-[#e0b253]" /> Save
                      Announcement Changes
                    </button>
                  </div>
                </form>

                {/* Ticker Management */}
                <div className="pt-4 border-t border-[#eee8dd] space-y-3">
                  <h4 className="text-xs font-bold text-[#162a1e]">
                    Marquee Ticker Bulletins
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add notice bulletin..."
                      value={tickerInput}
                      onChange={(e) => setTickerInput(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border rounded-xl bg-[#faf7f2]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!tickerInput.trim()) return;
                        const updated = {
                          ...announcementForm,
                          tickerMessages: [
                            ...(announcementForm.tickerMessages || []),
                            tickerInput.trim(),
                          ],
                        };
                        setAnnouncementForm(updated);
                        handleSaveSection("announcement", updated);
                        setTickerInput("");
                      }}
                      className="px-4 py-2 bg-[#1c3829] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Add Bulletin
                    </button>
                  </div>

                  <div className="divide-y divide-[#eee8dd] text-xs">
                    {(announcementForm.tickerMessages || []).map((msg, idx) => (
                      <div
                        key={idx}
                        className="py-2 flex justify-between items-center"
                      >
                        <span>{msg}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = {
                              ...announcementForm,
                              tickerMessages:
                                announcementForm.tickerMessages.filter(
                                  (_, i) => i !== idx,
                                ),
                            };
                            setAnnouncementForm(updated);
                            handleSaveSection("announcement", updated);
                          }}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove Bulletin"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. HERO SLIDES */}
            {activeCmsSection === "hero" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-5">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  2. Hero Carousel Bestseller Slides ({heroSlides.length})
                </h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!heroForm.title || !heroForm.price) return;
                    const updated = [
                      ...heroSlides,
                      {
                        ...heroForm,
                        id: Date.now(),
                        imageUrl:
                          heroForm.imageUrl ||
                          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
                      },
                    ];
                    handleSaveSection("hero_slides", updated);
                    setHeroForm({
                      tag: "",
                      title: "",
                      titleHighlight: "",
                      quote: "",
                      badge: "",
                      price: "",
                      originalPrice: "",
                      unit: "",
                      imageUrl: "",
                    });
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Tag (e.g. BESTSELLER #1 • COLD-PRESSED)"
                    value={heroForm.tag}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, tag: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Headline Title (e.g. Pure Virgin)"
                    value={heroForm.title}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, title: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    placeholder="Highlight Italic (e.g. Coconut Oil)"
                    value={heroForm.titleHighlight}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        titleHighlight: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Offer Price (e.g. ₹310)"
                    value={heroForm.price}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, price: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    placeholder="Original Price (e.g. ₹620)"
                    value={heroForm.originalPrice}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        originalPrice: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    placeholder="Unit / Net Weight (e.g. 500 ml Glass Jar)"
                    value={heroForm.unit}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, unit: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <div className="sm:col-span-3">
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={heroForm.imageUrl}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, imageUrl: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Quote Statement"
                      value={heroForm.quote}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, quote: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2.5 bg-[#1c3829] text-white font-bold rounded-xl shadow-xs cursor-pointer hover:bg-[#255236]"
                  >
                    Add Slide to Showcase
                  </button>
                </form>

                <div className="space-y-2 pt-2 text-xs">
                  {heroSlides.map((s, idx) => (
                    <div
                      key={s.id || idx}
                      className="p-3 border rounded-xl flex justify-between items-center bg-[#faf7f2]"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={s.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <b>
                            {s.title} {s.titleHighlight}
                          </b>{" "}
                          ({s.price})
                        </div>
                      </div>
                      {heroSlides.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = heroSlides.filter(
                              (_, i) => i !== idx,
                            );
                            handleSaveSection("hero_slides", updated);
                          }}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                          title="Remove Slide"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. HEALTH GOALS */}
            {activeCmsSection === "diet" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  3. Health Goals & Wellness Categories
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold block mb-1">
                      Section Main Heading
                    </label>
                    <input
                      type="text"
                      value={localHealthGoals?.heading || ""}
                      onChange={(e) =>
                        setLocalHealthGoals({
                          ...localHealthGoals,
                          heading: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Subheading Description
                    </label>
                    <input
                      type="text"
                      value={localHealthGoals?.subheading || ""}
                      onChange={(e) =>
                        setLocalHealthGoals({
                          ...localHealthGoals,
                          subheading: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveSection("health_goals", localHealthGoals)
                    }
                    className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Save Health Goals
                  </button>
                </div>
              </div>
            )}

            {/* 4. GIFTING BANNER */}
            {activeCmsSection === "gifting" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  4. Curated Gifting Box Section
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection("gifting_banner", localGifting);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">Badge</label>
                    <input
                      type="text"
                      value={localGifting?.badge || ""}
                      onChange={(e) =>
                        setLocalGifting({
                          ...localGifting,
                          badge: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Heading Title
                    </label>
                    <input
                      type="text"
                      value={localGifting?.title || ""}
                      onChange={(e) =>
                        setLocalGifting({
                          ...localGifting,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Description Paragraph
                    </label>
                    <textarea
                      rows="2"
                      value={localGifting?.description || ""}
                      onChange={(e) =>
                        setLocalGifting({
                          ...localGifting,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Save Gifting Card
                  </button>
                </form>
              </div>
            )}

            {/* 5. TESTIMONIALS */}
            {activeCmsSection === "testimonials" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  5. Customer Testimonials & Reviews
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newReview.name || !newReview.comment) return;
                    const updated = {
                      ...localTestimonials,
                      reviews: [
                        ...(localTestimonials?.reviews || []),
                        { ...newReview, id: Date.now() },
                      ],
                    };
                    setLocalTestimonials(updated);
                    handleSaveSection("testimonials", updated);
                    setNewReview({
                      name: "",
                      city: "",
                      rating: 5,
                      comment: "",
                    });
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Customer Name"
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="City (e.g. Chennai)"
                    value={newReview.city}
                    onChange={(e) =>
                      setNewReview({ ...newReview, city: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <div className="sm:col-span-3">
                    <textarea
                      rows="2"
                      required
                      placeholder="Review statement..."
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({ ...newReview, comment: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2.5 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Add Review
                  </button>
                </form>

                <div className="space-y-2 pt-2 text-xs">
                  {(localTestimonials?.reviews || []).map((t, idx) => (
                    <div
                      key={t.id || idx}
                      className="p-3 border rounded-xl flex justify-between items-center bg-[#faf7f2]"
                    >
                      <div>
                        <b>{t.name}</b> ({t.city}): "{t.comment.slice(0, 50)}
                        ..."
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = {
                            ...localTestimonials,
                            reviews: localTestimonials.reviews.filter(
                              (_, i) => i !== idx,
                            ),
                          };
                          setLocalTestimonials(updated);
                          handleSaveSection("testimonials", updated);
                        }}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        title="Remove Review"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. DISCOUNT MODAL */}
            {activeCmsSection === "discount" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  6. Client Welcome Discount Popup
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection("discount_modal", localDiscount);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">Popup Title</label>
                    <input
                      type="text"
                      value={localDiscount?.title || ""}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={localDiscount?.subtitle || ""}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          subtitle: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Coupon Code</label>
                    <input
                      type="text"
                      value={localDiscount?.couponCode || ""}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          couponCode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Save Discount Modal
                  </button>
                </form>
              </div>
            )}

            {/* 7. FOOTER */}
            {activeCmsSection === "footer" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  7. Bottom Footer Information
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection("footer", localFooter);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">
                      Farm Philosophy Tagline
                    </label>
                    <textarea
                      rows="2"
                      value={localFooter?.farmTagline || ""}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          farmTagline: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      value={localFooter?.contactPhone || ""}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          contactPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={localFooter?.contactEmail || ""}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          contactEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Save Footer
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: INVENTORY & CATALOG (STORE MANAGER & SUPER ADMIN)        */}
        {/* ============================================================== */}
        {activeTab === "inventory" && (isStoreManager || isSuperAdmin) && (
          <div className="space-y-6">
            {/* 1. ADD NEW HARVEST ITEM */}
            <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#eee8dd] pb-3">
                <h3 className="font-serif text-base font-bold text-[#162a1e] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1c3829] text-[#e0b253] flex items-center justify-center shadow-xs">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span>Add New Harvest Item to Storefront</span>
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#738d81] bg-[#faf7f2] border border-[#e8e2d5] px-2.5 py-1 rounded-full">
                  Active Catalog
                </span>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newItemForm.name || !newItemForm.price) return;

                  await addProduct({
                    ...newItemForm,
                    price: Number(newItemForm.price),
                  });

                  setNewItemForm({
                    name: "",
                    category: "Cold-Pressed Oils",
                    price: "",
                    unit: "",
                    image: "",
                    description: "",
                  });
                  triggerToast("New product saved to catalog!");
                }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs"
              >
                <div>
                  <label className="font-bold block mb-1 text-[#516859]">
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Traditional Palm Candy"
                    value={newItemForm.name}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-[#516859]">
                    Category
                  </label>
                  <select
                    value={newItemForm.category}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2] font-semibold"
                  >
                    <option value="Cold-Pressed Oils">Cold-Pressed Oils</option>
                    <option value="Millets & Grains">Millets & Grains</option>
                    <option value="Groceries">Groceries</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-[#516859]">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 240"
                    value={newItemForm.price}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1 text-[#516859]">
                    Unit / Weight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Litre, 500g, 1 kg"
                    value={newItemForm.unit}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, unit: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold block mb-1 text-[#516859]">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newItemForm.image}
                    onChange={(e) =>
                      setNewItemForm({ ...newItemForm, image: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="font-bold block mb-1 text-[#516859]">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder="Native cultivation details, milling process, or health perks..."
                    value={newItemForm.description}
                    onChange={(e) =>
                      setNewItemForm({
                        ...newItemForm,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                </div>

                <div className="sm:col-span-3 pt-2">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1c3829] hover:bg-[#255236] text-white font-bold rounded-xl shadow-xs cursor-pointer transition-all"
                  >
                    Publish New Item to Catalog
                  </button>
                </div>
              </form>
            </div>

            {/* 2. SHORTAGE ALERT SENDER */}
            <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-[#2e7d4d]">
                <Send className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold">
                  Send Out-of-Stock / Mill Batch Alert to Admin
                </h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!alertProduct || !alertMessage) return;
                  sendStockAlert(alertProduct, alertMessage);
                  setAlertProduct("");
                  setAlertMessage("");
                  alert("Stock notice dispatched to Admin!");
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Product Name"
                  value={alertProduct}
                  onChange={(e) => setAlertProduct(e.target.value)}
                  className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                />
                <input
                  type="text"
                  required
                  placeholder="Reason / Restock status"
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                />
                <button
                  type="submit"
                  className="py-2 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                >
                  Notify Admin
                </button>
              </form>
            </div>

            {/* 3. CATALOG PRODUCTS TABLE */}
            <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#e8e2d5] flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  Manage Catalog Stock ({products.length} Items)
                </h3>
                <span className="text-xs text-[#6d8274]">
                  Click <b>Edit</b> to update prices, weights, or photos.
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#516859]">
                  <thead className="bg-[#faf7f2] font-semibold border-b">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Unit</th>
                      <th className="px-6 py-3">Availability Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee8dd]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#faf7f2]/50">
                        <td className="px-6 py-3 font-semibold text-[#162a1e]">
                          <div className="flex items-center gap-2.5">
                            {p.image && (
                              <img
                                src={p.image}
                                alt=""
                                className="w-8 h-8 rounded-lg object-cover border"
                              />
                            )}
                            <span>{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">{p.category}</td>
                        <td className="px-6 py-3 font-bold text-[#1c3829]">
                          ₹{p.price}
                        </td>
                        <td className="px-6 py-3">{p.unit || "-"}</td>
                        <td className="px-6 py-3">
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                              p.inStock !== false
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {p.inStock !== false
                              ? "✓ In Stock"
                              : "✕ Out of Stock"}
                          </button>
                        </td>
                        <td className="px-6 py-3 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(p)}
                            className="px-2.5 py-1 bg-white border border-[#dcd4c7] hover:bg-[#edf5ef] text-[#1c3829] rounded-lg font-bold text-[11px] cursor-pointer"
                          >
                            ✎ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Remove Product"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. MODAL POPUP TO EDIT EXISTING ITEM */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#e8e2d5] shadow-2xl space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="font-serif font-bold text-base text-[#162a1e]">
                      Edit Item: {editingProduct.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="text-stone-400 hover:text-black font-bold text-sm cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">
                        Product Title
                      </label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                      />
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Category</label>
                      <select
                        value={editingProduct.category}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2] font-semibold"
                      >
                        <option value="Cold-Pressed Oils">
                          Cold-Pressed Oils
                        </option>
                        <option value="Millets & Grains">
                          Millets & Grains
                        </option>
                        <option value="Groceries">Groceries</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold block mb-1">
                          Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                        />
                      </div>

                      <div>
                        <label className="font-bold block mb-1">
                          Unit / Net Weight
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
                          className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">Image URL</label>
                      <input
                        type="url"
                        value={editingProduct.image || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            image: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                      />
                    </div>

                    <div>
                      <label className="font-bold block mb-1">
                        Description
                      </label>
                      <textarea
                        rows="2"
                        value={editingProduct.description || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 border rounded-xl font-bold bg-white text-[#516859] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProductEdit}
                      className="px-5 py-2 rounded-xl font-bold bg-[#1c3829] text-white hover:bg-[#255236] cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: DISPATCH TEAM (LOGISTICS & ORDERS STEPPER)               */}
        {/* ============================================================== */}
        {activeTab === "dispatch" && (isDispatch || isSuperAdmin) && (
          <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e8e2d5]">
              <h3 className="font-serif text-base font-bold text-[#162a1e]">
                Dispatch & Logistics Queue ({orders.length})
              </h3>
              <p className="text-xs text-[#6d8274]">
                Advance statuses and enter live hub transit notes that appear on
                customer tracking.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#516859]">
                <thead className="bg-[#faf7f2] font-semibold border-b">
                  <tr>
                    <th className="px-6 py-3">Tracking ID</th>
                    <th className="px-6 py-3">Customer Details</th>
                    <th className="px-6 py-3">Milestone</th>
                    <th className="px-6 py-3">Transit Checkpoint Note</th>
                    <th className="px-6 py-3 text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8dd]">
                  {orders.map((ord) => (
                    <tr key={ord.trackingId}>
                      <td className="px-6 py-4 font-mono font-bold text-[#1c3829]">
                        {ord.trackingId}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#162a1e]">
                          {ord.customer?.name}
                        </div>
                        <div className="text-[#738d81]">
                          {ord.customer?.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              ord.trackingId,
                              e.target.value,
                              ord.dispatchNote,
                            )
                          }
                          className="px-2 py-1 border rounded-lg bg-[#faf7f2] font-semibold text-[#1c3829] cursor-pointer"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          defaultValue={ord.dispatchNote || ""}
                          placeholder="e.g. Packed at warehouse, In transit"
                          onBlur={(e) =>
                            updateOrderStatus(
                              ord.trackingId,
                              ord.status,
                              e.target.value,
                            )
                          }
                          className="px-3 py-1.5 border rounded-lg bg-[#faf7f2] w-64 text-xs"
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => printPackingSlip(ord)}
                          className="px-3 py-1.5 bg-[#faf7f2] hover:bg-[#edf5ef] text-[#1c3829] border border-[#dcd4c7] rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" /> Print
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
    </div>
  );
}
