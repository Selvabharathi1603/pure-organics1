import React from "react";
import { Printer, X, CheckCircle2, Leaf } from "lucide-react";

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      {/* Modal Dialog Card */}
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Top Controls Bar - Hidden during printing */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#faf7f2] print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-[#1b3b27]">
              Customer Tax Invoice
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1b3b27] hover:bg-[#255236] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div
          id="printable-invoice"
          className="p-6 sm:p-10 overflow-y-auto print:p-0 print:overflow-visible text-stone-800 font-sans text-xs space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#1b3b27]">
                <Leaf className="w-6 h-6 text-[#2e7d4d]" />
                <span className="font-serif text-2xl font-bold tracking-tight">
                  Pure Organics
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                Direct Native Harvests & Cold-Pressed Produce
              </p>
              <p className="text-[11px] text-stone-500">
                Tamil Nadu, India • contact@pureorganics.in
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#edf5ef] text-[#2e7d4d] border border-[#cbe1d2]">
                Order Confirmed
              </span>
              <p className="text-stone-500 text-[11px] pt-1">
                Invoice Date:{" "}
                <strong className="text-stone-800">
                  {order.date || new Date().toLocaleDateString("en-IN")}
                </strong>
              </p>
              <p className="text-stone-500 text-[11px]">
                Tracking ID:{" "}
                <strong className="font-mono text-stone-800">
                  {order.trackingId}
                </strong>
              </p>
            </div>
          </div>

          {/* Billing & Shipping Meta */}
          <div className="grid grid-cols-2 gap-6 bg-[#faf7f2] p-4 rounded-2xl border border-stone-200 print:bg-white print:border-stone-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-bold text-stone-800 text-sm">
                {order.customer?.name}
              </p>
              <p className="text-stone-600 mt-0.5">{order.customer?.phone}</p>
              <p className="text-stone-600 mt-0.5 leading-relaxed whitespace-pre-line">
                {order.customer?.address}
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                Payment Details:
              </span>
              <p className="font-bold text-stone-800">
                {order.paymentMethod || "Cash on Delivery (COD)"}
              </p>
              {order.paymentRef && (
                <p className="text-[11px] font-mono text-stone-500 mt-0.5">
                  Ref: {order.paymentRef}
                </p>
              )}
              <p className="text-[11px] text-stone-600 mt-1">
                Fulfillment: <strong>Farm Hub Dispatch</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  <th className="py-2.5">Item Description</th>
                  <th className="py-2.5 text-center">Unit</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Price</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items?.map((item) => (
                  <tr key={item.id} className="text-xs">
                    <td className="py-3 font-semibold text-stone-800">
                      {item.name}
                    </td>
                    <td className="py-3 text-center text-stone-500">
                      {item.unit}
                    </td>
                    <td className="py-3 text-center font-bold text-stone-800">
                      {item.qty || 1}
                    </td>
                    <td className="py-3 text-right text-stone-600">
                      ₹{item.price}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-stone-900">
                      ₹{item.price * (item.qty || 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="border-t border-stone-300 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-mono">₹{order.subtotal}</span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Harvest Discount ({order.couponCode}):</span>
                  <span className="font-mono">-₹{order.discount}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>Farm Shipping:</span>
                <span className="text-emerald-700 font-semibold">
                  Free Delivery
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-[#1b3b27] pt-2 border-t border-stone-300">
                <span>Total Amount:</span>
                <span className="font-serif text-lg">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Invoice Footer / Packing Slip Note */}
          <div className="border-t border-dashed border-stone-300 pt-4 text-center text-[10px] text-stone-400 space-y-1">
            <p>
              Thank you for supporting regenerative agriculture and native
              chemical-free harvests.
            </p>
            <p>
              For parcel queries or farm support, please reference your Tracking
              ID:{" "}
              <span className="font-mono text-stone-600 font-semibold">
                {order.trackingId}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
