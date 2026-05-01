import Link from "next/link";

type RouteStubProps = {
  route: string;
  title: string;
  issue: string;
  summary: string;
  nextSteps: string[];
};

const navItems = [
  { href: "/", label: "Welcome" },
  { href: "/ai", label: "AI" },
  { href: "/business", label: "Business" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Get in Touch" },
];

export function RouteStub({
  route,
  title,
  issue,
  summary,
  nextSteps,
}: RouteStubProps) {
  return (
    <main className="min-h-screen bg-bg-light text-text-light">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-12">
        <nav
          aria-label="Primary"
          className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-center gap-2 rounded-full border border-border-light bg-white p-2 shadow-sm"
        >
          {navItems.map((item) => {
            const isActive = item.href === route;

            return (
              <Link
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-text-light hover:bg-bg-light-2"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <section className="flex flex-1 flex-col justify-center py-20 sm:py-24">
          <p className="font-mono text-sm text-accent">{route}</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-normal text-text-light sm:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-light-muted">
            {summary}
          </p>

          <div className="mt-10 max-w-3xl border-t border-border-light pt-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-bg-light-2 px-3 py-1.5 font-mono text-sm text-text-light-muted">
                Scaffold ready
              </span>
              <span className="rounded-md bg-bg-light-2 px-3 py-1.5 font-mono text-sm text-text-light-muted">
                {issue}
              </span>
            </div>

            <h2 className="mt-8 text-xl font-semibold text-text-light">
              Next implementation steps
            </h2>
            <ul className="mt-4 grid gap-3 text-base leading-7 text-text-light-muted">
              {nextSteps.map((step) => (
                <li className="flex gap-3" key={step}>
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
