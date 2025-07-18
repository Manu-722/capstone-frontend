import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, isAuthenticated } = useContext(AuthContext);

  // 🧠 Load cart from backend on login
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated || !token) {
        // Fallback to localStorage for guests
        try {
          const stored = localStorage.getItem('cymanCart');
          if (stored) setCart(JSON.parse(stored));
        } catch (err) {
          console.error('Error loading local cart:', err);
        }
        return;
      }

      try {
        const res = await fetch('http://localhost:8000/api/user/cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.items)) {
          setCart(data.items);
          localStorage.setItem('cymanCart', JSON.stringify(data.items));
        }
      } catch (err) {
        console.error('Failed to fetch cart from server:', err);
      }
    };

    fetchCart();
  }, [isAuthenticated, token]);

  // 💾 Sync cart to backend on change
  useEffect(() => {
    const persistCart = async () => {
      localStorage.setItem('cymanCart', JSON.stringify(cart));
      if (!isAuthenticated || !token || cart.length === 0) return;

      try {
        await fetch('http://localhost:8000/api/persist_cart/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cart),
        });
      } catch (err) {
        console.error('Failed to persist cart:', err);
      }
    };

    persistCart();
  }, [cart, isAuthenticated, token]);

  // ➕ Add to cart
  const addToCart = (product) => {
    if (!product || !product.id) return;

    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      const updated = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          imageUrl: product.image || '/assets/shoes/default.jpg',
        },
      ]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};