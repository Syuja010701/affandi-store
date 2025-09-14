// types/index.ts
export interface DailyReport {
  id: number;
  total_item_transaction: number;
  total_uang_transaction: number;
  total_uang_kasir: number;
  date: string;
}

export interface CategoryReport {
  name: string;
  total: number;
}

export interface TypeReport {
  name: string;
  total: number;
}

export interface Expense {
  id: number;
  name: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  keterangan?: string;
  date: string;
}

export interface Stock {
  nama: string;
  stok: number;
}

export interface ChartOptions {
  chart: {
    id: string;
    type: string;
    height: number;
  };
  xaxis?: {
    categories: string[];
  };
  labels?: string[];
  title: {
    text: string;
    align: string;
  };
}

export interface ChartSeries {
  name: string;
  data: number[];
}