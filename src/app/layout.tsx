import type { Metadata } from "next";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { GoogleAnalytics, MicrosoftClarity } from "./analytics";

export const metadata: Metadata = {
    metadataBase: new URL('https://ramesh0.com.np'),
    title: {
        default: "Ramesh Maharjan | Senior Full-Stack Engineer",
        template: "%s | Ramesh Maharjan"
    },
    description: "Ramesh Maharjan is a Full-Stack Engineer and Creative Technologist in Kathmandu, Nepal. Specializing in high-performance React, Next.js, Node.js, Laravel, and WebGL architectures.",
    keywords: [
        "Ramesh Maharjan", "Full-Stack Engineer Nepal", "Next.js Developer Kathmandu", 
        "React Architect", "TypeScript Developer", "Laravel API Engineer", 
        "Nepal Incubation & Research Center", "Creative Technologist", 
        "PostgreSQL", "Enterprise System Architecture", "Generative Web UI"
    ],
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
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: "profile",
        locale: "en_US",
        url: "https://ramesh0.com.np",
        siteName: "Ramesh Maharjan — Engineering Portfolio",
        title: "Ramesh Maharjan | Senior Full-Stack Engineer",
        description: "Explore the technical portfolio of Ramesh Maharjan. Showcasing resilient systems, Next.js / React ecosystems, backend API design in Laravel/Java, and tactile web experiments.",
    },
    twitter: {
        card: "summary_large_image",
        site: "@rameshdev",
        creator: "@rameshdev",
        title: "Ramesh Maharjan | Generative UI & Full-Stack Engineer",
        description: "Explore my interactive developer portfolio covering resilient backends (Laravel/Django) and tactile web frontends (Next.js/React).",
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
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "ProfilePage",
                                "@id": "https://ramesh0.com.np/#webpage",
                                "url": "https://ramesh0.com.np",
                                "name": "Ramesh Maharjan | Senior Full-Stack Engineer",
                                "description": "Portfolio of Ramesh Maharjan, a full-stack developer in Kathmandu specializing in Next.js, React, Laravel, and enterprise architecture.",
                                "isPartOf": { "@id": "https://ramesh0.com.np/#website" },
                                "about": { "@id": "https://ramesh0.com.np/#person" }
                            },
                            {
                                "@type": "WebSite",
                                "@id": "https://ramesh0.com.np/#website",
                                "url": "https://ramesh0.com.np",
                                "name": "Ramesh Maharjan - Engineering Portfolio",
                                "publisher": { "@id": "https://ramesh0.com.np/#person" },
                                "inLanguage": "en-US"
                            },
                            {
                                "@type": "Person",
                                "@id": "https://ramesh0.com.np/#person",
                                "name": "Ramesh Maharjan",
                                "alternateName": "ramesh0",
                                "jobTitle": [
                                    "Senior Full-Stack Engineer", 
                                    "Creative Technologist"
                                ],
                                "url": "https://ramesh0.com.np",
                                "image": "https://ramesh0.com.np/Profile.jpeg",
                                "description": "Full-Stack Engineer based in Kathmandu, Nepal. Specialist in React.js, Next.js frontends, and Laravel, Node.js backend architectures.",
                                "sameAs": [
                                    "https://github.com/Rames0",
                                    "https://www.linkedin.com/in/ramesh-mhr-1b0514337",
                                    "https://twitter.com/rameshdev",
                                    "https://www.rameshmaharjan.info.np/"
                                ],
                                "address": {
                                    "@type": "PostalAddress",
                                    "addressLocality": "Kathmandu",
                                    "addressRegion": "Bagmati",
                                    "addressCountry": "NP"
                                },
                                "email": "mhrjan0@gmail.com",
                                "alumniOf": {
                                    "@type": "CollegeOrUniversity",
                                    "name": "Tribhuvan University"
                                },
                                "worksFor": {
                                    "@type": "Organization",
                                    "name": "Nepal Incubation & Research Center"
                                },
                                "knowsAbout": [
                                    "Full-Stack Web Development",
                                    "System Architecture",
                                    "TypeScript",
                                    "React.js",
                                    "Next.js",
                                    "Laravel (PHP)",
                                    "Python Django",
                                    "PostgreSQL",
                                    "MariaDB",
                                    "Web Audio API",
                                    "Hardware-level Interaction"
                                ]
                            },
                            {
                                "@type": "SoftwareApplication",
                                "@id": "https://ramesh0.com.np/#speaker-cleaner",
                                "name": "Zero-Harm Acoustic Speaker Cleaner Engine",
                                "applicationCategory": "MultimediaApplication",
                                "creator": { "@id": "https://ramesh0.com.np/#person" },
                                "operatingSystem": "Web",
                                "description": "A hardware-safe web utility utilizing Web Audio API algorithms, Butterworth filters, and Helmholtz resonance to eject water and particulate debris from mobile speakers."
                            },
                            {
                                "@type": "CreativeWork",
                                "@id": "https://ramesh0.com.np/#gwp-portal",
                                "name": "GWP - Government Web Portal",
                                "genre": "Civic Public Infrastructure",
                                "creator": { "@id": "https://ramesh0.com.np/#person" },
                                "abstract": "Secure, highly-available centralized portal consolidating 50+ government services for citizens with strict WCAG compliance and RBAC access, built on Java and Grails.",
                                "text": "Java, Grails Engine, Spring Security, MariaDB, HTML/CSS"
                            }
                        ]
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