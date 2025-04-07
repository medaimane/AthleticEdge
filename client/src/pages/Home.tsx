import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import PromoBanner from "@/components/home/PromoBanner";
import BestSellers from "@/components/home/BestSellers";
import BrandsSection from "@/components/home/BrandsSection";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  // Set the page title
  useEffect(() => {
    document.title = "ATHLETIX | Premium Sportswear";
  }, []);

  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <PromoBanner />
      <BestSellers />
      <BrandsSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}
