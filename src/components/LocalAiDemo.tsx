"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { DemoTabCard, type DemoLoadStatus } from "./DemoTabCard";

type LocalAiTabId =
  | "image-classification"
  | "llm-chat"
  | "computer-vision"
  | "speech-to-text"
  | "semantic-search";

type RuntimeDevice = "webgpu" | "wasm";

type PipelineTask =
  | "automatic-speech-recognition"
  | "feature-extraction"
  | "image-classification"
  | "text-generation"
  | "zero-shot-image-classification";

type TabConfig = {
  badge: string;
  description: string;
  // Optional per-tab override. Some model + task combos (notably CLIP zero-shot)
  // are unstable on WebGPU at fp32 in transformers.js v4.2 — pin them to WASM.
  forceDevice?: RuntimeDevice;
  forceDtype?: string;
  howItWorks: string[];
  icon: (props: { className?: string }) => React.ReactNode;
  id: LocalAiTabId;
  label: string;
  model: string;
  task: PipelineTask;
};

const tabs: TabConfig[] = [
  {
    badge: "MobileNet · ~6 MB",
    description:
      "Classify any image in your browser. Single label, top-5 predictions, runs entirely on-device.",
    howItWorks: [
      "MobileNet v4 is a small, fast image classification model trained on ImageNet (1000 classes).",
      "The model loads ~6 MB once and caches in your browser. Inference is < 200 ms on mid-range hardware.",
      "Recruiter-relevant: same architecture pattern I used to digitize the QA inspection process at ThePrivateHotels.",
    ],
    icon: ImageIcon,
    id: "image-classification",
    label: "Image Classification",
    model: "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
    task: "image-classification",
  },
  {
    badge: "SmolLM2 · ~135 MB",
    description:
      "Type a prompt, get a response. The model lives in your browser tab — no API key, no cloud round-trip.",
    howItWorks: [
      "SmolLM2-135M-Instruct is a compact instruction-tuned LLM. Optimized for browser inference via Transformers.js.",
      "Quantized to 4-bit on WebGPU, falls back to WASM with int8 quantization on machines without WebGPU.",
      "Demonstrates the on-device pattern Atlas uses for routing decisions when latency or privacy matter.",
    ],
    icon: ChatIcon,
    id: "llm-chat",
    label: "LLM Chat",
    model: "HuggingFaceTB/SmolLM2-135M-Instruct",
    task: "text-generation",
  },
  {
    badge: "CLIP ViT · ~24 MB",
    description:
      "Allow your camera, hold up your hand, and the recognized gesture appears on the side in real time. Frames processed locally — nothing uploaded.",
    forceDevice: "wasm",
    forceDtype: "q8",
    howItWorks: [
      "Uses zero-shot image classification: CLIP encodes the live webcam frame and each gesture phrase into the same vector space, then ranks by cosine similarity.",
      "Sampling at ~2 FPS via requestAnimationFrame to balance responsiveness and battery.",
      "Runs on quantized WASM for stability — same architecture pattern can drive any vision QA pipeline.",
    ],
    icon: EyeIcon,
    id: "computer-vision",
    label: "Computer Vision",
    model: "Xenova/clip-vit-base-patch16",
    task: "zero-shot-image-classification",
  },
  {
    badge: "Whisper Tiny · ~40 MB",
    description:
      "Upload an audio clip. Whisper transcribes it locally. Built for meeting notes, voicemail, customer calls.",
    howItWorks: [
      "OpenAI Whisper tiny.en, English-only variant for fastest browser inference.",
      "WebGPU-accelerated when available, falls back to WASM with int8 quantization elsewhere.",
      "Same model class drives the guest-message chatbot pipeline at ThePrivateHotels (server-side).",
    ],
    icon: MicIcon,
    id: "speech-to-text",
    label: "Speech to Text",
    model: "onnx-community/whisper-tiny.en",
    task: "automatic-speech-recognition",
  },
  {
    badge: "MXBAI Embed · ~24 MB",
    description:
      "Type a query. The model ranks a small business dataset by semantic intent — not keyword match. Built for ops dashboards, customer search, and RAG.",
    howItWorks: [
      "mxbai-embed-xsmall encodes both query and dataset rows into 384-dim vectors. Ranking by cosine similarity.",
      "The same embedding pattern powers the inspection-checklist QA system: search 'broken' and find the issue even when the row says 'damaged'.",
      "Server cost: $0. Latency: < 50 ms per query after model load.",
    ],
    icon: SearchIcon,
    id: "semantic-search",
    label: "Semantic Search",
    model: "mixedbread-ai/mxbai-embed-xsmall-v1",
    task: "feature-extraction",
  },
];

