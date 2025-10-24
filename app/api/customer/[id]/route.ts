// GET one, PUT, DELETE
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ---------------- Helper ---------------- */
const parseId = async (params: Promise<{ id: string }>) => {
  const id = Number((await params).id);
  if (isNaN(id)) throw new Error("Invalid id");
  return id;
};

/* ---------------- GET one ---------------- */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);

    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer)
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    return NextResponse.json(customer);
  } catch (err) {
    console.error("GET /api/customer/[id] error:", err);
    return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
  }
}

/* ---------------- PUT ---------------- */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);
    const { name, phone, address } = await req.json();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone number must be filled in" },
        { status: 400 }
      );
    }

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Cegah duplikasi nomor telepon dengan customer lain
    const duplicatePhone = await prisma.customer.findFirst({
      where: {
        phone,
        NOT: { id },
      },
    });

    if (duplicatePhone) {
      return NextResponse.json(
        { error: "Phone number already registered by another customer" },
        { status: 400 }
      );
    }

    const updated = await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone,
        address: address || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/customer/[id] error:", err);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

/* ---------------- DELETE ---------------- */
export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = await parseId(params);

    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    await prisma.customer.delete({ where: { id } });

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/customer/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 });
  }
}
