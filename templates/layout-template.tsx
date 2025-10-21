import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "../src/app/ClientBody";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Professional Next.js Project",
    description: "Built with modern technologies and professional design patterns",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
        </body>
        </html>
    );
}