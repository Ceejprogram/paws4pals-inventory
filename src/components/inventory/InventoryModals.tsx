import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InventoryItem } from "@/lib/mock-data";
import { MetadataDialog } from "@/components/inventory/MetadataDialog";
import { useInventoryMetadata } from "@/lib/inventory-metadata";

interface FormErrors {
  name?: boolean;
  sku?: boolean;
  category?: boolean;
  location?: boolean;
  supplier?: boolean;
}

interface InventoryModalsProps {
  currentItem: InventoryItem | null;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isNewItem: boolean;
  formErrors: FormErrors;
  setCurrentItem: (item: InventoryItem) => void;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  handleSaveItem: () => void;
  itemToDelete: string | null;
  setItemToDelete: (id: string | null) => void;
  handleDeleteItem: () => void;
  handleAddCategory: (id: string, name: string) => void;
  handleAddLocation: (id: string, name: string) => void;
  handleAddSupplier: (id: string, name: string) => void;
  transactionItem: InventoryItem | null;
  isTransactionDialogOpen: boolean;
  setIsTransactionDialogOpen: (open: boolean) => void;
  transactionQuantity: number;
  setTransactionQuantity: (quantity: number) => void;
  handleTransactionConfirm: () => void;
  transactionType: "sold" | "purchase" | null;
  setTransactionType: (type: "sold" | "purchase" | null) => void;
}

