import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { InventoryItem, MOCK_INVENTORY } from "@/lib/mock-data";
import { useInventoryMetadata } from "@/lib/inventory-metadata";
import { format } from "date-fns";
import { InventoryFilter } from "@/components/inventory/InventoryFilter";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryModals } from "@/components/inventory/InventoryModals";
import { Plus, Clock, AlertTriangle, ArrowUp, ShieldAlert } from "lucide-react";

const Inventory = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === "admin";
  const isStaffUser = user?.role === "staff";
  const categories = useInventoryMetadata((state) => state.categories);
  const locations = useInventoryMetadata((state) => state.locations);
  const suppliers = useInventoryMetadata((state) => state.suppliers);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("all_categories");
  const [selectedLocation, setSelectedLocation] =
    useState<string>("all_locations");
  const [selectedSupplier, setSelectedSupplier] =
    useState<string>("all_suppliers");
  const [stockFilter, setStockFilter] = useState<string>(
    location.state?.filter === "low-stock"
      ? "low"
      : location.state?.filter === "out-stock"
      ? "out"
      : location.state?.filter === "over-stock"
      ? "over"
      : "all"
  );
  const [sortOrder, setSortOrder] = useState<string>("recent");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{
    name?: boolean;
    sku?: boolean;
    category?: boolean;
    location?: boolean;
    supplier?: boolean;
  }>({});
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [transactionItem, setTransactionItem] = useState<InventoryItem | null>(
    null
  );
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [transactionQuantity, setTransactionQuantity] = useState<number>(1);
  const [transactionType, setTransactionType] = useState<
    "sold" | "purchase" | null
  >(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const updatedInventory = MOCK_INVENTORY.map((item) => ({
        ...item,
        category: categories.find((c) => c.name === item.category)?.id || "",
        location: locations.find((l) => l.name === item.location)?.id || "",
        supplier: suppliers.find((s) => s.name === item.supplier)?.id || "",
        inventoryCap: item.inventoryCap || item.reorderPoint * 3,
      }));
      setInventory(updatedInventory);
      setIsLoading(false);
    }, 1000);
  }, [categories, locations, suppliers]);

  useEffect(() => {
    let filtered = [...inventory];

    // Apply filters
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.sku.toLowerCase().includes(query) ||
          useInventoryMetadata
            .getState()
            .getCategory(item.category)
            ?.name.toLowerCase()
            .includes(query) ||
          useInventoryMetadata
            .getState()
            .getSupplier(item.supplier)
            ?.name.toLowerCase()
            .includes(query)
      );
    }
    if (selectedCategory !== "all_categories")
      filtered = filtered.filter((item) => item.category === selectedCategory);
    if (selectedLocation !== "all_locations")
      filtered = filtered.filter((item) => item.location === selectedLocation);
    if (selectedSupplier !== "all_suppliers")
      filtered = filtered.filter((item) => item.supplier === selectedSupplier);
    if (stockFilter === "low")
      filtered = filtered.filter(
        (item) => item.quantity <= item.reorderPoint && item.quantity > 0
      );
    else if (stockFilter === "out")
      filtered = filtered.filter((item) => item.quantity === 0);
    else if (stockFilter === "over")
      filtered = filtered.filter((item) => item.quantity >= item.inventoryCap);

    // Apply sorting
    if (sortOrder === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ); // Newest first
    } else if (sortOrder === "oldest") {
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ); // Oldest first
    } else if (sortOrder === "asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name)); // A-Z
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.name.localeCompare(a.name)); // Z-A
    }

    setFilteredInventory(filtered);
  }, [
    inventory,
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedSupplier,
    stockFilter,
    sortOrder,
  ]);

  const handleEditItem = (item: InventoryItem) => {
    setCurrentItem(item);
    setIsNewItem(false);
    setIsEditDialogOpen(true);
    setFormErrors({});
  };

  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `INV-${1000 + inventory.length + 1}`,
      name: "",
      sku: `SKU${100000 + inventory.length + 1}`,
      category: "",
      quantity: 0,
      reorderPoint: 10,
      inventoryCap: 100,
      supplier: "",
      location: "",
      expirationDate: null,
      lastUpdated: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString().split("T")[0],
      notes: "",
      costPrice: 0,
      sellingPrice: 0,
    };
    setCurrentItem(newItem);
    setIsNewItem(true);
    setIsEditDialogOpen(true);
    setFormErrors({});
  };

  const validateItemForm = () => {
    if (!currentItem) return false;
    const errors: typeof formErrors = {};
    if (!currentItem.name.trim()) errors.name = true;
    if (!currentItem.sku.trim()) errors.sku = true;
    if (!currentItem.category) errors.category = true;
    if (!currentItem.location) errors.location = true;
    if (!currentItem.supplier) errors.supplier = true;
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveItem = () => {
    if (!currentItem || !validateItemForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }
    const duplicateName = inventory.find(
      (item) =>
        item.name.toLowerCase() === currentItem.name.toLowerCase() &&
        item.id !== currentItem.id
    );
    const duplicateSKU = inventory.find(
      (item) =>
        item.sku.toLowerCase() === currentItem.sku.toLowerCase() &&
        item.id !== currentItem.id
    );
    if (duplicateName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An item with this name already exists.",
      });
      setFormErrors((prev) => ({ ...prev, name: true }));
      return;
    }
    if (duplicateSKU) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An item with this SKU already exists.",
      });
      setFormErrors((prev) => ({ ...prev, sku: true }));
      return;
    }
    const updatedItem = {
      ...currentItem,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    if (isNewItem) {
      setInventory((prev) => [...prev, updatedItem]);
      toast({
        title: "Item Added",
        description: `${updatedItem.name} has been added to inventory.`,
      });
    } else {
      setInventory((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      toast({
        title: "Item Updated",
        description: `${updatedItem.name} has been updated.`,
      });
    }
    setIsEditDialogOpen(false);
  };

  const confirmDeleteItem = (id: string) => setItemToDelete(id);

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    const item = inventory.find((i) => i.id === itemToDelete);
    if (item) {
      setInventory((prev) => prev.filter((i) => i.id !== itemToDelete));
      toast({
        title: "Item Deleted",
        description: `${item.name} has been removed from inventory.`,
        variant: "destructive",
      });
    }
    setItemToDelete(null);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all_categories");
    setSelectedLocation("all_locations");
    setSelectedSupplier("all_suppliers");
    setStockFilter("all");
    setSortOrder("recent");
  };

  const handleAddCategory = (id: string) =>
    currentItem && setCurrentItem({ ...currentItem, category: id });
  const handleAddLocation = (id: string) =>
    currentItem && setCurrentItem({ ...currentItem, location: id });
  const handleAddSupplier = (id: string) =>
    currentItem && setCurrentItem({ ...currentItem, supplier: id });

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0)
      return { label: "Out of Stock", variant: "danger" as const };
    if (item.quantity <= item.reorderPoint)
      return { label: "Low Stock", variant: "warning" as const };
    if (item.quantity >= item.inventoryCap)
      return { label: "Over Stock", variant: "suspend-order" as const };
    return { label: "In Stock", variant: "success" as const };
  };

  const formatCurrency = (value: number) =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleTransaction = (id: string) => {
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setTransactionItem(item);
      setTransactionQuantity(1);
      setTransactionType(null);
      setIsTransactionDialogOpen(true);
    }
  };

  const handleTransactionConfirm = () => {
    if (!transactionItem || !transactionType) return;

    if (transactionType === "sold") {
      if (transactionQuantity > transactionItem.quantity) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Quantity sold cannot exceed current quantity.",
        });
        return;
      }
      const updatedItem = {
        ...transactionItem,
        quantity: transactionItem.quantity - transactionQuantity,
      };
      setInventory((prev) =>
        prev.map((item) =>
          item.id === transactionItem.id ? updatedItem : item
        )
      );
      toast({
        title: "Item Sold",
        description: `${transactionQuantity} ${transactionItem.name}${
          transactionQuantity > 1 ? "s" : ""
        } marked as sold.`,
      });
    } else if (transactionType === "purchase") {
      const updatedItem = {
        ...transactionItem,
        quantity: transactionItem.quantity + transactionQuantity,
      };
      setInventory((prev) =>
        prev.map((item) =>
          item.id === transactionItem.id ? updatedItem : item
        )
      );
      toast({
        title: "Item Purchased",
        description: `${transactionQuantity} ${transactionItem.name}${
          transactionQuantity > 1 ? "s" : ""
        } added to inventory.`,
      });
    }

    setIsTransactionDialogOpen(false);
    setTransactionItem(null);
    setTransactionQuantity(1);
    setTransactionType(null);
  };

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

  const outOfStockItems = inventory.filter((item) => item.quantity === 0);
  const lowStockItems = inventory.filter(
    (item) => item.quantity <= item.reorderPoint && item.quantity > 0
  );
  const overStockItems = inventory.filter(
    (item) => item.quantity >= item.inventoryCap
  );
  const hasStockAlerts =
    outOfStockItems.length > 0 ||
    lowStockItems.length > 0 ||
    overStockItems.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your stock levels and product details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {hasStockAlerts && (
            <div className="flex flex-wrap gap-2 mr-2">
              {outOfStockItems.length > 0 && (
                <Badge variant="danger" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{outOfStockItems.length} out of stock</span>
                </Badge>
              )}
              {lowStockItems.length > 0 && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{lowStockItems.length} low stock</span>
                </Badge>
              )}
              {overStockItems.length > 0 && (
                <Badge
                  variant="suspend-order"
                  className="flex items-center gap-1"
                >
                  <ArrowUp className="h-3 w-3" />
                  <span>{overStockItems.length} over stock</span>
                </Badge>
              )}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
            <Clock className="h-4 w-4" />
            <span>{format(currentDateTime, "MMMM d, yyyy • h:mm a")}</span>
          </div>
          {isAdmin && (
            <Button
              className="bg-brand-dark hover:bg-brand-medium gap-2"
              onClick={handleAddItem}
              disabled={isStaffUser}
            >
              <Plus className="h-4 w-4" />
              <span>Add New Item</span>
            </Button>
          )}
          {isStaffUser && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-300"
            >
              <ShieldAlert className="h-3 w-3" />
              <span>View-only access</span>
            </Badge>
          )}
        </div>
      </div>

      <InventoryFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        resetFilters={resetFilters}
      />

      <InventoryTable
        filteredInventory={filteredInventory}
        handleEditItem={handleEditItem}
        confirmDeleteItem={confirmDeleteItem}
        handleTransaction={handleTransaction}
        getStockStatus={getStockStatus}
        formatCurrency={formatCurrency}
        isAdmin={isAdmin}
      />

      <InventoryModals
        currentItem={currentItem}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isNewItem={isNewItem}
        formErrors={formErrors}
        setCurrentItem={setCurrentItem}
        setFormErrors={setFormErrors}
        handleSaveItem={handleSaveItem}
        itemToDelete={itemToDelete}
        setItemToDelete={setItemToDelete}
        handleDeleteItem={handleDeleteItem}
        handleAddCategory={handleAddCategory}
        handleAddLocation={handleAddLocation}
        handleAddSupplier={handleAddSupplier}
        transactionItem={transactionItem}
        isTransactionDialogOpen={isTransactionDialogOpen}
        setIsTransactionDialogOpen={setIsTransactionDialogOpen}
        transactionQuantity={transactionQuantity}
        setTransactionQuantity={setTransactionQuantity}
        handleTransactionConfirm={handleTransactionConfirm}
        transactionType={transactionType}
        setTransactionType={setTransactionType}
      />
    </div>
  );
};

export default Inventory;
