import { Button } from "@/components";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-dark px-4 text-text-dark">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="font-mono text-sm font-medium uppercase tracking-[0.22em] text-accent-light">
          404 · route not found
        </p>
        <h1 className="mt-6 text-7xl font-semibold leading-[0.95] tracking-tight text-text-dark sm:text-9xl">
          $ cd /
        </h1>
        <p className="mt-8 font-mono text-base leading-7 text-text-dark-muted">
          That page either ships in a future sprint or never made the
          architecture review. Either way, it&apos;s not here yet.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/contact" variant="ghostDark">
            Get in Touch
          </Button>
        </div>
      </div>
    </main>
  );
}
