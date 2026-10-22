import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LitEngine Scout & Business Auditor",
  description: "AI-powered founder research and inbound sales funnel audit engine by LITERALS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-[#09090b] text-[#fafafa]">
        {children}
      </body>
    </html>
  );
}
