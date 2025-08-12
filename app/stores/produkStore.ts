import { create } from "zustand";

interface ProductVariant {
  id?: number;
  ukuran: string;
  stok: number;
}

interface Product {
  id: number;
  barcode?: string;
  nama: string;
  jenisId: number;
  kategoriId: number;
  hargaJual: number;
  hargaBeli: number;
  createdAt?: string;
  updatedAt?: string;
  jenis?: { id: number; name: string };
  kategoriUmur?: { id: number; name: string };
  variants?: ProductVariant[];
}

interface ProductState {
  items: Product[];
  item: Product;
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  fetchItem: (id: number | string) => Promise<void>;
  addItem: (payload: Omit<Product, "id">) => Promise<void>;
  updateItem: (id: number, patch: Partial<Omit<Product, "id">>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  items: [],
  item: {} as Product,
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/produk");
      const data: Product[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchItem: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/produk/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const data: Product = await res.json();
      set({ item: data });
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/produk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // payload sudah bisa include variants
      });
      const created: Product = await res.json();
      set((state) => ({ items: [...state.items, created] }));
    } catch (err) {
      console.error("Failed to add product", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true });
    try {
      console.log("Updating product", id, patch);
      const res = await fetch(`/api/produk/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch), // patch bisa include variants
      });
      
      const updated: Product = await res.json();
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? updated : p)),
        item: updated,
      }));
    } catch (err) {
      console.error("Failed to update product", err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/produk/${id}`, { method: "DELETE" });
      set((state) => ({ items: state.items.filter((p) => p.id !== id) }));
    } catch (err) {
      console.error("Failed to delete product", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
