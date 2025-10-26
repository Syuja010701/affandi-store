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
  item: Customer | null;
  isLoading: boolean;

  fetchItems: () => Promise<void>;
  addItem: (payload: Omit<Customer, "id">) => Promise<void>;
  searchItemByPhone: (phone: string) => Promise<void>;

  message: string | null;
  updateItem: (
    id: number,
    patch: Partial<Omit<Customer, "id">>
  ) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set) => ({
  items: [],
  item: null,
  message: null,
  isLoading: false,

  searchItemByPhone: async (phone) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/customer/phone/${phone}`);

      if (res.status === 404) {
        set({ item: null, message: "Customer not found" });
        return;
      }

      if (res.ok) {
        const data: Customer = await res.json();
        set({ item: data, message: null });
      }
    } catch (err) {
      console.error("Failed to fetch customer", err);
      set({ message: "Error fetching customer" });
    } finally {
      set({ isLoading: false });
    }
  },
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
