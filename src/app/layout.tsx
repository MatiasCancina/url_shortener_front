"use client";

import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import axios from "axios";
import RootLayoutClient from "./RootLayoutClient";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
          <RootLayoutClient>{children}</RootLayoutClient>
        </GoogleReCaptchaProvider>
      </body>
    </html>
  );
}
