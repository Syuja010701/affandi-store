export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.expense.findMany({
    orderBy: { id: "asc" },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, jumlah, hargaSatuan, totalHarga, keterangan, date } =
    await req.json();

  try {
    const user = await prisma.expense.create({
      data: {
        name,
        jumlah,
        hargaSatuan,
        totalHarga,
        keterangan: keterangan ?? "-",
        date: date ? new Date(date) : new Date(),
      },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
