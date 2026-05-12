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

const buildSha = readGitSha();
const buildTime = new Date().toISOString();
const buildCommitSubject = readGitCommitSubject();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_COMMIT_SUBJECT: buildCommitSubject,
    NEXT_PUBLIC_BUILD_SHA: buildSha,
    NEXT_PUBLIC_BUILD_TIME: buildTime,
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
