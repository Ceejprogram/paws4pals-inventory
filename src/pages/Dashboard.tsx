
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getInventoryStats, MOCK_INVENTORY } from "@/lib/mock-data";
import { useInventoryMetadata } from "@/lib/inventory-metadata";

// Import components
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import InventoryActivityChart from "@/components/dashboard/InventoryActivityChart";
import CategoryDistributionChart from "@/components/dashboard/CategoryDistributionChart";
import StockStatusSections from "@/components/dashboard/StockStatusSections";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(getInventoryStats(MOCK_INVENTORY));
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<typeof MOCK_INVENTORY>([]);
  const [totalPotentialRevenue, setTotalPotentialRevenue] = useState<number>(0);

  const categories = useInventoryMetadata((state) => state.categories);
  const locations = useInventoryMetadata((state) => state.locations);
  const suppliers = useInventoryMetadata((state) => state.suppliers);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Update inventory with metadata
      const updatedInventory = MOCK_INVENTORY.map((item) => {
        return {
          ...item,
          inventoryCap: item.inventoryCap || item.reorderPoint * 3, // Default cap is 3x reorder point
        };
      });

      // Calculate total potential revenue (quantity × selling price)
      const potentialRevenue = updatedInventory.reduce(
        (sum, item) => sum + item.quantity * item.sellingPrice,
        0
      );

      setTotalPotentialRevenue(potentialRevenue);
      setInventory(updatedInventory);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand-light"></div>
          <div className="h-4 w-32 bg-brand-light rounded"></div>
          <div className="h-3 w-24 bg-brand-light rounded"></div>
        </div>
      </div>
    );
  }

  // Filter inventory items by stock status
  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.reorderPoint && item.quantity > 0
  );
  const outOfStockItems = inventory.filter((item) => item.quantity === 0);
  const overStockItems = inventory.filter(
    (item) => item.quantity >= (item.inventoryCap || item.reorderPoint * 3)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome section with stats */}
      <WelcomeSection 
        stats={stats} 
        totalPotentialRevenue={totalPotentialRevenue} 
        categoriesLength={categories.length} 
      />

      {/* Charts section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Activity Chart */}
        <InventoryActivityChart />

        {/* Category Distribution */}
        <CategoryDistributionChart categoryDistribution={stats.categoryDistribution} />
      </section>

      {/* Stock Status Sections - reordered as requested */}
      <StockStatusSections 
        outOfStockItems={outOfStockItems}
        lowStockItems={lowStockItems}
        overStockItems={overStockItems}
      />
    </div>
  );
};

export default Dashboard;
