import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";

type FilterType = "all" | "shoes" | "apparel" | "accessories";

export default function BestSellers() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { getBestSellers } = useProducts();
  
  const products = getBestSellers(filter);
  
  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Shoes", value: "shoes" },
    { label: "Apparel", value: "apparel" },
    { label: "Accessories", value: "accessories" },
  ];
  
  return (
    <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold font-space mb-2"
          >
            BEST SELLERS
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-lg"
          >
            Our most popular products based on sales
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex space-x-1 mt-4 md:mt-0"
        >
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setFilter(btn.value as FilterType)}
              className={`px-3 py-1 border rounded transition-colors ${
                filter === btn.value
                  ? "border-primary text-primary"
                  : "border-muted-foreground hover:border-primary"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </motion.div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * (index % 4) }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center mt-12"
      >
        <Button asChild variant="outline" className="border-2 border-white hover:border-primary hover:text-primary font-bold px-8 py-6 rounded-full hover-lift">
          <Link href="/products">VIEW ALL PRODUCTS</Link>
        </Button>
      </motion.div>
    </section>
  );
}
