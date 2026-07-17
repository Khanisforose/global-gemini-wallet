import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { kycStatus: true, kycFullName: true, kycDocumentType: true, kycSubmittedAt: true, kycVerifiedAt: true, kycRejectReason: true },
    });
    return NextResponse.json(user || { kycStatus: "UNVERIFIED" });
  } catch {
    return NextResponse.json({ kycStatus: "UNVERIFIED" });
  }
}
