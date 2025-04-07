import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80" 
          alt="Athletes in action" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/30"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl md:ml-16">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold font-space mb-6 leading-tight"
          >
            ELEVATE YOUR <span className="text-primary">PERFORMANCE</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-muted-foreground font-light max-w-xl"
          >
            Premium sportswear engineered for peak performance. Discover the latest from top athletic brands.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-full hover-lift">
              <Link href="/products">SHOP NOW</Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-2 border-white hover:border-primary hover:text-primary font-bold px-8 py-6 rounded-full hover-lift">
              <Link href="/products?filter=brands">EXPLORE BRANDS</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
