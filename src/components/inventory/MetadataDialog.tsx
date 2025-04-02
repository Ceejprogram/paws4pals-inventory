import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useInventoryMetadata } from "@/lib/inventory-metadata";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MetadataDialogProps {
  type: "category" | "location" | "supplier";
  trigger?: React.ReactNode;
  buttonText?: string;
  className?: string;
  onMetadataAdded?: (id: string, name: string) => void;
  selectedValue?: string;
}

export const MetadataDialog: React.FC<MetadataDialogProps> = ({
  type,
  trigger,
  buttonText,
  className,
  onMetadataAdded,
  selectedValue,
}) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const metadata = useInventoryMetadata((state) => {
    if (type === "category") return state.categories;
    if (type === "location") return state.locations;
    return state.suppliers;
  });

  const addItem = useInventoryMetadata((state) => {
    if (type === "category") return state.addCategory;
    if (type === "location") return state.addLocation;
    return state.addSupplier;
  });

  const updateItem = useInventoryMetadata((state) => {
    if (type === "category") return state.updateCategory;
    if (type === "location") return state.updateLocation;
    return state.updateSupplier;
  });

  const deleteItem = useInventoryMetadata((state) => {
    if (type === "category") return state.deleteCategory;
    if (type === "location") return state.deleteLocation;
    return state.deleteSupplier;
  });

  const handleAddItem = () => {
    if (!newItem.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } name cannot be empty`,
      });
      return;
    }

    const newId = addItem(newItem.trim());
    toast({
      title: "Success",
      description: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } added successfully`,
    });

    if (onMetadataAdded) {
      onMetadataAdded(newId, newItem.trim());
    }

    setNewItem("");
  };

  const handleEditItem = () => {
    if (!editingItem) return;
    if (!editingItem.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } name cannot be empty`,
      });
      return;
    }

    const success = updateItem(editingItem.id, editingItem.name.trim());
    if (success) {
      toast({
        title: "Success",
        description: `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } updated successfully`,
      });
      setEditingItem(null);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `A ${type} with this name already exists`,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
    toast({
      title: "Success",
      description: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } deleted successfully`,
    });
  };

  // Label capitalization helper
  const getLabel = () => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button className={className} variant="outline" size="sm">
            {buttonText || `Manage ${getLabel()}s`}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage {getLabel()}</DialogTitle>
          <DialogDescription>
            Add, edit, or remove {type} for your inventory items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor={`new-${type}`}>Add New {getLabel()}</Label>
              <Input
                id={`new-${type}`}
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Enter ${type} name`}
              />
            </div>
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          <div className="mt-4">
            <Label>{getLabel()} List</Label>
            <div className="border rounded-md mt-2 max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[100px] text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadata.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        className="text-center text-muted-foreground py-4"
                      >
                        No {type}s found
                      </TableCell>
                    </TableRow>
                  ) : (
                    metadata.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {editingItem?.id === item.id ? (
                            <Input
                              value={editingItem.name}
                              onChange={(e) =>
                                setEditingItem({
                                  ...editingItem,
                                  name: e.target.value,
                                })
                              }
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleEditItem()
                              }
                              autoFocus
                            />
                          ) : (
                            <span
                              className={
                                selectedValue === item.id ? "font-semibold" : ""
                              }
                            >
                              {item.name}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingItem?.id === item.id ? (
                            <div className="flex justify-end space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleEditItem}
                              >
                                <Pencil className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setEditingItem(null)}
                              >
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end space-x-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  setEditingItem({
                                    id: item.id,
                                    name: item.name,
                                  })
                                }
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
