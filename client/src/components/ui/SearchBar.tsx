import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "framer-motion";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { searchProducts } = useProducts();
  const [_, navigate] = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  
  const results = searchProducts(searchTerm);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  
  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full bg-muted/50 rounded-full py-2 px-4 focus:ring-2 focus:ring-primary text-sm pl-10"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value.length > 2) {
                setShowResults(true);
              } else {
                setShowResults(false);
              }
            }}
            onFocus={() => {
              if (searchTerm.length > 2) {
                setShowResults(true);
              }
            }}
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      
      <AnimatePresence>
        {showResults && searchTerm.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-50 mt-1 w-full rounded-md glassmorphism shadow-lg"
          >
            <div className="py-2 max-h-96 overflow-auto">
              {results.length > 0 ? (
                <ul>
                  {results.map((product) => (
                    <li key={product.id}>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-muted flex items-center"
                        onClick={() => {
                          setShowResults(false);
                          navigate(`/products/${product.id}`);
                        }}
                      >
                        <div className="w-10 h-10 rounded overflow-hidden mr-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand}</p>
                        </div>
                        <p className="ml-auto text-primary font-medium">
                          ${product.price.toFixed(2)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 text-center text-sm text-muted-foreground">
                  No products found
                </p>
              )}
              
              {results.length > 0 && (
                <div className="px-4 py-2 border-t border-border">
                  <button
                    onClick={() => {
                      setShowResults(false);
                      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
                    }}
                    className="text-sm text-primary hover:underline w-full text-center"
                  >
                    See all results
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
