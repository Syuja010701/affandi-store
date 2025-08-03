import { create } from 'zustand';

export interface ReportDaily {
  id: number;
  total_item_transaction: number;
  total_uang_transaction: number;
  total_uang_kasir: number;
  date: string;
}

interface ReportDailyState {
  reports: ReportDaily[];
  isLoading: boolean;
  fetchReports: () => Promise<void>;
  addReport: (
    payload: Omit<ReportDaily, 'id' | 'date'>
  ) => Promise<void>;
  updateReport: (
    id: number,
    patch: Partial<Omit<ReportDaily, 'id' | 'date'>>
  ) => Promise<void>;
  deleteReport: (id: number) => Promise<void>;
}

export const useReportDailyStore = create<ReportDailyState>((set) => ({
  reports: [],
  isLoading: false,

  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/report-daily');
      const data: ReportDaily[] = await res.json();
      set({ reports: data });
    } catch (err) {
      console.error('Failed to fetch reports', err);
    } finally {
      set({ isLoading: false });
    }
  },

  addReport: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/report-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const created: ReportDaily = await res.json();
      set((state) => ({ reports: [created, ...state.reports] }));
    } catch (err) {
      console.error('Failed to add report', err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateReport: async (id, patch) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`/api/report-daily/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      });
      const updated: ReportDaily = await res.json();
      set((state) => ({
        reports: state.reports.map((r) => (r.id === id ? updated : r)),
      }));
    } catch (err) {
      console.error('Failed to update report', err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReport: async (id) => {
    set({ isLoading: true });
    try {
      await fetch(`/api/report-daily/${id}`, { method: 'DELETE' });
      set((state) => ({
        reports: state.reports.filter((r) => r.id !== id),
      }));
    } catch (err) {
      console.error('Failed to delete report', err);
    } finally {
      set({ isLoading: false });
    }
  },
}));