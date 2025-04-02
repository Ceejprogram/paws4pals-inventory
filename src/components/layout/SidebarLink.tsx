
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  to,
  label,
  icon,
  isActive,
  onClick,
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
        "hover:bg-brand-lightest hover:text-brand-dark dark:hover:bg-gray-800 dark:hover:text-gray-200",
        isActive
          ? "bg-brand-lightest text-brand-dark font-medium dark:bg-gray-800 dark:text-gray-200"
          : "text-gray-600 dark:text-gray-400"
      )}
    >
      {icon}
      <span>{label}</span>
      {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  );
};

export default SidebarLink;
