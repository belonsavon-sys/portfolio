"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";
import { TerminalWindow, type TerminalLine } from "./TerminalWindow";

type DemoStatus = "idle" | "running" | "complete";
type TaskStatus = "todo" | "progress" | "done";

type DemoStep = {
  dbRows: DatabaseRow[];
  duration: number;
  terminal: TerminalLine[];
  tasks: TaskItem[];
};

type DatabaseRow = {
  id: string;
  operation: string;
  owner: string;
  state: string;
};

type TaskItem = {
  agent: string;
  id: string;
  status: TaskStatus;
  title: string;
};

const seededPrompt = "Build a guest-message QA launch plan";

type AtlasApiPayload = {
  rows?: { id: string; operation: string; owner: string; state: string }[];
  summary?: string;
  tasks?: { agent: string; id: string; status: TaskStatus; title: string }[];
  terminal?: string[];
};

function stepsFromLive(prompt: string, atlas: AtlasApiPayload): DemoStep[] {
  const lines = (atlas.terminal ?? []).slice(0, 10);
  const rows = (atlas.rows ?? []).slice(0, 6);
  const tasks = (atlas.tasks ?? []).slice(0, 5);
  const out: DemoStep[] = [
    {
      dbRows: [],
      duration: 700,
      tasks: [],
      terminal: [{ text: `> prompt: ${prompt}` }],
    },
  ];
  for (let i = 0; i < lines.length; i += 1) {
    out.push({
      dbRows: rows.slice(0, Math.min(rows.length, i + 1)),
      duration: 800,
      tasks: tasks.slice(0, Math.min(tasks.length, i + 1)),
      terminal: [
        { text: `> prompt: ${prompt}` },
        ...lines.slice(0, i + 1).map((t) => ({ text: t })),
      ],
    });
  }
  if (out.length === 1) {
    out.push({
      dbRows: rows,
      duration: 1000,
      tasks,
      terminal: [
        { text: `> prompt: ${prompt}` },
        { text: "> Atlas live runtime", kind: "output" },
      ],
    });
  }
  // Append a final step where any "progress" tasks are settled.
  const settled = tasks.map((t) =>
    t.status === "todo" ? { ...t, status: "progress" as TaskStatus } : t,
  );
  out.push({
    dbRows: rows,
    duration: 900,
    tasks: settled,
    terminal: [
      { text: `> prompt: ${prompt}` },
      ...lines.map((t) => ({ text: t })),
      {
        kind: "output",
        text: atlas.summary ?? "Atlas run complete.",
      },
    ],
  });
  return out;
}

const statusMeta: Record<
  TaskStatus,
  { bg: string; border: string; label: string; marker: string; text: string }
> = {
  done: {
    bg: "bg-[rgba(16,185,129,0.10)]",
    border: "border-result-green/40",
    label: "Done",
    marker: "●",
    text: "text-result-green",
  },
  progress: {
    bg: "bg-[rgba(91,155,244,0.10)]",
    border: "border-accent-light/40",
    label: "In progress",
    marker: "◐",
    text: "text-accent-light",
  },
  todo: {
    bg: "bg-[rgba(255,255,255,0.04)]",
    border: "border-[rgba(41,110,214,0.25)]",
    label: "Todo",
    marker: "◯",
    text: "text-text-dark-muted",
  },
};

