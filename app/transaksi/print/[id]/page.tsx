"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTransaksiStore } from "@/app/stores/transaksiStore";
import { formatTanggalIndonesia } from "@/lib/formatDate";
import Image from "next/image";

export default function PrintPage() {
  const params = useParams();
  const { dataPrint, printTransaksi } = useTransaksiStore();

  useEffect(() => {
    if (!dataPrint && params?.id) {
      printTransaksi(Number(params.id));
    }
    // window.print();
  }, [dataPrint, params, printTransaksi]);

  return (
    <div className="print-container">
      {dataPrint ? (
        <div className="receipt">
          {/* Header */}
          <div className="header">
            <div className="logo">
              <Image
                src="/images/logo/logo.png"
                width={60}
                height={50}
                alt="Affandi Store"
              />
            </div>
            <p className="store-name">AFFANDI STORE</p>
            <p className="store-address">Alamat toko</p>
            <hr />
          </div>

          {/* Body */}
          <div className="content">
            <p>ID: {dataPrint.id}</p>
            <p>Nama: {dataPrint.productVariant?.product?.nama}</p>
            <p>
              Jenis: {dataPrint.productVariant?.product?.jenis?.name ?? "-"}
            </p>
            <p>
              Kategori:{" "}
              {dataPrint.productVariant?.product?.kategoriUmur?.name ?? "-"}
            </p>
            <p>Ukuran: {dataPrint.productVariant?.ukuran ?? "-"}</p>
            <p>Tanggal: {formatTanggalIndonesia(dataPrint.date ?? "-")}</p>
            <p>Harga Satuan: {dataPrint.hargaSatuan}</p>
            <p>Jumlah: {dataPrint.jumlah}</p>
            <p>Diskon: {dataPrint.diskon ?? 0}</p>
            <hr />
            <p className="total">
              Total:{" "}
              {Number(dataPrint.hargaSatuan) * dataPrint.jumlah -
                (Number(dataPrint.diskon) ?? 0)}
            </p>
          </div>

          {/* Footer */}
          <div className="footer">
            <hr />
            <p>-- TERIMA KASIH --</p>
            <p>Barang yang sudah dibeli tidak dapat dikembalikan.</p>
          </div>
        </div>
      ) : (
        <div className="receipt">
          <h2 className="title">Detail Transaksi</h2>
          <p>ID: .id</p>
          <p>Nama: productVarian?.product?.nama</p>
          <p>Total: .hargaSatuan</p>
        </div>
      )}
  {/* @page {
            size: 58mm auto; 
            margin: 2mm;
          } */}
      <style jsx>{`
        @media print {
        
          body {
            margin: 0;
            font-size: 10pt;
          }
        }

        .receipt {
          width: 58mm;
          padding: 2mm;
          font-family: monospace;
        }

        .header {
          text-align: center;
          margin-bottom: 4px;
        }
        .logo {
          display: flex;
          justify-content: center;
          margin-bottom: 2px;
        }
        .store-name {
          font-size: 12pt;
          font-weight: bold;
        }
        .store-address {
          font-size: 9pt;
        }
        .content {
          text-align: left;
          font-size: 10pt;
        }

        .total {
          font-weight: bold;
          text-align: lefts;
        }

        .footer {
          text-align: center;
          margin-top: 6px;
          font-size: 9pt;
        }

        hr {
          border: 0;
          border-top: 1px dashed #000;
          margin: 4px 0;
        }
      `}</style>
    </div>
  );
}
