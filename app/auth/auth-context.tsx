import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Define user type
interface User {
  email: string;
  name: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample user data - in a real app, this would come from a database
const SAMPLE_USERS = [
  { email: "bronifty@gmail.com", password: "password123", name: "Demo User" },
  { email: "admin@example.com", password: "admin123", name: "Admin User" },
];

// Provider component that wraps your app and makes auth object available to any child component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Find user with matching credentials
    const matchedUser = SAMPLE_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (matchedUser) {
      // Create user object without password
      const { password, ...userWithoutPassword } = matchedUser;
      setUser(userWithoutPassword);

      // Store user in localStorage
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Provide the auth context value
  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
