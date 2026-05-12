import type { MetadataRoute } from "next";

/**
 * Web App Manifest — lets visitors "Install" or "Add to Home
 * Screen" on iOS / Android / Chromium desktops. Mirrors the site
 * identity that the layout metadata already establishes.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: "#ffffff",
    description:
      "AI Engineer building production systems for operations-heavy businesses. Currently running at ThePrivateHotels and Blackdoor.",
    display: "standalone",
    icons: [
      {
        sizes: "32x32",
        src: "/icon",
        type: "image/png",
      },
      {
        sizes: "180x180",
        src: "/apple-icon",
        type: "image/png",
      },
    ],
    lang: "en",
    name: "Pierre Belon Savon — AI Engineer",
    orientation: "portrait",
    scope: "/",
    short_name: "Pierre",
    start_url: "/",
    theme_color: "#296ed6",
  };
}
