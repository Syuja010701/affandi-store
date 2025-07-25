// GET all & POST
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const list = await prisma.kategoriUmur.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(list);
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const created = await prisma.kategoriUmur.create({ data: { name } });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'create failed' }, { status: 400 });
  }
}