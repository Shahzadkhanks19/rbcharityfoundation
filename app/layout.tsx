import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RB Charity Foundation | Profits With Purpose",
  description:
    "RB Charity Foundation turns business growth and public generosity into transparent, measurable social impact.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
