import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CartItem, Product } from "../lib/types";
import * as cartUtils from "../lib/cart";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

// Create default values for the cart context
const defaultCartContextValue: CartContextType = {
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  totalPrice: () => 0,
  itemCount: () => 0
};

// Initialize context with default values
const CartContext = createContext<CartContextType>(defaultCartContextValue);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Initialize cart from localStorage
  useEffect(() => {
    try {
      setCartItems(cartUtils.loadCart());
    } catch (error) {
      console.error("Error loading cart from localStorage:", error);
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      cartUtils.saveCart(cartItems);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);
  
  const addToCart = useCallback(
    (product: Product, quantity: number = 1, size?: string, color?: string) => {
      setCartItems((prevItems) => 
        cartUtils.addToCart(prevItems, product, quantity, size, color)
      );
    },
    []
  );
  
  const updateQuantity = useCallback(
    (productId: string, quantity: number, size?: string, color?: string) => {
      setCartItems((prevItems) => 
        cartUtils.updateQuantity(prevItems, productId, quantity, size, color)
      );
    },
    []
  );
  
  const removeFromCart = useCallback(
    (productId: string, size?: string, color?: string) => {
      setCartItems((prevItems) => 
        cartUtils.removeFromCart(prevItems, productId, size, color)
      );
    },
    []
  );
  
  const clearCart = useCallback(() => {
    setCartItems(cartUtils.clearCart());
  }, []);
  
  const totalPrice = useCallback(() => {
    return cartUtils.calculateTotalPrice(cartItems);
  }, [cartItems]);
  
  const itemCount = useCallback(() => {
    return cartUtils.calculateItemCount(cartItems);
  }, [cartItems]);
  
  // Memoize the context value to prevent unnecessary re-renders
  const value = useCallback(() => {
    return {
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      totalPrice,
      itemCount,
    };
  }, [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalPrice, itemCount]);
  
  return <CartContext.Provider value={value()}>{children}</CartContext.Provider>;
};

// Simplified hook that doesn't throw an error
export const useCart = (): CartContextType => {
  return useContext(CartContext);
};
