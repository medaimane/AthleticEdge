import { useState, useEffect } from "react";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";
import ProductGallery from "@/components/products/ProductGallery";
import ProductCard from "@/components/products/ProductCard";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star, StarHalf, Truck } from "lucide-react";

export default function ProductDetail() {
  const [_, params] = useRoute("/products/:id");
  const productId = params?.id || "";
  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  
  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId);
  
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ATHLETIX`;
      
      // Reset selections when product changes
      setQuantity(1);
      setSelectedSize("");
      setSelectedColor("");
    }
  }, [product]);
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-32 text-center">
        <h2 className="text-2xl font-semibold mb-4">Product not found</h2>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product, quantity);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isFavorite ? "removed from" : "added to"} your wishlist`,
    });
  };
  
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableSizes = product.sizes || sizes;
  const colors = product.colors || [];
  
  return (
    <div className="container mx-auto px-4 md:px-8 py-32">
      <div className="flex flex-col lg:flex-row gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <ProductGallery images={product.images || [product.imageUrl]} productName={product.name} />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-2 mb-2">
            <Link href={`/products?brand=${product.brand.toLowerCase()}`}>
              <a className="text-sm text-muted-foreground hover:text-primary">{product.brand}</a>
            </Link>
            {product.badge && (
              <Badge className={`${
                product.badge === "NEW" ? "bg-secondary text-secondary-foreground" 
                : product.badge === "POPULAR" ? "bg-primary text-primary-foreground"
                : "bg-destructive text-destructive-foreground"
              }`}>
                {product.badge}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-secondary">
              {[...Array(Math.floor(product.rating))].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-secondary" />
              ))}
              {product.rating % 1 > 0 && <StarHalf className="h-4 w-4 fill-secondary" />}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          
          <div className="text-2xl font-bold text-primary mb-6">${product.price.toFixed(2)}</div>
          
          {product.stock && product.stock < 10 && (
            <p className="text-destructive flex items-center mb-4 text-sm font-medium">
              <Truck className="h-4 w-4 mr-2" />
              Only {product.stock} items left in stock
            </p>
          )}
          
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-10 px-4 rounded-md border ${
                      selectedSize === size 
                        ? "border-primary bg-primary/10 text-primary" 
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${
                      selectedColor === color 
                        ? "border-primary" 
                        : "border-transparent hover:border-primary/50"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Color: ${color}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-l-md border border-border hover:bg-muted flex items-center justify-center"
              >
                -
              </button>
              <div className="h-10 w-12 border-t border-b border-border flex items-center justify-center">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="h-10 w-10 rounded-r-md border border-border hover:bg-muted flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button
              onClick={handleAddToCart}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full py-6 flex-1"
            >
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            
            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={`border-2 rounded-full py-6 ${
                isFavorite 
                ? "border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-white" 
                : "border-border hover:border-primary hover:text-primary"
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-destructive" : ""}`} />
              <span className="ml-2">{isFavorite ? "In Wishlist" : "Add to Wishlist"}</span>
            </Button>
          </div>
          
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="py-4">
              <p className="text-muted-foreground leading-relaxed">
                {product.description || `Experience the ultimate in performance with the ${product.name} from ${product.brand}. 
                Designed for athletes who demand the best, this premium product delivers 
                exceptional comfort, support, and style for your active lifestyle.`}
              </p>
            </TabsContent>
            
            <TabsContent value="features" className="py-4">
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Premium quality materials for durability</li>
                <li>Advanced cushioning for comfort</li>
                <li>Breathable design to keep you cool</li>
                <li>Ergonomic fit for natural movement</li>
                <li>Stylish design for everyday wear</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="reviews" className="py-4">
              <div className="space-y-4">
                {product.reviewCount > 0 ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        MJ
                      </div>
                      <div>
                        <p className="font-medium">Michael Jordan</p>
                        <div className="flex text-secondary mt-1">
                          <Star className="h-3 w-3 fill-secondary" />
                          <Star className="h-3 w-3 fill-secondary" />
                          <Star className="h-3 w-3 fill-secondary" />
                          <Star className="h-3 w-3 fill-secondary" />
                          <Star className="h-3 w-3 fill-secondary" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This product exceeded my expectations! The quality is outstanding, and it performs well during intense training sessions.
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No reviews yet</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      
      {relatedProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-16 pt-10 border-t border-border"
        >
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
