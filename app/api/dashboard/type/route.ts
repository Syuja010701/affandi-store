import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
interface TypeReport {
  name: string;
  total: number;
}

export async function GET() {
  try {
    const typeReports = await prisma.jenisProduk.findMany({
      include: {
        products: {
          include: {
            variants: {
              include: {
                transaksi: true,
              },
            },
          },
        },
      },
    });

    const result: TypeReport[] = typeReports.map((type) => {
      let total = 0;
      type.products.forEach((product) => {
        product.variants.forEach((variant) => {
          variant.transaksi.forEach((t) => {
            total += Number(t.hargaSatuan) * t.jumlah;
          });
        });
      });
      return {
        name: type.name,
        total,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch type reports" },
      { status: 500 }
    );
  }
}
