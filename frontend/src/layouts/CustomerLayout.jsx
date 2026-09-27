import { Outlet, Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const CustomerLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItemCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Strip Removed */}

      {/* Main Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo */}
            <Link to="/products" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 tracking-tight">NovaTrend</span>
            </Link>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link to="/products" className={`transition-colors hover:text-[#ff4e00] ${isActive('/products') && !location.search ? 'text-[#ff4e00] border-b-2 border-[#ff4e00] pb-1' : ''}`}>Home</Link>
              <Link to="/products" className={`transition-colors hover:text-[#ff4e00] ${location.search.includes('search=') ? 'text-[#ff4e00] border-b-2 border-[#ff4e00] pb-1' : ''}`}>Shop</Link>
              <Link to="/products?sort=newest" className={`transition-colors hover:text-[#ff4e00] ${location.search.includes('sort=newest') ? 'text-[#ff4e00] border-b-2 border-[#ff4e00] pb-1' : ''}`}>New Arrivals</Link>
              <Link to="/products?sort=price-high" className={`transition-colors hover:text-[#ff4e00] ${location.search.includes('sort=price-high') ? 'text-[#ff4e00] border-b-2 border-[#ff4e00] pb-1' : ''}`}>Best Sellers</Link>
              <Link to="/products?category=Electronics" className={`transition-colors hover:text-[#ff4e00] ${location.search.includes('category=') ? 'text-[#ff4e00] border-b-2 border-[#ff4e00] pb-1' : ''}`}>Categories</Link>
            </div>

            {/* Right: Icons */}
            <div className="flex items-center gap-4">
              <Link to="/products" className="text-gray-900 hover:text-[#ff4e00] transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg></Link>
              <Link to="/products" className="text-gray-900 hover:text-[#ff4e00] transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></Link>
              
              {/* User */}
              {user ? (
                <div className="relative group">
                  <button className="text-gray-900 hover:text-[#ff4e00] transition-colors flex items-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </button>
                  <div className="absolute right-0 top-full pt-4 w-48 origin-top-right outline-none hidden group-hover:block z-50">
                    <div className="bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                      </div>
                      <Link to="/orders" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">My Orders</Link>
                      <button onClick={logout} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100">Sign out</button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-gray-900 hover:text-[#ff4e00] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-gray-900 hover:text-[#ff4e00] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#ff4e00] rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="bg-black text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <Link to="/products" className="flex-shrink-0 flex items-center mb-6">
                <span className="text-xl font-bold text-white tracking-tight">NovaTrend</span>
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">Your trusted multi-vendor marketplace. Shop from independent sellers worldwide with a curated minimalist experience.</p>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3 text-sm"><li><Link to="/products" className="hover:text-[#ff4e00] transition-colors">All Products</Link></li><li><Link to="/cart" className="hover:text-[#ff4e00] transition-colors">Shopping Cart</Link></li><li><Link to="/orders" className="hover:text-[#ff4e00] transition-colors">My Orders</Link></li></ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Support</h4>
              <ul className="space-y-3 text-sm"><li><a href="#" className="hover:text-[#ff4e00] transition-colors">Help Center</a></li><li><a href="#" className="hover:text-[#ff4e00] transition-colors">Contact Us</a></li><li><a href="#" className="hover:text-[#ff4e00] transition-colors">Return Policy</a></li></ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-wider">
            <p>&copy; 2026 NovaTrend. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
