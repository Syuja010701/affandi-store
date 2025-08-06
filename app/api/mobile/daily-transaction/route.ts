import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay, endOfDay } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
 
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date');
  
  const filterDate = dateParam ? new Date(dateParam) : new Date();

  const transactions = await prisma.transaksi.findMany({
    where: {
      date: {
        gte: startOfDay(filterDate),
        lte: endOfDay(filterDate),
      },
    },
    select: {
      jumlah: true,
      hargaSatuan: true,
      diskon: true,
    }
  });

  const totalUang = transactions.reduce((sum, trans) => {
    return sum + ((trans.jumlah * Number(trans.hargaSatuan)) - (Number(trans.diskon) || 0));
  }, 0);

  return NextResponse.json({
    totalTransaksi: transactions.length,
    totalUang: totalUang,
    tanggal: filterDate.toISOString().split('T')[0]
  });
}