function createSteps(prompt: string): DemoStep[] {
  const briefRow = {
    id: "task_brief",
    operation: "insert",
    owner: "CEO",
    state: "brief received",
  };
  const financeRow = {
    id: "budget_check",
    operation: "insert",
    owner: "CFO",
    state: "cost guardrails",
  };
  const marketingRow = {
    id: "launch_copy",
    operation: "insert",
    owner: "CMO",
    state: "message draft",
  };
  const executionRow = {
    id: "field_run",
    operation: "update",
    owner: "Field",
    state: "completed",
  };

  const buildTask = {
    agent: "Manager",
    id: "build-plan",
    title: "Build QA launch plan",
  };
  const deployTask = {
    agent: "Field",
    id: "deploy-checklist",
    title: "Deploy checklist",
  };
  const reportTask = {
    agent: "CFO",
    id: "report-outcome",
    title: "Report outcome",
  };

  return [
    {
      dbRows: [],
      duration: 900,
      tasks: [],
      terminal: [{ text: `> prompt: ${prompt}` }],
    },
    {
      dbRows: [briefRow],
      duration: 1100,
      tasks: [{ ...buildTask, status: "todo" }],
      terminal: [{ text: `> prompt: ${prompt}` }, { text: "> CEO routing" }],
    },
    {
      dbRows: [briefRow, financeRow],
      duration: 1200,
      tasks: [
        { ...buildTask, status: "progress" },
        { ...reportTask, status: "todo" },
      ],
      terminal: [
        { text: `> prompt: ${prompt}` },
        { text: "> CEO routing" },
        { text: "> Agent CFO ack" },
      ],
    },
    {
      dbRows: [briefRow, financeRow, marketingRow],
      duration: 1200,
      tasks: [
        { ...buildTask, status: "progress" },
        { ...deployTask, status: "todo" },
        { ...reportTask, status: "progress" },
      ],
      terminal: [
        { text: `> prompt: ${prompt}` },
        { text: "> CEO routing" },
        { text: "> Agent CFO ack" },
        { text: "> Agent CMO ack" },
      ],
    },
    {
      dbRows: [briefRow, financeRow, marketingRow],
      duration: 1300,
      tasks: [
        { ...buildTask, status: "done" },
        { ...deployTask, status: "progress" },
        { ...reportTask, status: "progress" },
      ],
      terminal: [
        { text: `> prompt: ${prompt}` },
        { text: "> CEO routing" },
        { text: "> Agent CFO ack" },
        { text: "> Agent CMO ack" },
        { text: "> Manager delegates" },
      ],
    },
    {
      dbRows: [briefRow, financeRow, marketingRow, executionRow],
      duration: 1500,
      tasks: [
        { ...buildTask, status: "done" },
        { ...deployTask, status: "done" },
        { ...reportTask, status: "done" },
      ],
      terminal: [
        { text: `> prompt: ${prompt}` },
        { text: "> CEO routing" },
        { text: "> Agent CFO ack" },
        { text: "> Agent CMO ack" },
        { text: "> Manager delegates" },
        { text: "> Field active" },
        { kind: "output", text: "Database persisted. Task board complete." },
      ],
    },
  ];
}

