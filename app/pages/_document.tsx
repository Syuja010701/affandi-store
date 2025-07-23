// pages/_document.tsx
'use client'
import { ThemeModeScript } from "flowbite-react";
import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html suppressHydrationWarning>
      <Head>
        <ThemeModeScript />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
