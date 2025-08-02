"use client";

import { initFlowbite } from "flowbite";
import { ArrowsRepeat } from "flowbite-react-icons/outline";
import {
  ChartPie,
  Cube,
  Tag,
  User,
  UsersGroup,
} from "flowbite-react-icons/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Sidebar() {
  useEffect(() => {
    initFlowbite();
  }, []);

  const pathname = usePathname();

  const menu = [
    { path: "/", icon: <ChartPie />, name: "Dashboard" },
    { path: "/user", icon: <User />, name: "User" },
    { path: "/jenis-produk", icon: <Tag />, name: "Jenis Produk" },
    { path: "/kategori-umur", icon: <UsersGroup />, name: "Kategori Umur" },
    { path: "/produk", icon: <Cube />, name: "Produk" },
    { path: "/transaksi", icon: <ArrowsRepeat />, name: "Transaksi" },
  ];

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
      suppressHydrationWarning={true} 
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {menu.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-2 rounded-lg group ${
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                      : "text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ms-3">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}