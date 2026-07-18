import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{requireAdmin}from"@/lib/auth";
export async function GET(){try{await requireAdmin();const logs=await prisma.auditLog.findMany({orderBy:{createdAt:"desc"},take:100,include:{admin:{select:{name:true,email:true}}}});return NextResponse.json({logs})}catch(e:any){return NextResponse.json({error:e.message},{status:401})}
