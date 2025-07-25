// app/api/user/[id]/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

/* 1️⃣  GET ------------------------------------------------------------- */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;   // <-- await the promise
  const id = Number(idStr);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

/* 2️⃣  PUT ------------------------------------------------------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  const { username, name, password } = await req.json();
  const hashed = password ? await bcrypt.hash(password, 12) : undefined;

  try {
    const updated = await prisma.user.update({
      where: { id },
      data: { username, name, ...(hashed && { password: hashed }) },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  }
}

/* 3️⃣  DELETE ---------------------------------------------------------- */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}