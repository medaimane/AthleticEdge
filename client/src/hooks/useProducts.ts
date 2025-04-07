import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, ProductFilters } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";

export function useProducts() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["/api/products"],
    staleTime: 60000, // 1 minute
  });

  const getProductById = useCallback(
    (id: string): Product | undefined => {
      return products.find((product: Product) => product.id === id);
    },
    [products]
  );

  const getRelatedProducts = useCallback(
    (id: string, limit: number = 4): Product[] => {
      const currentProduct = getProductById(id);
      if (!currentProduct) return [];

      return products
        .filter(
          (product: Product) => 
            product.id !== id && 
            (product.category === currentProduct.category || 
             product.brand === currentProduct.brand)
        )
        .slice(0, limit);
    },
    [products, getProductById]
  );

  const getBestSellers = useCallback(
    (filter: string = "all", limit: number = 4): Product[] => {
      let filtered = [...products];

      if (filter !== "all") {
        filtered = filtered.filter((product: Product) => product.type === filter);
      }

      return filtered
        .filter((product: Product) => product.bestSeller)
        .slice(0, limit);
    },
    [products]
  );

  const getFeaturedProducts = useCallback(
    (limit: number = 3): Product[] => {
      return products
        .filter((product: Product) => product.featured)
        .slice(0, limit);
    },
    [products]
  );

  const getFilteredProducts = useCallback(
    (filters: ProductFilters, sortBy: string = "newest"): Product[] => {
      let filtered = [...products];

      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter((product: Product) =>
          filters.categories.includes(product.category)
        );
      }

      // Apply brand filter
      if (filters.brands.length > 0) {
        filtered = filtered.filter((product: Product) =>
          filters.brands.includes(product.brand.toLowerCase())
        );
      }

      // Apply sport filter
      if (filters.sports.length > 0 && filters.sports[0] !== "") {
        filtered = filtered.filter(
          (product: Product) =>
            product.sport && filters.sports.includes(product.sport)
        );
      }

      // Apply product type filter
      if (filters.types.length > 0) {
        filtered = filtered.filter((product: Product) =>
          filters.types.includes(product.type)
        );
      }

      // Apply price range filter
      filtered = filtered.filter(
        (product: Product) => {
          const price = product.salePrice || product.price;
          return price >= filters.priceRange[0] && price <= filters.priceRange[1];
        }
      );

      // Apply sorting
      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
          break;
        case "price-high":
          filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
          break;
        case "popular":
          filtered.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case "newest":
        default:
          filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }

      return filtered;
    },
    [products]
  );

  const searchProducts = useCallback(
    (searchTerm: string): Product[] => {
      if (!searchTerm || searchTerm.length < 3) return [];

      const term = searchTerm.toLowerCase();
      return products.filter(
        (product: Product) =>
          product.name.toLowerCase().includes(term) ||
          product.brand.toLowerCase().includes(term) ||
          product.description?.toLowerCase().includes(term) ||
          product.category.toLowerCase().includes(term)
      );
    },
    [products]
  );

  return {
    products,
    isLoading,
    error,
    getProductById,
    getRelatedProducts,
    getBestSellers,
    getFeaturedProducts,
    getFilteredProducts,
    searchProducts,
  };
}
