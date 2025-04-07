import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-lg glassmorphism">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedImage}
            src={images[selectedImage]}
            alt={`${productName} - view ${selectedImage + 1}`}
            className="object-cover w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative overflow-hidden rounded-md transition-all ${
              selectedImage === index 
                ? "ring-2 ring-primary" 
                : "ring-1 ring-border hover:ring-primary/50"
            }`}
          >
            <div className="aspect-square">
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
