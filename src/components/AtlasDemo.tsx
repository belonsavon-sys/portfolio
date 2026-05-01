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

const statusMeta: Record<TaskStatus, { label: string; marker: string }> = {
  done: { label: "done", marker: "●" },
  progress: { label: "in progress", marker: "◐" },
  todo: { label: "todo", marker: "◯" },
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
  const steps = useMemo(() => createSteps(runPrompt), [runPrompt]);
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
    setRunPrompt(nextPrompt);
    setStepIndex(0);
    setRunId((id) => id + 1);
    setStatus("running");
  }

  function resetSimulation() {
    setStepIndex(0);
    setRunId((id) => id + 1);
    setStatus("idle");
  }

  return (
    <div className="mt-10">
      <div className="grid gap-3 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4 lg:grid-cols-[1fr_auto_auto]">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-text-dark">
            User prompt
          </span>
          <input
            className="h-12 rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-4 text-text-dark outline-none transition focus:border-accent"
            onChange={(event) => setPrompt(event.target.value)}
            value={prompt}
          />
        </label>
        <div className="flex items-end">
          <Button disabled={status === "running"} onClick={runSimulation}>
            {status === "complete" ? "Replay" : "Run Simulation"}
          </Button>
        </div>
        <div className="flex items-end">
          <Button onClick={resetSimulation} variant="ghostDark">
            Reset
          </Button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <GlassCard>
          <p className="text-sm font-semibold text-accent">Pane 1</p>
          <h3 className="mt-3 text-xl font-semibold">Harness Terminal</h3>
          <TerminalWindow
            className="mt-5"
            key={`terminal-${runId}`}
            linePauseMs={220}
            lines={currentStep.terminal}
            title="atlas"
            typingSpeedMs={18}
          />
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-accent">Pane 2</p>
          <h3 className="mt-3 text-xl font-semibold">Database</h3>
          <DatabaseTable rows={currentStep.dbRows} />
        </GlassCard>

        <GlassCard>
          <p className="text-sm font-semibold text-accent">Pane 3</p>
          <h3 className="mt-3 text-xl font-semibold">Task Board</h3>
          <TaskBoard tasks={currentStep.tasks} />
        </GlassCard>
      </div>
    </div>
  );
}

function DatabaseTable({ rows }: { rows: DatabaseRow[] }) {
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2">
      <div className="grid grid-cols-[1fr_90px_90px] border-b border-[rgba(41,110,214,0.18)] px-4 py-3 text-sm font-semibold text-text-dark">
        <span>tasks</span>
        <span>owner</span>
        <span>state</span>
      </div>
      <AnimatePresence initial={false}>
        {rows.length > 0 ? (
          rows.map((row, index) => (
            <motion.div
              animate={{
                backgroundColor:
                  index === rows.length - 1
                    ? "rgba(41, 110, 214, 0.18)"
                    : "rgba(17, 24, 39, 0)",
              }}
              className="grid grid-cols-[1fr_90px_90px] border-b border-[rgba(41,110,214,0.18)] px-4 py-3 text-sm text-text-dark-muted last:border-b-0"
              exit={{ opacity: 0, y: -8 }}
              initial={{ opacity: 0, y: 8 }}
              key={row.id}
              transition={{ duration: 0.25 }}
            >
              <span>{row.operation === "insert" ? "+ " : "↻ "}{row.id}</span>
              <span>{row.owner}</span>
              <span>{row.state}</span>
            </motion.div>
          ))
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="px-4 py-6 text-sm text-text-dark-muted"
            initial={{ opacity: 0 }}
          >
            Waiting for agent activity...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskBoard({ tasks }: { tasks: TaskItem[] }) {
  return (
    <div className="mt-5 grid gap-3">
      <AnimatePresence initial={false}>
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const meta = statusMeta[task.status];

            return (
              <motion.div
                className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-4 py-3"
                initial={{ opacity: 0, y: 8 }}
                key={task.id}
                layout
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-text-dark">{task.title}</p>
                    <p className="mt-1 text-sm text-text-dark-muted">
                      {task.agent}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-[rgba(41,110,214,0.18)] px-2 py-1 text-sm text-text-dark">
                    {meta.marker} {meta.label}
                  </span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            animate={{ opacity: 1 }}
            className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-4 py-6 text-sm text-text-dark-muted"
            initial={{ opacity: 0 }}
          >
            Waiting for routed work...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
