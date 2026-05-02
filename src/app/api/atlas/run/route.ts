import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const limiter = new Map<string, { count: number; resetAt: number }>();

function getTrustedClientIp(req: NextRequest) {
  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get('forwarded');
  if (forwarded) {
    const match = forwarded.match(/for=(?:\"?)(\[[^\]]+\]|[^;\",]+)(?:\"?)/i);
    if (match?.[1]) return match[1];
  }

  return 'unknown';
}

export async function POST(req: NextRequest) {
  const ip = getTrustedClientIp(req);
  const now = Date.now();
  const entry = limiter.get(ip);
  if (!entry || now > entry.resetAt) {
    limiter.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
  } else if (entry.count >= 3) {
    return NextResponse.json({ error: 'Rate limited' }, { status: 429 });
  } else {
    entry.count += 1;
  }

  const body = await req.json().catch(() => ({}));
  const prompt = body?.prompt ?? 'Build a guest-message QA launch plan';

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ fallback: true, error: 'missing_api_key' }, { status: 503 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: 'Return compact JSON with terminalLines, dbRows, tasks arrays only.',
    messages: [{ role: 'user', content: String(prompt) }],
  });

  return NextResponse.json({ text: msg.content });
}
