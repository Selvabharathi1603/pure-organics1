import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  ShoppingBag,
  Check,
  RotateCcw,
} from "lucide-react";
import { useStore } from "../context/storecontext";

export default function StorefrontChatbot() {
  const { products, addToCart, openCart } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Vanakkam! I am Nila, your pantry assistant. Ask me anything about cold-pressed oils, Karuppu Kavuni rice, native millets, or raw forest honey.",
      suggestedProducts: [],
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [addedItemMap, setAddedItemMap] = useState({});
  const messagesEndRef = useRef(null);

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

  // Autonomous tri-lingual NLP matcher for English, Tamil script, and Tanglish
  const processAssistantQuery = (text) => {
    const q = (text || "").toLowerCase().trim();
    let reply =
      "Vanakkam! I can guide you through our cold-pressed wood chekku oils, unpolished heritage rice varieties, native millets, and wild forest honey. Which product would you like to know about?";
    let recs = [];

    // 1. Karuppu Kavuni & Heritage Rice
    if (
      q.includes("kavuni") ||
      q.includes("black rice") ||
      q.includes("arisi") ||
      q.includes("rice") ||
      q.includes("அரிசி") ||
      q.includes("கவுனி")
    ) {
      reply =
        "Karuppu Kavuni is our heritage black rice packed with high anthocyanin antioxidants, iron, and fiber. It helps in diabetes management and boosting immunity. Available in 1kg direct-mill harvest packs at ₹160.";
      recs = (products || []).filter((p) =>
        (p.name || "").toLowerCase().includes("kavuni"),
      );
    }
    // 2. Cold-Pressed Wood Chekku Oils
    else if (
      q.includes("oil") ||
      q.includes("ennai") ||
      q.includes("chekku") ||
      q.includes("cooking") ||
      q.includes("frying") ||
      q.includes("samayal") ||
      q.includes("எண்ணெய்") ||
      q.includes("செக்கு")
    ) {
      reply =
        "For daily cooking and deep frying, our cold-pressed groundnut oil is ideal due to its high smoke point. For traditional seasoning and aromatic flavor, wood-pressed gingelly oil is best. Both are 100% unrefined and chemical-free.";
      recs = (products || [])
        .filter(
          (p) =>
            (p.category || "").toLowerCase().includes("oil") ||
            (p.name || "").toLowerCase().includes("oil"),
        )
        .slice(0, 2);
    }
    // 3. Raw Forest Honey & Natural Sweeteners
    else if (
      q.includes("honey") ||
      q.includes("then") ||
      q.includes("sweet") ||
      q.includes("karupatti") ||
      q.includes("vellam") ||
      q.includes("jaggery") ||
      q.includes("தேன்") ||
      q.includes("கருப்பட்டி")
    ) {
      reply =
        "Our wild forest honey is 100% raw, unprocessed, and multi-floral, harvested directly by native tribal beekeepers in the Western Ghats without added sugar syrup or heat treatment.";
      recs = (products || []).filter((p) =>
        (p.name || "").toLowerCase().includes("honey"),
      );
    }
    // 4. Native Millets / Sirudhaniyangal
    else if (
      q.includes("millet") ||
      q.includes("thinai") ||
      q.includes("varagu") ||
      q.includes("kambu") ||
      q.includes("samai") ||
      q.includes("sirudhaniyam") ||
      q.includes("திணை") ||
      q.includes("வரகு")
    ) {
      reply =
        "We stock unpolished native millets like thinai, varagu, kambu, and samai. They are rich in dietary fiber, low in glycemic index, and ideal for a low-carb diet.";
      recs = (products || [])
        .filter(
          (p) =>
            (p.category || "").toLowerCase().includes("millet") ||
            (p.name || "").toLowerCase().includes("millet"),
        )
        .slice(0, 2);
    }

    // Fallback product fallback if no exact category matches
    if (recs.length === 0 && (products || []).length > 0) {
      recs = products.slice(0, 1);
    }

    return { reply, recs };
  };

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || loading) return;

    const userText = inputMsg.trim();
    const userMessage = { id: Date.now(), sender: "user", text: userText };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMsg("");
    setLoading(true);

    // Natural processing simulation (instant response without 404 network failure)
    setTimeout(() => {
      const { reply, recs } = processAssistantQuery(userText);
      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        suggestedProducts: recs,
      };

      setMessages((prev) => [...prev, botReply]);
      setLoading(false);
    }, 450);
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "bot",
        text: "Conversation refreshed. How can I help you with your groceries today?",
        suggestedProducts: [],
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] select-none font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-stone-900 text-white rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.25)] hover:bg-[#D97706] hover:text-black transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-stone-800"
          aria-label="Open Store Assistant"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-stone-800 group-hover:bg-black/20 flex items-center justify-center border border-stone-700">
              <MessageSquare className="w-4 h-4 text-[#D97706] group-hover:text-black" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D97706]"></span>
            </span>
          </div>

          <div className="text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 group-hover:text-black/80 block leading-none font-bold">
              Store Help
            </span>
            <span className="text-xs font-bold tracking-tight block mt-0.5">
              Ask Nila
            </span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl border border-stone-300 shadow-[0_24px_60px_rgba(0,0,0,0.22)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-stone-950 text-white px-5 py-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-2xl bg-stone-800 flex items-center justify-center border border-stone-700 shadow-inner">
                  <MessageSquare className="w-4 h-4 text-[#D97706]" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#D97706] ring-2 ring-stone-950"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold tracking-tight text-white">
                    Nila • Pantry Assistant
                  </h3>
                </div>
                <p className="text-[10px] text-stone-400 font-mono">
                  Cold-Pressed Oils &amp; Whole Staples
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={clearChat}
                title="Restart chat"
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50">
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
                    <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#D97706] shrink-0 mt-0.5">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-stone-900 text-white rounded-tr-xs shadow-xs font-medium"
                        : "bg-white text-stone-900 border border-stone-200 rounded-tl-xs shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>

                {/* In-Chat Product Recommendation Cards */}
                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="mt-2.5 w-full pl-8 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                      Recommended From Store
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {m.suggestedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2.5 bg-white rounded-xl border border-stone-200 shadow-xs flex items-center justify-between gap-3 hover:border-[#D97706] transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-50 text-[#D97706] font-bold inline-block mb-0.5 border border-amber-200">
                              {prod.category}
                            </span>
                            <h4 className="text-xs font-bold text-stone-900 truncate">
                              {prod.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-xs font-extrabold text-stone-900 font-mono">
                                ₹{prod.price}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">
                                • {prod.unit || "1 Unit"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddToCartFromBot(prod)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                              addedItemMap[prod.id]
                                ? "bg-[#D97706] text-black font-extrabold"
                                : "bg-stone-900 hover:bg-[#D97706] hover:text-black text-white shadow-2xs active:scale-95"
                            }`}
                          >
                            {addedItemMap[prod.id] ? (
                              <>
                                <Check className="w-3.5 h-3.5 stroke-[3]" />{" "}
                                Added
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
              <div className="flex gap-2.5 items-center text-stone-500 text-xs pl-8">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D97706]" />
                <span className="text-[11px] font-mono text-stone-600">
                  Checking catalog details...
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3.5 py-2 bg-white border-t border-stone-200 flex gap-1.5 overflow-x-auto scrollbar-none">
            {[
              "Best oil for daily cooking?",
              "Karuppu Kavuni rice details?",
              "Which oil is best for deep frying?",
              "Do you have raw forest honey?",
            ].map((prompt) => (
              <button
                type="button"
                key={prompt}
                onClick={() => {
                  setInputMsg(prompt);
                }}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-[10px] font-semibold text-stone-700 rounded-lg whitespace-nowrap cursor-pointer transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask about oils, rice, or millets..."
              className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#D97706] placeholder-stone-400"
            />
            <button
              type="submit"
              disabled={loading || !inputMsg.trim()}
              className={`p-2.5 rounded-xl bg-stone-900 text-white hover:bg-[#D97706] hover:text-black transition-all cursor-pointer ${
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
