import type { Metadata, Viewport } from "next";
import { Red_Hat_Mono } from "next/font/google";
import { Providers } from "@/components/providers/store-provider-wrapper";
import "./globals.css";

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-red-hat-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OUTTERSPACE STORE — SPLY STUDIO",
  description: "High-end studio e-commerce experience powered by Next.js 14 and Framer Motion.",
  metadataBase: new URL("https://sply-studio.webexp.dev"),
};

export const viewport: Viewport = {
  themeColor: "#0F0F0F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('sply-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${redHatMono.variable} font-mono antialiased selection:bg-neutral-700 selection:text-white min-h-screen flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}