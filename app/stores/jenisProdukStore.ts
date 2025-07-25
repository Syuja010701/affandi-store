// stores/jenisProdukStore.ts
import { create } from 'zustand';

interface JenisProduk {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface JenisProdukState {
  items: JenisProduk[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<JenisProduk, 'id'>) => Promise<void>;
  updateItem: (
    id: number,
    patch: Partial<Omit<JenisProduk, 'id'>>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useJenisProdukStore = create<JenisProdukState>((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/jenis-produk');
      const data: JenisProduk[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error('Failed to fetch jenisProduk', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/jenis-produk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const created: JenisProduk = await res.json();
      set((state) => ({ items: [...state.items, created] }));
    } catch (err) {
      console.error('Failed to add jenisProduk', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/jenis-produk/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const updated: JenisProduk = await res.json();
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
    } catch (err) {
      console.error('Failed to update jenisProduk', err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/jenis-produk/${id}`, { method: 'DELETE' });
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (err) {
      console.error('Failed to delete jenisProduk', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));