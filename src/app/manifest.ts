import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ramesh Maharjan - Full Stack Engineer",
    short_name: "Ramesh M.",
    description:
      "Full-Stack Engineer & Creative Technologist. Building resilient web systems, low-latency backends, and tactile user interfaces.",
    start_url: "/",
    display: "standalone",
    background_color: "#161714",
    theme_color: "#cecec6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon?<generated>",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon?<generated>",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    categories: ["business", "productivity", "technology"],
    lang: "en",
    dir: "ltr",
  };
}
