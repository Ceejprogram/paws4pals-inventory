
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff";
}

interface SecurityQuestion {
  question: string;
  answer: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (role: string, answers: string[]) => Promise<string | null>;
  verifySecurityAnswers: (answers: string[]) => Promise<string | null>;
  securityQuestions: SecurityQuestion[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@paws4pals.com",
    password: "admin123",
    name: "Admin User",
    role: "admin" as const,
  },
  {
    id: "2",
    email: "staff@paws4pals.com",
    password: "staff123",
    name: "Staff User",
    role: "staff" as const,
  },
];

// Security questions for password recovery
const SECURITY_QUESTIONS: SecurityQuestion[] = [
  {
    question: "What is the name of your first pet?",
    answer: "pet",
  },
  {
    question: "What is your mother's maiden name?",
    answer: "name",
  },
  {
    question: "What city were you born in?",
    answer: "city",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Check if user is already logged in - modified to not persist across app launches
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      // If on login page and already authenticated, navigate to dashboard
      if (location.pathname === "/login") {
        navigate("/dashboard");
      }
    } else {
      // If not on login page and not authenticated, redirect to login
      if (location.pathname !== "/login") {
        navigate("/login");
      }
    }
    setIsLoading(false);
  }, [location.pathname, navigate]);

  const login = async (role: string, password: string) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Find user with matching credentials
      const matchedUser = MOCK_USERS.find(
        (u) => u.role === role && u.password === password
      );

      if (matchedUser) {
        // Remove password before storing
        const { password, ...userWithoutPassword } = matchedUser;

        // Store user in state and sessionStorage (instead of localStorage)
        setUser(userWithoutPassword);
        sessionStorage.setItem("user", JSON.stringify(userWithoutPassword));

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userWithoutPassword.name}!`,
          duration: 3000, // Auto-dismiss after 3 seconds
        });

        navigate("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid role or password. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  const forgotPassword = async (
    role: string,
    answers: string[]
  ): Promise<string | null> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Check if all answers are correct
      const allCorrect = SECURITY_QUESTIONS.every(
        (q, index) => q.answer.toLowerCase() === answers[index].toLowerCase()
      );

      // Find user with matching role
      const user = MOCK_USERS.find((u) => u.role === role);

      if (allCorrect && user) {
        setIsLoading(false);
        return user.password;
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "One or more of your answers are incorrect.",
        });
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
      console.error("Forgot password error:", error);

      setIsLoading(false);
      return null;
    }
  };

  const verifySecurityAnswers = async (
    answers: string[]
  ): Promise<string | null> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Check if all answers are correct
      const allCorrect = SECURITY_QUESTIONS.every(
        (q, index) => q.answer.toLowerCase() === answers[index].toLowerCase()
      );

      if (allCorrect && user) {
        // Get the corresponding mock user
        const mockUser = MOCK_USERS.find((u) => u.role === user.role);
        setIsLoading(false);

        if (mockUser) {
          return mockUser.password;
        }
        return null;
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "One or more of your answers are incorrect.",
        });
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
      console.error("Verify security answers error:", error);
      setIsLoading(false);
      return null;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        forgotPassword,
        verifySecurityAnswers,
        securityQuestions: SECURITY_QUESTIONS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
