// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
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

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ message: 'Deleted' });
}