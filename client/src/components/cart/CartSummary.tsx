import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";

export default function CartSummary() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
  };
  
  const subtotal = totalPrice();
  const shipping = cartItems.length > 0 ? 15 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glassmorphism rounded-xl p-6"
    >
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <p className="text-muted-foreground">Subtotal</p>
          <p className="font-medium">${subtotal.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between">
          <p className="text-muted-foreground">Shipping</p>
          <p className="font-medium">${shipping.toFixed(2)}</p>
        </div>
        
        <div className="flex justify-between">
          <p className="text-muted-foreground">Tax</p>
          <p className="font-medium">${tax.toFixed(2)}</p>
        </div>
        
        <Separator />
        
        <div className="flex justify-between pt-2">
          <p className="font-semibold">Total</p>
          <p className="font-bold text-primary">${total.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="mt-6 space-y-3">
        <Button 
          asChild
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full"
          disabled={cartItems.length === 0 || isCheckingOut}
          onClick={handleCheckout}
        >
          <Link href="/checkout">
            <a className="flex items-center justify-center">
              CHECKOUT <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-semibold"
          disabled={cartItems.length === 0}
          asChild
        >
          <Link href="/products">
            <a>CONTINUE SHOPPING</a>
          </Link>
        </Button>
      </div>
      
      <div className="mt-6">
        <h3 className="font-medium mb-2">We Accept</h3>
        <div className="flex space-x-2">
          <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Visa</span>
          <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Mastercard</span>
          <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">PayPal</span>
          <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Apple Pay</span>
        </div>
      </div>
    </motion.div>
  );
}
