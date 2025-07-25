"use client";

import { initFlowbite } from "flowbite";
import { ChartPie, Tag, User } from "flowbite-react-icons/solid";
import Link from "next/link";
import { useEffect } from "react";

export default function Sidebar() {
  useEffect(() => {
    initFlowbite(); // Re-scan the DOM for data-attributes
  }, []);
  const menu = [
    { path: "/", icon: <ChartPie />, name: "Dashboard" },
    { path: `/user`, icon: <User />, name: "User" },
    { path: `/jenis-produk`, icon: <Tag />, name: "Jenis Produk" },

  ];
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {menu.map((item, idx) => (
              <li key={idx}>
                <Link
                  href={item.path}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  {item.icon}
                  <span className="ms-3">{item.name}</span>
                </Link>
              </li>
            ))}

           
          </ul>
        </div>
      </aside>
    </>
  );
}