type TransformersPipeline = (input: unknown, options?: unknown) => Promise<unknown>;
type TransformersModule = {
  env?: {
    allowLocalModels?: boolean;
    allowRemoteModels?: boolean;
    backends?: {
      onnx?: { wasm?: { proxy?: boolean; wasmPaths?: string } };
    };
  };
  pipeline: (
    task: PipelineTask,
    model?: string,
    options?: Record<string, unknown>,
  ) => Promise<TransformersPipeline>;
};

const pipelineCache = new Map<string, TransformersPipeline>();
let transformersModule: TransformersModule | null = null;

async function getTransformers(): Promise<TransformersModule> {
  if (transformersModule) return transformersModule;
  const mod = (await import("@huggingface/transformers")) as TransformersModule;
  if (mod.env) {
    mod.env.allowLocalModels = false;
    mod.env.allowRemoteModels = true;
  }
  transformersModule = mod;
  return mod;
}

async function loadPipeline(
  task: PipelineTask,
  model: string,
  device: RuntimeDevice,
  onProgress: (percent: number, detail: string) => void,
  dtypeOverride?: string,
): Promise<TransformersPipeline> {
  const key = `${task}::${model}::${device}::${dtypeOverride ?? "auto"}`;
  const cached = pipelineCache.get(key);
  if (cached) {
    onProgress(100, "Cached — ready");
    return cached;
  }
  const mod = await getTransformers();
  const dtype =
    dtypeOverride ??
    (task === "text-generation"
      ? device === "webgpu"
        ? "q4f16"
        : "q4"
      : device === "webgpu"
        ? "fp32"
        : "q8");
  const pipe = await mod.pipeline(task, model, {
    device,
    dtype,
    progress_callback: (event: unknown) => {
      const { percent, detail } = progressFromEvent(event);
      onProgress(percent, detail);
    },
  });
  pipelineCache.set(key, pipe);
  return pipe;
}

function progressFromEvent(event: unknown): { detail: string; percent: number } {
  if (!event || typeof event !== "object") return { detail: "Loading", percent: 0 };
  const e = event as Record<string, unknown>;
  const status = typeof e.status === "string" ? e.status : "";
  const file = typeof e.file === "string" ? e.file : "";
  const loaded = typeof e.loaded === "number" ? e.loaded : 0;
  const total = typeof e.total === "number" ? e.total : 0;
  const progress = typeof e.progress === "number" ? e.progress : 0;
  const percent =
    progress > 0 ? Math.min(100, progress) : total > 0 ? (loaded / total) * 100 : 0;
  const detail = file ? `${status} ${file}` : status || "Loading";
  return { detail, percent };
}

async function detectDevice(): Promise<RuntimeDevice> {
  if (typeof navigator !== "undefined") {
    const nav = navigator as { gpu?: { requestAdapter?: () => Promise<unknown> } };
    if (nav.gpu?.requestAdapter) {
      try {
        const adapter = await nav.gpu.requestAdapter();
        if (adapter) return "webgpu";
      } catch {
        // fall through
      }
    }
  }
  return "wasm";
}

