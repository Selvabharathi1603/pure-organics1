import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import DiscountModal from "../components/DiscountModal";
import StorefrontChatbot from "./StorefrontChatbor";

export default function ClientLayout() {
  const [isDiscountOpen, setIsDiscountOpen] = useState(false);

  useEffect(() => {
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
    <div className="flex flex-col min-h-screen bg-brand-bg text-brand-dark font-sans antialiased selection:bg-brand-green selection:text-white relative">
      <AnnouncementBar />
      <Navbar />
      <CartDrawer />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      <DiscountModal
        isOpen={isDiscountOpen}
        onClose={handleCloseDiscount}
        onSubmit={handleSubmitDiscount}
      />

      <StorefrontChatbot />
    </div>
  );
}
