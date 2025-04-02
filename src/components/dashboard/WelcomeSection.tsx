
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Banknote, ShoppingCart } from "lucide-react";

interface WelcomeSectionProps {
  stats: {
    totalItems: number;
    totalStock: number;
  };
  totalPotentialRevenue: number;
  categoriesLength: number;
}

const WelcomeSection = ({
  stats,
  totalPotentialRevenue,
  categoriesLength,
}: WelcomeSectionProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Function to format number with commas for thousands
  const formatNumberWithCommas = (number: number): string => {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your inventory today
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/inventory")}
          >
            <Package className="h-4 w-4" />
            <span>View Inventory</span>
          </Button>
          <Button
            className="bg-brand-dark hover:bg-brand-medium gap-2"
            onClick={() => navigate("/reports")}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Reports</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {/* Total Items */}
        <Card className="border-0 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-gray-500 mt-1">
                  In {categoriesLength} categories
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Stock */}
        <Card className="border-0 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{stats.totalStock}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Across all inventory items
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <ShoppingCart className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card className="border-0 shadow-sm hover:shadow transition-all duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Inventory Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {user?.role === "staff" ? (
                  <div className="text-3xl font-bold text-purple-700">
                    ₱ ****
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-purple-700">
                    ₱ {formatNumberWithCommas(totalPotentialRevenue)}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Total potential revenue
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Banknote className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default WelcomeSection;
