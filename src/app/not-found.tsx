import Link from "next/link";
import { Button } from "@/components";

const ROUTES = [
  { description: "The opener", href: "/", label: "Welcome" },
  { description: "What I build", href: "/ai", label: "AI" },
  { description: "For operators", href: "/business", label: "Business" },
  { description: "The receipts", href: "/resume", label: "Résumé" },
  { description: "Open to work", href: "/contact", label: "Contact" },
];

const DIAGNOSTIC = [
  { key: "Status", value: "404 · NOT_FOUND" },
  { key: "Attempted", value: "Unmapped route" },
  { key: "Action", value: "Redirect required" },
  { key: "Cache", value: "Clean · no stale hit" },
];

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg-dark text-text-dark">
      {/* Giant ghost 404 — same parallax watermark used across page heroes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <span
          className="select-none font-bold leading-[0.82] tracking-tighter"
          style={{
            fontSize: "clamp(8rem, 32vw, 28rem)",
            WebkitTextStroke: "1px rgba(91,155,244,0.12)",
            color: "transparent",
          }}
        >
          404
        </span>
      </div>

      <div className="relative mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-7xl grid-cols-12 gap-x-6 gap-y-12 px-4 py-16 sm:px-6 sm:py-20 lg:gap-x-8 lg:py-24">
        {/* TOP STRIP — problem-red status pill + chapter mark.
            Matches the chapter-slate that PageTransition flashed when
            the user landed here. */}
        <div className="col-span-12 flex flex-wrap items-center gap-3 self-start">
          <span className="inline-flex items-center gap-3 rounded-full border border-problem-red/40 bg-[rgba(239,68,68,0.10)] px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-problem-red/60" />
              <span className="relative inline-block h-2 w-2 rounded-full bg-problem-red" />
            </span>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-problem-red">
              404 · route not found
            </span>
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-accent-light/40" />
          <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-text-dark-muted">
            Chapter 404 / Off-route
          </span>
        </div>

        {/* LEFT — massive stacked headline (cols 1–8 lg). Reads as the
            same editorial typography used on the home, business, and
            contact heroes. */}
        <div className="col-span-12 self-center lg:col-span-8">
          <h1
            className="font-semibold text-text-dark"
            style={{
              fontSize: "clamp(3rem, 12vw, 10rem)",
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
            }}
          >
            <span className="block">Off-</span>
            <span className="gradient-shift-dark block">
              route<span className="text-accent-light">.</span>
            </span>
          </h1>

          <div className="mt-8 flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent-light" />
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent-light sm:text-sm">
              The route you typed isn&apos;t live (yet)
            </p>
          </div>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-dark-muted sm:text-xl sm:leading-9">
            That page either ships in a future sprint or never made the
            architecture review. Either way, it&apos;s not here yet — but
            five other routes are. Pick one.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button arrow className="!px-8 !py-4 !text-base" href="/">
              Back to Welcome
            </Button>
            <Button
              className="!px-8 !py-4 !text-base"
              href="/contact"
              variant="ghostDark"
            >
              Get in Touch
            </Button>
          </div>
        </div>

        {/* RIGHT — diagnostic datasheet (cols 9–12 lg). Reuses the same
            ~/slug · meta datasheet language as the /resume sidebar and
            SiteFooter outro. Makes the 404 feel like a status report
            rather than an apology. */}
        <div className="col-span-12 self-center lg:col-span-4">
          <div className="overflow-hidden rounded-xl border border-[rgba(91,155,244,0.20)] bg-[rgba(15,23,42,0.55)] backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-[rgba(91,155,244,0.18)] bg-[rgba(91,155,244,0.06)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              <span className="inline-flex h-2 w-2 rounded-full bg-problem-red" />
              <span>~/diagnostic</span>
              <span aria-hidden="true" className="h-px flex-1 bg-[rgba(91,155,244,0.20)]" />
              <span className="text-text-dark-muted">{DIAGNOSTIC.length} signals</span>
            </div>
            <ul className="grid">
              {DIAGNOSTIC.map((row, index) => (
                <li
                  className="grid grid-cols-[auto_1fr] items-baseline gap-3 border-t border-[rgba(91,155,244,0.12)] px-5 py-3 first:border-t-0"
                  key={row.key}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
                    <span className="text-text-dark-muted/60">// </span>
                    {String(index + 1).padStart(2, "0")} {row.key}
                  </span>
                  <span className="text-right font-mono text-[12.5px] leading-6 text-text-dark">
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* BOTTOM — editorial route ledger. Replaces the bullet list of
            "try one of these" links with a full-width indexed timeline
            that matches the home page's editorial divided lists. */}
        <div className="col-span-12 mt-4">
          <div className="flex flex-wrap items-baseline gap-4 border-b border-[rgba(91,155,244,0.20)] pb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light">
              06 · Detour
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/40" />
            <h2
              className="font-semibold tracking-tight text-text-dark"
              style={{
                fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                letterSpacing: "-0.035em",
                lineHeight: 1,
              }}
            >
              Try one of these instead.
            </h2>
          </div>

          <ol className="grid divide-y divide-[rgba(91,155,244,0.18)] border-b border-[rgba(91,155,244,0.18)]">
            {ROUTES.map((route, index) => (
              <li key={route.href}>
                <Link
                  className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-6 transition-colors duration-200 hover:bg-[rgba(91,155,244,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-light sm:py-7"
                  href={route.href}
                >
                  <span className="col-span-2 font-mono text-[11px] uppercase tracking-[0.32em] text-accent-light sm:col-span-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="col-span-7 font-semibold tracking-tight text-text-dark transition-colors duration-200 group-hover:text-accent-light sm:col-span-6"
                    style={{
                      fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.05,
                    }}
                  >
                    {route.label}
                  </span>
                  <span className="col-span-12 font-mono text-xs uppercase tracking-[0.28em] text-text-dark-muted sm:col-span-4">
                    {route.description}
                  </span>
                  <span className="col-span-3 flex justify-end sm:col-span-1">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(91,155,244,0.30)] text-accent-light/70 transition-[transform,border-color,background,color] duration-300 group-hover:translate-x-1 group-hover:border-accent-light group-hover:bg-accent-light group-hover:text-bg-dark"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14m-7-7 7 7-7 7" />
                      </svg>
                    </span>
                  </span>

                  {/* Hover hairline — matches the divided-list rows used on
                      the home page Process band and the resume Experience
                      ledger. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-gradient-to-r from-accent-deep via-accent to-accent-light transition-transform duration-500 ease-out group-hover:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
}
