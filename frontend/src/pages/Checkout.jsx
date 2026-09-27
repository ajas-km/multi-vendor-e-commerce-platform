import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    street: '', city: '', state: '', zip: '', country: ''
  });
  const [loading, setLoading] = useState(false);

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5005/api/orders', {
        shippingAddress,
        paymentMethod: 'Credit Card'
      }, { withCredentials: true });
      
      clearCart();
      navigate('/orders');
    } catch (error) {
      console.error(error);
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 text-gray-900">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Street Address" className="border border-gray-200 bg-gray-50 p-3.5 text-sm rounded-xl col-span-2 focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:bg-white transition-all" onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
              <input required type="text" placeholder="City" className="border border-gray-200 bg-gray-50 p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:bg-white transition-all" onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
              <input required type="text" placeholder="State" className="border border-gray-200 bg-gray-50 p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:bg-white transition-all" onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
              <input required type="text" placeholder="ZIP Code" className="border border-gray-200 bg-gray-50 p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:bg-white transition-all" onChange={e => setShippingAddress({...shippingAddress, zip: e.target.value})} />
              <input required type="text" placeholder="Country" className="border border-gray-200 bg-gray-50 p-3.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff4e00] focus:bg-white transition-all" onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} />
            </div>
            
            <h2 className="text-sm font-bold uppercase tracking-wider mb-6 mt-10 text-gray-900">Payment Method</h2>
            <div className="border-2 border-black bg-white p-5 rounded-xl flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-bold text-gray-900 text-sm">Credit Card</p>
                <p className="text-xs text-gray-500 mt-1">Safe and secure payment</p>
              </div>
              <div className="h-4 w-4 rounded-full border-4 border-black bg-[#ff4e00]"></div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-8 w-full py-4 bg-[#ff4e00] hover:bg-[#e64600] text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Place Order (₹${cart.subtotal.toLocaleString()})`}
            </button>
          </form>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-[#f8f8f8] rounded-3xl p-8 border border-gray-200 sticky top-24">
            <h2 className="text-lg font-extrabold mb-6 text-gray-900">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-6">
              {cart.items.map(item => (
                <li key={item.productId._id} className="py-4 flex justify-between gap-4">
                  <span className="text-sm text-gray-600 font-medium">{item.productId.name} <span className="text-gray-400">x {item.quantity}</span></span>
                  <span className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
              <span className="font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-black text-[#ff4e00]">₹{cart.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
