// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, name: true, createdAt: true },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { username, name, password } = await req.json();
  const hashed = await bcrypt.hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: { username, name, password: hashed },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (e: any) {
    if (e.code === 'P2002') {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}