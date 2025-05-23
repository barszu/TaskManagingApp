import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import ReactQuerryProvider from "@/app/providers/react-querry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Tasks",
  description: "My Tasks - Task Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ChakraProvider>
          <ReactQuerryProvider>{children}</ReactQuerryProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
