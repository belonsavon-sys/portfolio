import { execSync } from "node:child_process";
import type { NextConfig } from "next";

// Capture build-time signals so the site can show a live "last shipped"
// stamp. All values are baked in as public env vars at build time —
// they don't refresh after deploy. Vercel auto-injects
// VERCEL_GIT_COMMIT_SHA + VERCEL_GIT_COMMIT_MESSAGE on its builds;
// locally we read git.
function readGitSha() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "dev";
  }
}

function readGitCommitSubject() {
  if (process.env.VERCEL_GIT_COMMIT_MESSAGE) {
    // Vercel passes the FULL message — we just want the subject line.
    return process.env.VERCEL_GIT_COMMIT_MESSAGE.split("\n")[0].trim();
  }
  try {
    return execSync("git log -1 --pretty=%s", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "";
  }
}

// Last N commits — subject + sha + relative time stamp. Captured at
// build so /now can render real shipping log instead of a hardcoded
// list. Skipped on Vercel (no git history in the build env) — Vercel
// uses VERCEL_GIT_COMMIT_MESSAGE for the single-latest variant
// instead.
function readRecentCommits(limit = 10) {
  try {
    const raw = execSync(
      `git log -${limit} --pretty=format:%h%x09%s%x09%ar%x09%H`,
      { stdio: ["ignore", "pipe", "ignore"] },
    ).toString();
    const lines = raw.split("\n").filter(Boolean);
    return JSON.stringify(
      lines.map((line) => {
        const [shortSha, subject, when, fullSha] = line.split("\t");
        return {
          fullSha: (fullSha ?? "").trim(),
          sha: (shortSha ?? "").trim(),
          subject: (subject ?? "").trim(),
          when: (when ?? "").trim(),
        };
      }),
    );
  } catch {
    return "[]";
  }
}

const buildSha = readGitSha();
const buildTime = new Date().toISOString();
const buildCommitSubject = readGitCommitSubject();
const buildRecentCommits = readRecentCommits();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_COMMIT_SUBJECT: buildCommitSubject,
    NEXT_PUBLIC_BUILD_RECENT_COMMITS: buildRecentCommits,
    NEXT_PUBLIC_BUILD_SHA: buildSha,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
