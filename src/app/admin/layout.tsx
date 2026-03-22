import type { Metadata } from "next";
import "../globals.scss";

export const metadata: Metadata = {
  title: "Bolero Admin",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <head>
        <link
          rel="stylesheet"
          href="//cdn.web-fonts.ge/fonts/bpg-web-002-caps/css/bpg-web-002-caps.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdn.web-fonts.ge/fonts/bpg-glaho-web/css/bpg-glaho-web.min.css"
        />
      </head>
      <body className="bg-[#0a0e17] antialiased" style={{ fontFamily: '"BPG Glaho WEB", sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
