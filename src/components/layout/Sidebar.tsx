
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarLink from "./SidebarLink";
import logo from "@/assets/paws4palslogo.png";

interface SidebarProps {
  sidebarOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  navLinks: {
    path: string;
    label: string;
    icon: React.ReactNode;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  isMobile,
  toggleSidebar,
  navLinks,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-950 shadow-md transition-transform duration-300 ease-in-out",
        "flex flex-col border-r border-gray-100 dark:border-gray-800",
        isMobile && !sidebarOpen && "-translate-x-full",
        isMobile && sidebarOpen && "translate-x-0"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 dark:border-gray-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 overflow-hidden">
            <img
              src={logo}
              alt="PAWS4PALS Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            PAWS4PALS
          </h1>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navLinks.map((link) => (
          <SidebarLink
            key={link.path}
            to={link.path}
            label={link.label}
            icon={link.icon}
            isActive={location.pathname === link.path}
            onClick={isMobile ? toggleSidebar : undefined}
          />
        ))}
      </nav>

      {/* User profile section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage src="" alt={user?.name || "User"} />
            <AvatarFallback className="bg-brand-medium text-white">
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
