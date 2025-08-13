import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";

const parseBarcode = async (params: Promise<{ barcode: string }>) => {
  const barcode = (await params).barcode;
  if (!barcode) throw new Error("Invalid barcode");
  return barcode;
};

export async function GET(
  _: NextRequest,
  context: { params: Promise<{ barcode: string }> }
) {
  try {
    const barcode = await parseBarcode(context.params);

    const item = await prisma.product.findUnique({
      where: { barcode },
      include: {
        jenis: true,
        variants: true,
        kategoriUmur: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Invalid barcode" }, { status: 400 });
  }
}
