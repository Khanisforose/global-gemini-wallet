import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-glow"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div><div className="bg-grid"/>{children}</body></html>)}
