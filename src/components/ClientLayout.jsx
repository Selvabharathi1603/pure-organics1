import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import DiscountModal from "../components/DiscountModal";

export default function ClientLayout() {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  useEffect(() => {
    // Show discount popup gracefully after 2.5s instead of instant flash
    const timer = setTimeout(() => {
      const alreadyClosed = sessionStorage.getItem(
        "organic_discount_dismissed",
      );
      if (!alreadyClosed) {
        setIsDiscountOpen(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseDiscount = () => {
    setIsDiscountOpen(false);
    sessionStorage.setItem("organic_discount_dismissed", "true");
  };

  const handleSubmitDiscount = (formData) => {
    console.log("Discount form lead captured:", formData);
    setIsDiscountOpen(false);
    sessionStorage.setItem("organic_discount_dismissed", "true");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#faf7f2] text-[#1b2e23] antialiased selection:bg-[#2d5a3f] selection:text-white">
      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Floating Botanical Navbar */}
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Discount Form Modal */}
      <DiscountModal
        isOpen={isDiscountOpen}
        onClose={handleCloseDiscount}
        onSubmit={handleSubmitDiscount}
      />
    </div>
  );
}
