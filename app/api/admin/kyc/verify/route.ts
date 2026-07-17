import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    const { userId, action } = await req.json();
    if (!userId || !["VERIFIED", "REJECTED"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: action, kycVerifiedAt: new Date(), kycVerifiedBy: admin.userId },
    });
    return NextResponse.json({ success: true, status: action });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
