
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowUp, ChevronRight, XCircle } from "lucide-react";
import { InventoryItem } from "@/lib/mock-data";

interface StockStatusCardProps {
  title: string;
  description: string;
  items: InventoryItem[];
  type: "out-stock" | "low-stock" | "over-stock";
  navigateFilter: string;
}

const StockStatusCard = ({
  title,
  description,
  items,
  type,
  navigateFilter,
}: StockStatusCardProps) => {
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case "out-stock":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "low-stock":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "over-stock":
        return <ArrowUp className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "out-stock":
        return "bg-red-100";
      case "low-stock":
        return "bg-amber-100";
      case "over-stock":
        return "bg-blue-100";
      default:
        return "bg-amber-100";
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "out-stock":
        return "danger";
      case "low-stock":
        return "warning";
      case "over-stock":
        return "suspend-order";
      default:
        return "warning";
    }
  };

  const getBadgeText = (type: string) => {
    switch (type) {
      case "out-stock":
        return "Order item!";
      case "low-stock":
        return "Reorder item!";
      case "over-stock":
        return "Suspend Order!";
      default:
        return "Warning!";
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-brand-dark"
            onClick={() => navigate("/inventory", { state: { filter: navigateFilter } })}
          >
            <span>View All</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${getBgColor(type)} flex items-center justify-center`}>
                  {getIcon(type)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={getBadgeVariant(type)} className="mb-1">
                  {getBadgeText(type)}
                </Badge>
                {type === "out-stock" && (
                  <p className="text-xs text-gray-500">
                    Reorder point: {item.reorderPoint}
                  </p>
                )}
                {type === "low-stock" && (
                  <p className="text-xs text-gray-500">
                    {item.quantity} left (min: {item.reorderPoint})
                  </p>
                )}
                {type === "over-stock" && (
                  <p className="text-xs text-gray-500">
                    {item.quantity} / {item.inventoryCap || item.reorderPoint * 3}
                  </p>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No {title.toLowerCase()} to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockStatusCard;
