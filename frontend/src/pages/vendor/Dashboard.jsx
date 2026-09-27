import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({ productCount: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('http://localhost:5002/api/vendors/dashboard', { withCredentials: true });
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const SidebarLink = ({ to, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${active ? 'bg-black text-white' : 'text-gray-500 hover:text-[#ff4e00] hover:bg-orange-50'}`}>
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/products" className="text-xl font-bold text-gray-900 tracking-tight">NovaTrend <span className="text-[#ff4e00]">Vendor</span></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-2">
          <SidebarLink to="/vendor/dashboard" label="Dashboard" active />
          <SidebarLink to="/vendor/products" label="Products" />
          <SidebarLink to="/vendor/orders" label="Orders" />
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-900 text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-bold text-gray-900 truncate uppercase tracking-wider">{user?.name}</p></div>
          </div>
          <button onClick={logout} className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back, <span className="font-bold text-gray-900">{user?.name}</span></p>
            </div>
            <Link to="/vendor/products?new=true" className="flex items-center gap-2 px-5 py-2.5 bg-[#ff4e00] text-white font-bold text-sm rounded-xl hover:bg-[#e64600] transition-colors shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              New Product
            </Link>
          </header>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(n => <div key={n} className="h-32 bg-white rounded-2xl animate-pulse border border-gray-100 shadow-sm"></div>)}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Revenue */}
                <div className="bg-black rounded-3xl p-6 text-white shadow-lg border border-gray-800">
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Revenue</p>
                  <p className="text-3xl font-black text-[#ff4e00]">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs mt-3 flex items-center gap-1 font-semibold">
                    <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    +12.5% this month
                  </p>
                </div>
                
                {/* Orders */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Orders</p>
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg></div>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-400 font-bold mt-3 hover:text-[#ff4e00] cursor-pointer transition-colors">View all orders →</p>
                </div>

                {/* Products */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Active Products</p>
                    <div className="w-8 h-8 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center"><svg className="w-4 h-4 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900">{stats.productCount}</p>
                  <p className="text-xs text-gray-400 font-bold mt-3">Across all categories</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6">Recent Activity</h3>
                <div className="text-center py-12 bg-[#f8f8f8] rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Activity feed will appear here as orders come in.</p>
                  <Link to="/vendor/products" className="text-[#ff4e00] text-sm font-bold mt-3 inline-block hover:text-[#e64600] transition-colors">Start by adding products →</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
