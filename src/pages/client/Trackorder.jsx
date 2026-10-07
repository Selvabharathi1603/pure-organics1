import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ArrowLeft,
  Truck,
  AlertCircle,
  MapPin,
  Package,
} from "lucide-react";
import { useStore } from "../../context/storecontext";
import TrackingStepper from "../../components/TrackingStepper";

export default function TrackOrder() {
  const { orders } = useStore();
  const [query, setQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchTerm = query.trim().toUpperCase();
    const found = (orders || []).find(
      (ord) =>
        (ord.trackingId || ord.tracking_id)?.toUpperCase() === searchTerm,
    );

    if (found) {
      setSearchedOrder(found);
      setErrorMsg("");
    } else {
      setSearchedOrder(null);
      setErrorMsg(
        `No order found matching "${query.trim()}". Please verify your ID.`,
      );
    }
  };

  const orderItems = Array.isArray(searchedOrder?.items)
    ? searchedOrder.items
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans select-none text-left bg-white text-stone-900 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-amber-50 text-[#D97706] border border-amber-200">
          <Truck className="w-3.5 h-3.5" /> Order Status
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-medium">
          Enter your Tracking ID to view real-time packing and shipping updates.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 sm:p-7 rounded-3xl border border-stone-200 shadow-xs max-w-2xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Tracking ID (e.g., PO-123456)"
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-2xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#D97706] font-mono transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-stone-900 hover:bg-[#D97706] hover:text-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            Track Order
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-stone-100 border border-stone-300 text-stone-900 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Searched Order Output */}
      {searchedOrder && (
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-stone-400 block">
                  Tracking ID
                </span>
                <span className="font-mono text-xl font-bold text-stone-900 tracking-wider">
                  {searchedOrder.trackingId || searchedOrder.tracking_id}
                </span>
              </div>
              <span className="self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-50 text-[#D97706] border border-amber-200">
                Status: {searchedOrder.status || "Placed"}
              </span>
            </div>

            <TrackingStepper currentStatus={searchedOrder.status || "Placed"} />

            {/* Checkpoint / Dispatch Note */}
            {(searchedOrder.dispatchNote || searchedOrder.dispatch_note) && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D97706] shrink-0" />
                <div className="text-xs text-stone-700">
                  <span className="font-bold text-stone-900">
                    Dispatch Note:{" "}
                  </span>
                  {searchedOrder.dispatchNote || searchedOrder.dispatch_note}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order Items */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-stone-400">
                Order Items
              </h3>

              {orderItems.length > 0 ? (
                <div className="divide-y divide-stone-100">
                  {orderItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="py-2.5 flex justify-between items-center text-xs"
                    >
                      <span className="text-stone-900 font-medium">
                        {item.name}{" "}
                        <span className="text-stone-400 font-mono">
                          ({item.unit || "Pack"}) × {item.qty || 1}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹{Number(item.price || 0) * Number(item.qty || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-xs text-stone-500 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D97706]" />
                  <span>Items confirmed and recorded in packing manifest.</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-100 flex justify-between items-center text-sm font-bold">
                <span className="text-stone-500">Total Amount:</span>
                <span className="text-lg font-black text-stone-900 font-mono">
                  ₹{searchedOrder.total || searchedOrder.total_amount || 0}
                </span>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-3">
              <h3 className="text-xs uppercase font-mono tracking-widest font-bold text-stone-400">
                Delivery Details
              </h3>
              <div className="text-xs space-y-2 text-stone-700">
                <p>
                  <span className="text-stone-400">Recipient:</span>{" "}
                  <span className="font-semibold text-stone-900">
                    {searchedOrder.customer?.name ||
                      searchedOrder.customer_name ||
                      "Customer"}
                  </span>
                </p>
                <p>
                  <span className="text-stone-400">Phone:</span>{" "}
                  <span className="font-semibold text-stone-900">
                    {searchedOrder.customer?.phone ||
                      searchedOrder.customer_phone ||
                      "On File"}
                  </span>
                </p>
                <p>
                  <span className="text-stone-400">Address:</span>{" "}
                  <span className="font-semibold text-stone-900">
                    {searchedOrder.customer?.address ||
                      searchedOrder.customer_address ||
                      "Registered Address"}
                  </span>
                </p>
                <p className="text-[#D97706] font-bold pt-1">
                  Payment:{" "}
                  {searchedOrder.paymentMethod ||
                    searchedOrder.payment_method ||
                    "Cash on Delivery"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Link */}
      <div className="text-center pt-2">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-800 hover:text-[#D97706] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    </div>
  );
}
