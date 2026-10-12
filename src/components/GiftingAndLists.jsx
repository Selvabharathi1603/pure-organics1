import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Gift, ArrowRight } from "lucide-react";
import { useStore } from "../context/storecontext";
import combosCoverImg from "../assets/image/COMBOS FOR YOU.jpeg";

const VALUE_COMBOS = [
  {
    id: "combo-1",
    name: "Pure Chekku Trio (1L x 3)",
    items: "Groundnut Oil + Sesame Oil + Coconut Oil",
    price: 940,
    originalPrice: 1040,
    badge: "Best Seller",
  },
  {
    id: "combo-2",
    name: "Village Sweetener Box",
    items: "Pure Wild Forest Honey (500g) + Palm Jaggery (1kg)",
    price: 620,
    originalPrice: 700,
    badge: "Save ₹80",
  },
  {
    id: "combo-3",
    name: "Traditional Millet & Rice Pack",
    items: "Karuppu Kavuni Rice (1kg) + Kodo Millet (1kg)",
    price: 360,
    originalPrice: 410,
    badge: "Healthy Choice",
  },
];

export default function GiftingAndLists() {
  const { products } = useStore();
  const featured = (products || []).slice(0, 3);
  const onSale = (products || []).slice(3, 6);

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isScratching = useRef(false);
  const [scratchProgress, setScratchProgress] = useState(0);

  // Responsive canvas render that preserves the image's original proportions
  const renderCanvasImage = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const img = new Image();
    img.src = combosCoverImg;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warm linen backdrop fills letterbox areas cleanly
      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawW, drawH, drawX, drawY;

      // Fit contained so nothing gets stretched or zoomed
      if (canvasRatio < imgRatio) {
        drawW = canvas.width;
        drawH = canvas.width / imgRatio;
        drawX = 0;
        drawY = (canvas.height - drawH) / 2;
      } else {
        drawH = canvas.height;
        drawW = canvas.height * imgRatio;
        drawX = (canvas.width - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    };

    img.onerror = () => {
      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
  }, [isRevealed]);

  useEffect(() => {
    renderCanvasImage();
    const handleResize = () => {
      if (!isRevealed) renderCanvasImage();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderCanvasImage, isRevealed]);

  // Scratch action
  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const x = (clientX - rect.left) * dpr;
    const y = (clientY - rect.top) * dpr;
    const radius = Math.max(34, Math.min(rect.width * 0.06, 56)) * dpr;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    checkScratchProgress();
  };

  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    const step = 128;

    for (let i = 3; i < pixels.length; i += 4 * step) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const totalSampled = pixels.length / (4 * step);
    const percent = Math.round((transparentCount / totalSampled) * 100);
    setScratchProgress(percent);

    if (percent > 30) {
      setIsRevealed(true);
    }
  };

  // Mouse handlers
  const handleMouseDown = (e) => {
    isScratching.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isScratching.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isScratching.current = false;
  };

  // Touch handlers
  const handleTouchStart = (e) => {
    isScratching.current = true;
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    if (!isScratching.current) return;
    if (e.cancelable) e.preventDefault();
    const touch = e.touches[0];
    scratch(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    isScratching.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-full overflow-hidden select-none font-sans"
    >
      {/* =========================================================================
          THE INNER COMPONENT: REVEALED ON SCRATCH
         ========================================================================= */}
      <section className="w-full bg-[#FAF9F5] border-y border-stone-200 py-10 sm:py-16 px-4 sm:px-8 lg:px-14 text-stone-900">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-stone-200 pb-5 text-left">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D97706] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full inline-block">
                Kitchen Essentials & Sets
              </span>
              <h2
                style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                className="text-2xl sm:text-4xl lg:text-5xl font-medium text-stone-950 mt-2 tracking-tight leading-tight"
              >
                Pantry Bundles &{" "}
                <span className="text-[#D97706] italic font-normal">
                  Daily Staples
                </span>
              </h2>
            </div>
            <Link
              to="/catalog"
              className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#D97706] transition-colors self-start sm:self-auto"
            >
              <span>Explore All Items</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Top Selling & Weekly Discounts */}
            <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col justify-between shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                {/* List 1 */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <h3
                      style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      className="text-base sm:text-lg font-medium text-stone-950 tracking-wide"
                    >
                      Top Selling Essentials
                    </h3>
                    <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase">
                      Daily Fresh
                    </span>
                  </div>

                  <div className="space-y-3">
                    {featured.map((p) => (
                      <Link
                        key={p.id}
                        to="/catalog"
                        className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all group"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate group-hover:text-[#D97706] transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 block mt-0.5 font-medium truncate">
                            {p.unit || "Standard Pack"}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-stone-950 mt-1 block">
                            ₹{p.price}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* List 2 */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                    <h3
                      style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                      className="text-base sm:text-lg font-medium text-stone-950 tracking-wide"
                    >
                      Weekly Batch Offers
                    </h3>
                    <span className="text-[10px] font-mono text-[#D97706] font-bold uppercase">
                      Direct Savings
                    </span>
                  </div>

                  <div className="space-y-3">
                    {onSale.map((p) => (
                      <Link
                        key={p.id}
                        to="/catalog"
                        className="flex items-center gap-3.5 p-2 rounded-2xl hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-all group"
                      >
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center p-1.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate group-hover:text-[#D97706] transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-[11px] text-stone-500 block mt-0.5 font-medium truncate">
                            {p.unit || "Standard Pack"}
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs sm:text-sm font-bold text-stone-950">
                              ₹{p.price}
                            </span>
                            <span className="text-[11px] text-stone-400 line-through">
                              ₹{Number(p.price) + 40}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600 text-left font-medium">
                <span>
                  Free doorstep shipping across Tamil Nadu on orders above ₹799
                </span>
                <span className="text-[#D97706] font-bold">
                  Cash On Delivery Available
                </span>
              </div>
            </div>

            {/* Right Column: Value Combos */}
            <div className="lg:col-span-4 rounded-2xl sm:rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-7 flex flex-col justify-between text-left shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#D97706] text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Gift className="w-3.5 h-3.5" />
                    Family Kitchen Combos
                  </span>
                  <span className="text-[10px] font-mono text-stone-500 font-bold">
                    Save on Sets
                  </span>
                </div>

                <div className="space-y-1">
                  <h3
                    style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                    className="text-xl sm:text-2xl font-medium text-stone-950 tracking-tight"
                  >
                    Value Combo Packs
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    Buy routine cooking pairs together and save directly on
                    packaging costs.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {VALUE_COMBOS.map((combo) => (
                    <div
                      key={combo.id}
                      className="bg-[#FAF9F5] border border-stone-200 hover:border-[#D97706] rounded-2xl p-3 sm:p-3.5 transition-all text-left shadow-2xs group"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h5
                          style={{ fontFamily: "'Newsreader', Georgia, serif" }}
                          className="text-sm font-medium text-stone-950 group-hover:text-[#D97706] transition-colors truncate"
                        >
                          {combo.name}
                        </h5>
                        <span className="text-[9px] font-mono font-bold bg-[#D97706] text-stone-950 px-2 py-0.5 rounded-full shrink-0">
                          {combo.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug line-clamp-1 mb-2 font-normal">
                        {combo.items}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-stone-950">
                            ₹{combo.price}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{combo.originalPrice}
                          </span>
                        </div>
                        <Link
                          to="/catalog"
                          className="text-[11px] font-bold text-[#D97706] hover:text-stone-950 transition-colors"
                        >
                          Order Pack →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-stone-100">
                <Link
                  to="/catalog"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-stone-900 hover:bg-[#D97706] text-white hover:text-stone-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>View All Combo Packs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300 group-hover:text-stone-950" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE CANVAS SCRATCH OVERLAY (CLEAN: NO TEXT OVERLAP)
         ========================================================================= */}
      {!isRevealed && (
        <div
          className={`absolute inset-0 z-30 touch-none select-none transition-opacity duration-700 ${
            scratchProgress > 30
              ? "opacity-0 pointer-events-none"
              : "opacity-100"
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair touch-none"
          />
        </div>
      )}
    </div>
  );
}
