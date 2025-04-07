import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { CartItem as CartItemType } from "@/lib/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const [isRemoving, setIsRemoving] = useState(false);
  
  const handleIncrease = () => {
    updateQuantity(product.id, quantity + 1);
  };
  
  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      handleRemove();
    }
  };
  
  const handleRemove = () => {
    setIsRemoving(true);
    // Small delay to allow animation to play
    setTimeout(() => {
      removeFromCart(product.id);
    }, 300);
  };
  
  return (
    <motion.div 
      className={`flex items-center py-4 ${isRemoving ? 'opacity-0' : 'opacity-100'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isRemoving ? 0 : 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md glassmorphism">
        <Link href={`/products/${product.id}`}>
          <a>
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="h-full w-full object-cover object-center" 
            />
          </a>
        </Link>
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between">
            <Link href={`/products/${product.id}`}>
              <a className="text-sm font-medium hover:text-primary">
                {product.name}
              </a>
            </Link>
            <p className="ml-4 text-sm font-medium text-primary">${(product.price * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-full border-border">
            <button
              onClick={handleDecrease}
              className="p-1 rounded-l-full flex items-center justify-center hover:bg-muted"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="px-3 text-sm font-medium">{quantity}</span>
            <button
              onClick={handleIncrease}
              className="p-1 rounded-r-full flex items-center justify-center hover:bg-muted"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-muted-foreground hover:text-destructive p-0 h-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
