import {  NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const reports = await prisma.reportDaily.findMany({
      orderBy: {
        date: "asc",
      },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch daily reports" },
      { status: 500 }
    );
  }
}
