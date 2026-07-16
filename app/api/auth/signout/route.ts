import { NextResponse } from "next/server"; import { clearCookie } from "@/lib/auth";
export async function POST(){const r=NextResponse.json({success:true});r.cookies.set(clearCookie());return r}
