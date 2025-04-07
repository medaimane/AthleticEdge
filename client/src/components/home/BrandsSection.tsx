import { Link } from "wouter";
import { motion } from "framer-motion";

const brands = [
  {
    id: "nike",
    name: "Nike",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png",
    link: "/products?brand=nike"
  },
  {
    id: "adidas",
    name: "Adidas",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1280px-Adidas_Logo.svg.png",
    link: "/products?brand=adidas"
  },
  {
    id: "under-armour",
    name: "Under Armour",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Under_armour_logo.svg/1280px-Under_armour_logo.svg.png",
    link: "/products?brand=under-armour"
  },
  {
    id: "puma",
    name: "Puma",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Puma_AG.svg/1200px-Puma_AG.svg.png",
    link: "/products?brand=puma"
  }
];

export default function BrandsSection() {
  return (
    <section className="py-16 md:py-20 bg-muted">
      <div className="container mx-auto px-4 md:px-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold font-space mb-2 text-center"
        >
          TOP BRANDS
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
        >
          Shop your favorite athletic brands all in one place
        </motion.p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <Link href={brand.link}>
                <a className="flex items-center justify-center p-6 md:p-8 hover-lift group">
                  <img 
                    src={brand.logoUrl} 
                    alt={brand.name} 
                    className="h-12 md:h-16 w-auto grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" 
                  />
                </a>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
