// pages/dashboard.tsx
"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  DailyReport,
  CategoryReport,
  TypeReport,
  Expense,
  Stock,
  ChartSeries,
} from "../types";
import { ApexOptions } from "apexcharts";
import { formatRupiah } from "@/lib/currency";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [typeReports, setTypeReports] = useState<TypeReport[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ⬇️ ambil dari localStorage / class dark
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dailyRes, categoryRes, typeRes, expenseRes, stockRes] =
          await Promise.all([
            fetch("/api/dashboard/daily"),
            fetch("/api/dashboard/category"),
            fetch("/api/dashboard/type"),
            fetch("/api/dashboard/expense"),
            fetch("/api/dashboard/stock"),
          ]);

        setDailyReports(await dailyRes.json());
        setCategoryReports(await categoryRes.json());
        setTypeReports(await typeRes.json());
        setExpenses(await expenseRes.json());
        setStocks(await stockRes.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Base theme ApexCharts
  const baseChartTheme: ApexOptions = {
    theme: {
      mode: darkMode ? "dark" : "light",
    },
    chart: {
      toolbar: { show: false },
      foreColor: darkMode ? "#E5E7EB" : "#374151", // Tailwind gray
    },
  };

  // Helper tooltip formatter
  const rupiahFormatter = (val: number) => formatRupiah(val);

  // Daily sales
  const dailySalesOptions: ApexOptions = {
    ...baseChartTheme,
    chart: {
      ...baseChartTheme.chart,
      id: "daily-sales",
      type: "line",
      height: 300,
    },
    xaxis: {
      categories: dailyReports.map((r) =>
        new Date(r.date).toLocaleDateString()
      ),
    },
    title: { text: "Penjualan Harian", align: "center" },
    tooltip: {
      y: { formatter: rupiahFormatter },
    },
  };
  const dailySalesSeries: ChartSeries[] = [
    {
      name: "Total Transaksi",
      data: dailyReports.map((r) => Number(r.total_uang_transaction)),
    },
  ];

  // Category sales
  const categorySalesOptions: ApexOptions = {
    ...baseChartTheme,
    chart: {
      ...baseChartTheme.chart,
      id: "category-sales",
      type: "bar",
      height: 300,
    },
    xaxis: { categories: categoryReports.map((r) => r.name) },
    title: { text: "Penjualan per Kategori Umur", align: "center" },
    tooltip: {
      y: { formatter: rupiahFormatter },
    },
    dataLabels: {
      formatter: rupiahFormatter,
    },
  };
  const categorySalesSeries: ChartSeries[] = [
    { name: "Total Penjualan", data: categoryReports.map((r) => r.total) },
  ];

  // Type sales (pie)
  const typeSalesOptions: ApexOptions = {
    ...baseChartTheme,
    chart: {
      ...baseChartTheme.chart,
      id: "type-sales",
      type: "pie",
      height: 300,
    },
    labels: typeReports.map((r) => r.name),
    title: { text: "Penjualan per Jenis Produk", align: "center" },
    tooltip: {
      y: { formatter: rupiahFormatter },
    },
  };
  const typeSalesSeries: number[] = typeReports.map((r) => r.total);

  // Expense
  const expenseOptions: ApexOptions = {
    ...baseChartTheme,
    chart: {
      ...baseChartTheme.chart,
      id: "expenses",
      type: "line",
      height: 300,
    },
    xaxis: {
      categories: expenses.map((e) => new Date(e.date).toLocaleDateString()),
    },
    title: { text: "Pengeluaran", align: "center" },
    tooltip: {
      y: { formatter: rupiahFormatter },
    },
  };
  const expenseSeries: ChartSeries[] = [
    {
      name: "Total Pengeluaran",
      data: expenses.map((e) => Number(e.totalHarga)),
    },
  ];

  const stockOptions: ApexOptions = {
    ...baseChartTheme,
    chart: { ...baseChartTheme.chart, id: "stock", type: "bar", height: 300 },
    xaxis: { categories: stocks.map((s) => s.nama) },
    title: { text: "Stok Produk", align: "center" },
  };
  const stockSeries: ChartSeries[] = [
    { name: "Stok Tersedia", data: stocks.map((s) => s.stok) },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Chart
            options={dailySalesOptions}
            series={dailySalesSeries}
            type="line"
            height={300}
          />
        </div>

        <div className="">
          <Chart
            options={categorySalesOptions}
            series={categorySalesSeries}
            type="bar"
            height={300}
          />
        </div>

        <div className="">
          <Chart
            options={typeSalesOptions}
            series={typeSalesSeries}
            type="pie"
            height={300}
          />
        </div>

        <div className="">
          <Chart
            options={expenseOptions}
            series={expenseSeries}
            type="line"
            height={300}
          />
        </div>

        <div className=" md:col-span-2">
          <Chart
            options={stockOptions}
            series={stockSeries}
            type="bar"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
