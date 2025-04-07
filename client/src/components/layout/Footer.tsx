import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Instagram, Facebook, Twitter, Youtube,
  CreditCard, Coins, Apple, Globe 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-muted pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12"
        >
          <div>
            <h3 className="text-xl font-bold font-space tracking-wider mb-6">
              <span className="text-white">ATHLE</span><span className="text-primary">TIX</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Premium sportswear for athletes who demand nothing but the best. Performance meets style.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-white transition-colors hover-lift">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors hover-lift">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors hover-lift">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors hover-lift">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">SHOP</h4>
            <ul className="space-y-3">
              <li><Link href="/products?category=men" className="text-muted-foreground hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/products?category=women" className="text-muted-foreground hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/products?category=kids" className="text-muted-foreground hover:text-white transition-colors">Kids</Link></li>
              <li><Link href="/products?category=footwear" className="text-muted-foreground hover:text-white transition-colors">Footwear</Link></li>
              <li><Link href="/products?category=equipment" className="text-muted-foreground hover:text-white transition-colors">Equipment</Link></li>
              <li><Link href="/products?filter=sale" className="text-muted-foreground hover:text-white transition-colors">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">SUPPORT</h4>
            <ul className="space-y-3">
              <li><Link href="/help" className="text-muted-foreground hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/orders" className="text-muted-foreground hover:text-white transition-colors">Order Status</Link></li>
              <li><Link href="/shipping" className="text-muted-foreground hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-muted-foreground hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/size-guide" className="text-muted-foreground hover:text-white transition-colors">Size Guide</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">ABOUT</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/careers" className="text-muted-foreground hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/responsibility" className="text-muted-foreground hover:text-white transition-colors">Corporate Responsibility</Link></li>
              <li><Link href="/investors" className="text-muted-foreground hover:text-white transition-colors">Investors</Link></li>
              <li><Link href="/news" className="text-muted-foreground hover:text-white transition-colors">News</Link></li>
            </ul>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-border mt-8"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-bold mb-3">WE ACCEPT</h4>
              <div className="flex space-x-3">
                <CreditCard className="w-6 h-6 text-muted-foreground" />
                <CreditCard className="w-6 h-6 text-muted-foreground" />
                <CreditCard className="w-6 h-6 text-muted-foreground" />
                <Coins className="w-6 h-6 text-muted-foreground" />
                <Apple className="w-6 h-6 text-muted-foreground" />
                <Globe className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ATHLETIX. All rights reserved.
                {" "}
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link> | 
                {" "}
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
