import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { signToken, setCookie } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (user.verifyToken !== otp) return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true, verifyToken: null } });
    
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    res.cookies.set(setCookie(token));
    return res;
  } catch { return NextResponse.json({ error: "Verification failed" }, { status: 500 }); }
}
