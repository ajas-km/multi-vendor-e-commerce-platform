import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CustomerLayout from './layouts/CustomerLayout';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorOrders from './pages/vendor/Orders';
import VendorLayout from './layouts/VendorLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAds from './pages/admin/Ads';
import AdminDiscounts from './pages/admin/Discounts';
import AdminReviews from './pages/admin/Reviews';

function App() {
  return (
    <div className="font-sans text-gray-900 antialiased min-h-screen bg-gray-900">
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Vendor Routes */}
        <Route element={<VendorLayout />}>
          <Route path="/vendor/dashboard" element={<VendorDashboard />} />
          <Route path="/vendor/products" element={<VendorProducts />} />
          <Route path="/vendor/orders" element={<VendorOrders />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/ads" element={<AdminAds />} />
          <Route path="/admin/discounts" element={<AdminDiscounts />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>

        {/* Customer Routes with Layout */}
        <Route element={<CustomerLayout />}>
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
