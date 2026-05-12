import type { MetadataRoute } from "next";

const SITE_URL = "https://pierrebelonsavon.com";

/**
 * robots.txt — allow everything by default; point crawlers at the
 * sitemap. Disallow internal /api/* routes from being indexed.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: [
      {
        allow: "/",
        disallow: ["/api/"],
        userAgent: "*",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
