// GET one, PUT, DELETE
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const parseId = async (params: Promise<{ id: string }>) => {
  const id = Number((await params).id);
  if (isNaN(id)) throw new Error("Invalid id");
  return id;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const item = await prisma.transaksi.findUnique({
      where: { id },
      include: { product: true },
    });
    if (!item)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);
    const { jumlah: newJumlah, hargaSatuan, date, diskon } = await req.json();

    // 1. ambil transaksi lama
    const oldTx = await prisma.transaksi.findUnique({
      where: { id },
      select: { jumlah: true, productId: true },
    });
    if (!oldTx)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const delta = newJumlah - oldTx.jumlah;

    // 2. cek & update stok
    const product = await prisma.product.update({
      where: { id: oldTx.productId },
      data: { stok: { decrement: delta } },
    });

    if (product.stok < 0) {
      // rollback stok
      await prisma.product.update({
        where: { id: oldTx.productId },
        data: { stok: { increment: delta } },
      });
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    // 3. update transaksi
    const updated = await prisma.transaksi.update({
      where: { id },
      data: {
        jumlah: newJumlah,
        diskon: diskon ? diskon : 0,
        date: date ? new Date(date) : new Date(),
        hargaSatuan: hargaSatuan ? Number(hargaSatuan) : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = Number((await params).id);

    // 1. ambil data lama
    const tx = await prisma.transaksi.findUnique({
      where: { id },
      select: { jumlah: true, productId: true },
    });
    if (!tx) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // 2. kembalikan stok
    await prisma.product.update({
      where: { id: tx.productId },
      data: { stok: { increment: tx.jumlah } },
    });

    // 3. hapus transaksi
    await prisma.transaksi.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
