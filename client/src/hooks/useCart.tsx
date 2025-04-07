import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { CartItem, Product } from "@/lib/types";
import * as cartUtils from "@/lib/cart";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  totalPrice: () => number;
  itemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Initialize cart from localStorage
  useEffect(() => {
    setCartItems(cartUtils.loadCart());
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    cartUtils.saveCart(cartItems);
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
  
  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    itemCount,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
};
