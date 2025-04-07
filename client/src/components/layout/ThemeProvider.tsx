import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Create a default value for the context to avoid the undefined check
const defaultThemeContextValue: ThemeContextType = {
  theme: "dark",
  toggleTheme: () => {}
};

// Use the default value in createContext
const ThemeContext = createContext<ThemeContextType>(defaultThemeContextValue);

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Safely access localStorage in a useEffect hook to avoid SSR issues
    try {
      const savedTheme = localStorage.getItem("theme") as Theme;
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        setTheme(savedTheme);
        
        // Make sure we remove the old class before adding the new one
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(savedTheme);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "dark" ? "light" : "dark";
      
      try {
        localStorage.setItem("theme", newTheme);
        
        // Remove both classes and then add the new one
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(newTheme);
      } catch (error) {
        console.error("Error setting theme:", error);
      }
      
      return newTheme;
    });
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(() => {
    return { theme, toggleTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use the theme context
export function useTheme() {
  return useContext(ThemeContext);
}
