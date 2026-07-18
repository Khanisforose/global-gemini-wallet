import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-glow"><div className="o o1"/><div className="o o2"/><div className="o o3"/></div>{children}</body></html>)}
