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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders found</h2>
          <Link to="/products" className="text-indigo-600 font-bold hover:underline">Go shopping</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">Total: ₹{order.totalAmount.toLocaleString()}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.overallStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {order.overallStatus}
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {order.vendorOrders.map((vo, idx) => (
                  <div key={idx} className="border border-gray-50 rounded-xl p-4 bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">Package {idx + 1} Status:</span>
                      <span className="text-sm text-indigo-600 font-bold">{vo.status}</span>
                    </div>
                    {vo.items.map(item => (
                      <div key={item.productId?._id} className="flex items-center gap-4 py-2">
                        <img src={item.productId?.images?.[0] || 'https://via.placeholder.com/50'} alt="product" className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.productId?.name || 'Deleted Product'}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
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
