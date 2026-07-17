import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      where: { kycStatus: "PENDING" },
      select: {
        id: true, email: true, name: true, kycStatus: true, kycFullName: true,
        kycDocumentType: true, kycDocumentNumber: true, kycDocumentImage: true, kycSubmittedAt: true,
      },
      orderBy: { kycSubmittedAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
