import { LightGlassCard } from './LightGlassCard';

const items = [
  ['Game App', 'Mini party game built end-to-end via Atlas'],
  ['Budget Web App', 'Personal finance app with a built-in AI advisor'],
  ['Agent-Augmented PM', 'Project management where agents do the work'],
] as const;

export function AtlasGallery() {
  return <div className="grid gap-4 md:grid-cols-3">{items.map(([title, desc]) => <LightGlassCard key={title} className="p-4" hoverable={false}><div className="h-28 rounded-lg bg-gradient-to-br from-accent/20 to-accent-light/20" /><p className="mt-3 font-semibold">{title}</p><p className="mt-1 text-sm text-text-light-muted">{desc}</p></LightGlassCard>)}</div>;
}
