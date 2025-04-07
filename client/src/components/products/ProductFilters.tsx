import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { X } from "lucide-react";

const brands = [
  { id: "nike", name: "Nike" },
  { id: "adidas", name: "Adidas" },
  { id: "under-armour", name: "Under Armour" },
  { id: "puma", name: "Puma" },
  { id: "new-balance", name: "New Balance" },
  { id: "reebok", name: "Reebok" }
];

const categories = [
  { id: "men", name: "Men" },
  { id: "women", name: "Women" },
  { id: "kids", name: "Kids" }
];

const sports = [
  { id: "running", name: "Running" },
  { id: "training", name: "Training & Gym" },
  { id: "basketball", name: "Basketball" },
  { id: "soccer", name: "Soccer" },
  { id: "tennis", name: "Tennis" },
  { id: "golf", name: "Golf" }
];

const productTypes = [
  { id: "shoes", name: "Shoes" },
  { id: "clothing", name: "Clothing" },
  { id: "accessories", name: "Accessories" }
];

interface ProductFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export default function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [_, navigate] = useLocation();
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  
  const handleBrandChange = (brandId: string, checked: boolean) => {
    setSelectedBrands(prev => {
      const newSelection = checked 
        ? [...prev, brandId]
        : prev.filter(id => id !== brandId);
      
      applyFilters({ ...currentFilters, brands: newSelection });
      return newSelection;
    });
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const newSelection = checked 
        ? [...prev, categoryId]
        : prev.filter(id => id !== categoryId);
      
      applyFilters({ ...currentFilters, categories: newSelection });
      return newSelection;
    });
  };
  
  const handleSportChange = (sportId: string, checked: boolean) => {
    setSelectedSports(prev => {
      const newSelection = checked 
        ? [...prev, sportId]
        : prev.filter(id => id !== sportId);
      
      applyFilters({ ...currentFilters, sports: newSelection });
      return newSelection;
    });
  };
  
  const handleTypeChange = (typeId: string, checked: boolean) => {
    setSelectedTypes(prev => {
      const newSelection = checked 
        ? [...prev, typeId]
        : prev.filter(id => id !== typeId);
      
      applyFilters({ ...currentFilters, types: newSelection });
      return newSelection;
    });
  };
  
  const handlePriceChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setPriceRange(newRange);
    applyFilters({ ...currentFilters, priceRange: newRange });
  };
  
  const currentFilters = {
    brands: selectedBrands,
    categories: selectedCategories,
    sports: selectedSports,
    types: selectedTypes,
    priceRange
  };
  
  const applyFilters = (filters: any) => {
    onFiltersChange(filters);
  };
  
  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSports([]);
    setSelectedTypes([]);
    setPriceRange([0, 300]);
    
    onFiltersChange({
      brands: [],
      categories: [],
      sports: [],
      types: [],
      priceRange: [0, 300]
    });
  };
  
  const hasActiveFilters = 
    selectedBrands.length > 0 || 
    selectedCategories.length > 0 || 
    selectedSports.length > 0 || 
    selectedTypes.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 300;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" /> Clear all
          </Button>
        )}
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Price Range</h4>
          <Slider
            defaultValue={[0, 300]}
            value={[priceRange[0], priceRange[1]]}
            max={300}
            step={5}
            onValueChange={handlePriceChange}
            className="my-6"
          />
          <div className="flex justify-between">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        
        <Separator />
        
        <Accordion type="multiple" defaultValue={["brands", "categories"]}>
          <AccordionItem value="brands">
            <AccordionTrigger>Brands</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {brands.map(brand => (
                  <div key={brand.id} className="flex items-center">
                    <Checkbox
                      id={`brand-${brand.id}`}
                      checked={selectedBrands.includes(brand.id)}
                      onCheckedChange={(checked) => 
                        handleBrandChange(brand.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`brand-${brand.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sports">
            <AccordionTrigger>Sports</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {sports.map(sport => (
                  <div key={sport.id} className="flex items-center">
                    <Checkbox
                      id={`sport-${sport.id}`}
                      checked={selectedSports.includes(sport.id)}
                      onCheckedChange={(checked) => 
                        handleSportChange(sport.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`sport-${sport.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {sport.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="types">
            <AccordionTrigger>Product Type</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {productTypes.map(type => (
                  <div key={type.id} className="flex items-center">
                    <Checkbox
                      id={`type-${type.id}`}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={(checked) => 
                        handleTypeChange(type.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={`type-${type.id}`}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.name}
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
