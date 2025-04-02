
import React from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  navLinks: {
    path: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <header className="h-16 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {navLinks.find((link) => link.path === location.pathname)?.label || "Dashboard"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        {/* Theme toggle button */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
};

export default Header;
