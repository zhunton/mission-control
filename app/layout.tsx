import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Personal command center for Zach and Wally",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
        <Sidebar />
        <main style={{ flex: 1, overflow: "auto", background: "#0a0a0a" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
