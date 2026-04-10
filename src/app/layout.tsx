import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "JLPT Happy Learn | Học Kanji & Từ vựng Tiếng Nhật",
  description: "Ứng dụng giúp bạn học tiếng Nhật dễ dàng với phương pháp thông minh và hiện đại.",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "JLPT Happy Learn",
    description: "Chinh phục kỳ thi JLPT với lộ trình học thông minh.",
    type: "website",
    locale: "vi_VN",
    siteName: "JLPT Happy Learn",
  },
  twitter: {
    card: "summary_large_image",
    title: "JLPT Happy Learn",
    description: "Chinh phục kỳ thi JLPT với lộ trình học thông minh.",
  },
};

import { DataProvider } from "@/context/DataContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${notoSansJP.variable}`}>
      <body className="antialiased">
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}

