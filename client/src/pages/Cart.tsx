import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function Cart() {
  const { cartItems, totalPrice, clearCart } = useCart();
  
  useEffect(() => {
    document.title = "Your Cart | ATHLETIX";
  }, []);
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-32">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            
            <Button asChild className="rounded-full">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 md:px-8 py-32">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-8"
      >
        Your Cart ({cartItems.length})
      </motion.h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1"
        >
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Items</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCart}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear Cart
              </Button>
            </div>
            
            <Separator className="mb-4" />
            
            <AnimatePresence>
              <div className="divide-y divide-border">
                {cartItems.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </div>
            </AnimatePresence>
            
            <div className="pt-4 mt-4 border-t border-border">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link href="/products">
                  <ArrowLeft className="h-4 w-4" /> Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
        
        <div className="w-full lg:w-96">
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
