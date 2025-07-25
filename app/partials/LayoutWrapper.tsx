// app/components/LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../partials/Header";
import Sidebar from "../partials/sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <Sidebar />
      <div className="p-4 sm:ml-64">
        <div className="p-4 mt-14">{children}</div>
      </div>
    </>
  );
}
