import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const VendorOrders = () => {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5005/api/orders/vendor', { withCredentials: true });
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5005/api/orders/${orderId}/status`, { status }, { withCredentials: true });
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  const statusColors = {
    Pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Processing: 'bg-blue-50 text-blue-700 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
    Delivered: 'bg-green-50 text-green-700 border-green-200'
  };

  const SidebarLink = ({ to, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all ${active ? 'bg-black text-white' : 'text-gray-500 hover:text-[#ff4e00] hover:bg-orange-50'}`}>
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/products" className="text-xl font-bold text-gray-900 tracking-tight">NovaTrend <span className="text-[#ff4e00]">Vendor</span></Link>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-2">
          <SidebarLink to="/vendor/dashboard" label="Dashboard" />
          <SidebarLink to="/vendor/products" label="Products" />
          <SidebarLink to="/vendor/orders" label="Orders" active />
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

      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto animate-fade-in">
          <header className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
            <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-wider">{orders.length} orders received</p>
          </header>

          {loading ? (
            <div className="space-y-4">{[1,2,3].map(n => <div key={n} className="h-32 bg-white rounded-3xl animate-pulse border border-gray-200"></div>)}</div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 text-center py-24">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-100">
                <svg className="w-8 h-8 text-[#ff4e00]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-sm font-medium text-gray-500">Orders will appear here once customers start purchasing your products.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 bg-[#f8f8f8]">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ORDER #{order._id.slice(-8)}</p>
                      <p className="text-sm font-bold text-gray-900 mt-1">Customer: {order.userId?.name || 'Unknown'}</p>
                      <p className="text-xs font-semibold text-gray-500">{order.userId?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 text-[10px] font-bold rounded uppercase tracking-wider border ${statusColors[order.vendorOrders[0]?.status] || statusColors.Pending}`}>
                        {order.vendorOrders[0]?.status}
                      </span>
                      <select 
                        className="text-xs font-bold border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-[#ff4e00] outline-none cursor-pointer hover:border-gray-300 transition-colors"
                        value={order.vendorOrders[0]?.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {order.vendorOrders[0]?.items.map(item => (
                      <div key={item.productId?._id} className="flex items-center gap-4 py-2">
                        <div className="w-16 h-16 bg-white border border-gray-100 p-1 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.productId?.images?.[0] ? (
                            <img src={item.productId.images[0]} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                          ) : (
                            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-900">{item.productId?.name || 'Deleted Product'}</p>
                          <p className="text-xs font-semibold text-gray-400 mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <p className="text-base font-black text-[#ff4e00]">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorOrders;
