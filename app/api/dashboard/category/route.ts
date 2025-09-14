import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CategoryReport {
  name: string;
  total: number;
}

export async function GET() {
  try {
    const categoryReports = await prisma.kategoriUmur.findMany({
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

    const result: CategoryReport[] = categoryReports.map((category) => {
      let total = 0;
      category.products.forEach((product) => {
        product.variants.forEach((variant) => {
          variant.transaksi.forEach((t) => {
            total += Number(t.hargaSatuan) * t.jumlah;
          });
        });
      });
      return {
        name: category.name,
        total,
      };
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to fetch category reports" },
      { status: 500 }
    );
  }
}
