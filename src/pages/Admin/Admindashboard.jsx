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
  Sparkles,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Crown,
  Palette,
  Truck,
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

  const API_BASE_URL = "https://pure-organics1.onrender.com";

  const role = currentAdmin?.role || "SUPER_ADMIN";
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

  const [analyticsSubTab, setAnalyticsSubTab] = useState("overview");
  const [activeCmsSection, setActiveCmsSection] = useState("announcements");
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(
    "Storefront Configurations Updated!",
  );

  // Marketing & Search Data
  const [subscribers, setSubscribers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [searchInsights, setSearchInsights] = useState({
    topKeywords: [],
    topCategories: [],
  });

  // Promotional Offer Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastText, setBroadcastText] = useState("");
  const [broadcastCoupon, setBroadcastCoupon] = useState("HARVEST10");
  const [customPhone, setCustomPhone] = useState("");

  // Forms
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

  // ==========================================
  // WHATSAPP NOTIFICATION DISPATCHER (NO META API NEEDED)
  // ==========================================
  const notifyCustomerWhatsApp = (order) => {
    const rawPhone = (
      order.customer?.phone ||
      order.customer_phone ||
      ""
    ).replace(/\D/g, "");
    if (!rawPhone) {
      alert("No customer phone number available for this consignment.");
      return;
    }
    const targetPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const trackingId = order.trackingId || order.tracking_id;
    const customerName =
      order.customer?.name || order.customer_name || "Valued Patron";
    const status = order.status || "Placed";
    const total = order.total || order.total_amount;
    const address =
      order.customer?.address || order.customer_address || "Customer Address";
    const dispatchNote =
      order.dispatchNote ||
      order.dispatch_note ||
      "Package is advancing along route.";

    let message = "";

    if (status === "Delivered") {
      message = `🌾 *Pure Organics - Order Delivered!*

Hello *${customerName}*,
Your native harvest consignment (*${trackingId}*) has been delivered successfully.

Thank you for choosing chemical-free farm produce!
Need assistance? Reply directly to this chat.`;
    } else if (status === "Shipped" || status === "On the Way") {
      message = `🚚 *Pure Organics - Order Out for Delivery!*

Hello *${customerName}*,
Your package (*${trackingId}*) is now in transit to:
📍 ${address}

📝 *Logistics Note:* ${dispatchNote}
🔗 Track live: https://pure-organics1.vercel.app/track?id=${trackingId}`;
    } else if (status === "Packed") {
      message = `📦 *Pure Organics - Order Packed!*

Hello *${customerName}*,
Your items for order *${trackingId}* have been verified and sealed at our regional farm collective.

📝 *Note:* ${dispatchNote}
Next milestone: Handover to regional logistics courier.`;
    } else {
      message = `🌿 *Pure Organics - Order Confirmed!*

Hello *${customerName}*,
We have registered your native harvest booking!

• *Tracking ID:* ${trackingId}
• *Total Payable:* ₹${total}
• *Delivery Destination:* ${address}

Track real-time progress:
👉 https://pure-organics1.vercel.app/track?id=${trackingId}`;
    }

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${targetPhone}?text=${encoded}`, "_blank");
  };

  const fetchMarketingData = () => {
    fetch(`${API_BASE_URL}/api/newsletter`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSubscribers(data);
      })
      .catch((err) => console.warn(err));

    fetch(`${API_BASE_URL}/api/leads`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data);
      })
      .catch((err) => console.warn(err));

    fetch(`${API_BASE_URL}/api/admin/search-insights`)
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
        `${API_BASE_URL}/api/products/${editingProduct.id}`,
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

  const grossRevenue = orders.reduce(
    (sum, o) => sum + (o.total || o.total_amount || 0),
    0,
  );
  const outOfStockItems = products.filter((p) => p.inStock === false);
  const avgOrderValue =
    orders.length > 0 ? Math.round(grossRevenue / orders.length) : 0;
  const estimatedGrossProfit = Math.round(grossRevenue * 0.42);
  const todaysBirthdays = leads.filter((l) => l.is_birthday_today === 1);

  const printPackingSlip = (order) => {
    const trackingId = order.trackingId || order.tracking_id;
    const custName = order.customer?.name || order.customer_name || "Customer";
    const custPhone = order.customer?.phone || order.customer_phone || "N/A";
    const custAddress =
      order.customer?.address || order.customer_address || "Address on File";
    const total = order.total || order.total_amount;

    const slip = window.open("", "_blank");
    slip.document.write(`
      <html>
        <head>
          <title>Packing Slip - ${trackingId}</title>
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
            <p>Consignment ID: <strong>${trackingId}</strong></p>
            <p class="badge">FSSAI Lic. No: 12423008000412</p>
          </div>
          <div>
            <h3>Customer Delivery Details:</h3>
            <p><strong>Name:</strong> ${custName}</p>
            <p><strong>Phone:</strong> +91 ${custPhone}</p>
            <p><strong>Address:</strong> ${custAddress}</p>
            <p><strong>Total Collectable (COD):</strong> ₹${total}</p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    slip.document.close();
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#162a1e] py-8 px-4 sm:px-6 lg:px-8 font-sans">
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
                {currentAdmin?.badge || "Tier 1: Super Admin"}
              </span>
              <span className="text-xs text-[#6d8274]">
                Signed in as <b>{currentAdmin?.name || "Admin"}</b> (@
                {currentAdmin?.username || "owner"})
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
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef]"
              }`}
            >
              <Crown className="w-4 h-4 text-[#e0b253]" />
              <span>Founder Command Center</span>
            </button>
          )}

          {(isAdmin || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("homepage-cms")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "homepage-cms"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef]"
              }`}
            >
              <Palette className="w-4 h-4 text-[#e0b253]" />
              <span>Storefront CMS Studio</span>
            </button>
          )}

          {(isStoreManager || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("inventory")}
              className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                activeTab === "inventory"
                  ? "bg-[#1c3829] text-white shadow-sm border border-[#2e5941]"
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef]"
              }`}
            >
              <PackageCheck className="w-4 h-4 text-[#e0b253]" />
              <span>Inventory & Catalog</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#faf7f2] text-[#1c3829]">
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
                  : "bg-white text-[#4d6556] border border-[#e5dfd3] hover:bg-[#edf5ef]"
              }`}
            >
              <Truck className="w-4 h-4 text-[#e0b253]" />
              <span>Logistics Stepper</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#faf7f2] text-[#1c3829]">
                {orders.length}
              </span>
            </button>
          )}
        </div>

        {/* TAB 1: FOUNDER COMMAND CENTER */}
        {activeTab === "super-analytics" && isSuperAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-2xl border border-[#e8e2d5] flex flex-wrap gap-2 text-xs shadow-xs">
              {[
                { id: "overview", label: "Revenue & Financial Pulse" },
                { id: "kanban", label: "Live Order Fulfillment Board" },
                { id: "crm", label: "VIP Customer & WhatsApp Broadcaster" },
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

            {analyticsSubTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274]">
                        Gross Store Revenue
                      </span>
                      <TrendingUp className="w-4 h-4 text-[#2e7d4d]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#1c3829] mt-2">
                      ₹{grossRevenue.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 inline-block">
                      100% Native Wood-Pressed
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274]">
                        Average Order Value
                      </span>
                      <Sparkles className="w-4 h-4 text-[#e0b253]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#162a1e] mt-2">
                      ₹{avgOrderValue}
                    </p>
                    <span className="text-[11px] text-[#6d8274] mt-1 inline-block">
                      {orders.length} total orders
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274]">
                        Est. Gross Margin (42%)
                      </span>
                      <ShieldCheck className="w-4 h-4 text-[#2e7d4d]" />
                    </div>
                    <p className="text-3xl font-serif font-black text-[#2e7d4d] mt-2">
                      ₹{estimatedGrossProfit.toLocaleString()}
                    </p>
                    <span className="text-[11px] text-[#6d8274] mt-1 inline-block">
                      Net processing margin
                    </span>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase font-bold text-[#6d8274]">
                        Stock Risk Items
                      </span>
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                    </div>
                    <p className="text-3xl font-serif font-black text-rose-600 mt-2">
                      {outOfStockItems.length}
                    </p>
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 inline-block">
                      Needs mill batch replenishment
                    </span>
                  </div>
                </div>

                {/* Search Insights Widget */}
                <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-base text-[#162a1e] flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#e0b253]" /> Customer
                    Demand & Search Trends
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-[#516859]">
                        Top Searched Keywords
                      </h4>
                      {searchInsights.topKeywords.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          No search terms recorded yet.
                        </p>
                      ) : (
                        searchInsights.topKeywords.map((k, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between p-2.5 bg-[#faf7f2] rounded-xl text-xs"
                          >
                            <span>
                              #{idx + 1} "{k.query_term}"
                            </span>
                            <span className="font-bold text-[#1c3829]">
                              {k.count} searches
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-[#516859]">
                        Popular Category Filters
                      </h4>
                      {searchInsights.topCategories.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">
                          No category clicks recorded yet.
                        </p>
                      ) : (
                        searchInsights.topCategories.map((c, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between p-2.5 bg-[#faf7f2] rounded-xl text-xs"
                          >
                            <span>{c.filter_category}</span>
                            <span className="font-bold text-[#1c3829]">
                              {c.count} views
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KANBAN BOARD */}
            {analyticsSubTab === "kanban" && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {["Placed", "Packed", "Shipped", "Delivered"].map((stage) => {
                  const stageOrders = orders.filter(
                    (o) => (o.status || "Placed") === stage,
                  );
                  return (
                    <div
                      key={stage}
                      className="bg-[#faf7f2] border border-[#e8e2d5] rounded-3xl p-4 flex flex-col min-h-[450px]"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-[#e2dacf] mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider">
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
                          stageOrders.map((ord) => {
                            const trackingId =
                              ord.trackingId || ord.tracking_id;
                            const total = ord.total || ord.total_amount;
                            const custName =
                              ord.customer?.name ||
                              ord.customer_name ||
                              "Customer";
                            const custPhone =
                              ord.customer?.phone || ord.customer_phone || "";

                            return (
                              <div
                                key={trackingId}
                                className="bg-white p-3.5 rounded-2xl border border-[#e5dfd3] shadow-xs space-y-2"
                              >
                                <div className="flex justify-between">
                                  <span className="font-mono text-xs font-bold text-[#1c3829]">
                                    {trackingId}
                                  </span>
                                  <span className="text-xs font-bold text-[#2e7d4d]">
                                    ₹{total}
                                  </span>
                                </div>
                                <div className="text-xs">
                                  <p className="font-bold">{custName}</p>
                                  <p className="text-[11px] text-[#6d8274]">
                                    {custPhone}
                                  </p>
                                </div>
                                <div className="pt-2 border-t flex items-center justify-between gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => notifyCustomerWhatsApp(ord)}
                                    className="px-2.5 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                                    title="Send WhatsApp Update"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" />{" "}
                                    Notify WA
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
                                          trackingId,
                                          next,
                                          ord.dispatchNote || ord.dispatch_note,
                                        );
                                      }}
                                      className="inline-flex items-center text-[10px] font-bold bg-[#1c3829] text-white px-2 py-1 rounded-lg hover:bg-[#255236] cursor-pointer"
                                    >
                                      Next <ChevronRight className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CRM & WHATSAPP BROADCASTER */}
            {analyticsSubTab === "crm" && (
              <div className="space-y-6">
                {todaysBirthdays.length > 0 && (
                  <div className="bg-[#1c3829] p-5 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#e0b253] uppercase">
                        Birthday Alert
                      </span>
                      <h3 className="font-serif text-lg font-bold">
                        {todaysBirthdays.length} Customers Celebrating Today!
                      </h3>
                    </div>
                    <div className="flex gap-2">
                      {todaysBirthdays.map((b) => (
                        <a
                          key={b.id}
                          href={`https://wa.me/91${b.phone}?text=Dear%20Valued%20Customer,%20Warmest%20birthday%20greetings%20from%20the%20Pure%20Organics%20farm%20family!%20%F0%9F%8E%82%20Enjoy%20a%20special%2020%25%20birthday%20harvest%20discount%20using%20coupon:%20BDAY20`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Cake className="w-4 h-4" /> Wish {b.phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offer Composer */}
                <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4 shadow-xs">
                  <h3 className="font-serif font-bold text-base text-[#162a1e] flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-[#25D366]" /> Direct
                    WhatsApp Offer Broadcast Composer
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="font-bold block mb-1">Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Flash 20% Off Wood-Pressed Oils"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        Coupon Code
                      </label>
                      <input
                        type="text"
                        value={broadcastCoupon}
                        onChange={(e) =>
                          setBroadcastCoupon(e.target.value.toUpperCase())
                        }
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2] font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold block mb-1">
                        Customer Phone (or default to lead)
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="font-bold block mb-1">
                        Message Body
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Our latest harvest of Vaagai cold-pressed sesame oil is ready! Use code at checkout."
                        value={broadcastText}
                        onChange={(e) => setBroadcastText(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2] resize-none"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={() => {
                          const target =
                            customPhone.replace(/\D/g, "") ||
                            (leads[0]?.phone ? leads[0].phone : "");
                          if (!target) {
                            alert(
                              "Please enter a target mobile number or add a lead.",
                            );
                            return;
                          }
                          const cleanTarget =
                            target.length === 10 ? `91${target}` : target;
                          const promo = `🌿 *Pure Organics - ${broadcastTitle || "Harvest Special"}* 🌾

${broadcastText || "Fresh seasonal harvests now available at farm-gate rates."}

🎟️ *Use Coupon:* ${broadcastCoupon || "HARVEST10"}
🛒 *Shop:* https://pure-organics1.vercel.app/shop`;
                          window.open(
                            `https://wa.me/${cleanTarget}?text=${encodeURIComponent(promo)}`,
                            "_blank",
                          );
                        }}
                        className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
                      >
                        <Send className="w-4 h-4" /> Send Offer via WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: STOREFRONT CMS STUDIO */}
        {activeTab === "homepage-cms" && (isAdmin || isSuperAdmin) && (
          <div className="space-y-6">
            <div className="bg-white p-3 rounded-2xl border border-[#e8e2d5] flex flex-wrap gap-2 text-xs">
              {[
                { id: "announcements", label: "Announcement Bar" },
                { id: "hero", label: "Hero Carousel" },
                { id: "discount", label: "Discount Popup" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveCmsSection(s.id)}
                  className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer ${
                    activeCmsSection === s.id
                      ? "bg-[#1c3829] text-white"
                      : "bg-[#faf7f2] text-[#516859]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {activeCmsSection === "announcements" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif font-bold text-base">
                  Top Announcement Banner
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveSection("announcement", announcementForm);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">Banner Text</label>
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
                    <label className="font-bold block mb-1">Badge</label>
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
                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                    >
                      Save Announcement
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY & CATALOG */}
        {activeTab === "inventory" && (isStoreManager || isSuperAdmin) && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base">
                Add New Harvest Product
              </h3>
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
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
              >
                <input
                  type="text"
                  required
                  placeholder="Product Name"
                  value={newItemForm.name}
                  onChange={(e) =>
                    setNewItemForm({ ...newItemForm, name: e.target.value })
                  }
                  className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                />
                <input
                  type="number"
                  required
                  placeholder="Price (₹)"
                  value={newItemForm.price}
                  onChange={(e) =>
                    setNewItemForm({ ...newItemForm, price: e.target.value })
                  }
                  className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g. 1L, 500g)"
                  value={newItemForm.unit}
                  onChange={(e) =>
                    setNewItemForm({ ...newItemForm, unit: e.target.value })
                  }
                  className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                />
                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1c3829] text-white font-bold rounded-xl cursor-pointer"
                  >
                    Publish Item
                  </button>
                </div>
              </form>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-xs overflow-hidden">
              <div className="p-6 border-b border-[#e8e2d5]">
                <h3 className="font-serif font-bold text-base">
                  Active Catalog Stock ({products.length} Products)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#faf7f2] font-semibold border-b">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee8dd]">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-6 py-3 font-semibold">{p.name}</td>
                        <td className="px-6 py-3 font-bold text-[#1c3829]">
                          ₹{p.price}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            type="button"
                            onClick={() => toggleStockStatus(p.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer ${
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
                        <td className="px-6 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
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
          </div>
        )}

        {/* TAB 4: DISPATCH TEAM */}
        {activeTab === "dispatch" && (isDispatch || isSuperAdmin) && (
          <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#e8e2d5]">
              <h3 className="font-serif font-bold text-base text-[#162a1e]">
                Dispatch & Logistics Stepper ({orders.length} Consignments)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf7f2] font-semibold border-b">
                  <tr>
                    <th className="px-6 py-3">Tracking ID</th>
                    <th className="px-6 py-3">Customer Details</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Hub Transit Note</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8dd]">
                  {orders.map((ord) => {
                    const trackingId = ord.trackingId || ord.tracking_id;
                    const custName =
                      ord.customer?.name || ord.customer_name || "Customer";
                    const custPhone =
                      ord.customer?.phone || ord.customer_phone || "N/A";
                    const status = ord.status || "Placed";
                    const dispatchNote =
                      ord.dispatchNote || ord.dispatch_note || "";

                    return (
                      <tr key={trackingId}>
                        <td className="px-6 py-4 font-mono font-bold text-[#1c3829]">
                          {trackingId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold">{custName}</div>
                          <div className="text-[#6d8274]">{custPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={status}
                            onChange={(e) =>
                              updateOrderStatus(
                                trackingId,
                                e.target.value,
                                dispatchNote,
                              )
                            }
                            className="px-2 py-1 border rounded-lg bg-[#faf7f2] font-semibold cursor-pointer"
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
                            defaultValue={dispatchNote}
                            placeholder="e.g. Hub scan complete, En route"
                            onBlur={(e) =>
                              updateOrderStatus(
                                trackingId,
                                status,
                                e.target.value,
                              )
                            }
                            className="px-3 py-1.5 border rounded-lg bg-[#faf7f2] w-64 text-xs"
                          />
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => notifyCustomerWhatsApp(ord)}
                            className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
                            title="Send WhatsApp update to recipient"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Notify WA
                          </button>
                          <button
                            type="button"
                            onClick={() => printPackingSlip(ord)}
                            className="px-3 py-1.5 bg-[#faf7f2] hover:bg-[#edf5ef] text-[#1c3829] border border-[#dcd4c7] rounded-xl font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" /> Print
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
      </div>
    </div>
  );
}
