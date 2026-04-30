import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CALISFIT — Train Smarter",
  description: "Your calisthenics & gym workout platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          toastClassName="!bg-brand-black !text-white"
        />
      </body>
    </html>
  );
}
