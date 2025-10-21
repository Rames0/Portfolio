import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { GoogleAnalytics, MicrosoftClarity } from "./analytics";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ramesh0.com.np'),
    title: {
        default: "Ramesh Maharjan - Full Stack Developer | React, Next.js, PHP, Python Expert",
        template: "%s | Ramesh Maharjan"
    },
    description: "Expert Full Stack Developer from Nepal with 5+ years experience. Specializing in React, Next.js, Laravel, PHP, Python Django, PostgreSQL, MariaDB. Building scalable web applications, POS systems, and enterprise solutions.",
    keywords: ["Full Stack Developer", "React Developer", "Next.js Expert", "PHP Laravel Developer", "Python Django", "Web Developer Nepal", "Kathmandu Developer", "PostgreSQL", "MariaDB", "Node.js", "TypeScript", "Tailwind CSS", "REST API", "POS System Developer", "Enterprise Web Applications", "Freelance Developer Nepal"],
    authors: [{ name: "Ramesh Maharjan", url: "https://ramesh0.com.np" }],
    creator: "Ramesh Maharjan",
    publisher: "Ramesh Maharjan",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://ramesh0.com.np",
        siteName: "Ramesh Maharjan Portfolio",
        title: "Ramesh Maharjan - Full Stack Developer | React, Next.js, PHP Expert",
        description: "Expert Full Stack Developer with 5+ years experience building scalable web applications. Specializing in React, Next.js, Laravel, Python Django, and modern web technologies.",
        images: [
            {
                url: "/Profile.jpeg",
                width: 1200,
                height: 630,
                alt: "Ramesh Maharjan - Full Stack Developer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        site: "@rameshdev",
        creator: "@rameshdev",
        title: "Ramesh Maharjan - Full Stack Developer | React, Next.js, PHP Expert",
        description: "Expert Full Stack Developer from Nepal with 5+ years experience in React, Next.js, Laravel, Python Django, and modern web technologies.",
        images: ["/Profile.jpeg"],
    },
    alternates: {
        canonical: "https://ramesh0.com.np",
    },
    verification: {
        google: "your-google-verification-code",
        yandex: "your-yandex-verification-code",
        bing: "your-bing-verification-code",
    },
    category: "technology",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
            <link rel="apple-touch-icon" href="/icon-192.png" />
            <meta name="theme-color" content="#10b981" />
            <Script
                id="schema-org"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Ramesh Maharjan",
                        "url": "https://ramesh0.com.np",
                        "image": "https://ramesh0.com.np/Profile.jpeg",
                        "sameAs": [
                            "https://github.com/rameshmaharjan",
                            "https://linkedin.com/in/rameshmaharjan",
                            "https://twitter.com/rameshdev"
                        ],
                        "jobTitle": "Full Stack Developer",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Kathmandu",
                            "addressCountry": "Nepal"
                        },
                        "email": "mhrjan0@gmail.com",
                        "knowsAbout": ["React", "Next.js", "Laravel", "PHP", "Python", "Django", "PostgreSQL", "MariaDB", "Node.js", "TypeScript", "Web Development"],
                        "alumniOf": "NIRC Nepal"
                    })
                }}
            />
            <Script
                crossOrigin="anonymous"
                src="//unpkg.com/same-runtime/dist/index.global.js"
            />
        </head>
        <body suppressHydrationWarning className="antialiased bg-slate-950 text-white overflow-x-hidden">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        {process.env.NEXT_PUBLIC_CLARITY_ID && <MicrosoftClarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} />}
        <ClientBody>{children}</ClientBody>
        </body>
        </html>
    );
}
