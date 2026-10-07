import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { StoreProvider } from "./context/storecontext";

import ClientLayout from "./components/ClientLayout";

import Home from "./pages/client/Home";
import Shop from "./pages/client/Shop";
import Cart from "./pages/client/Cart";
import TrackOrder from "./pages/client/Trackorder";
import AdminLogin from "./pages/Admin/AdminLogin";

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-stone-50 text-stone-900 antialiased font-sans selection:bg-amber-100 selection:text-amber-900">
        <Router>
          <Routes>
            {/* Client Public Routes */}
            <Route element={<ClientLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/track" element={<TrackOrder />} />
            </Route>

            {/* Admin Protected Portal */}
            <Route path="/admin" element={<AdminLogin />} />

            {/* Fallback - Redirect non-matching routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </StoreProvider>
  );
}
