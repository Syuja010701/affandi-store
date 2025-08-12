import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  _: NextRequest,
  { params }: { params: { barcode: string } }
) {
  try {
    const { barcode } = params;
    console.log('Received barcode:', barcode);

    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 });
    }

    const item = await prisma.product.findUnique({
      where: { barcode },
      include: {
        jenis: true,
        kategoriUmur: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
