// stores/userStore.ts
import { create } from 'zustand';
interface User {
  id: string | number,
  name: string,
  username: string,
  password: string,
  createdAt?: string,
  updatedAt?: string
}

interface UserState {
  users: User[];
  isLoading: boolean; // <--- baru
  fetchUsers: () => Promise<void>;
  addUser: (u: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: number, patch: Partial<Omit<User, 'id'>>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  isLoading: false, 

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/user');
      const data: User[] = await res.json();
      set({ users: data });
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (user) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const created: User = await res.json();
      set((state) => ({ users: [...state.users, created] }));
    } catch (err) {
      console.error("Failed to add user", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const updated: User = await res.json();
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? updated : u)),
      }));
    } catch (err) {
      console.error("Failed to update user", err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/user/${id}`, { method: 'DELETE' });
      set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
    } catch (err) {
      console.error("Failed to delete user", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
