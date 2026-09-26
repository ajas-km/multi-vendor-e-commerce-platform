import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
      setLoading(false);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5004/api/cart', { withCredentials: true });
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      alert("Please login to add items to cart!");
      return;
    }
    
    try {
      const { data } = await axios.post(
        'http://localhost:5004/api/cart/items',
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(data);
    } catch (error) {
      console.error('Error adding to cart', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5004/api/cart/items/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      setCart(data);
    } catch (error) {
      console.error('Error updating quantity', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5004/api/cart/items/${productId}`,
        { withCredentials: true }
      );
      setCart(data);
    } catch (error) {
      console.error('Error removing from cart', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5004/api/cart', { withCredentials: true });
      setCart(null);
    } catch (error) {
      console.error('Error clearing cart', error);
    }
  };

  const cartItemCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};
