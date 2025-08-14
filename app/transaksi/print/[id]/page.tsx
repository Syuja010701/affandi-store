"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTransaksiStore } from "@/app/stores/transaksiStore";

export default function PrintPage() {
  const params = useParams();
  const { dataPrint, printTransaksi } = useTransaksiStore();

  useEffect(() => {
    if (!dataPrint && params?.id) {
      printTransaksi(Number(params.id));
    }
  }, [dataPrint, params, printTransaksi]);

  return (
    <div className="text-black m-0 flex flex-col items-center justify-center bg-white print:m-0">
      <h1 className="text-2xl font-bold mb-4">Transaksi Print</h1>
      {dataPrint ? (
        <div className="p-4 border rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Detail Transaksi</h2>
          <p><strong>ID:</strong> {dataPrint.id}</p>
          <p><strong>Nama:</strong> {dataPrint.productVariant?.product?.nama}</p>
          <p><strong>Total:</strong> {dataPrint.hargaSatuan}</p>
        </div>
      ) : (
        <p className="text-red-500">Memuat data transaksi...</p>
      )}
    </div>
  );
}
