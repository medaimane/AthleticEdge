export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  description?: string;
  imageUrl: string;
  images?: string[];
  category: string;
  type: string;
  sport?: string;
  rating: number;
  reviewCount: number;
  badge?: "NEW" | "POPULAR" | "ONLY X LEFT";
  stock?: number;
  isOnSale?: boolean;
  salePrice?: number;
  sizes?: string[];
  colors?: string[];
  featured?: boolean;
  bestSeller?: boolean;
  createdAt: Date;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export type ProductFilters = {
  brands: string[];
  categories: string[];
  sports: string[];
  types: string[];
  priceRange: [number, number];
};

export interface OrderDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  nameOnCard: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  orderDetails: OrderDetails;
  paymentInfo?: PaymentInfo;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
}
