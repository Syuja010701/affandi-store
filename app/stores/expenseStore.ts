// stores/expenseStore.ts
import { create } from 'zustand';

interface Expense {
  id: number;
  name: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  keterangan?: string;
  date: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: () => Promise<void>;
  addExpense: (payload: Omit<Expense, 'id' | 'totalHarga' | 'date'>) => Promise<void>;
  updateExpense: (
    id: number,
    patch: Partial<Omit<Expense, 'id' | 'date'>>
  ) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/expense');
      const data: Expense[] = await res.json();
      set({ expenses: data });
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addExpense: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const created: Expense = await res.json();
      set((state) => ({ expenses: [created, ...state.expenses] }));
    } catch (err) {
      console.error('Failed to add expense', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/expense/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const updated: Expense = await res.json();
      set((state) => ({
        expenses: state.expenses.map((e) => (e.id === id ? updated : e)),
      }));
    } catch (err) {
      console.error('Failed to update expense', err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/expense/${id}`, { method: 'DELETE' });
      set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete expense', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));