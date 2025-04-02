
import React from "react";
import StockStatusCard from "./StockStatusCard";
import { InventoryItem } from "@/lib/mock-data";

interface StockStatusSectionsProps {
  outOfStockItems: InventoryItem[];
  lowStockItems: InventoryItem[];
  overStockItems: InventoryItem[];
}

const StockStatusSections = ({
  outOfStockItems,
  lowStockItems,
  overStockItems,
}: StockStatusSectionsProps) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Out of Stock Items */}
      <StockStatusCard
        title="Out of Stock Items"
        description="Items that need immediate reordering"
        items={outOfStockItems}
        type="out-stock"
        navigateFilter="out-stock"
      />

      {/* Low Stock Items */}
      <StockStatusCard
        title="Low Stock Items"
        description="Items that need to be restocked soon"
        items={lowStockItems}
        type="low-stock"
        navigateFilter="low-stock"
      />

      {/* Over Stock Items */}
      <StockStatusCard
        title="Over Stock Items"
        description="Items exceeding inventory capacity"
        items={overStockItems}
        type="over-stock"
        navigateFilter="over-stock"
      />
    </section>
  );
};

export default StockStatusSections;
