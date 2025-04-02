
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Settings,
  MessageSquare,
} from "lucide-react";

// Import components
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      path: "/inventory",
      label: "Inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      path: "/reports",
      label: "Reports",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      path: "/feedback",
      label: "Feedback",
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar component */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        isMobile={isMobile}
        toggleSidebar={toggleSidebar}
        navLinks={navLinks}
      />

      {/* Main content */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          sidebarOpen && !isMobile ? "ml-64" : "ml-0"
        )}
      >
        {/* Header component */}
        <Header navLinks={navLinks} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
