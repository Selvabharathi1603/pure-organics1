import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Compass,
  PackageCheck,
  AlertCircle,
  MapPin,
  PackageOpen,
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

    const found = orders.find(
      (ord) => ord.trackingId?.toUpperCase() === query.trim().toUpperCase(),
    );

    if (found) {
      setSearchedOrder(found);
      setErrorMsg("");
    } else {
      setSearchedOrder(null);
      setErrorMsg(`No active harvest order found for "${query.trim()}".`);
    }
  };

  const orderItems = Array.isArray(searchedOrder?.items)
    ? searchedOrder.items
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
          <PackageCheck className="w-3.5 h-3.5 text-[#2e7d4d]" /> Live Farm
          Dispatch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#162a1e]">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-[#5c7365]">
          Enter your Order ID (e.g. ORG-123456) to monitor packaging and
          delivery milestones.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e2d5] shadow-sm max-w-2xl mx-auto">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8e9f93]" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Tracking ID (e.g. ORG-123456)"
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-[#faf7f2] border border-[#dcd4c7] rounded-2xl text-[#162a1e] placeholder-[#8e9f93] focus:outline-none focus:border-[#2e7d4d] font-mono transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-7 py-3 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer shrink-0"
          >
            Track Status
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Searched Order Result */}
      {searchedOrder && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#eee8dd] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#738d81] block">
                  Tracking ID
                </span>
                <span className="font-mono text-xl font-bold text-[#1b3b27]">
                  {searchedOrder.trackingId}
                </span>
              </div>
              <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
                Status: {searchedOrder.status || "Placed"}
              </span>
            </div>

            <TrackingStepper currentStatus={searchedOrder.status || "Placed"} />

            {/* Live Transit Checkpoint */}
            {searchedOrder.dispatchNote && (
              <div className="p-4 rounded-2xl bg-[#edf5ef] border border-[#cbe1d2] flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#2e7d4d] shrink-0" />
                <div className="text-xs text-[#162a1e]">
                  <span className="font-bold text-[#1b3b27]">
                    Transit Checkpoint:{" "}
                  </span>
                  {searchedOrder.dispatchNote}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1b3b27]">
                Ordered Items
              </h3>

              {orderItems.length > 0 ? (
                <div className="divide-y divide-[#f2ece2]">
                  {orderItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="py-2.5 flex justify-between items-center text-xs"
                    >
                      <span className="text-[#162a1e]">
                        {item.name}{" "}
                        <span className="text-[#738d81]">
                          ({item.unit || "Standard"}) × {item.qty || 1}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-[#162a1e]">
                        ₹{Number(item.price || 0) * Number(item.qty || 1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-xs text-[#738d81] flex items-center gap-2">
                  <PackageOpen className="w-4 h-4 text-[#2e7d4d]" />
                  <span>Farm items verified in central manifest.</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#eee8dd] flex justify-between items-center text-sm font-bold">
                <span className="text-[#6d8274]">Total Amount:</span>
                <span className="font-serif text-lg text-[#1b3b27]">
                  ₹{searchedOrder.total || 0}
                </span>
              </div>
            </div>

            <div className="bg-white border border-[#e8e2d5] rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#1b3b27]">
                Delivery Details
              </h3>
              <div className="text-xs space-y-2 text-[#162a1e]">
                <p>
                  <span className="text-[#738d81]">Recipient:</span>{" "}
                  {searchedOrder.customer?.name || "Verified Customer"}
                </p>
                <p>
                  <span className="text-[#738d81]">Phone:</span>{" "}
                  {searchedOrder.customer?.phone || "On File"}
                </p>
                <p>
                  <span className="text-[#738d81]">Address:</span>{" "}
                  {searchedOrder.customer?.address || "Registered Address"}
                </p>
                <p className="text-[#2e7d4d] font-semibold pt-1">
                  Payment Method: Cash on Delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1b3b27] hover:text-[#2e7d4d] transition-colors"
        >
          <Compass className="w-4 h-4 text-[#c58f38]" /> Back to Catalog
        </Link>
      </div>
    </div>
  );
}
