import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DayForge",
  description: "Slay the boss first.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
