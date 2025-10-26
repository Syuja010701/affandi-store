import { create } from "zustand";

interface Transaksi {
  id: number;
  variantId: number;
  jumlah: number;
  hargaSatuan: number | string;
  diskon?: number | string;
  customer?: {
    id: number;
    name: string;
    phone?: string;
    address?: string;
  };
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
  dataPrint: Transaksi | null;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<Transaksi, "id">) => Promise<void>;
  updateItem: (id: number, patch: Partial<Omit<Transaksi, "id">>) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
  printTransaksi: (id: number) => Promise<void>;
}

export const useTransaksiStore = create<TransaksiState>((set) => ({
  items: [],
  isLoading: false,
  dataPrint: null,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/transaksi");
      if (!res.ok) throw new Error("Gagal fetch data transaksi");
      const data: Transaksi[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error("Failed to fetch transaksi:", err);
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

      const result = await res.json();

      if (!res.ok) {
        console.error(result.error || "Gagal tambah transaksi");
        return;
      }

      // Tambahkan langsung ke list tanpa fetch ulang
      set((state) => ({
        items: [result, ...state.items],
      }));
    } catch (err) {
      console.error("Failed to add transaksi:", err);
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

      const result = await res.json();

      if (!res.ok) {
        console.error(result.error || "Gagal update transaksi");
        return;
      }

      set((state) => ({
        items: state.items.map((t) => (t.id === id ? result : t)),
      }));
    } catch (err) {
      console.error("Failed to update transaksi:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/transaksi/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal hapus transaksi");

      set((state) => ({
        items: state.items.filter((t) => t.id !== id),
      }));
    } catch (err) {
      console.error("Failed to delete transaksi:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  printTransaksi: async (id) => {
    try {
      const res = await fetch(`/api/transaksi/${id}`);
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");
      const data = await res.json();
      set({ dataPrint: data });
    } catch (err) {
      console.error("Error fetching transaksi:", err);
      set({ dataPrint: null });
    }
  },
}));
