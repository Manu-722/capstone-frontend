import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem('cymanCart');
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      return [];
    }
  });

  
  useEffect(() => {
    localStorage.setItem('cymanCart', JSON.stringify(cart));
  }, [cart]);

  
  const addToCart = (product) => {
    if (!product || !product.id) return;

    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
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