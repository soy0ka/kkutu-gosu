import type { Metadata } from "next";
import Image from "next/image";
import React from "react";
import Chobo from "~/assets/images/chobo.webp";
import suit from '~/fonts/Suit';
import "./globals.css";


export const metadata: Metadata = {
  title: "끄투고수",
  description: "ㅠㅠ 저 끄투 초보",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR" className="scroll-smooth">
      <body
        className={`${suit.variable} antialiased bg-background text-foreground flex flex-col min-h-screen overflow-auto`}
      >
        {children}
        <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-2">
          <Image
            src={Chobo}
            alt="끄투고수 로고"
            className="w-6 h-6"
          />
          <span className="text-sm font-semibold text-gray-700">끄투고수</span>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">
            낱말집 관리 고수되기
          </p>
          <p className="text-xs text-gray-400 mt-2">
            &copy; 2025 너울님. All rights reserved.
          </p>
        </div>
          </div>
        </div>
      </footer>
      </body>
    </html>
  );
}
