import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { GoogleAnalytics, MicrosoftClarity } from "./analytics";

export const metadata: Metadata = {
    metadataBase: new URL('https://ramesh0.com.np'),
    title: {
        default: "Ramesh Maharjan | Full-Stack Developer",
        template: "%s | ramesh0"
    },
    description: "Ramesh Maharjan is a full-stack developer in Kathmandu, Nepal, building clear, dependable digital products with React, Next.js, Laravel, Node.js, and PostgreSQL.",
    keywords: ["ramesh0", "ramesh0.com.np", "Ramesh Maharjan", "Full Stack Developer", "React Developer", "Next.js Developer", "PHP Laravel Developer", "Python Django", "Web Developer Nepal", "Kathmandu Developer", "PostgreSQL", "MariaDB", "Node.js", "TypeScript", "Tailwind CSS", "REST API", "POS System Developer", "Enterprise Web Applications", "Freelance Developer Nepal"],
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
        siteName: "Ramesh Portfolio",
        title: "Ramesh | Full Stack Developer",
        description: "Full-stack developer in Kathmandu building production websites and applications with React, Next.js, Laravel, Node.js, and PostgreSQL.",
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
        title: "Ramesh | Full Stack Developer",
        description: "Full-stack developer in Kathmandu building production websites and applications across modern JavaScript, PHP, Python, and Java stacks.",
        images: ["/Profile.jpeg"],
    },
    alternates: {
        canonical: "https://ramesh0.com.np",
    },
    verification: {
        google: "tBq-YUyYidrrfTTz27-QIGCEGhowp57xv6X4szIFoc8",
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
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
            <meta name="theme-color" content="#10b981" />
            <Script
                id="schema-org"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Person",
                        "name": "Ramesh Maharjan",
                        "alternateName": "ramesh0",
                        "url": "https://ramesh0.com.np",
                        "image": "https://ramesh0.com.np/Profile.jpeg",
                        "sameAs": [
                            "https://github.com/Rames0",
                            "https://www.linkedin.com/in/ramesh-mhr-1b0514337"
                        ],
                        "jobTitle": "Full Stack Developer",
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": "Kathmandu",
                            "addressCountry": "Nepal"
                        },
                        "email": "mhrjan0@gmail.com",
                        "knowsAbout": ["React", "Next.js", "Laravel", "PHP", "Python", "Django", "PostgreSQL", "MariaDB", "Node.js", "TypeScript", "Web Development"],
                        "worksFor": {
                            "@type": "Organization",
                            "name": "Nepal Incubation & Research Center"
                        },
                        "alumniOf": {
                            "@type": "CollegeOrUniversity",
                            "name": "Tribhuvan University"
                        }
                    })
                }}
            />
        </head>
        <body suppressHydrationWarning className="antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        {process.env.NEXT_PUBLIC_CLARITY_ID && <MicrosoftClarity clarityId={process.env.NEXT_PUBLIC_CLARITY_ID} />}
        <ClientBody>{children}</ClientBody>
        </body>
        </html>
    );
}