export const InventoryModals: React.FC<InventoryModalsProps> = ({
  currentItem,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isNewItem,
  formErrors,
  setCurrentItem,
  setFormErrors,
  handleSaveItem,
  itemToDelete,
  setItemToDelete,
  handleDeleteItem,
  handleAddCategory,
  handleAddLocation,
  handleAddSupplier,
  transactionItem,
  isTransactionDialogOpen,
  setIsTransactionDialogOpen,
  transactionQuantity,
  setTransactionQuantity,
  handleTransactionConfirm,
  transactionType,
  setTransactionType,
}) => {
  const categories = useInventoryMetadata((state) => state.categories);
  const locations = useInventoryMetadata((state) => state.locations);
  const suppliers = useInventoryMetadata((state) => state.suppliers);

  return (
    <>
      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!itemToDelete}
        onOpenChange={(open) => !open && setItemToDelete(null)}
      >
        <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-white">
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this item? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleDeleteItem}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit/Add Item Dialog */}
      {currentItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                {isNewItem ? "Add New Item" : "Edit Item"}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {isNewItem
                  ? "Add a new item to your inventory"
                  : `Update details for ${currentItem.name}`}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className={
                    formErrors.name ? "text-red-500" : "dark:text-white"
                  }
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={currentItem.name}
                  onChange={(e) => {
                    setCurrentItem({ ...currentItem, name: e.target.value });
                    if (e.target.value.trim())
                      setFormErrors((prev) => ({ ...prev, name: false }));
                  }}
                  className={`dark:bg-gray-800 dark:border-gray-700 ${
                    formErrors.name ? "border-red-500" : ""
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">Name is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="sku"
                  className={
                    formErrors.sku ? "text-red-500" : "dark:text-white"
                  }
                >
                  SKU
                </Label>
                <Input
                  id="sku"
                  value={currentItem.sku}
                  onChange={(e) => {
                    setCurrentItem({ ...currentItem, sku: e.target.value });
                    if (e.target.value.trim())
                      setFormErrors((prev) => ({ ...prev, sku: false }));
                  }}
                  className={`dark:bg-gray-800 dark:border-gray-700 ${
                    formErrors.sku ? "border-red-500" : ""
                  }`}
                />
                {formErrors.sku && (
                  <p className="text-xs text-red-500">SKU is required</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="category"
                    className={
                      formErrors.category ? "text-red-500" : "dark:text-white"
                    }
                  >
                    Category
                  </Label>
                  <MetadataDialog
                    type="category"
                    buttonText="Manage"
                    className="h-6 text-xs"
                    onMetadataAdded={handleAddCategory}
                    selectedValue={currentItem.category}
                  />
                </div>
                <Select
                  value={currentItem.category}
                  onValueChange={(value) => {
                    setCurrentItem({ ...currentItem, category: value });
                    setFormErrors((prev) => ({ ...prev, category: false }));
                  }}
                >
                  <SelectTrigger
                    className={`dark:bg-gray-800 dark:border-gray-700 ${
                      formErrors.category ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <p className="text-xs text-red-500">Category is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="dark:text-white">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reorderPoint" className="dark:text-white">
                  Reorder Point
                </Label>
                <Input
                  id="reorderPoint"
                  type="number"
                  min="0"
                  value={currentItem.reorderPoint}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      reorderPoint: parseInt(e.target.value) || 0,
                    })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inventoryCap" className="dark:text-white">
                  Inventory Cap
                </Label>
                <Input
                  id="inventoryCap"
                  type="number"
                  min="0"
                  value={currentItem.inventoryCap}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      inventoryCap: parseInt(e.target.value) || 0,
                    })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="location"
                    className={
                      formErrors.location ? "text-red-500" : "dark:text-white"
                    }
                  >
                    Location
                  </Label>
                  <MetadataDialog
                    type="location"
                    buttonText="Manage"
                    className="h-6 text-xs"
                    onMetadataAdded={handleAddLocation}
                    selectedValue={currentItem.location}
                  />
                </div>
                <Select
                  value={currentItem.location}
                  onValueChange={(value) => {
                    setCurrentItem({ ...currentItem, location: value });
                    setFormErrors((prev) => ({ ...prev, location: false }));
                  }}
                >
                  <SelectTrigger
                    className={`dark:bg-gray-800 dark:border-gray-700 ${
                      formErrors.location ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.location && (
                  <p className="text-xs text-red-500">Location is required</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="supplier"
                    className={
                      formErrors.supplier ? "text-red-500" : "dark:text-white"
                    }
                  >
                    Supplier
                  </Label>
                  <MetadataDialog
                    type="supplier"
                    buttonText="Manage"
                    className="h-6 text-xs"
                    onMetadataAdded={handleAddSupplier}
                    selectedValue={currentItem.supplier}
                  />
                </div>
                <Select
                  value={currentItem.supplier}
                  onValueChange={(value) => {
                    setCurrentItem({ ...currentItem, supplier: value });
                    setFormErrors((prev) => ({ ...prev, supplier: false }));
                  }}
                >
                  <SelectTrigger
                    className={`dark:bg-gray-800 dark:border-gray-700 ${
                      formErrors.supplier ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.supplier && (
                  <p className="text-xs text-red-500">Supplier is required</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice" className="dark:text-white">
                  Cost
                </Label>
                <Input
                  id="costPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.costPrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      costPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice" className="dark:text-white">
                  Price
                </Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={currentItem.sellingPrice}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      sellingPrice: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="notes" className="dark:text-white">
                  Notes
                </Label>
                <Input
                  id="notes"
                  value={currentItem.notes}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, notes: e.target.value })
                  }
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveItem}>
                {isNewItem ? "Add Item" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Transaction Dialog */}
      {transactionItem && (
        <Dialog
          open={isTransactionDialogOpen}
          onOpenChange={setIsTransactionDialogOpen}
        >
          <DialogContent className="sm:max-w-[400px] dark:bg-gray-900 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle className="dark:text-white">
                Manage Transaction
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                Select an action for {transactionItem.name}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {transactionType === null ? (
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-x-4 justify-center w-full">
                    <Button
                      variant="outline"
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      onClick={() => setTransactionType("sold")}
                    >
                      Sold
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      onClick={() => setTransactionType("purchase")}
                    >
                      Purchased
                    </Button>
                  </div>

                  {/* <Button
                    variant="outline"
                    style={{ marginLeft: "135px" }} // Adjust this value as needed
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    onClick={() => {
                      setIsTransactionDialogOpen(false);
                      setTransactionType(null);
                    }}
                  >
                    Cancel
                  </Button> */}
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm dark:text-gray-300">
                      <strong>Item:</strong> {transactionItem.name}
                    </p>
                    <p className="text-sm dark:text-gray-300">
                      <strong>Current Quantity:</strong>{" "}
                      {transactionItem.quantity}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="transactionQuantity"
                      className="dark:text-white"
                    >
                      {transactionType === "sold"
                        ? "Quantity Sold"
                        : "Quantity Purchased"}
                    </Label>
                    <Input
                      id="transactionQuantity"
                      type="number"
                      min="1"
                      max={
                        transactionType === "sold"
                          ? transactionItem.quantity
                          : undefined
                      }
                      value={transactionQuantity}
                      onChange={(e) =>
                        setTransactionQuantity(parseInt(e.target.value) || 1)
                      }
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              {transactionType === null ? null : (
                <Button
                  variant="outline"
                  onClick={() => setTransactionType(null)} // Back button resets to choice screen
                  className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                >
                  Back
                </Button>
              )}
              {transactionType && (
                <Button onClick={handleTransactionConfirm}>Save Changes</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
