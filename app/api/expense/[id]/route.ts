// app/api/expense/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* 1️⃣  GET ------------------------------------------------------------- */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params; // <-- await the promise
  const id = Number(idStr);
  const expense = await prisma.expense.findUnique({ where: { id } });
  if (!expense)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(expense);
}

/* 2️⃣  PUT ------------------------------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const { name, jumlah, hargaSatuan, totalHarga, keterangan, date } =
    await req.json();

  try {
    const updated = await prisma.expense.update({
      where: { id },
      data: {
        name,
        jumlah,
        hargaSatuan,
        totalHarga,
        keterangan: keterangan ?? "-",
        date: date ? new Date(date) : new Date(),
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

/* 3️⃣  DELETE ---------------------------------------------------------- */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  await prisma.expense.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
