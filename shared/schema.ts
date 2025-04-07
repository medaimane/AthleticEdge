import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Products table
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  price: real("price").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  // Store multiple images as JSON array
  images: jsonb("images"),
  category: text("category").notNull(),
  type: text("type").notNull(),
  sport: text("sport"),
  rating: real("rating").notNull().default(5),
  reviewCount: integer("review_count").notNull().default(0),
  badge: text("badge"),
  stock: integer("stock"),
  isOnSale: boolean("is_on_sale").default(false),
  salePrice: real("sale_price"),
  // Store sizes as JSON array
  sizes: jsonb("sizes"),
  // Store colors as JSON array
  colors: jsonb("colors"),
  featured: boolean("featured").default(false),
  bestSeller: boolean("best_seller").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  name: true,
  brand: true,
  price: true,
  description: true,
  imageUrl: true,
  images: true,
  category: true,
  type: true,
  sport: true,
  rating: true,
  reviewCount: true,
  badge: true,
  stock: true,
  isOnSale: true,
  salePrice: true,
  sizes: true,
  colors: true,
  featured: true,
  bestSeller: true,
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  size: text("size"),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  productId: true,
  quantity: true,
  size: true,
  color: true,
});

// Orders table
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
  status: text("status").notNull().default("pending"),
  shippingDetails: jsonb("shipping_details").notNull(),
  paymentDetails: jsonb("payment_details"),
  subtotal: real("subtotal").notNull(),
  shipping: real("shipping").notNull(),
  tax: real("tax").notNull(),
  total: real("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  status: true,
  shippingDetails: true,
  paymentDetails: true,
  subtotal: true,
  shipping: true,
  tax: true,
  total: true,
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: text("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  productBrand: text("product_brand").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  size: text("size"),
  color: text("color"),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  productName: true,
  productBrand: true,
  price: true,
  quantity: true,
  size: true,
  color: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
