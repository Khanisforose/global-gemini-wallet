import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { requireAdmin } from "@/lib/auth";
export async function DELETE(req: Request) {
  try { const a = await requireAdmin(); const { userId } = await req.json();
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function PATCH(req: Request) {
  try { const a = await requireAdmin(); const { userId, status } = await req.json();
    await prisma.user.update({ where: { id: userId }, data: { kycStatus: status } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
