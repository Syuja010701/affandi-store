// GET one, PUT, DELETE
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const parseId = async (params: Promise<{ id: string }>) => {
  const id = Number((await params).id);
  if (isNaN(id)) throw new Error('Invalid id');
  return id;
};

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const item = await prisma.product.findUnique({
      where: { id },
      include: { jenis: true, kategoriUmur: true },
    });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const body = await req.json();
    const {
      barcode,
      nama,
      jenisId,
      kategoriId,
      ukuran,
      hargaJual,
      hargaBeli,
      stok,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(barcode && { barcode }),
        ...(nama && { nama }),
        ...(jenisId && { jenisId: Number(jenisId) }),
        ...(kategoriId && { kategoriId: Number(kategoriId) }),
        ...(ukuran && { ukuran }),
        ...(hargaJual !== undefined && { hargaJual: Number(hargaJual) }),
        ...(hargaBeli !== undefined && { hargaBeli: Number(hargaBeli) }),
        ...(stok !== undefined && { stok: Number(stok) }),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'update failed' }, { status: 400 });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'delete failed' }, { status: 400 });
  }
}