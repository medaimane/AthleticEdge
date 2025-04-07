import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Products() {
  const [location] = useLocation();
  const { getFilteredProducts, isLoading } = useProducts();
  const [activeFilters, setActiveFilters] = useState({
    brands: [],
    categories: [],
    sports: [],
    types: [],
    priceRange: [0, 300]
  });
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Parse query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.split('?')[1]);
    
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    
    if (category) {
      setActiveFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
    
    if (brand) {
      setActiveFilters(prev => ({
        ...prev,
        brands: [brand]
      }));
    }
    
    document.title = search 
      ? `Search: ${search} | ATHLETIX` 
      : "Shop All Products | ATHLETIX";
      
  }, [location]);
  
  const handleFiltersChange = (filters: any) => {
    setActiveFilters(filters);
  };
  
  const clearFilters = () => {
    setActiveFilters({
      brands: [],
      categories: [],
      sports: [],
      types: [],
      priceRange: [0, 300]
    });
  };
  
  const products = getFilteredProducts(activeFilters, sortBy);
  
  const hasActiveFilters = 
    activeFilters.brands.length > 0 || 
    activeFilters.categories.length > 0 || 
    activeFilters.sports.length > 0 || 
    activeFilters.types.length > 0 || 
    activeFilters.priceRange[0] > 0 || 
    activeFilters.priceRange[1] < 300;
  
  // Extract query params to display in title
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const searchQuery = searchParams.get('search');
  
  return (
    <div className="container mx-auto px-4 md:px-8 py-32">
      <div className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold">
            {searchQuery 
              ? `Search: "${searchQuery}"` 
              : "All Products"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {products.length} products found
          </p>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar filters */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full lg:w-64 hidden lg:block"
          >
            <ProductFilters onFiltersChange={handleFiltersChange} />
          </motion.div>
          
          <div className="flex-1">
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                        {hasActiveFilters && (
                          <span className="ml-1 bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs flex items-center justify-center">
                            !
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                      <div className="h-full py-4">
                        <ProductFilters onFiltersChange={handleFiltersChange} />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="flex items-center gap-2 ml-auto">
                  <Label htmlFor="sort-by" className="text-sm">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {hasActiveFilters && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center"
                >
                  <p className="text-sm mr-2">Active filters:</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-7 px-2 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" /> Clear all
                  </Button>
                </motion.div>
              )}
              
              <ProductGrid products={products} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
