// app/api/reportDaily/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/* 1️⃣  GET ------------------------------------------------------------- */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params; 
  const id = Number(idStr);
  const reportDaily = await prisma.reportDaily.findUnique({ where: { id } });
  if (!reportDaily)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(reportDaily);
}

/* 2️⃣  PUT ------------------------------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const {
    total_item_transaction,
    total_uang_kasir,
    total_uang_transaction,
    date,
  } = await req.json();

  try {
    const updated = await prisma.reportDaily.update({
      where: { id },
      data: {
        total_item_transaction,
        total_uang_kasir,
        total_uang_transaction,
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
  await prisma.reportDaily.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
