// GET all & POST
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ---------------- GET ---------------- */
export async function GET() {
  const list = await prisma.transaksi.findMany({
    include: {
      customer: true,
      productVariant: {
        include: {
          product: {
            include: {
              jenis: true,
              kategoriUmur: true,
            },
          },
        },
      },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(list);
}

/* ---------------- POST ---------------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      variantId,
      jumlah,
      hargaSatuan,
      date,
      diskon,
      name,
      phone,
      address,
    } = body;

    if (!variantId || jumlah <= 0 || !hargaSatuan) {
      return NextResponse.json(
        { error: "Data tidak lengkap atau jumlah ≤ 0" },
        { status: 400 }
      );
    }

    // --- 1. Cek customer ---
    let customer = null;
    if (phone) {
      customer = await prisma.customer.findUnique({ where: { phone } });
      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name: name || "Tanpa Nama",
            phone,
            address: address || null,
          },
        });
      }
    }

    // --- 2. Kurangi stok varian ---
    const variant = await prisma.productVariant.update({
      where: { id: Number(variantId) },
      data: { stok: { decrement: Number(jumlah) } },
    });

    if (variant.stok < 0) {
      // rollback kalau stok minus
      await prisma.productVariant.update({
        where: { id: Number(variantId) },
        data: { stok: { increment: Number(jumlah) } },
      });
      return NextResponse.json({ error: "Stok tidak cukup" }, { status: 400 });
    }

    // --- 3. Simpan transaksi ---
    const transaksi = await prisma.transaksi.create({
      data: {
        variantId: Number(variantId),
        jumlah: Number(jumlah),
        diskon: diskon ? Number(diskon) : 0,
        hargaSatuan: Number(hargaSatuan),
        date: date ? new Date(date) : new Date(),
        customerId: customer ? customer.id : null,
      },
      include: {
        customer: true,
        productVariant: {
          include: {
            product: {
              include: {
                jenis: true,
                kategoriUmur: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(transaksi, { status: 201 });
  } catch (err) {
    console.error("POST /api/transaksi error:", err);
    return NextResponse.json({ error: "Transaksi gagal" }, { status: 500 });
  }
}
