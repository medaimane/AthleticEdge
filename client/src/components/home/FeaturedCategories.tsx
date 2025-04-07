import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "men",
    name: "MEN",
    image: "https://images.unsplash.com/photo-1594381898411-846e7d193883?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
    link: "/products?category=men"
  },
  {
    id: "women",
    name: "WOMEN",
    image: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
    link: "/products?category=women"
  },
  {
    id: "kids",
    name: "KIDS",
    image: "https://images.unsplash.com/photo-1618355776464-8666794d2520?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=800&q=80",
    link: "/products?category=kids"
  }
];

export default function FeaturedCategories() {
  return (
    <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold font-space mb-2 text-center"
      >
        CATEGORIES
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
      >
        Shop by category and find your perfect fit
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {categories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            className="relative h-96 rounded-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
            <img 
              src={category.image} 
              alt={`${category.name} category`} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-2xl font-bold font-space mb-2">{category.name}</h3>
              <Link href={category.link}>
                <a className="inline-flex items-center text-primary font-medium group-hover:underline">
                  Shop Collection 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
