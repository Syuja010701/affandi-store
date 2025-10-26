import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, transaksi } = body;

    // --- Validasi dasar ---
    if (!customer || !transaksi || !Array.isArray(transaksi) || transaksi.length === 0) {
      return NextResponse.json({ error: "Data customer atau transaksi tidak valid" }, { status: 400 });
    }

    const { name, phone, address } = customer;

    if (!phone) {
      return NextResponse.json({ error: "Nomor HP wajib diisi" }, { status: 400 });
    }

    // --- Cek atau buat customer ---
    let existingCustomer = await prisma.customer.findUnique({ where: { phone } });
    if (!existingCustomer) {
      existingCustomer = await prisma.customer.create({
        data: {
          name: name || "Tanpa Nama",
          phone,
          address: address || null,
        },
      });
    } else {
      // Jika sudah ada, update data terbaru
      await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: name || existingCustomer.name,
          address: address || existingCustomer.address,
        },
      });
    }

    // --- Jalankan transaksi database ---
    const result = await prisma.$transaction(async (tx) => {
      const transaksiList = [];

      for (const item of transaksi) {
        const { variantId, jumlah, hargaSatuan, date, diskon } = item;

        if (!variantId || jumlah <= 0 || !hargaSatuan) {
          throw new Error("Data transaksi tidak lengkap atau jumlah ≤ 0");
        }

        // Kurangi stok varian
        const variant = await tx.productVariant.update({
          where: { id: Number(variantId) },
          data: { stok: { decrement: Number(jumlah) } },
        });

        if (variant.stok < 0) {
          throw new Error(`Stok tidak cukup untuk variantId ${variantId}`);
        }

        // Simpan transaksi
        const createdTransaksi = await tx.transaksi.create({
          data: {
            variantId: Number(variantId),
            jumlah: Number(jumlah),
            hargaSatuan: Number(hargaSatuan),
            diskon: diskon ? Number(diskon) : 0,
            date: date ? new Date(date) : new Date(),
            customerId: existingCustomer.id,
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

        transaksiList.push(createdTransaksi);
      }

      return transaksiList;
    });

    return NextResponse.json(
      {
        customer: existingCustomer,
        transaksi: result,
        totalItem: result.length,
        totalHarga: result.reduce(
          (acc, t) => acc + ((t.jumlah * Number(t.hargaSatuan)) - Number(t.diskon || 0)),
          0
        ),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /api/transaksi error:", err);
    return NextResponse.json({ error: err.message || "Transaksi gagal" }, { status: 500 });
  }
}
