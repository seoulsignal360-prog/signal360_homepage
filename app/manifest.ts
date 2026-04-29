import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "시그널360",
    short_name: "시그널360",
    description:
      "보험설계사를 위한 DB 매칭 플랫폼. 당신이 찾던 성공의 신호.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1D2E",
    theme_color: "#4F46E5",
    lang: "ko",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
