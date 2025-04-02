import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/lib/mock-data";
import { useInventoryMetadata } from "@/lib/inventory-metadata";
import { Pencil, Trash2, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface InventoryTableProps {
  filteredInventory: InventoryItem[];
  handleEditItem: (item: InventoryItem) => void;
  confirmDeleteItem: (id: string) => void;
  handleTransaction: (id: string) => void;
  getStockStatus: (item: InventoryItem) => {
    label: string;
    variant: "danger" | "warning" | "suspend-order" | "success";
    badge?: JSX.Element | null;
  };
  formatCurrency: (value: number) => string;
  isAdmin: boolean;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  filteredInventory,
  handleEditItem,
  confirmDeleteItem,
  handleTransaction,
  getStockStatus,
  formatCurrency,
  isAdmin,
}) => {
  const { user } = useAuth();
  const isStaffUser = user?.role === "staff";

  return (
    <Card className="border-0 shadow-sm overflow-hidden dark:bg-gray-950 dark:border-gray-800">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="dark:border-gray-800">
                <TableHead className="dark:text-gray-400 w-[180px]">
                  Name
                </TableHead>
                <TableHead className="dark:text-gray-400 w-[140px]">
                  Category
                </TableHead>
                <TableHead className="dark:text-gray-400 w-[140px]">
                  Location
                </TableHead>
                <TableHead className="dark:text-gray-400 w-[140px]">
                  Supplier
                </TableHead>
                <TableHead className="text-right dark:text-gray-400 w-[80px]">
                  Quantity
                </TableHead>
                <TableHead className="text-right dark:text-gray-400 w-[80px]">
                  Price
                </TableHead>
                <TableHead className="dark:text-gray-400 w-[110px]">
                  Status
                </TableHead>
                <TableHead className="dark:text-gray-400 w-[100px]">
                  Date
                </TableHead>
                <TableHead className="text-right dark:text-gray-400 w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <TableRow key={item.id} className="dark:border-gray-800">
                      <TableCell className="truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-[180px] font-medium dark:text-white">
                        {item.name}
                      </TableCell>
                      <TableCell className="truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] dark:text-gray-300">
                        {useInventoryMetadata
                          .getState()
                          .getCategory(item.category)?.name || ""}
                      </TableCell>
                      <TableCell className="truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] dark:text-gray-300">
                        {useInventoryMetadata
                          .getState()
                          .getLocation(item.location)?.name || ""}
                      </TableCell>
                      <TableCell className="truncate overflow-hidden whitespace-nowrap text-ellipsis max-w-[140px] dark:text-gray-300">
                        {useInventoryMetadata
                          .getState()
                          .getSupplier(item.supplier)?.name || ""}
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-300 max-w-[80px]">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-300 max-w-[100px]">
                        ₱{formatCurrency(item.sellingPrice)}
                      </TableCell>
                      <TableCell className="max-w-[100px]">
                        <Badge variant={stockStatus.variant}>
                          {stockStatus.label}
                        </Badge>
                        {stockStatus.badge && (
                          <div className="mt-1">{stockStatus.badge}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 dark:text-gray-400 max-w-[120px] truncate overflow-hidden whitespace-nowrap text-ellipsis">
                        {item.lastUpdated}
                      </TableCell>
                      <TableCell className="text-right max-w-[140px]">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleTransaction(item.id)}
                            title="Manage transaction"
                            disabled={isStaffUser}
                            className={
                              isStaffUser ? "cursor-not-allowed opacity-50" : ""
                            }
                          >
                            <ShoppingBag className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditItem(item)}
                            title="Edit item"
                            disabled={isStaffUser}
                            className={
                              isStaffUser ? "cursor-not-allowed opacity-50" : ""
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDeleteItem(item.id)}
                              title="Delete item"
                              disabled={isStaffUser}
                              className={
                                isStaffUser
                                  ? "cursor-not-allowed opacity-50"
                                  : ""
                              }
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="dark:border-gray-800">
                  <TableCell
                    colSpan={9}
                    className="h-24 text-center dark:text-gray-400"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
