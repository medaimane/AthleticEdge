import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/layout/ThemeProvider";
import { CartProvider } from "./hooks/useCart";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </CartProvider>
  </ThemeProvider>
);
