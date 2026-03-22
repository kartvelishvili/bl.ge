import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Bolero",
  description: "Bolero - Georgian Wine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
