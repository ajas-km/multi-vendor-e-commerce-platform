import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3 space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="w-full lg:w-1/3">
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet.</p>
          <Link to="/products" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <ul className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <li key={item.productId._id} className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0 w-full sm:w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
                    {item.productId.images && item.productId.images[0] ? (
                      <img src={item.productId.images[0]} alt={item.productId.name} className="object-cover w-full h-full" />
                    ) : (
                      <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between mb-1">
                      <Link to={`/products/${item.productId._id}`} className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors">
                        {item.productId.name}
                      </Link>
                      <p className="font-bold text-gray-900 ml-4">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Sold by: {item.vendorId?.storeName || 'Unknown Vendor'}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center border border-gray-300 rounded-full px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                          className="text-gray-500 hover:text-indigo-600 w-6 h-6 flex items-center justify-center font-medium"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                          className="text-gray-500 hover:text-indigo-600 w-6 h-6 flex items-center justify-center font-medium"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.productId._id)}
                        className="text-sm font-medium text-pink-600 hover:text-pink-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <button 
            onClick={clearCart}
            className="text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            Clear entire cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="flow-root">
              <dl className="-my-4 text-sm divide-y divide-gray-100">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">₹{cart.subtotal.toLocaleString()}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping estimate</dt>
                  <dd className="font-medium text-green-600">Free</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Tax estimate</dt>
                  <dd className="font-medium text-gray-900">Calculated at checkout</dd>
                </div>
                <div className="py-4 flex items-center justify-between border-t-2 border-gray-100">
                  <dt className="text-base font-extrabold text-gray-900">Order total</dt>
                  <dd className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    ₹{cart.subtotal.toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              <Link to="/checkout" className="w-full flex items-center justify-center px-6 py-4 border border-transparent rounded-full shadow-lg text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:-translate-y-1">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
