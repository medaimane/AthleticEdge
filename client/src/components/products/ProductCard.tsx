import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingBag, Star, StarHalf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isFavorite ? "removed from" : "added to"} your wishlist`,
    });
  };
  
  return (
    <motion.div 
      className="glassmorphism rounded-xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-lg hover:shadow-primary/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Link href={`/products/${product.id}`}>
        <a className="block h-full">
          <div className="relative">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-64 object-cover"
            />
            
            {product.badge && (
              <Badge className={`absolute top-3 left-3 ${
                product.badge === "NEW" ? "bg-secondary text-secondary-foreground" 
                : product.badge === "POPULAR" ? "bg-primary text-primary-foreground"
                : "bg-destructive text-destructive-foreground"
              }`}>
                {product.badge}
              </Badge>
            )}
            
            <button 
              className="absolute top-3 right-3 bg-background/60 hover:bg-background/80 p-2 rounded-full transition-colors"
              onClick={handleToggleFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{product.brand}</p>
                <h3 className="font-medium">{product.name}</h3>
              </div>
              <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <div className="flex text-secondary">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary" />
                ))}
                {product.rating % 1 > 0 && <StarHalf className="h-4 w-4 fill-secondary" />}
              </div>
              <span className="ml-2">({product.reviewCount})</span>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-background bg-opacity-10 hover:bg-primary hover:text-primary-foreground rounded-full py-2 transition-colors flex items-center justify-center font-medium"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </motion.button>
          </div>
        </a>
      </Link>
    </motion.div>
  );
}
