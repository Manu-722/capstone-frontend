import { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { token, isAuthenticated } = useContext(AuthContext);

  
  useEffect(() => {
    if (!isAuthenticated) {
      setCart([]);
      localStorage.removeItem('cymanCart');
    }
  }, [isAuthenticated]);

  
  useEffect(() => {
    if (!token || !isAuthenticated) return;

    const fetchCart = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/user/cart/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (Array.isArray(data.items)) {
          setCart(data.items);
          localStorage.setItem('cymanCart', JSON.stringify(data.items));
        } else {
          console.warn('Unexpected cart payload:', data);
        }
      } catch (err) {
        console.error('Failed to fetch cart from server:', err);
      }
    };

    const timer = setTimeout(fetchCart, 200);
    return () => clearTimeout(timer);
  }, [token, isAuthenticated]);

  
  useEffect(() => {
    if (!token || !isAuthenticated || cart.length === 0) return;

    const persistCart = async () => {
      localStorage.setItem('cymanCart', JSON.stringify(cart));
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

    const timer = setTimeout(persistCart, 200);
    return () => clearTimeout(timer);
  }, [cart, token, isAuthenticated]);

  
  const addToCart = (product) => {
    if (!product || !product.id) return;

    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: 1,
            imageUrl: product.image || '/assets/shoes/default.jpg',
          },
        ];
      }
    });
  };


  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cymanCart');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};