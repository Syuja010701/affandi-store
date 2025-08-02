// GET all & POST
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const list = await prisma.transaksi.findMany({
    include: {
      product: {
        select: {
          id: true,
          nama: true,
          stok: true,
          kategoriId: true,
          kategoriUmur: true,
          jenis: true,
          jenisId: true,
        },
      },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, jumlah, hargaSatuan, date, diskon } = body;

    if (!productId || jumlah <= 0 || !hargaSatuan) {
      return NextResponse.json(
        { error: "Data tidak lengkap atau jumlah ≤ 0" },
        { status: 400 }
      );
    }

    // 1. Kurangi stok
    const product = await prisma.product.update({
      where: { id: Number(productId) },
      data: { stok: { decrement: Number(jumlah) } },
    });

    if (product.stok < 0) {
      // rollback jika stok jadi minus
      await prisma.product.update({
        where: { id: Number(productId) },
        data: { stok: { increment: Number(jumlah) } },
      });
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    // 2. Simpan transaksi
    const transaksi = await prisma.transaksi.create({
      data: {
        productId: Number(productId),
        jumlah: Number(jumlah),
        diskon: diskon ? Number(diskon) : 0,
        hargaSatuan: Number(hargaSatuan),
        date: date ? new Date(date) : new Date(),
      },
    });

    return NextResponse.json(transaksi, { status: 201 });
  } catch (err) {
    console.error("POST /api/transaksi error:", err);
    return NextResponse.json({ error: "Transaksi gagal" }, { status: 500 });
  }
}