export function AtlasDemo() {
  const [prompt, setPrompt] = useState(seededPrompt);
  const [runPrompt, setRunPrompt] = useState(seededPrompt);
  const [runId, setRunId] = useState(0);
  const [status, setStatus] = useState<DemoStatus>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [mode, setMode] = useState<"sim" | "live">("sim");
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveSteps, setLiveSteps] = useState<DemoStep[] | null>(null);
  const [liveSummary, setLiveSummary] = useState<string | null>(null);
  const simulatedSteps = useMemo(() => createSteps(runPrompt), [runPrompt]);
  const steps = mode === "live" && liveSteps ? liveSteps : simulatedSteps;
  const currentStep = steps[stepIndex];

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    if (stepIndex >= steps.length - 1) {
      const timeout = window.setTimeout(() => setStatus("complete"), 700);
      return () => window.clearTimeout(timeout);
    }

    const timeout = window.setTimeout(() => {
      setStepIndex((index) => index + 1);
    }, currentStep.duration);

    return () => window.clearTimeout(timeout);
  }, [currentStep.duration, status, stepIndex, steps.length]);

  function runSimulation() {
    const nextPrompt = prompt.trim() || seededPrompt;
    setMode("sim");
    setLiveError(null);
    setLiveSteps(null);
    setLiveSummary(null);
    setRunPrompt(nextPrompt);
    setStepIndex(0);
    setRunId((id) => id + 1);
    setStatus("running");
  }

  async function runLive() {
    const nextPrompt = prompt.trim() || seededPrompt;
    setLiveError(null);
    setRunPrompt(nextPrompt);
    setStepIndex(0);
    setRunId((id) => id + 1);
    setMode("live");
    setStatus("running");
    setLiveSteps(null);
    setLiveSummary(null);

    try {
      const response = await fetch("/api/atlas/run", {
        body: JSON.stringify({ prompt: nextPrompt }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
      const data = (await response.json()) as
        | { atlas: AtlasApiPayload }
        | { error: string; message: string };
      if (!response.ok || "error" in data) {
        const message = "message" in data ? data.message : "Live runtime error.";
        setLiveError(message);
        setMode("sim");
        // continue simulation flow with the existing scripted steps
        return;
      }
      const next = stepsFromLive(nextPrompt, data.atlas);
      setLiveSteps(next);
      setLiveSummary(data.atlas.summary ?? null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Network error reaching live runtime.";
      setLiveError(message);
      setMode("sim");
    }
  }

  function resetSimulation() {
    setStepIndex(0);
    setRunId((id) => id + 1);
    setStatus("idle");
    setMode("sim");
    setLiveError(null);
    setLiveSteps(null);
    setLiveSummary(null);
  }

  const totalSteps = steps.length;
  const stepProgress = Math.min(stepIndex + 1, totalSteps);
  const statusLabel =
    status === "running"
      ? "Running"
      : status === "complete"
        ? "Complete"
        : "Idle";
  const statusTone =
    status === "running"
      ? "text-accent-light"
      : status === "complete"
        ? "text-result-green"
        : "text-text-dark-muted";

  return (
    <div className="mt-10">
      {/* CONTROL DECK — cinematic header */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(41,110,214,0.28)] bg-gradient-to-br from-bg-dark-2 to-bg-dark p-6 backdrop-blur-md sm:p-8">
        {/* Ambient corner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-accent/22 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -bottom-32 h-72 w-72 rounded-full bg-accent-light/12 blur-3xl"
        />

        {/* TOP ROW — runtime label + status pill + step counter */}
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-accent-light">
              Atlas · Live runtime
            </span>
            <span aria-hidden="true" className="h-px w-10 bg-accent-light/50" />
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.22em] ${
                status === "running"
                  ? "border-accent-light/40 bg-[rgba(91,155,244,0.10)] text-accent-light"
                  : status === "complete"
                    ? "border-result-green/40 bg-[rgba(16,185,129,0.10)] text-result-green"
                    : "border-[rgba(41,110,214,0.25)] bg-bg-dark/50 text-text-dark-muted"
              } ${statusTone}`}
            >
              <span className="relative inline-flex h-2 w-2">
                {status === "running" ? (
                  <span className="absolute inset-0 animate-ping rounded-full bg-accent-light/60" />
                ) : null}
                <span
                  className={`relative inline-block h-2 w-2 rounded-full ${
                    status === "running"
                      ? "bg-accent-light"
                      : status === "complete"
                        ? "bg-result-green"
                        : "bg-text-dark-muted"
                  }`}
                />
              </span>
              {statusLabel}
            </span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-text-dark-muted">
            <span>
              Step{" "}
              <span className="text-text-dark">
                {String(stepProgress).padStart(2, "0")}
              </span>{" "}
              / {String(totalSteps).padStart(2, "0")}
            </span>
            {mode === "live" ? (
              <span className="rounded-md border border-accent-light/40 bg-[rgba(91,155,244,0.10)] px-1.5 py-0.5 text-[10px] text-accent-light">
                Live runtime
              </span>
            ) : (
              <span className="rounded-md border border-[rgba(41,110,214,0.25)] bg-bg-dark/50 px-1.5 py-0.5 text-[10px] text-text-dark-muted">
                Simulation
              </span>
            )}
          </div>
        </div>

        {/* TITLE */}
        <h3 className="display-text relative mt-5 max-w-3xl text-text-dark">
          Send a prompt. Watch the agents move.
        </h3>
        <p className="relative mt-3 max-w-2xl text-sm leading-7 text-text-dark-muted sm:text-base">
          CEO routes the work, C-suite acknowledges, managers delegate, field
          agents execute. Every layer logged to the terminal, persisted to the
          DB, tracked on the board.
        </p>

        {/* PROMPT + CONTROLS */}
        <div className="relative mt-7 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              Prompt
            </span>
            <input
              className="h-12 rounded-xl border border-[rgba(41,110,214,0.35)] bg-bg-dark px-4 font-mono text-sm text-text-dark outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
              onChange={(event) => setPrompt(event.target.value)}
              value={prompt}
            />
          </label>
          <Button disabled={status === "running"} onClick={runLive}>
            Run Live →
          </Button>
          <Button
            disabled={status === "running"}
            onClick={runSimulation}
            variant="ghostDark"
          >
            {status === "complete" ? "Replay" : "Simulate"}
          </Button>
          <Button onClick={resetSimulation} variant="ghostDark">
            Reset ↺
          </Button>
        </div>

        {liveError ? (
          <p className="relative mt-3 rounded-lg border border-problem-red/40 bg-[rgba(239,68,68,0.08)] px-3 py-2 text-xs text-text-dark">
            Live runtime unavailable — showing simulation.{" "}
            <span className="text-text-dark-muted">{liveError}</span>
          </p>
        ) : null}
        {liveSummary ? (
          <p className="relative mt-3 rounded-lg border border-accent/30 bg-[rgba(41,110,214,0.08)] px-3 py-2 text-xs text-text-dark">
            <span className="font-mono uppercase tracking-[0.18em] text-accent-light">
              Live ·{" "}
            </span>
            {liveSummary}
          </p>
        ) : null}

        {/* PROGRESS RAIL — segments instead of a single bar */}
        <div className="relative mt-6">
          <div className="flex gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const filled = i < stepProgress;
              return (
                <motion.span
                  animate={{ opacity: filled ? 1 : 0.25 }}
                  className={`h-1 flex-1 rounded-full ${
                    filled
                      ? "bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                      : "bg-[rgba(41,110,214,0.2)]"
                  }`}
                  initial={false}
                  key={i}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <AtlasPanel
          accent="text-accent-light"
          eyebrow="01 · stream"
          icon={<TerminalIcon className="h-4 w-4" />}
          subtitle={`${currentStep.terminal.length} lines`}
          title="Harness Terminal"
        >
          <TerminalWindow
            className="mt-5"
            key={`terminal-${runId}`}
            linePauseMs={220}
            lines={currentStep.terminal}
            title="atlas"
            typingSpeedMs={18}
          />
        </AtlasPanel>

        <AtlasPanel
          accent="text-accent-light"
          eyebrow="02 · persistence"
          icon={<DatabaseIcon className="h-4 w-4" />}
          subtitle={`${currentStep.dbRows.length} ${currentStep.dbRows.length === 1 ? "row" : "rows"}`}
          title="Database"
        >
          <DatabaseTable rows={currentStep.dbRows} />
        </AtlasPanel>

        <AtlasPanel
          accent="text-accent-light"
          eyebrow="03 · orchestration"
          icon={<BoardIcon className="h-4 w-4" />}
          subtitle={`${currentStep.tasks.filter((t) => t.status === "done").length}/${currentStep.tasks.length || 0} done`}
          title="Task Board"
        >
          <TaskBoard tasks={currentStep.tasks} />
        </AtlasPanel>
      </div>
    </div>
  );
}

function AtlasPanel({
  accent,
  children,
  eyebrow,
  icon,
  subtitle,
  title,
}: {
  accent: string;
  children: React.ReactNode;
  eyebrow: string;
  icon: React.ReactNode;
  subtitle: string;
  title: string;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2/85 p-5 backdrop-blur-md transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/45">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.28em] ${accent}`}
        >
          {icon}
          {eyebrow}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
          {subtitle}
        </span>
      </div>
      <h3 className="mt-3 text-xl font-semibold text-text-dark sm:text-2xl">
        {title}
      </h3>
      {children}
    </div>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m6 8 4 4-4 4M12 16h6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <rect
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
        width="18"
        x="3"
        y="4"
      />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <ellipse
        cx="12"
        cy="6"
        rx="8"
        ry="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BoardIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.4"
        width="18"
        x="3"
        y="4"
      />
      <path
        d="M8 8h8M8 12h6M8 16h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DatabaseTable({ rows }: { rows: DatabaseRow[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2">
      <div className="grid grid-cols-[1fr_70px_80px] border-b border-[rgba(41,110,214,0.18)] bg-bg-dark/40 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
        <span>row · id</span>
        <span>owner</span>
        <span>state</span>
      </div>
      <AnimatePresence initial={false}>
        {rows.length > 0 ? (
          rows.map((row, index) => {
            const isNewest = index === rows.length - 1;
            return (
              <motion.div
                animate={{
                  backgroundColor: isNewest
                    ? "rgba(41, 110, 214, 0.16)"
                    : "rgba(17, 24, 39, 0)",
                  opacity: 1,
                  y: 0,
                }}
                className="grid grid-cols-[1fr_70px_80px] items-center border-b border-[rgba(41,110,214,0.14)] px-4 py-2.5 font-mono text-[11px] text-text-dark-muted last:border-b-0"
                exit={{ opacity: 0, y: -8 }}
                initial={{ opacity: 0, y: 8 }}
                key={row.id}
                transition={{ duration: 0.3 }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-sm ${
                      row.operation === "insert"
                        ? "bg-result-green"
                        : "bg-accent-light"
                    }`}
                  />
                  <span className="truncate text-text-dark">{row.id}</span>
                </span>
                <span className="uppercase tracking-[0.18em] text-accent-light">
                  {row.owner}
                </span>
                <span className="uppercase tracking-[0.18em]">
                  {row.state}
                </span>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 px-4 py-6 font-mono text-xs text-text-dark-muted"
            initial={{ opacity: 0 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-dark-muted" />
            Waiting for agent activity…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskBoard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="mt-5 grid gap-2.5">
      <AnimatePresence initial={false}>
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const meta = statusMeta[task.status];

            return (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className={`relative overflow-hidden rounded-xl border ${meta.border} bg-bg-dark-2 px-4 py-3 transition-colors`}
                initial={{ opacity: 0, y: 8 }}
                key={task.id}
                layout
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Status accent stripe on left */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-2 left-1 w-0.5 rounded-full ${meta.text === "text-result-green" ? "bg-result-green" : meta.text === "text-accent-light" ? "bg-accent-light" : "bg-text-dark-muted/40"}`}
                />
                <div className="flex items-start justify-between gap-3 pl-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text-dark">
                      {task.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
                      <span className="rounded border border-[rgba(41,110,214,0.3)] bg-bg-dark/50 px-1.5 py-0.5 text-accent-light">
                        {task.agent}
                      </span>
                      <span>agent</span>
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border ${meta.border} ${meta.bg} px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.22em] ${meta.text}`}
                  >
                    <span>{meta.marker}</span>
                    {meta.label}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-4 py-6 font-mono text-xs text-text-dark-muted"
            initial={{ opacity: 0 }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-dark-muted" />
            Waiting for routed work…
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
