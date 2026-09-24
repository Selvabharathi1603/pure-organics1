import React, { useState } from "react";
import {
  Trash2,
  LogOut,
  Truck,
  Plus,
  Bell,
  Send,
  Sliders,
  Sparkles,
  Layers,
  Quote,
  Gift,
  HelpCircle,
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
    dietPreferences,
    categories,
    giftingConfig,
    testimonials,
    discountConfig,
    footerConfig,
    addProduct,
    updateProduct,
    toggleStockStatus,
    deleteProduct,
    sendStockAlert,
    dismissAlert,
    updateOrderStatus,
    updateAnnouncements,
    updateHeroSlides,
    updateDietPreferences,
    updateCategories,
    updateGiftingConfig,
    updateTestimonials,
    updateDiscountConfig,
    updateFooterConfig,
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

  // Sub-section tab for Homepage Editor
  const [activeCmsSection, setActiveCmsSection] = useState("announcements");

  // Local Editor State
  const [announcementInput, setAnnouncementInput] = useState("");
  const [heroForm, setHeroForm] = useState({
    tag: "",
    title: "",
    highlightText: "",
    quote: "",
    badge: "",
    price: "",
    imageUrl: "",
  });
  const [localGifting, setLocalGifting] = useState(giftingConfig);
  const [localDiscount, setLocalDiscount] = useState(discountConfig);
  const [localFooter, setLocalFooter] = useState(footerConfig);

  // Testimonial Form State
  const [newReview, setNewReview] = useState({
    name: "",
    location: "",
    product: "",
    rating: 5,
    review: "",
  });

  // Store Manager State
  const [alertProduct, setAlertProduct] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Groceries",
    price: "",
    unit: "",
    image: "",
    description: "",
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const outOfStockItems = products.filter((p) => p.inStock === false);

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#162a1e] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d5] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#1b3b27] text-white">
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

        {/* 4-Tier Main Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("super-analytics")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "super-analytics"
                  ? "bg-[#1b3b27] text-white"
                  : "bg-white text-[#516859] border"
              }`}
            >
              👑 Owner Analytics & Audit
            </button>
          )}

          {(isAdmin || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("homepage-cms")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "homepage-cms"
                  ? "bg-[#1b3b27] text-white"
                  : "bg-white text-[#516859] border"
              }`}
            >
              🎨 Full Homepage CMS (Top to Bottom)
            </button>
          )}

          {(isStoreManager || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("inventory")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "inventory"
                  ? "bg-[#1b3b27] text-white"
                  : "bg-white text-[#516859] border"
              }`}
            >
              📦 Inventory & Out-of-Stock ({products.length})
            </button>
          )}

          {(isDispatch || isSuperAdmin) && (
            <button
              onClick={() => setActiveTab("dispatch")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dispatch"
                  ? "bg-[#1b3b27] text-white"
                  : "bg-white text-[#516859] border"
              }`}
            >
              🚚 Dispatch Stepper & Notes ({orders.length})
            </button>
          )}
        </div>

        {/* ============================================================== */}
        {/* TAB: HOMEPAGE CMS (ADMIN & SUPER ADMIN COMPLETE CONTROL)       */}
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
              <span className="font-bold text-[#1b3b27] self-center px-2">
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
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                    activeCmsSection === s.id
                      ? "bg-[#1b3b27] text-white"
                      : "bg-[#faf7f2] text-[#516859] hover:bg-[#edf5ef]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* 1. ANNOUNCEMENTS */}
            {activeCmsSection === "announcements" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  1. Top Announcement Bar (Ticker Ticker Text)
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!announcementInput.trim()) return;
                    updateAnnouncements([
                      ...announcements,
                      announcementInput.trim(),
                    ]);
                    setAnnouncementInput("");
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    required
                    value={announcementInput}
                    onChange={(e) => setAnnouncementInput(e.target.value)}
                    placeholder="Enter announcement notice..."
                    className="flex-1 px-3 py-2 text-xs border rounded-xl bg-[#faf7f2]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1b3b27] text-white text-xs font-bold rounded-xl"
                  >
                    Add Notice
                  </button>
                </form>
                <div className="divide-y divide-[#eee8dd] text-xs">
                  {announcements.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-2 flex justify-between items-center"
                    >
                      <span>{item}</span>
                      <button
                        onClick={() =>
                          updateAnnouncements(
                            announcements.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. HERO SLIDES */}
            {activeCmsSection === "hero" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  2. Hero Section Carousel Slides ({heroSlides.length})
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!heroForm.title || !heroForm.price) return;
                    updateHeroSlides([
                      ...heroSlides,
                      {
                        ...heroForm,
                        id: Date.now(),
                        imageUrl:
                          heroForm.imageUrl ||
                          "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1000&q=80",
                      },
                    ]);
                    setHeroForm({
                      tag: "",
                      title: "",
                      highlightText: "",
                      quote: "",
                      badge: "",
                      price: "",
                      imageUrl: "",
                    });
                    alert("Slide added to Hero Carousel!");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Tag (e.g. 100% Native)"
                    value={heroForm.tag}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, tag: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Full Headline Title"
                    value={heroForm.title}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, title: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    placeholder="Highlight Italic Text"
                    value={heroForm.highlightText}
                    onChange={(e) =>
                      setHeroForm({
                        ...heroForm,
                        highlightText: e.target.value,
                      })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    placeholder="Badge Name (e.g. Wood Gingelly)"
                    value={heroForm.badge}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, badge: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Price (e.g. ₹480)"
                    value={heroForm.price}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, price: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={heroForm.imageUrl}
                    onChange={(e) =>
                      setHeroForm({ ...heroForm, imageUrl: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Botanical Quote Statement"
                      value={heroForm.quote}
                      onChange={(e) =>
                        setHeroForm({ ...heroForm, quote: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2 bg-[#1b3b27] text-white font-bold rounded-xl"
                  >
                    Add Hero Slide
                  </button>
                </form>

                <div className="space-y-2 pt-2 text-xs">
                  {heroSlides.map((s, idx) => (
                    <div
                      key={s.id}
                      className="p-3 border rounded-xl flex justify-between items-center bg-[#faf7f2]"
                    >
                      <div>
                        <b>{s.title}</b> ({s.badge} - {s.price})
                      </div>
                      {heroSlides.length > 1 && (
                        <button
                          onClick={() =>
                            updateHeroSlides(
                              heroSlides.filter((_, i) => i !== idx),
                            )
                          }
                          className="text-rose-600 font-bold"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. HEALTH GOALS / DIET PREFS */}
            {activeCmsSection === "diet" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  3. Health Goals / Dietary Cards (3 Cards)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  {dietPreferences.map((pref, idx) => (
                    <div
                      key={pref.id}
                      className="p-4 border rounded-2xl bg-[#faf7f2] space-y-2"
                    >
                      <label className="font-bold block">
                        Card {idx + 1} Title
                      </label>
                      <input
                        type="text"
                        value={pref.title}
                        onChange={(e) => {
                          const updated = [...dietPreferences];
                          updated[idx].title = e.target.value;
                          updateDietPreferences(updated);
                        }}
                        className="w-full px-2 py-1 border rounded-lg bg-white"
                      />
                      <label className="font-bold block">Subtitle</label>
                      <input
                        type="text"
                        value={pref.subtitle}
                        onChange={(e) => {
                          const updated = [...dietPreferences];
                          updated[idx].subtitle = e.target.value;
                          updateDietPreferences(updated);
                        }}
                        className="w-full px-2 py-1 border rounded-lg bg-white"
                      />
                      <label className="font-bold block">Pill Tag</label>
                      <input
                        type="text"
                        value={pref.tag}
                        onChange={(e) => {
                          const updated = [...dietPreferences];
                          updated[idx].tag = e.target.value;
                          updateDietPreferences(updated);
                        }}
                        className="w-full px-2 py-1 border rounded-lg bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. GIFTING BANNER */}
            {activeCmsSection === "gifting" && (
              <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] space-y-4">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  4. Gifting & Assortment Banner Box
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateGiftingConfig(localGifting);
                    alert("Gifting card saved live!");
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">Small Badge</label>
                    <input
                      type="text"
                      value={localGifting.badge}
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
                    <label className="font-bold block mb-1">Main Heading</label>
                    <input
                      type="text"
                      value={localGifting.title}
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
                      value={localGifting.description}
                      onChange={(e) =>
                        setLocalGifting({
                          ...localGifting,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Button Callout Text
                    </label>
                    <input
                      type="text"
                      value={localGifting.buttonText}
                      onChange={(e) =>
                        setLocalGifting({
                          ...localGifting,
                          buttonText: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1b3b27] text-white font-bold rounded-xl"
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
                  5. Customer Testimonials Reviews
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newReview.name || !newReview.review) return;
                    updateTestimonials([
                      ...testimonials,
                      { ...newReview, id: Date.now() },
                    ]);
                    setNewReview({
                      name: "",
                      location: "",
                      product: "",
                      rating: 5,
                      review: "",
                    });
                    alert("Customer testimonial added!");
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
                    placeholder="Location (e.g. Chennai)"
                    value={newReview.location}
                    onChange={(e) =>
                      setNewReview({ ...newReview, location: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Verified Product (e.g. A2 Ghee)"
                    value={newReview.product}
                    onChange={(e) =>
                      setNewReview({ ...newReview, product: e.target.value })
                    }
                    className="px-3 py-2 border rounded-xl bg-[#faf7f2]"
                  />
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      required
                      placeholder="Review Quote Description"
                      value={newReview.review}
                      onChange={(e) =>
                        setNewReview({ ...newReview, review: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="sm:col-span-3 py-2 bg-[#1b3b27] text-white font-bold rounded-xl"
                  >
                    Add Review
                  </button>
                </form>

                <div className="space-y-2 pt-2 text-xs">
                  {testimonials.map((t, idx) => (
                    <div
                      key={t.id}
                      className="p-3 border rounded-xl flex justify-between items-center bg-[#faf7f2]"
                    >
                      <div>
                        <b>{t.name}</b> from {t.location} ("
                        {t.review.slice(0, 45)}...")
                      </div>
                      <button
                        onClick={() =>
                          updateTestimonials(
                            testimonials.filter((_, i) => i !== idx),
                          )
                        }
                        className="text-rose-600 font-bold"
                      >
                        Remove
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
                    updateDiscountConfig(localDiscount);
                    alert("Discount popup updated!");
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">
                      Headline Text
                    </label>
                    <input
                      type="text"
                      value={localDiscount.headline}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          headline: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Subtext Description
                    </label>
                    <input
                      type="text"
                      value={localDiscount.subtext}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          subtext: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">Image URL</label>
                    <input
                      type="url"
                      value={localDiscount.image}
                      onChange={(e) =>
                        setLocalDiscount({
                          ...localDiscount,
                          image: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1b3b27] text-white font-bold rounded-xl"
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
                  7. Bottom Footer Section
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    updateFooterConfig(localFooter);
                    alert("Footer updated live!");
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold block mb-1">
                      Newsletter Headline
                    </label>
                    <input
                      type="text"
                      value={localFooter.headline}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          headline: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Farm Heritage Philosophy Statement
                    </label>
                    <textarea
                      rows="2"
                      value={localFooter.philosophy}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          philosophy: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">
                      Customer Support Phone
                    </label>
                    <input
                      type="text"
                      value={localFooter.phone || ""}
                      onChange={(e) =>
                        setLocalFooter({
                          ...localFooter,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-[#faf7f2]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 bg-[#1b3b27] text-white font-bold rounded-xl"
                  >
                    Save Footer Live
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: STORE MANAGER (INVENTORY, STOCK STATUS & ALERTS)          */}
        {/* ============================================================== */}
        {activeTab === "inventory" && (isStoreManager || isSuperAdmin) && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-[#e8e2d5] shadow-sm space-y-3">
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
                  className="py-2 bg-[#1b3b27] text-white font-bold rounded-xl"
                >
                  Notify Admin
                </button>
              </form>
            </div>

            {/* Catalog Stock Toggle List */}
            <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#e8e2d5]">
                <h3 className="font-serif text-base font-bold text-[#162a1e]">
                  Manage Catalog Stock ({products.length} Items)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#516859]">
                  <thead className="bg-[#faf7f2] font-semibold border-b">
                    <tr>
                      <th className="px-6 py-3">Product</th>
                      <th className="px-6 py-3">Price</th>
                      <th className="px-6 py-3">Availability Status</th>
                      <th className="px-6 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee8dd]">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="px-6 py-3 font-semibold text-[#162a1e]">
                          {p.name}
                        </td>
                        <td className="px-6 py-3">₹{p.price}</td>
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
                            onClick={() => deleteProduct(p.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-4 h-4 inline" />
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

        {/* ============================================================== */}
        {/* TAB: DISPATCH TEAM (ORDERS, PACKING TO DELIVERY)               */}
        {/* ============================================================== */}
        {activeTab === "dispatch" && (isDispatch || isSuperAdmin) && (
          <div className="bg-white rounded-3xl border border-[#e8e2d5] shadow-sm overflow-hidden">
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee8dd]">
                  {orders.map((ord) => (
                    <tr key={ord.trackingId}>
                      <td className="px-6 py-4 font-mono font-bold text-[#1b3b27]">
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
                          className="px-2 py-1 border rounded-lg bg-[#faf7f2] font-semibold text-[#1b3b27]"
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
                          placeholder="e.g. Packed at warehouse, In transit via Trichy Hub"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: SUPER ADMIN ANALYTICS & AUDIT                             */}
        {/* ============================================================== */}
        {activeTab === "super-analytics" && isSuperAdmin && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#e8e2d5] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#6d8274] block">
                  Total Orders
                </span>
                <p className="text-2xl font-serif font-bold text-[#162a1e]">
                  {orders.length}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-[#e8e2d5] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#6d8274] block">
                  Gross Revenue (COD)
                </span>
                <p className="text-2xl font-serif font-bold text-[#162a1e]">
                  ₹{totalRevenue}
                </p>
              </div>
              <div className="bg-white p-5 rounded-3xl border border-[#e8e2d5] shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#6d8274] block">
                  Out of Stock Count
                </span>
                <p className="text-2xl font-serif font-bold text-rose-600">
                  {outOfStockItems.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
