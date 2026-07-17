import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const fd = await req.formData();
    const fullName = fd.get("fullName") as string;
    const documentType = fd.get("documentType") as string;
    const documentNumber = fd.get("documentNumber") as string;
    const documentImage = fd.get("documentImage") as File;

    if (!fullName || !documentType || !documentNumber || !documentImage) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const buffer = await documentImage.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const imageUrl = `data:${documentImage.type};base64,${base64}`;

    const updated = await prisma.user.update({
      where: { id: session.userId },
      data: {
        kycStatus: "PENDING",
        kycFullName: fullName,
        kycDocumentType: documentType,
        kycDocumentNumber: documentNumber,
        kycDocumentImage: imageUrl,
        kycSubmittedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, kycStatus: updated.kycStatus });
  } catch (e: any) {
    console.error("KYC error:", e);
    return NextResponse.json({ error: e.message || "Submission failed" }, { status: 500 });
  }
}
