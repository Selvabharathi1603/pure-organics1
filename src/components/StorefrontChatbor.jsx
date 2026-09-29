import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Loader2,
  User,
  ShoppingBag,
  Check,
  ChevronRight,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function StorefrontChatbot() {
  const { products, addToCart, openCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Vanakkam! 🌿 I am **Nila**, your Pure Organics Sommelier. Ask me anything about native heritage grains, chekku oils, or gut-friendly meal planning.",
      suggestedProducts: [],
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});
  const messagesEndRef = useRef(null);

  const API_BASE_URL = "https://pure-organics1.onrender.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, loading]);

  const handleAddToCartFromBot = (prod) => {
    addToCart(prod);
    setAddedItemMap((prev) => ({ ...prev, [prod.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [prod.id]: false }));
    }, 2000);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    const userMessage = { id: Date.now(), sender: "user", text: userText };

    // Update conversation state
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMsg("");
    setLoading(true);

    try {
      // 2026 Trend: Format previous turns to provide conversational memory
      const conversationHistory = updatedMessages.slice(-6).map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const response = await fetch(`${API_BASE_URL}/api/ai/assistant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: conversationHistory,
          catalog: (products || []).map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            unit: p.unit || "1 Unit",
            category: p.category,
            inStock: p.inStock !== false && p.in_stock !== false,
          })),
        }),
      });

      if (!response.ok) throw new Error("Assistant response failure");

      const data = await response.json();

      // Match recommended products from live store context
      const matchedProducts = (data.recommendedProductIds || [])
        .map((id) => products.find((p) => String(p.id) === String(id)))
        .filter(Boolean);

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.reply ||
          "Let me know how else I can assist your wellness journey!",
        suggestedProducts: matchedProducts,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "I am having a momentary connection glitch with the farm database. Feel free to re-ask or browse our catalog directly!",
          suggestedProducts: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Conversation refreshed. How may I guide your native pantry selections today?",
        suggestedProducts: [],
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] select-none font-sans">
      {/* 2026 Floating Smart Widget Trigger */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#1b3b27] via-[#244f34] to-[#1b3b27] text-white rounded-full shadow-[0_12px_32px_rgba(27,59,39,0.35)] hover:shadow-[0_16px_40px_rgba(27,59,39,0.45)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-emerald-500/20"
          aria-label="Open Farm Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/40">
              <Sparkles className="w-4 h-4 text-[#e6b95c] animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <div className="text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300/90 block leading-none">
              AI Sommelier
            </span>
            <span className="text-xs font-bold tracking-tight text-white block mt-0.5">
              Ask Nila
            </span>
          </div>
        </button>
      )}

      {/* 2026 Chat Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-white/95 backdrop-blur-md rounded-3xl border border-[#e4ded5] shadow-[0_24px_60px_rgba(20,40,28,0.22)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-[#173322] text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900/60">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                  <Sparkles className="w-4 h-4 text-[#ecd18b]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#173322]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight">
                    Nila • Farm Sommelier
                  </h3>
                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-mono rounded border border-emerald-500/30 font-semibold">
                    v2.6
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80 font-mono">
                  100% Native Wood-Pressed & Heirloom Grains
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Restart chat"
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf8f5]/80">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${
                    m.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-lg bg-[#edf5ef] border border-[#cbe1d2] flex items-center justify-center text-[#1b3b27] shrink-0 mt-0.5">
                      <Sparkles className="w-3 h-3 text-[#2e7d4d]" />
                    </div>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-[#1b3b27] text-white rounded-tr-xs shadow-xs font-medium"
                        : "bg-white text-slate-800 border border-[#e8e2d8] rounded-tl-xs shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>

                {/* 2026 Trend: In-Chat Product Cards */}
                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="mt-2.5 w-full pl-8 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#2e7d4d] block">
                      Recommended Native Harvest
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {m.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 bg-white rounded-xl border border-emerald-100/80 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 font-semibold inline-block mb-0.5">
                              {prod.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-extrabold text-[#1b3b27]">
                                ₹{prod.price}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                • {prod.unit || "1 Unit"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCartFromBot(prod)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                              addedItemMap[prod.id]
                                ? "bg-emerald-600 text-white"
                                : "bg-[#1b3b27] hover:bg-[#255236] text-white shadow-2xs active:scale-95"
                            }`}
                          >
                            {addedItemMap[prod.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Added
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" /> Add
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-500 text-xs pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#2e7d4d]" />
                <span className="italic text-[11px] font-mono text-emerald-800">
                  Checking current harvest & recipes...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 2026 Trend: Smart Prompt Suggestions */}
          <div className="px-3.5 py-2 bg-white/80 border-t border-[#e8e2d8] flex gap-1.5 overflow-x-auto scrollbar-none">
            {[
              "Best oil for daily cooking?",
              "Karuppu Kavuni benefits?",
              "Recommend diabetic-friendly rice",
              "Which oil for hair growth?",
            ].map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => {
                  setInputMsg(prompt);
                }}
                className="px-2.5 py-1 bg-[#faf7f2] hover:bg-[#edf5ef] border border-[#e8e2d8] text-[10px] font-medium text-slate-600 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Footer Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-[#e8e2d8] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about native staples, cold-pressed oils..."
              className="flex-1 px-3.5 py-2.5 bg-[#faf7f2] border border-[#dcd4c7] rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#2e7d4d] placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className={`p-2.5 rounded-xl bg-[#1b3b27] text-white hover:bg-[#255236] transition-all cursor-pointer ${
                loading || !inputMsg.trim()
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
