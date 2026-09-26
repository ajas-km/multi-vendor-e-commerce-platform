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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-2/3">
          <form onSubmit={handlePlaceOrder} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input required type="text" placeholder="Street Address" className="border p-3 rounded-xl col-span-2" onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} />
              <input required type="text" placeholder="City" className="border p-3 rounded-xl" onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
              <input required type="text" placeholder="State" className="border p-3 rounded-xl" onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} />
              <input required type="text" placeholder="ZIP Code" className="border p-3 rounded-xl" onChange={e => setShippingAddress({...shippingAddress, zip: e.target.value})} />
              <input required type="text" placeholder="Country" className="border p-3 rounded-xl" onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})} />
            </div>
            
            <h2 className="text-xl font-bold mb-6 mt-8">Payment Method</h2>
            <div className="border border-indigo-500 bg-indigo-50 p-4 rounded-xl">
              <p className="font-bold text-indigo-900">Credit Card (Simulated)</p>
              <p className="text-sm text-indigo-700">Payment processing will be handled securely.</p>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="mt-8 w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              {loading ? 'Processing...' : `Place Order (₹${cart.subtotal.toLocaleString()})`}
            </button>
          </form>
        </div>
        
        <div className="w-full lg:w-1/3">
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
            <ul className="divide-y divide-gray-200 mb-4">
              {cart.items.map(item => (
                <li key={item.productId._id} className="py-3 flex justify-between">
                  <span className="text-sm text-gray-600">{item.productId.name} x {item.quantity}</span>
                  <span className="text-sm font-medium text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-indigo-600">₹{cart.subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
