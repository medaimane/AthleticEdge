import { 
  users, 
  products, 
  cartItems, 
  orders, 
  orderItems,
  type User, 
  type InsertUser, 
  type Product, 
  type InsertProduct, 
  type CartItem, 
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem
} from "@shared/schema";
import { randomUUID } from "crypto";

// Define storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsByBrand(brand: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getBestSellerProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearUserCart(userId: number): Promise<void>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrderById(id: string): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  addOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
}

// Memory Storage Implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<string, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<string, Order>;
  private orderItems: Map<number, OrderItem>;
  private nextUserId: number;
  private nextCartItemId: number;
  private nextOrderItemId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.nextUserId = 1;
    this.nextCartItemId = 1;
    this.nextOrderItemId = 1;
    
    // Initialize with sample products
    this.initializeProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.nextUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getProductsByBrand(brand: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.brand.toLowerCase() === brand.toLowerCase()
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.featured
    );
  }

  async getBestSellerProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.bestSeller
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.description?.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.type.toLowerCase().includes(lowerQuery) ||
        product.sport?.toLowerCase().includes(lowerQuery)
    );
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      item => item.userId === userId
    );
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    // Check if the same product, size, color already exists for the user
    const existingItem = Array.from(this.cartItems.values()).find(
      cartItem => 
        cartItem.userId === item.userId && 
        cartItem.productId === item.productId && 
        cartItem.size === item.size && 
        cartItem.color === item.color
    );

    if (existingItem) {
      // Update quantity instead of adding new item
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + (item.quantity || 1)
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    }
    
    // Add new cart item
    const id = this.nextCartItemId++;
    const createdAt = new Date();
    const cartItem: CartItem = { 
      ...item, 
      id, 
      quantity: item.quantity || 1, 
      createdAt 
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearUserCart(userId: number): Promise<void> {
    for (const [id, item] of this.cartItems.entries()) {
      if (item.userId === userId) {
        this.cartItems.delete(id);
      }
    }
  }

  // Order methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const createdAt = new Date();
    const newOrder: Order = { ...order, createdAt };
    this.orders.set(order.id, newOrder);
    return newOrder;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      order => order.userId === userId
    ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async addOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const id = this.nextOrderItemId++;
    const orderItem: OrderItem = { ...item, id };
    this.orderItems.set(id, orderItem);
    return orderItem;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      item => item.orderId === orderId
    );
  }

  // Initialize with sample products
  private initializeProducts(): void {
    // Sample products data
    const sampleProducts: InsertProduct[] = [
      {
        name: "Air Zoom SuperRep",
        brand: "Nike",
        price: 129.99,
        description: "Nike Air Zoom SuperRep is designed for circuit training, HIIT, and other fast-paced exercise. Zoom Air cushioning in the forefoot combined with a wide, stable heel offers comfort and stability for cardio and squats alike.",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "shoes",
        sport: "training",
        rating: 4.5,
        reviewCount: 128,
        badge: "NEW",
        stock: 25,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#000000", "#ffffff", "#ff0000"],
        featured: true,
        bestSeller: true
      },
      {
        name: "Ultraboost 21",
        brand: "Adidas",
        price: 179.99,
        description: "The Adidas Ultraboost 21 delivers incredible energy return. The shoe features a BOOST midsole and a Primeknit upper that wraps the foot with a supportive fit to enhance movement.",
        imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "shoes",
        sport: "running",
        rating: 5,
        reviewCount: 208,
        badge: "POPULAR",
        stock: 18,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#000000", "#0000ff", "#ff0000"],
        featured: true,
        bestSeller: true
      },
      {
        name: "HOVR Phantom 2",
        brand: "Under Armour",
        price: 149.99,
        description: "UA HOVR™ technology provides 'zero gravity feel' to maintain energy return and helps eliminate impact. Compression mesh Energy Web contains & molds UA HOVR™ foam to give back the energy you put in.",
        imageUrl: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1606890658317-7d14490b76fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1520295537254-53a6203bc542?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1539185441755-769473a23570?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "shoes",
        sport: "running",
        rating: 4,
        reviewCount: 94,
        stock: 12,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#000000", "#ffffff", "#ff0000", "#00ff00"],
        bestSeller: true
      },
      {
        name: "RS-X³ Puzzle",
        brand: "Puma",
        price: 119.99,
        description: "Taking design cues from the ever-changing puzzle of life, these RS-X³ Puzzle shoes feature a mesh and synthetic leather upper, bold color-blocking, and iconic RS cushioning in the midsole.",
        imageUrl: "https://images.unsplash.com/photo-1593081891731-fda0877988da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1593081891731-fda0877988da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1608379743498-63cc1a4c2309?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1604868189278-e362ca3c4d66?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "shoes",
        sport: "lifestyle",
        rating: 3.5,
        reviewCount: 76,
        badge: "ONLY X LEFT",
        stock: 3,
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["#000000", "#ffffff", "#0000ff"],
        bestSeller: true
      },
      {
        name: "Dri-FIT Men's Training T-Shirt",
        brand: "Nike",
        price: 35.99,
        description: "The Nike Dri-FIT Men's Training T-Shirt delivers a soft feel, sweat-wicking performance and excellent range of motion to get you through your workout in total comfort.",
        imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1571945153237-4929e783af4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1600185652960-4e81bf0069a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "apparel",
        sport: "training",
        rating: 4.8,
        reviewCount: 156,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#000000", "#ffffff", "#ff0000", "#0000ff"],
        bestSeller: true
      },
      {
        name: "Cloudfoam Pure Shoes",
        brand: "Adidas",
        price: 89.99,
        description: "These women's running-inspired shoes feature a foot-hugging knit upper and a female-friendly fit. Pillow-soft Cloudfoam cushioning in the midsole and outsole offers enhanced comfort.",
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1539298781177-895e79cf9a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "women",
        type: "shoes",
        sport: "running",
        rating: 4.9,
        reviewCount: 287,
        badge: "POPULAR",
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["#ffffff", "#ff00ff", "#0000ff"],
        featured: true,
        bestSeller: true
      },
      {
        name: "Women's UA Fly-By 2.0 Shorts",
        brand: "Under Armour",
        price: 29.99,
        description: "These lightweight women's running shorts feature a soft, stretchy woven fabric that delivers superior comfort & durability with strategic mesh panels for added ventilation.",
        imageUrl: "https://images.unsplash.com/photo-1548286978-f218023f8d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1548286978-f218023f8d18?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "women",
        type: "apparel",
        sport: "running",
        rating: 4.7,
        reviewCount: 183,
        isOnSale: true,
        salePrice: 24.99,
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["#000000", "#ff00ff", "#0000ff"],
        bestSeller: true
      },
      {
        name: "Kid's Zoom Pegasus 38",
        brand: "Nike",
        price: 85.99,
        description: "The Nike Zoom Pegasus 38 is built for young runners. It helps kids feel comfortable and confident when they run, walk and play. Soft and springy cushioning helps them feel good on their feet, run and jump.",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1556906918-c3071bd11598?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1622920123900-8d3cf5c42c5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "kids",
        type: "shoes",
        sport: "running",
        rating: 4.6,
        reviewCount: 92,
        badge: "NEW",
        sizes: ["3", "4", "5", "6", "7"],
        colors: ["#ff0000", "#0000ff", "#00ff00"],
        featured: true
      },
      {
        name: "Workout Ready Tech Tee",
        brand: "Reebok",
        price: 25.99,
        description: "This men's training tee is designed to help keep you cool and comfortable when your workout heats up. The lightweight, sweat-wicking fabric breathes to help keep you dry.",
        imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1562771242-a02d9090c90c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "apparel",
        sport: "training",
        rating: 4.4,
        reviewCount: 108,
        isOnSale: true,
        salePrice: 19.99,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#000000", "#ffffff", "#808080"]
      },
      {
        name: "Training Duffle Bag",
        brand: "Nike",
        price: 45.99,
        description: "The Nike Training Duffle Bag features a spacious main compartment with a water-resistant bottom to help keep your gear clean and dry. Multiple pockets help you stay organized.",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1516697073-419b2bd079db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1631008767304-5ce75ff6c163?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "accessories",
        type: "accessories",
        sport: "training",
        rating: 4.2,
        reviewCount: 65,
        colors: ["#000000", "#0000ff", "#ff0000"]
      },
      {
        name: "Mercurial Vapor 14 Elite",
        brand: "Nike",
        price: 249.99,
        description: "The Nike Mercurial Vapor 14 Elite FG features a new look with specialized components to let you play your fastest from start to finish. A flashy design pairs with a stunning range of iridescent colors.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "shoes",
        sport: "soccer",
        rating: 4.9,
        reviewCount: 216,
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["#ff0000", "#00ff00", "#0000ff"],
        featured: true
      },
      {
        name: "Pro Basketball Shorts",
        brand: "Adidas",
        price: 39.99,
        description: "Designed for the basketball court, these men's shorts are made of lightweight, breathable fabric to keep you cool through all four quarters. They feature side pockets to hold your essentials.",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
        images: [
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1563460716037-460a3ad24ba9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80",
          "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=500&q=80"
        ],
        category: "men",
        type: "apparel",
        sport: "basketball",
        rating: 4.5,
        reviewCount: 78,
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["#000000", "#ff0000", "#0000ff"]
      }
    ];

    // Add products to storage
    sampleProducts.forEach(product => {
      const id = randomUUID();
      const createdAt = new Date();
      this.products.set(id, { ...product, id, createdAt });
    });
  }
}

// Export storage instance
export const storage = new MemStorage();
