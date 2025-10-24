// GET all & POST
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ---------------- GET ---------------- */
export async function GET() {
  const list = await prisma.customer.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(list);
}

/* ---------------- POST ---------------- */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      address,
    } = body;

    if (!name || !phone ) {
      return NextResponse.json(
        { error: "name or phone number must be filled in" },
        { status: 400 }
      );
    }

    if(await prisma.customer.findUnique({ where: { phone } })) {
      return NextResponse.json(
        { error: "phone number already registered" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        phone,
        address: address || null,
      },
    });


    return NextResponse.json(customer, { status: 201 });
  } catch (err) {
    console.error("POST /api/customer error:", err);
    return NextResponse.json({ error: "Customer gagal" }, { status: 500 });
  }
}
