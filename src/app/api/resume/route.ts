/**
 * GET /api/resume — streams Pierre's résumé PDF.
 *
 * The PDF is generated server-side via @react-pdf/renderer using the
 * same source data the /resume page consumes (src/data/resume.ts).
 * That keeps the downloadable PDF and the on-site profile from
 * drifting apart.
 *
 * The response is forced as an attachment so visitors get a real
 * download with the expected filename.
 */

import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { ResumeDocument } from "./ResumeDocument";

export const runtime = "nodejs";
// Re-render at most once per hour — content is data-driven and only
// changes when src/data/resume.ts changes (i.e. on deploy).
export const revalidate = 3600;

export async function GET() {
  // createElement instead of JSX so this file stays `.ts` (Next.js
  // route handlers must be route.ts or route.js).
  const buffer = await renderToBuffer(createElement(ResumeDocument));

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "Content-Disposition":
        'inline; filename="pierre-belon-savon-resume.pdf"',
      "Content-Type": "application/pdf",
    },
  });
}
