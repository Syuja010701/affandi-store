import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Data harus array" }, { status: 400 });
    }

    const queries = body.map((item) => {
      const { variantId, jumlah, hargaSatuan, date, diskon } = item;

      if (!variantId || jumlah <= 0 || !hargaSatuan) {
        throw new Error("Data tidak lengkap atau jumlah ≤ 0");
      }

      return prisma.transaksi.create({
        data: {
          variantId: Number(variantId),
          jumlah: Number(jumlah),
          diskon: diskon ? Number(diskon) : 0,
          hargaSatuan: Number(hargaSatuan),
          date: date ? new Date(date) : new Date(),
        },
      });
    });

    // Jalankan semua create sekaligus
    const result = await prisma.$transaction(queries);

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Transaksi gagal" }, { status: 500 });
  }
}
