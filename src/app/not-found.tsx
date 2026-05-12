import { Button } from "@/components";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-dark px-4 text-text-dark">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-accent/22 blur-3xl" />
        <div className="absolute -bottom-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent-light/12 blur-3xl" />
        <div className="absolute -bottom-24 left-[-10%] h-[360px] w-[360px] rounded-full bg-accent/14 blur-3xl" />
      </div>

      {/* Giant ghost 404 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <span
          className="select-none font-bold leading-[0.85] tracking-tighter"
          style={{
            fontSize: "clamp(8rem, 32vw, 28rem)",
            WebkitTextStroke: "1px rgba(91,155,244,0.12)",
            color: "transparent",
          }}
        >
          404
        </span>
      </div>

      <div className="relative mx-auto w-full max-w-2xl text-center">
        <span className="inline-flex items-center gap-3 rounded-full border border-problem-red/40 bg-[rgba(239,68,68,0.10)] px-4 py-1.5 backdrop-blur-md">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-problem-red/60" />
            <span className="relative inline-block h-2 w-2 rounded-full bg-problem-red" />
          </span>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.28em] text-problem-red">
            404 · route not found
          </span>
        </span>

        <h1 className="hero-display-md mt-8 font-semibold text-text-dark">
          $ cd /
        </h1>
        <p className="mt-8 font-mono text-base leading-7 text-text-dark-muted">
          That page either ships in a future sprint or never made the
          architecture review. Either way, it&apos;s not here yet.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button arrow href="/">Back to Home</Button>
          <Button href="/contact" variant="ghostDark">
            Get in Touch
          </Button>
        </div>

        {/* Suggestion list */}
        <div className="mx-auto mt-14 max-w-md text-left">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
            Try one of these instead
          </p>
          <ul className="mt-3 grid gap-2">
            {[
              { href: "/ai", label: "AI · what I build" },
              { href: "/business", label: "Business · how it runs" },
              { href: "/resume", label: "Resume · the receipts" },
              { href: "/contact", label: "Contact · let's talk" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  className="link-underline inline-flex items-center gap-3 font-mono text-sm text-text-dark-muted transition-colors hover:text-text-dark"
                  href={item.href}
                >
                  <span aria-hidden="true" className="text-accent-light">→</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
