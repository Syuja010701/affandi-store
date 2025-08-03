export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfDay } from 'date-fns';

export async function GET() {
  const reportDaily = await prisma.reportDaily.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json(reportDaily);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      total_item_transaction,
      total_uang_kasir,
      total_uang_transaction,
      date,
    } = body;

    // truncate ke 00:00:00 hari ini / tanggal yang dikirim
    const targetDate = startOfDay(date ? new Date(date) : new Date());

    // cek sudah ada atau belum
    const existing = await prisma.reportDaily.findFirst({
      where: { date: { gte: targetDate, lt: new Date(targetDate.getTime() + 24 * 60 * 60 * 1000) } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Laporan hari ini sudah ada.' },
        { status: 409 }
      );
    }

    const created = await prisma.reportDaily.create({
      data: {
        total_item_transaction: Number(total_item_transaction),
        total_uang_transaction: Number(total_uang_transaction),
        total_uang_kasir: Number(total_uang_kasir),
        date: targetDate,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Gagal menyimpan laporan' }, { status: 400 });
  }
}