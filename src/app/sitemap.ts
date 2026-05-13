import type { MetadataRoute } from "next";

const SITE_URL = "https://pierrebelonsavon.com";

/**
 * Static sitemap.xml — emits one entry per public route with a
 * sensible changeFrequency and priority. The build SHA is captured
 * at compile time so `lastModified` matches the active deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME;
  const lastModified = buildTime ? new Date(buildTime) : new Date();

  const routes: Array<{
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    path: string;
    priority: number;
  }> = [
    { changeFrequency: "weekly", path: "/", priority: 1.0 },
    { changeFrequency: "monthly", path: "/atlas", priority: 0.9 },
    { changeFrequency: "monthly", path: "/business", priority: 0.9 },
    { changeFrequency: "monthly", path: "/resume", priority: 0.9 },
    { changeFrequency: "weekly", path: "/lab", priority: 0.7 },
  ];

  return routes.map((entry) => ({
    changeFrequency: entry.changeFrequency,
    lastModified,
    priority: entry.priority,
    url: `${SITE_URL}${entry.path === "/" ? "" : entry.path}`,
  }));
}
