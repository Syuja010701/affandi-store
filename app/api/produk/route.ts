// GET all & POST
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateBarcode } from '@/lib/barcode';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await prisma.product.findMany({
    include: { jenis: true, kategoriUmur: true },
    orderBy: { id: 'asc' },
  });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Tidak perlu barcode dari body
    const {
      nama,
      jenisId,
      kategoriId,
      ukuran,
      hargaJual,
      hargaBeli,
      stok,
    } = body;

    if (!nama || !jenisId || !kategoriId || !ukuran) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Generate barcode unik dengan retry sederhana
    let barcode: string;
    let attempts = 0;
    do {
      barcode = generateBarcode();
      attempts++;
    } while (
      (await prisma.product.count({ where: { barcode } })) > 0 &&
      attempts < 5
    );

    const created = await prisma.product.create({
      data: {
        barcode,
        nama,
        jenisId: Number(jenisId),
        kategoriId: Number(kategoriId),
        ukuran,
        hargaJual: Number(hargaJual),
        hargaBeli: Number(hargaBeli),
        stok: Number(stok ?? 0),
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'create failed' }, { status: 400 });
  }
}