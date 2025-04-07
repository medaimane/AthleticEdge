import { motion } from "framer-motion";
import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function ProductGrid({ products, isLoading = false }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden glassmorphism animate-pulse">
            <div className="w-full h-64 bg-muted"></div>
            <div className="p-4">
              <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
              <div className="flex justify-between mb-4">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/6"></div>
              </div>
              <div className="h-9 bg-muted rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <h3 className="text-2xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 * (index % 4) }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
}
