"use client";

import { useProductStore } from "@/app/stores/produkStore";
import { useQRCode } from "next-qrcode";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function PrintPage() {
  const { SVG } = useQRCode();
  const { id } = useParams();
  const numericId = typeof id === "string" ? Number(id) : Number(id);

  const { fetchItem, item } = useProductStore();

  useEffect(() => {
    if (!numericId) return;

    fetchItem(numericId).then(() => {
      // cetak setelah data siap
      if (typeof window !== "undefined") {
        window.print();
      }
    });
  }, [numericId, fetchItem]);

  // Hindari render sebelum data siap
  if (!item || !item.id) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="m-0 flex flex-col items-center justify-center bg-white print:m-0">
      <SVG
        text={`produk/print/${item.id}`}
        options={{
          margin: 2,
          width: 200,
          color: { dark: "#000000", light: "#ffffff" },
        }}
      />
      <div className="mt-2 text-center text-sm text-black">
        <p className="font-bold">{item.nama}</p>
        <p>Ukuran: {item.ukuran || "-"}</p>
        <p>Jenis: {item.jenis?.name || "-"}</p>
        <p>Kategori: {item.kategoriUmur?.name || "-"}</p>
      </div>
    </div>
  );
}