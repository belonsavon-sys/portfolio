import { LightGlassCard } from './LightGlassCard';

export type TestimonialQuote = { body: string; author: string; role: string };

export function Testimonial({ quote }: { quote?: TestimonialQuote }) {
  if (!quote?.body?.trim()) return null;
  return (
    <LightGlassCard className="p-6 sm:p-8" hoverable={false}>
      <p className="text-3xl text-accent">“</p>
      <p className="mt-2 text-lg leading-8 text-text-light">{quote.body}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-text-light-muted">
        {quote.author} · {quote.role}
      </p>
    </LightGlassCard>
  );
}
