import{NextResponse}from"next/server";import{prisma}from"@/lib/db";
export async function GET(){try{
  let fiat:Record<string,number>={};
  try{const r=await fetch("https://api.frankfurter.app/latest?from=USD");const d=await r.json();if(d.rates)fiat=d.rates}catch(e){}
  if(Object.keys(fiat).length===0)fiat={EUR:0.92,GBP:0.79,INR:83.5,AED:3.67,SAR:3.75,JPY:149.5,CNY:7.24,AUD:1.54,CAD:1.36};
  let crypto:Record<string,number>={};
  try{const r=await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd");const d=await r.json();crypto={BTC:d.bitcoin?.usd||67000,ETH:d.ethereum?.usd||3400,SOL:d.solana?.usd||145,USDT:d.tether?.usd||1}}catch(e){}
  if(Object.keys(crypto).length===0)crypto={BTC:67000,ETH:3400,SOL:145,USDT:1};
  const all={...fiat,...crypto,USD:1};
  for(const[to,rate]of Object.entries(all)){try{await prisma.exchangeRate.upsert({where:{from_to:{from:"USD",to}},update:{rate},create:{from:"USD",to,rate}})}catch(e){}}
  return NextResponse.json({rates:Object.entries(all).map(([currency,rate]:[string,number])=>({currency,rate}))});
}catch(e){return NextResponse.json({error:"Error"},{status:500})}
