import type{Metadata}from"next";import"./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-o"><div className="b b1"/><div className="b b2"/><div className="b b3"/></div>{children}</body></html>)}
