// GET all & POST
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Ambil semua produk beserta variannya
export async function GET() {
  const list = await prisma.product.findMany({
    include: {
      jenis: true,
      kategoriUmur: true,
      variants: true, // tambahkan untuk ambil ukuran & stok
    },
    orderBy: { id: "asc" },
  });

  const jenisProduk = await prisma.jenisProduk.findMany({
    orderBy: { id: "asc" },
  });

  const kategoriUmur = await prisma.kategoriUmur.findMany({
    orderBy: { id: "asc" },
  });

  return NextResponse.json({ list, jenisProduk, kategoriUmur });
}
