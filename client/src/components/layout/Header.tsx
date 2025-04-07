import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "../../components/layout/ThemeProvider";
import { useCart } from "../../hooks/useCart";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import SearchBar from "../../components/ui/SearchBar";
import { Sun, Moon, Heart, ShoppingBag, Menu, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glassmorphism' : ''}`}>
      <div className="glassmorphism py-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center">
                <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <span className="text-white">ATHLE</span><span className="text-primary">TIX</span>
                </h1>
              </a>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/products?category=men">
                <a className={`font-medium hover:text-primary transition-colors ${location.includes('category=men') ? 'text-primary' : ''}`}>
                  Men
                </a>
              </Link>
              <Link href="/products?category=women">
                <a className={`font-medium hover:text-primary transition-colors ${location.includes('category=women') ? 'text-primary' : ''}`}>
                  Women
                </a>
              </Link>
              <Link href="/products?category=kids">
                <a className={`font-medium hover:text-primary transition-colors ${location.includes('category=kids') ? 'text-primary' : ''}`}>
                  Kids
                </a>
              </Link>
              <Link href="/products?filter=brands">
                <a className={`font-medium hover:text-primary transition-colors ${location.includes('filter=brands') ? 'text-primary' : ''}`}>
                  Brands
                </a>
              </Link>
              <Link href="/products?filter=sale">
                <a className={`font-medium hover:text-primary transition-colors ${location.includes('filter=sale') ? 'text-primary' : ''}`}>
                  Sale
                </a>
              </Link>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-5">
              <button 
                className="hidden md:block hover:text-primary transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button 
                className="hover:text-primary transition-colors"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              
              <Link href="/wishlist">
                <a className="hover:text-primary transition-colors">
                  <Heart className="h-5 w-5" />
                </a>
              </Link>
              
              <Link href="/cart">
                <a className="relative hover:text-primary transition-colors">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </a>
              </Link>
              
              <Sheet>
                <SheetTrigger asChild>
                  <button className="md:hidden hover:text-primary transition-colors">
                    <Menu className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/95 backdrop-blur-sm border-l border-white/10">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <Link href="/products?category=men">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Men
                      </a>
                    </Link>
                    <Link href="/products?category=women">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Women
                      </a>
                    </Link>
                    <Link href="/products?category=kids">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Kids
                      </a>
                    </Link>
                    <Link href="/products?filter=brands">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Brands
                      </a>
                    </Link>
                    <Link href="/products?filter=sale">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Sale
                      </a>
                    </Link>
                    <Link href="/account">
                      <a className="font-medium py-2 hover:text-primary transition-colors">
                        Account
                      </a>
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="mt-4 relative md:hidden">
            <SearchBar className="w-full" />
          </div>
        </div>
      </div>
      
      {/* Desktop Search Bar */}
      {isSearchOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-background/90 backdrop-blur-md py-4 border-b border-white/10"
        >
          <div className="container mx-auto px-4 md:px-8">
            <SearchBar />
          </div>
        </motion.div>
      )}
    </header>
  );
}
