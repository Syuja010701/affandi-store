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
      include: { productVariant: 
        {
          include: { product: {
            include: {
              jenis: true,
              kategoriUmur: true
            }
          } }
        }
       },
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
    const id = await parseId(params);
    const { jumlah: newJumlah, hargaSatuan, date, diskon } = await req.json();

    // Ambil transaksi lama
    const oldTx = await prisma.transaksi.findUnique({
      where: { id },
      select: { jumlah: true, variantId: true }
    });

    if (!oldTx)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const delta = newJumlah - oldTx.jumlah;

    // Update stok varian sesuai perubahan jumlah
    const variant = await prisma.productVariant.update({
      where: { id: oldTx.variantId },
      data: { stok: { decrement: delta } }
    });

    if (variant.stok < 0) {
      // rollback stok kalau minus
      await prisma.productVariant.update({
        where: { id: oldTx.variantId },
        data: { stok: { increment: delta } }
      });
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    // Update transaksi
    const updated = await prisma.transaksi.update({
      where: { id },
      data: {
        jumlah: newJumlah,
        diskon: diskon ?? 0,
        date: date ? new Date(date) : new Date(),
        hargaSatuan: hargaSatuan ? Number(hargaSatuan) : undefined
      }
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/transaksi error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}


export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);

    // Ambil data transaksi
    const tx = await prisma.transaksi.findUnique({
      where: { id },
      select: { jumlah: true, variantId: true }
    });

    if (!tx)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Kembalikan stok varian
    await prisma.productVariant.update({
      where: { id: tx.variantId },
      data: { stok: { increment: tx.jumlah } }
    });

    // Hapus transaksi
    await prisma.transaksi.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /api/transaksi error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

