import { create } from 'zustand';

interface KategoriUmur {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface KategoriUmurState {
  items: KategoriUmur[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<KategoriUmur, 'id'>) => Promise<void>;
  updateItem: (
    id: number,
    patch: Partial<Omit<KategoriUmur, 'id'>>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useKategoriUmurStore = create<KategoriUmurState>((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/kategori-umur');
      const data: KategoriUmur[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error('Failed to fetch kategoriUmur', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/kategori-umur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const created: KategoriUmur = await res.json();
      set((state) => ({ items: [...state.items, created] }));
    } catch (err) {
      console.error('Failed to add kategoriUmur', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/kategori-umur/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const updated: KategoriUmur = await res.json();
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
    } catch (err) {
      console.error('Failed to update kategoriUmur', err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/kategori-umur/${id}`, { method: 'DELETE' });
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (err) {
      console.error('Failed to delete kategoriUmur', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));