import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
      <Router>
        <Routes>
          <Route element={<ClientLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/track" element={<TrackOrder />} />
          </Route>

          <Route path="/admin" element={<AdminLogin />} />

          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
}
