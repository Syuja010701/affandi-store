import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const parsePhone = async (params: Promise<{ phone: string }>) => {
  const phoneStr = (await params).phone;
  // ensure phone consists of digits only and is not empty
  if (!phoneStr || !/^\d+$/.test(phoneStr)) throw new Error("Invalid phone");
  return phoneStr;
};

/* ---------------- GET by phone ---------------- */
export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ phone: string }> }
) {
  try {
    const  phone  = await parsePhone(params);
    
    if (!phone) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (err) {
    console.error("GET /api/customer/phone/[phone] error:", err);
    return NextResponse.json(
      { error: "Invalid or missing phone number" },
      { status: 400 }
    );
  }
}
