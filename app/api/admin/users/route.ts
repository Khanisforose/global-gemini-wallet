import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { requireAdmin } from "@/lib/auth";
export async function GET(){try{await requireAdmin();const u=await prisma.user.findMany({select:{id:true,email:true,name:true,role:true},orderBy:{createdAt:"desc"}});return NextResponse.json({users:u})}catch(e:any){return NextResponse.json({error:e.message},{status:401})}}
