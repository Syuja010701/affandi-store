import { create } from "zustand";
interface Transaksi {
  id: number;
  variantId: number;
  jumlah: number;
  hargaSatuan: number | string;
  diskon?: number | string;
  date?: string;
  productVariant?: {
    id: number;
    productId: number;
    ukuran: string;
    stok: number;
    product?: {
      id: number;
      nama: string;
      barcode?: string;
      hargaJual: number | string;
      hargaBeli: number | string;
      jenisId: number;
      kategoriId: number;
      jenis?: {
        id: number;
        name: string;
      };
      kategoriUmur?: {
        id: number;
        name: string;
      };
    };
  };
}

interface TransaksiState {
  items: Transaksi[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<Transaksi, "id">) => Promise<void>;
  updateItem: (
    id: number,
    patch: Partial<Omit<Transaksi, "id">>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useTransaksiStore = create<TransaksiState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/transaksi");
      const data: Transaksi[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error("Failed to fetch transaksi", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/transaksi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created: Transaksi = await res.json();
      set((state) => ({ items: [created, ...state.items] }));
      get().fetchItems();
    } catch (err) {
      console.error("Failed to add transaksi", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/transaksi/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const updated: Transaksi = await res.json();
      set((state) => ({
        items: state.items.map((t) => (t.id === id ? updated : t)),
      }));
      get().fetchItems();
    } catch (err) {
      console.error("Failed to update transaksi", err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/transaksi/${id}`, { method: "DELETE" });
      set((state) => ({ items: state.items.filter((t) => t.id !== id) }));
      get().fetchItems();
    } catch (err) {
      console.error("Failed to delete transaksi", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
