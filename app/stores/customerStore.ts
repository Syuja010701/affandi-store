// stores/customerStore.ts
import { create } from "zustand";

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CustomerState {
  items: Customer[];
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<Customer, "id">) => Promise<void>;
  updateItem: (
    id: number,
    patch: Partial<Omit<Customer, "id">>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/customer");
      const data: Customer[] = await res.json();
      set({ items: data });
    } catch (err) {
      console.error("Failed to fetch customer", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created: Customer = await res.json();
      set((state) => ({ items: [...state.items, created] }));
    } catch (err) {
      console.error("Failed to add customer", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/customer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const updated: Customer = await res.json();
      set((state) => ({
        items: state.items.map((i) => (i.id === id ? updated : i)),
      }));
    } catch (err) {
      console.error("Failed to update customer", err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteItem: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/customer/${id}`, { method: "DELETE" });
      set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
    } catch (err) {
      console.error("Failed to delete customer", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
