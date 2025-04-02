import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search, X, SortAsc, SortDesc, Calendar } from "lucide-react";
import { useInventoryMetadata } from "@/lib/inventory-metadata";

interface InventoryFilterProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  selectedSupplier: string;
  setSelectedSupplier: (value: string) => void;
  stockFilter: string;
  setStockFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  resetFilters: () => void;
}

export const InventoryFilter: React.FC<InventoryFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedSupplier,
  setSelectedSupplier,
  stockFilter,
  setStockFilter,
  sortOrder,
  setSortOrder,
  resetFilters,
}) => {
  const categories = useInventoryMetadata((state) => state.categories);
  const locations = useInventoryMetadata((state) => state.locations);
  const suppliers = useInventoryMetadata((state) => state.suppliers);

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-950 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[180px]">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                id="search"
                placeholder="Search by name, SKU, category..."
                className="pl-10 dark:bg-gray-800 dark:border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[150px] md:w-[160px] lg:w-[180px]">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all_categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32 md:w-40">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all_locations">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-32 md:w-40">
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
                <SelectItem value="over">Over Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-32 md:w-48">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Recently Added" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="recent">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Recently Added</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Oldest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <SortAsc className="h-4 w-4" />
                    <span>A-Z</span>
                  </div>
                </SelectItem>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <SortDesc className="h-4 w-4" />
                    <span>Z-A</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(selectedCategory !== "all_categories" ||
            selectedLocation !== "all_locations" ||
            selectedSupplier !== "all_suppliers" ||
            stockFilter !== "all" ||
            sortOrder !== "recent" ||
            searchQuery) && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1 text-xs dark:border-gray-700 dark:bg-gray-800"
              onClick={resetFilters}
            >
              <X className="h-3 w-3" />
              <span>Reset All</span>
            </Button>
          )}

          {selectedCategory !== "all_categories" && (
            <Badge variant="secondary" className="gap-1 text-xs dark:bg-gray-800">
              Category: {useInventoryMetadata.getState().getCategory(selectedCategory)?.name}
              <button onClick={() => setSelectedCategory("all_categories")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedLocation !== "all_locations" && (
            <Badge variant="secondary" className="gap-1 text-xs dark:bg-gray-800">
              Location: {useInventoryMetadata.getState().getLocation(selectedLocation)?.name}
              <button onClick={() => setSelectedLocation("all_locations")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {stockFilter !== "all" && (
            <Badge variant="secondary" className="gap-1 text-xs dark:bg-gray-800">
              Status: {stockFilter === "low" ? "Low Stock" : stockFilter === "out" ? "Out of Stock" : "Over Stock"}
              <button onClick={() => setStockFilter("all")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {sortOrder !== "recent" && (
            <Badge variant="secondary" className="gap-1 text-xs dark:bg-gray-800">
              Sort: {sortOrder === "asc" ? "A-Z" : sortOrder === "desc" ? "Z-A" : "Oldest"}
              <button onClick={() => setSortOrder("recent")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {searchQuery && (
            <Badge variant="secondary" className="gap-1 text-xs dark:bg-gray-800">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery("")}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};