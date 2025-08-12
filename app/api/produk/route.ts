// GET all & POST
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateBarcode } from '@/lib/barcode';

export const dynamic = 'force-dynamic';

// Ambil semua produk beserta variannya
export async function GET() {
  const list = await prisma.product.findMany({
    include: {
      jenis: true,
      kategoriUmur: true,
      variants: true, // tambahkan untuk ambil ukuran & stok
    },
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(list);
}

// Tambah produk baru + variannya
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nama,
      jenisId,
      kategoriId,
      hargaJual,
      hargaBeli,
      variants,
    } = body;

    if (!nama || !jenisId || !kategoriId || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate barcode unik dengan retry sederhana
    let barcode: string;
    let attempts = 0;
    do {
      barcode = generateBarcode();
      attempts++;
    } while (
      (await prisma.product.count({ where: { barcode } })) > 0 &&
      attempts < 5
    );

    // Buat produk + varian sekaligus
    const created = await prisma.product.create({
      data: {
        barcode,
        nama,
        jenisId: Number(jenisId),
        kategoriId: Number(kategoriId),
        hargaJual: Number(hargaJual),
        hargaBeli: Number(hargaBeli),
        variants: {
          create: variants.map((v: any) => ({
            ukuran: v.ukuran,
            stok: Number(v.stok ?? 0),
          })),
        },
      },
      include: {
        jenis: true,
        kategoriUmur: true,
        variants: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('POST /product error:', error);
    return NextResponse.json({ error: 'create failed' }, { status: 400 });
  }
}
