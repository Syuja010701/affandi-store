import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Stock {
  nama: string;
  stok: number;
}

export async function GET(
 
) {
  try {
    const stocks = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            nama: true
          }
        }
      },
      orderBy: {
        stok: 'desc'
      }
    });
    
    const formattedStocks: Stock[] = stocks.map(stock => ({
      nama: stock.product.nama,
      stok: stock.stok
    }));
    
    return NextResponse.json(formattedStocks);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}