import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Simple in-memory rate limiter. 3 calls per IP per hour.
// Resets per cold-start; for production you would back this with KV.
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "anonymous";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "anonymous";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAt: number } {
  const now = Date.now();
  const record = rateLimit.get(ip);
  if (!record || record.resetAt < now) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAt: record.resetAt };
  }
  record.count += 1;
  return { ok: true };
}

const SYSTEM_PROMPT = `You are Atlas, a multi-agent orchestration harness.
A visitor of Pierre Belon Savon's portfolio has sent you a business prompt.
Respond strictly as a JSON object that simulates routing the prompt through
your agent hierarchy. Keep it tight, plausible, and business-focused.

Schema:
{
  "terminal": [string, ...],   // 5-7 terse log lines, e.g. "> CEO routing"
  "rows": [{ "id": string, "owner": "CEO"|"CFO"|"CMO"|"Manager"|"Field", "operation": "insert"|"update", "state": string }, ...],   // 3-5 rows
  "tasks": [{ "id": string, "title": string, "agent": string, "status": "todo"|"progress"|"done" }, ...],   // 2-4 tasks; at least one must be "done"
  "summary": string   // one short sentence summarizing what was orchestrated
}

Rules:
- All field values are short (max 6 words).
- "tasks" must mostly be "done" or "progress" by the end (you simulate the final state).
- The whole JSON must be under 500 tokens.
- Output JSON only. No prose, no markdown fences.`;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "live_unavailable", message: "Live runtime is not configured." },
      { status: 503 },
    );
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    const retrySeconds = Math.max(
      1,
      Math.round((limit.retryAt - Date.now()) / 1000),
    );
    return NextResponse.json(
      {
        error: "rate_limited",
        message: `Rate limit reached. Try again in ${retrySeconds}s.`,
        retryAfterSeconds: retrySeconds,
      },
      {
        headers: { "Retry-After": String(retrySeconds) },
        status: 429,
      },
    );
  }

  let body: { prompt?: string };
  try {
    body = (await request.json()) as { prompt?: string };
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const prompt = (body.prompt ?? "").trim().slice(0, 280);
  if (!prompt) {
    return NextResponse.json(
      { error: "bad_request", message: "prompt is required." },
      { status: 400 },
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const result = await client.messages.create({
      max_tokens: 800,
      messages: [{ content: prompt, role: "user" }],
      model: "claude-haiku-4-5-20251001",
      system: SYSTEM_PROMPT,
    });

    const textPart = result.content.find((p) => p.type === "text");
    const text = textPart && textPart.type === "text" ? textPart.text : "";

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "parse_failed",
          message: "Atlas returned malformed output. Falling back to simulation.",
          raw: text,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ atlas: parsed }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Anthropic error.";
    return NextResponse.json(
      { error: "anthropic_error", message },
      { status: 502 },
    );
  }
}
