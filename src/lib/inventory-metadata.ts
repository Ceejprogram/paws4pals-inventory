import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";

// Define types for metadata items
interface MetadataItem {
  id: string;
  name: string;
}

interface InventoryMetadataState {
  categories: MetadataItem[];
  locations: MetadataItem[];
  suppliers: MetadataItem[];
  addCategory: (name: string) => string;
  addLocation: (name: string) => string;
  addSupplier: (name: string) => string;
  updateCategory: (id: string, name: string) => boolean;
  updateLocation: (id: string, name: string) => boolean;
  updateSupplier: (id: string, name: string) => boolean;
  deleteCategory: (id: string) => void;
  deleteLocation: (id: string) => void;
  deleteSupplier: (id: string) => void;
  getCategory: (id: string) => MetadataItem | undefined;
  getLocation: (id: string) => MetadataItem | undefined;
  getSupplier: (id: string) => MetadataItem | undefined;
}

// Create Zustand store with persistence
export const useInventoryMetadata = create<InventoryMetadataState>()(
  persist(
    (set, get) => ({
      categories: [
        { id: "cat-1", name: "Electronics" },
        { id: "cat-2", name: "Clothing" },
      ],
      locations: [
        { id: "loc-1", name: "Warehouse A" },
        { id: "loc-2", name: "Storefront" },
      ],
      suppliers: [
        { id: "sup-1", name: "Supplier X" },
        { id: "sup-2", name: "Supplier Y" },
      ],

      addCategory: (name) => {
        const newId = uuidv4();
        const newCategory = { id: newId, name };
        set((state) => ({ categories: [...state.categories, newCategory] }));
        return newId;
      },

      addLocation: (name) => {
        const newId = uuidv4();
        const newLocation = { id: newId, name };
        set((state) => ({ locations: [...state.locations, newLocation] }));
        return newId;
      },

      addSupplier: (name) => {
        const newId = uuidv4();
        const newSupplier = { id: newId, name };
        set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
        return newId;
      },

      updateCategory: (id, name) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id ? { ...category, name } : category
          ),
        }));
        return true;
      },

      updateLocation: (id, name) => {
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === id ? { ...location, name } : location
          ),
        }));
        return true;
      },

      updateSupplier: (id, name) => {
        set((state) => ({
          suppliers: state.suppliers.map((supplier) =>
            supplier.id === id ? { ...supplier, name } : supplier
          ),
        }));
        return true;
      },

      deleteCategory: (id) => {
        // Check if the category is being used by any inventory items
        // If so, either prevent deletion or reassign those items to a default category
        set((state) => ({
          categories: state.categories.filter((category) => category.id !== id),
        }));
      },

      deleteLocation: (id) => {
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== id),
        }));
      },

      deleteSupplier: (id) => {
        set((state) => ({
          suppliers: state.suppliers.filter((supplier) => supplier.id !== id),
        }));
      },

      getCategory: (id) => {
        const categories = get().categories;
        return categories.find((category) => category.id === id);
      },

      getLocation: (id) => {
        const locations = get().locations;
        return locations.find((location) => location.id === id);
      },

      getSupplier: (id) => {
        const suppliers = get().suppliers;
        return suppliers.find((supplier) => supplier.id === id);
      },
    }),
    {
      name: "inventory-metadata-storage",
      // Fix the storage type issue
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);
