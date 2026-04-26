import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import { Footer } from "@/app/components/sections/Footer";
import { Header } from "@/app/components/sections/Header";
import "./globals.css";

const pretendard = localFont({
  src: "./fonts/Pretendard-Variable.woff2",
  display: "swap",
  variable: "--font-pretendard",
  weight: "45 930",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "시그널360 - 보험설계사를 위한 DB 매칭 플랫폼",
  description:
    "당신이 찾던 성공의 신호, 결국 시그널360에 있습니다. 누구를 만나느냐가 설계사의 내일을 결정합니다.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Header injected by proxy for /admin/* paths so we can suppress
  // the public Header/Footer chrome on the admin shell.
  const h = await headers();
  const isAdmin = (h.get("x-pathname") || "").startsWith("/admin");

  return (
    <html
      lang="ko"
      data-scroll-behavior="smooth"
      className={`${pretendard.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
      </body>
    </html>
  );
}
