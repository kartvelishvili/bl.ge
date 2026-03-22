import type { Metadata } from "next";
import "../globals.scss";
import localFont from "next/font/local";
import { Darker_Grotesque, Inder, Noto_Sans_Georgian } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getDictionary } from "@/app/dictionaries/dictionaries";
import VideoLayout from "@/app/[lang]/(video)/layout";
import VideoOverlay from "@/components/VideoOverlay/VideoOverlay";

const dejavuSans = localFont({
  src: [
    {
      path: "../../../public/fonts/DejaVuSans.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/DejaVuSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../../public/fonts/DejaVuSans-BoldOblique.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../../public/fonts/DejaVuSans-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../../public/fonts/DejaVuSans-Oblique.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-dejavu-sans",
});

const notoSansGeorgianSemiCondensed = localFont({
  src: [
    {
      path: "../../../public/fonts/NotoSansGeorgian-SemiCondensed.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-notoSansGeorigan-SemiCondensed",
});

const inder = Inder({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inder",
});

const notoSansGeorgian = Noto_Sans_Georgian({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-notoSansGeorgian",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-darkerGrotesque",
});

export const metadata: Metadata = {
  title: "Bolero & Co",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: any;
}>) {
  const { lang } = await params;
  const dictionary = (await getDictionary(lang)) as any;

  return (
    <html lang={lang}>
      <body
        className={`${dejavuSans.variable} ${notoSansGeorgianSemiCondensed.variable} ${notoSansGeorgian.variable} ${inder.variable} ${darkerGrotesque.variable}  antialiased`}
      >
        <VideoOverlay>
          <div className="flex flex-col bg-[#0D1116]">
            {children}
            <Footer dictionary={dictionary} locale={lang} />
          </div>
        </VideoOverlay>
      </body>
    </html>
  );
}