export function LocalAiDemo() {
  const [activeId, setActiveId] = useState<LocalAiTabId>("image-classification");
  const activeTab = useMemo(() => tabs.find((t) => t.id === activeId)!, [activeId]);
  const [device, setDevice] = useState<RuntimeDevice | null>(null);

  useEffect(() => {
    detectDevice().then(setDevice);
  }, []);

  return (
    <div className="mt-10">
      {/* HARDWARE BAR — wide, glassy, monospace */}
      <div className="mb-8 grid gap-3 rounded-2xl border border-[rgba(41,110,214,0.22)] bg-bg-dark-2/70 p-4 backdrop-blur-md sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-result-green/60" />
            <span className="relative inline-block h-2.5 w-2.5 rounded-full bg-result-green ring-4 ring-result-green/20" />
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-text-dark">
            {device === "webgpu"
              ? "WebGPU detected · GPU-accelerated"
              : device === "wasm"
                ? "Running on WASM · CPU-only"
                : "Detecting hardware…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-[0.24em] text-text-dark-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className="text-accent-light">●</span> On-device
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-[rgba(41,110,214,0.25)] sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <span className="text-accent-light">●</span> No API key
          </span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-[rgba(41,110,214,0.25)] sm:inline-block" />
          <span className="inline-flex items-center gap-1.5">
            <span className="text-accent-light">●</span> No upload
          </span>
        </div>
      </div>

      {/* TAB PILLS — bigger, with icons and active indicator */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2 rounded-full border border-[rgba(41,110,214,0.18)] bg-bg-dark-2/60 p-1.5 backdrop-blur-md sm:gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              aria-pressed={isActive}
              className={`relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-white"
                  : "text-text-dark-muted hover:text-text-dark"
              }`}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              type="button"
            >
              {isActive ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent-deep shadow-[0_4px_14px_-4px_rgba(41,110,214,0.55)]"
                  layoutId="local-ai-active-tab"
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : null}
              <tab.icon className="relative h-4 w-4" />
              <span className="relative hidden sm:inline">{tab.label}</span>
              <span className="relative sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      <TabSurface
        tab={activeTab}
        device={activeTab.forceDevice ?? device ?? "wasm"}
      />
    </div>
  );
}

function TabSurface({
  device,
  tab,
}: {
  device: RuntimeDevice;
  tab: TabConfig;
}) {
  const [loadStatus, setLoadStatus] = useState<DemoLoadStatus>("idle");
  const [loadProgress, setLoadProgress] = useState(0);
  const [pipe, setPipe] = useState<TransformersPipeline | null>(null);

  // Reset state when switching tabs
  useEffect(() => {
    setLoadStatus("idle");
    setLoadProgress(0);
    setPipe(null);
  }, [tab.id]);

  async function handleLoad() {
    setLoadStatus("loading");
    setLoadProgress(0);
    try {
      const next = await loadPipeline(
        tab.task,
        tab.model,
        device,
        (percent) => setLoadProgress(percent),
        tab.forceDtype,
      );
      setPipe(next);
      setLoadStatus("ready");
    } catch (error) {
      console.error(error);
      setLoadStatus("error");
    }
  }

  return (
    <DemoTabCard
      badge={`${tab.badge} · ${device.toUpperCase()}`}
      description={tab.description}
      howItWorks={
        <ul className="grid gap-2">
          {tab.howItWorks.map((line) => (
            <li className="flex items-start gap-2" key={line}>
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      }
      loadProgress={loadProgress}
      loadStatus={loadStatus}
      onLoad={handleLoad}
      title={tab.label}
    >
      {pipe && loadStatus === "ready" ? (
        <TabRunner pipe={pipe} tabId={tab.id} />
      ) : null}
      {loadStatus === "error" ? (
        <p className="rounded-lg border border-problem-red/40 bg-[rgba(239,68,68,0.08)] p-4 text-sm text-text-dark">
          Failed to load model. Some tabs need WebGPU; try a Chromium-based browser, or click Load Model again.
        </p>
      ) : null}
    </DemoTabCard>
  );
}

function TabRunner({
  pipe,
  tabId,
}: {
  pipe: TransformersPipeline;
  tabId: LocalAiTabId;
}) {
  switch (tabId) {
    case "image-classification":
      return <ImageClassificationRunner pipe={pipe} />;
    case "llm-chat":
      return <LlmChatRunner pipe={pipe} />;
    case "computer-vision":
      return <ComputerVisionRunner pipe={pipe} />;
    case "speech-to-text":
      return <SpeechToTextRunner pipe={pipe} />;
    case "semantic-search":
      return <SemanticSearchRunner pipe={pipe} />;
  }
}

// ---------------- Image Classification ----------------

function ImageClassificationRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<{ label: string; score: number }[]>([]);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<number>(0);
  const [latency, setLatency] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function onUpload(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setRunning(true);
    setResults([]);
    startRef.current = performance.now();
    try {
      const out = (await pipe(url, { topk: 5 })) as { label: string; score: number }[];
      setResults(out);
      setLatency(performance.now() - startRef.current);
    } finally {
      setRunning(false);
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onUpload(file);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* DROP ZONE / PREVIEW */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Input · image
          </span>
          {imageUrl ? (
            <button
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:text-accent-light"
              onClick={() => {
                setImageUrl(null);
                setResults([]);
                setLatency(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              type="button"
            >
              Reset ↺
            </button>
          ) : null}
        </div>

        <label
          className={`mt-3 block cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-colors duration-200 ${
            dragging
              ? "border-accent bg-[rgba(41,110,214,0.10)]"
              : "border-[rgba(41,110,214,0.35)] bg-bg-dark/40 hover:border-accent/60 hover:bg-bg-dark/60"
          }`}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={onDrop}
        >
          <input
            accept="image/*"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            ref={fileInputRef}
            type="file"
          />
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="mx-auto max-h-72 rounded-xl object-contain"
              src={imageUrl}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(41,110,214,0.4)] bg-[rgba(41,110,214,0.10)] text-accent-light">
                <UploadIcon className="h-6 w-6" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-dark">
                Drop an image or click to browse
              </p>
              <p className="max-w-xs text-xs text-text-dark-muted">
                JPG, PNG, WEBP · processed on-device, never uploaded.
              </p>
            </div>
          )}
        </label>
      </div>

      {/* RESULTS */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Output · top 5 predictions
          </span>
          {latency != null ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-result-green">
              {Math.round(latency)} ms
            </span>
          ) : null}
        </div>

        {running ? (
          <div className="mt-4 grid gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                className="h-12 animate-pulse rounded-lg border border-[rgba(41,110,214,0.18)] bg-bg-dark-2/60"
                key={i}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        ) : results.length > 0 ? (
          <ul className="mt-4 grid gap-2">
            {results.map((r, index) => (
              <motion.li
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-3.5 py-3"
                initial={{ opacity: 0, x: -8 }}
                key={r.label}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-dark">
                    {r.label}
                  </span>
                  <span className="font-mono text-xs font-semibold text-accent-light">
                    {Math.round(r.score * 100)}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                  <motion.div
                    animate={{ width: `${Math.round(r.score * 100)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                    initial={{ width: 0 }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[rgba(41,110,214,0.2)] bg-bg-dark/30 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
              Awaiting input ·{"  "}drop an image to classify
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M12 4v12m0-12-4 4m4-4 4 4M5 20h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

// ---------------- LLM Chat ----------------

const chatSuggestions = [
  "Suggest a 3-step QA process for hotel housekeeping a small team can run.",
  "Draft a friendly reply to a guest who lost their key card.",
  "List 5 ways to cut response time on customer messages without hiring.",
];

function LlmChatRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [prompt, setPrompt] = useState(chatSuggestions[0]);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [tokenCount, setTokenCount] = useState<number | null>(null);
  const startRef = useRef<number>(0);

  async function run() {
    setRunning(true);
    setOutput("");
    setLatency(null);
    setTokenCount(null);
    startRef.current = performance.now();
    try {
      const result = (await pipe(
        [
          { role: "system", content: "You are a concise business operator." },
          { role: "user", content: prompt },
        ],
        { max_new_tokens: 220 },
      )) as { generated_text?: unknown }[] | string;
      const text = extractGeneratedText(result);
      setOutput(text);
      setLatency(performance.now() - startRef.current);
      // Rough token estimate — splits on whitespace.
      setTokenCount(text.trim().split(/\s+/).filter(Boolean).length);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-5">
      {/* PROMPT INPUT */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Prompt · system
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
            {prompt.length} chars
          </span>
        </div>
        <div className="mt-2 overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.3)] bg-bg-dark/60 transition-colors focus-within:border-accent">
          <textarea
            className="block min-h-28 w-full resize-none border-0 bg-transparent p-4 font-mono text-sm leading-7 text-text-dark outline-none placeholder:text-text-dark-muted"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask the model something a small business operator would care about…"
            rows={3}
            value={prompt}
          />
          <div className="flex items-center justify-between gap-3 border-t border-[rgba(41,110,214,0.2)] bg-bg-dark-2/40 px-4 py-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
                Try:
              </span>
              {chatSuggestions.map((s, i) => (
                <button
                  className="rounded-full border border-[rgba(41,110,214,0.3)] bg-bg-dark/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dark-muted transition-colors hover:border-accent hover:text-accent-light"
                  key={i}
                  onClick={() => setPrompt(s)}
                  type="button"
                >
                  #{i + 1}
                </button>
              ))}
            </div>
            <Button
              disabled={running || !prompt.trim()}
              onClick={run}
              variant="primary"
            >
              {running ? "Generating…" : "Generate ↵"}
            </Button>
          </div>
        </div>
      </div>

      {/* OUTPUT BUBBLE */}
      {running || output ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-gradient-to-br from-bg-dark-2 to-bg-dark p-5"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* corner accent */}
          <span
            aria-hidden="true"
            className="absolute left-4 top-4 h-3 w-3 border-l border-t border-accent-light/70"
          />
          <div className="ml-5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
              Output · assistant
            </span>
            {latency != null && tokenCount != null ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-result-green">
                {Math.round(latency)} ms · ~{tokenCount} tokens
              </span>
            ) : null}
          </div>
          {running ? (
            <div className="ml-5 mt-3 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-light" />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-accent-light"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-accent-light"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            <p className="ml-5 mt-3 whitespace-pre-wrap text-sm leading-7 text-text-dark">
              {output}
            </p>
          )}
        </motion.div>
      ) : (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-[rgba(41,110,214,0.2)] bg-bg-dark/30 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
            Press Generate to run the model in your browser
          </p>
        </div>
      )}
    </div>
  );
}

function extractGeneratedText(result: unknown): string {
  if (typeof result === "string") return result;
  if (Array.isArray(result)) {
    const first = result[0] as { generated_text?: unknown } | undefined;
    if (!first) return "";
    const gen = first.generated_text;
    if (typeof gen === "string") return gen;
    if (Array.isArray(gen)) {
      const last = gen[gen.length - 1] as { content?: unknown } | undefined;
      if (last && typeof last.content === "string") return last.content;
    }
  }
  return "";
}

// ---------------- Computer Vision (live webcam) ----------------

// Internal candidate set for zero-shot CLIP. The user just sees the winning
// gesture as a single word — they don't manage the label list.
const GESTURE_CANDIDATES = [
  "peace sign",
  "open palm",
  "fist",
  "thumbs up",
  "pointing finger",
  "OK sign",
  "no hand visible",
];

function ComputerVisionRunner({ pipe }: { pipe: TransformersPipeline }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [topMatch, setTopMatch] = useState<{ label: string; score: number } | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef(false);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", height: 360, width: 480 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setActive(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not access camera. Check browser permissions.",
      );
    }
  }

  function stop() {
    const video = videoRef.current;
    if (video?.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    setActive(false);
    setTopMatch(null);
  }

  useEffect(() => () => stop(), []);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const target = 1000 / 2; // ~2 FPS keeps CLIP responsive without burning CPU
    let lastSample = 0;

    async function loop(time: number) {
      if (cancelled) return;
      if (
        time - lastSample >= target &&
        !inflightRef.current &&
        videoRef.current &&
        canvasRef.current
      ) {
        lastSample = time;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = 224;
        canvas.height = 224;
        const ctx = canvas.getContext("2d");
        if (ctx && video.readyState >= 2) {
          ctx.drawImage(video, 0, 0, 224, 224);
          inflightRef.current = true;
          try {
            // Pass canvas directly — RawImage.fromCanvas avoids data-URL fetch
            // roundtrip and quirks in some browsers.
            const result = (await pipe(canvas, GESTURE_CANDIDATES)) as {
              label: string;
              score: number;
            }[];
            if (!cancelled && Array.isArray(result) && result[0]) {
              setTopMatch({ label: result[0].label, score: result[0].score });
              setError(null);
            }
          } catch (err) {
            console.error("[ComputerVision] inference error", err);
            if (!cancelled) {
              setError(
                err instanceof Error
                  ? err.message
                  : "Inference failed. Check the browser console.",
              );
            }
          } finally {
            inflightRef.current = false;
          }
        }
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
    return () => {
      cancelled = true;
    };
  }, [active, pipe]);

  return (
    <div className="grid gap-6">
      {error ? (
        <p className="rounded-lg border border-problem-red/40 bg-[rgba(239,68,68,0.08)] p-3 text-sm text-text-dark">
          {error}
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        {/* WEBCAM FRAME — camera-chrome border */}
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.3)] bg-bg-dark-2 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),0_24px_60px_-20px_rgba(0,0,0,0.7)]">
          <video
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
            muted
            playsInline
            ref={videoRef}
          />
          <canvas className="hidden" ref={canvasRef} />

          {/* Corner crosshairs — camera viewfinder feel */}
          {[
            "top-3 left-3 border-l-2 border-t-2",
            "top-3 right-3 border-r-2 border-t-2",
            "bottom-3 left-3 border-l-2 border-b-2",
            "bottom-3 right-3 border-r-2 border-b-2",
          ].map((pos, i) => (
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute h-5 w-5 border-accent-light/80 ${pos}`}
              key={i}
            />
          ))}

          {!active ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-bg-dark/40 backdrop-blur-sm">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent-light/40 bg-bg-dark/70">
                <CameraIcon className="h-7 w-7 text-accent-light" />
              </span>
              <Button onClick={start}>Start Camera</Button>
              <p className="max-w-xs text-center text-xs text-text-dark-muted">
                Camera permission requested · feed processed on-device, never uploaded
              </p>
            </div>
          ) : (
            <>
              <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-result-green/40 bg-bg-dark/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-result-green backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-result-green" />
                Live · 2 fps
              </div>
              <button
                className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-md border border-[rgba(255,255,255,0.2)] bg-bg-dark/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark transition-colors hover:border-problem-red/50 hover:text-problem-red"
                onClick={stop}
                type="button"
              >
                <span className="h-1.5 w-1.5 rounded-sm bg-problem-red" />
                Stop
              </button>
            </>
          )}
        </div>

        {/* PREDICTION PANEL */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[rgba(41,110,214,0.25)] bg-gradient-to-br from-bg-dark-2 to-bg-dark p-5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-light">
              Recognized · gesture
            </p>
            <p className="mt-3 text-3xl font-semibold leading-tight text-text-dark sm:text-4xl">
              {active && topMatch ? topMatch.label : "—"}
            </p>
            {active && topMatch ? (
              <>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                  <motion.div
                    animate={{ width: `${Math.round(topMatch.score * 100)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                    initial={false}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent-light">
                  {Math.round(topMatch.score * 100)}% confidence
                </p>
              </>
            ) : (
              <p className="mt-2 text-xs leading-6 text-text-dark-muted">
                Start the camera and hold up a gesture. The recognized word updates in real time.
              </p>
            )}
          </div>
          <p className="rounded-lg border border-[rgba(41,110,214,0.18)] bg-bg-dark/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.24em] text-text-dark-muted">
            Zero-shot CLIP · frames processed locally
          </p>
        </div>
      </div>
    </div>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 8a2 2 0 0 1 2-2h2l1.5-2h5L16 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Zm8 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

// ---------------- Speech to Text ----------------

function SpeechToTextRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [transcript, setTranscript] = useState("");
  const [running, setRunning] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const startRef = useRef<number>(0);

  async function onUpload(file: File) {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileName(file.name);
    setTranscript("");
    setLatency(null);
    setRunning(true);
    startRef.current = performance.now();
    try {
      const result = (await pipe(url)) as { text?: string };
      setTranscript(result.text ?? "");
      setLatency(performance.now() - startRef.current);
    } finally {
      setRunning(false);
    }
  }

  function onDrop(event: React.DragEvent) {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith("audio/")) onUpload(file);
  }

  return (
    <div className="grid gap-5">
      {/* INPUT BLOCK */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Input · audio
          </span>
          {fileName ? (
            <button
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted transition-colors hover:text-accent-light"
              onClick={() => {
                setAudioUrl(null);
                setFileName(null);
                setTranscript("");
                setLatency(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              type="button"
            >
              Reset ↺
            </button>
          ) : null}
        </div>

        <label
          className={`mt-3 block cursor-pointer rounded-2xl border-2 border-dashed p-6 transition-colors duration-200 ${
            dragging
              ? "border-accent bg-[rgba(41,110,214,0.10)]"
              : "border-[rgba(41,110,214,0.35)] bg-bg-dark/40 hover:border-accent/60 hover:bg-bg-dark/60"
          }`}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={onDrop}
        >
          <input
            accept="audio/*"
            className="sr-only"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            ref={fileInputRef}
            type="file"
          />
          {audioUrl ? (
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent-light/40 bg-[rgba(41,110,214,0.12)] text-accent-light">
                  <MicIconLarge className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm text-text-dark">
                    {fileName}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
                    Audio file · processed locally
                  </p>
                </div>
              </div>
              {/* Decorative waveform bars */}
              <div className="flex h-14 items-end gap-[3px]">
                {Array.from({ length: 40 }).map((_, i) => {
                  const height = 20 + Math.sin(i * 0.7) * 20 + Math.cos(i * 1.2) * 10;
                  return (
                    <span
                      className={`flex-1 rounded-sm bg-gradient-to-t ${
                        running
                          ? "from-accent-deep to-accent-light"
                          : "from-accent/60 to-accent-light/60"
                      }`}
                      key={i}
                      style={{
                        height: `${Math.max(8, Math.abs(height))}%`,
                        opacity: running ? 0.85 : 0.6,
                        animation: running
                          ? `pulse 1.5s ease-in-out infinite ${i * 0.04}s`
                          : undefined,
                      }}
                    />
                  );
                })}
              </div>
              <audio className="w-full" controls src={audioUrl} />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(41,110,214,0.4)] bg-[rgba(41,110,214,0.10)] text-accent-light">
                <MicIconLarge className="h-6 w-6" />
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-dark">
                Drop an audio file or click to browse
              </p>
              <p className="max-w-xs text-xs text-text-dark-muted">
                .wav, .mp3, .m4a · transcribed in your browser
              </p>
            </div>
          )}
        </label>
      </div>

      {/* OUTPUT */}
      {running || transcript ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-gradient-to-br from-bg-dark-2 to-bg-dark p-5"
          initial={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            aria-hidden="true"
            className="absolute left-4 top-4 h-3 w-3 border-l border-t border-accent-light/70"
          />
          <div className="ml-5 flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
              Transcript · Whisper
            </span>
            {latency != null ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-result-green">
                {Math.round(latency)} ms
              </span>
            ) : null}
          </div>
          {running ? (
            <div className="ml-5 mt-3 flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent-light" />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-accent-light"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-2 w-2 animate-pulse rounded-full bg-accent-light"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            <p className="ml-5 mt-3 whitespace-pre-wrap text-sm leading-7 text-text-dark">
              {transcript}
            </p>
          )}
        </motion.div>
      ) : null}
    </div>
  );
}

function MicIconLarge({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
        width="6"
        x="9"
        y="3"
      />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

// ---------------- Semantic Search ----------------

const SEARCH_DATASET = [
  "Guest left a 5-star review citing the cleanliness of the bathroom.",
  "Booking modified — checkout pushed to the following day.",
  "Maintenance flagged a leaking sink in unit 3B.",
  "Front desk noted a broken thermostat in the lobby suite.",
  "Late check-in approved for VIP guest, key delivered to lockbox.",
  "Cleaning crew reported torn linens needing replacement.",
  "Guest requested an early breakfast tray, accommodated.",
  "Smart lock failed for unit 2A; manual override required.",
];

function SemanticSearchRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [query, setQuery] = useState("anything broken in the rooms?");
  const [results, setResults] = useState<{ row: string; score: number }[]>([]);
  const [running, setRunning] = useState(false);
  const [datasetVectors, setDatasetVectors] = useState<number[][] | null>(null);

  async function buildIndex() {
    const vectors: number[][] = [];
    for (const row of SEARCH_DATASET) {
      const res = (await pipe(row, { normalize: true, pooling: "mean" })) as
        | { data: Float32Array | number[] }
        | { tolist: () => number[][] };
      const vec = "data" in res ? Array.from(res.data) : (res.tolist() as number[][])[0];
      vectors.push(vec);
    }
    setDatasetVectors(vectors);
    return vectors;
  }

  async function run() {
    setRunning(true);
    try {
      const vectors = datasetVectors ?? (await buildIndex());
      const queryRes = (await pipe(query, { normalize: true, pooling: "mean" })) as
        | { data: Float32Array | number[] }
        | { tolist: () => number[][] };
      const qvec =
        "data" in queryRes ? Array.from(queryRes.data) : (queryRes.tolist() as number[][])[0];
      const scored = SEARCH_DATASET.map((row, i) => ({
        row,
        score: cosine(qvec, vectors[i]),
      })).sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 5));
    } finally {
      setRunning(false);
    }
  }

  const searchSuggestions = [
    "anything broken in the rooms?",
    "VIP guest accommodations",
    "checkout schedule changes",
  ];

  return (
    <div className="grid gap-5">
      {/* QUERY BAR */}
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Query · semantic
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
            {SEARCH_DATASET.length} rows indexed
          </span>
        </div>
        <div className="mt-3 overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.3)] bg-bg-dark/60 transition-colors focus-within:border-accent">
          <div className="flex items-center gap-3 px-4 py-3">
            <SearchIcon className="h-5 w-5 shrink-0 text-accent-light" />
            <input
              className="block w-full bg-transparent font-mono text-sm text-text-dark outline-none placeholder:text-text-dark-muted"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim() && !running) run();
              }}
              placeholder="Ask in natural language — embeddings handle the rest…"
              value={query}
            />
            <Button
              disabled={running || !query.trim()}
              onClick={run}
              variant="primary"
            >
              {running ? "Ranking…" : "Search ↵"}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 border-t border-[rgba(41,110,214,0.2)] bg-bg-dark-2/40 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted">
              Try:
            </span>
            {searchSuggestions.map((s) => (
              <button
                className="rounded-full border border-[rgba(41,110,214,0.3)] bg-bg-dark/60 px-2.5 py-0.5 font-mono text-[10px] text-text-dark-muted transition-colors hover:border-accent hover:text-accent-light"
                key={s}
                onClick={() => setQuery(s)}
                type="button"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATASET PREVIEW (collapsed visualization) */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
          Dataset · mock hospitality ops rows
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {SEARCH_DATASET.map((row, i) => (
            <span
              className="rounded-md border border-[rgba(41,110,214,0.2)] bg-bg-dark/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-text-dark-muted"
              key={i}
              title={row}
            >
              row {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      {results.length > 0 ? (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
            Ranked results · top {results.length}
          </p>
          <ol className="mt-3 grid gap-2">
            {results.map((r, i) => (
              <motion.li
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4"
                initial={{ opacity: 0, x: -8 }}
                key={r.row}
                transition={{
                  delay: i * 0.05,
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent-light">
                    #{String(i + 1).padStart(2, "0")} · score
                  </span>
                  <span className="font-mono text-sm font-semibold text-accent-light">
                    {Math.round(r.score * 100)}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                  <motion.div
                    animate={{ width: `${Math.round(r.score * 100)}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light"
                    initial={{ width: 0 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-text-dark">{r.row}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      ) : !running ? (
        <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-[rgba(41,110,214,0.2)] bg-bg-dark/30 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-dark-muted">
            Press search to embed your query and rank the dataset
          </p>
        </div>
      ) : null}
    </div>
  );
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ---------------- Icons ----------------

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.6" width="18" x="3" y="4" />
      <circle cx="9" cy="10" fill="currentColor" r="1.5" />
      <path d="m4 18 5-5 4 4 3-3 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-7l-4 3v-3H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="12" rx="3" stroke="currentColor" strokeWidth="1.6" width="6" x="9" y="3" />
      <path
        d="M5 11a7 7 0 0 0 14 0M12 18v3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-4-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}
