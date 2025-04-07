import { CartItem, Product } from "./types";

// LocalStorage key
const CART_STORAGE_KEY = "athletix-cart";

// Load cart from localStorage
export const loadCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

// Save cart to localStorage
export const saveCart = (cart: CartItem[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
};

// Add item to cart
export const addToCart = (cart: CartItem[], product: Product, quantity: number = 1, size?: string, color?: string): CartItem[] => {
  const existingItemIndex = cart.findIndex(
    (item) => item.product.id === product.id && item.size === size && item.color === color
  );
  
  if (existingItemIndex !== -1) {
    // Item already exists, update quantity
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += quantity;
    return updatedCart;
  } else {
    // Add new item
    return [...cart, { product, quantity, size, color }];
  }
};

// Update item quantity
export const updateQuantity = (cart: CartItem[], productId: string, quantity: number, size?: string, color?: string): CartItem[] => {
  return cart.map((item) => {
    if (item.product.id === productId && item.size === size && item.color === color) {
      return { ...item, quantity };
    }
    return item;
  });
};

// Remove item from cart
export const removeFromCart = (cart: CartItem[], productId: string, size?: string, color?: string): CartItem[] => {
  return cart.filter(
    (item) => !(item.product.id === productId && item.size === size && item.color === color)
  );
};

// Clear cart
export const clearCart = (): CartItem[] => {
  return [];
};

// Calculate total price
export const calculateTotalPrice = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => {
    const price = item.product.salePrice || item.product.price;
    return total + price * item.quantity;
  }, 0);
};

// Calculate item count
export const calculateItemCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
