import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5005/api/orders/myorders', { withCredentials: true });
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-center py-20 text-xl font-bold">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">No orders found</h2>
          <Link to="/products" className="text-[#ff4e00] font-bold hover:text-[#e64600] hover:underline transition-colors">Go shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Order ID: {order._id}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#ff4e00]">₹{order.totalAmount.toLocaleString()}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${order.overallStatus === 'Delivered' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                    {order.overallStatus}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.vendorOrders.map((vo, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-xl p-4 bg-[#f8f8f8]">
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-200">
                      <span className="font-bold text-xs uppercase tracking-wider text-gray-500">Package {idx + 1}</span>
                      <span className="text-xs font-bold text-gray-900 bg-white px-2 py-1 rounded border border-gray-200">{vo.status}</span>
                    </div>
                    <div className="space-y-3">
                      {vo.items.map(item => (
                        <div key={item.productId?._id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 p-1 flex items-center justify-center">
                            <img src={item.productId?.images?.[0] || 'https://via.placeholder.com/50'} alt="product" className="w-full h-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.productId?.name || 'Deleted Product'}</p>
                            <p className="text-gray-400 text-xs font-semibold mt-0.5">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold text-sm text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
