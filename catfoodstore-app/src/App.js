import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';

// Pages
import HomePage from './pages/HomePage';
import NotFound from './components/NotFound';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GuidePage from "./pages/GuidePage";
import ProductPage from "./pages/ProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import ReceiptPage from "./pages/ReceiptPage";
import LoginPage from "./pages/LoginPage";

// Admin
import AdminProductsPage from "./pages/AdminProductsPage";

import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <div className="App">

      {/* TEST TAILWIND */}
      <div className="bg-blue-500 h-10 text-white flex items-center justify-center">
        TEST TAILWIND
      </div>

      <Navbar />

      <ScrollToTop />   {/* ⭐ ทำให้ทุกหน้าเด้งขึ้นบนสุด */}

      <main className="main-content min-h-screen px-4 py-6">
        <Routes>

          {/* Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Category */}
          <Route path="/category/:categoryName" element={<CategoryPage />} />

          {/* Static pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/guide" element={<GuidePage />} />

          {/* Product listing */}
          <Route path="/products" element={<ProductPage />} />

          {/* ⭐ Product detail (ต้องตรงกับลิงก์ทั้งหมดในระบบ) */}
          <Route path="/products/:id" element={<ProductDetailPage />} />

          {/* Cart & Payment */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<ReceiptPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin */}
          <Route path="/admin/products" element={<AdminProductsPage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </main>

    </div>
  );
}

export default App;
