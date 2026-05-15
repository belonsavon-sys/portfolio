"use client";

import { motion } from "framer-motion";
import {
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* /lab — BrowserAI playground.
 *
 * Five demos, switched via pill tabs. Pure-dark surface. All
 * inference runs in the visitor's tab.
 *   01 Image Classification — ViT Base via Transformers.js
 *   02 LLM Chat            — Llama 3.2 1B (q4f16) streaming
 *   03 Computer Vision     — MediaPipe GestureRecognizer
 *   04 Speech to Text      — Moonshine Base via live mic
 *   05 Semantic Search     — BGE Small v1.5 embeddings
 *
 * Pipeline cache is shared so re-selecting a previously-loaded
 * model is instant. MediaPipe loads on-demand for the CV tab. */

/* ────────────────────────────────────────────────────────────────────
 * Types + pipeline utilities
 * ───────────────────────────────────────────────────────────────── */

type RuntimeDevice = "webgpu" | "wasm";

type PipelineTask =
  | "automatic-speech-recognition"
  | "background-removal"
  | "depth-estimation"
  | "feature-extraction"
  | "image-classification"
  | "object-detection"
  | "text-generation";

type TabId =
  | "image"
  | "chat"
  | "camera"
  | "speech"
  | "search"
  | "object"
  | "bgremove"
  | "depth";

type TabConfig = {
  description: string;
  /** GPU / CPU / etc — what shows after the dtype in the spec pill. */
  device: "GPU" | "CPU";
  /** Tokens for the spec pill (e.g. `q4f16`). */
  dtype?: string;
  icon: (props: { className?: string }) => ReactNode;
  id: TabId;
  label: string;
  model?: string;
  modelLabel: string;
  /** Compressed weight, displayed in the spec pill. */
  size: string;
  task?: PipelineTask;
};

const TABS: TabConfig[] = [
  {
    description:
      "Classify images using Vision Transformer running entirely in your browser",
    device: "CPU",
    icon: ImageIcon,
    id: "image",
    label: "Image Classification",
    model: "Xenova/vit-base-patch16-224",
    modelLabel: "ViT Base",
    size: "~84 MB",
    task: "image-classification",
  },
  {
    description:
      "Detect and locate the objects in a scene — boxes + labels + confidence, all on-device.",
    device: "CPU",
    icon: BoxIcon,
    id: "object",
    label: "Object Detection",
    model: "Xenova/detr-resnet-50",
    modelLabel: "DETR ResNet-50",
    size: "~160 MB",
    task: "object-detection",
  },
  {
    description:
      "Drop a photo and the model returns a transparent PNG — subject preserved, background gone.",
    device: "CPU",
    icon: ScissorsIcon,
    id: "bgremove",
    label: "Background Removal",
    model: "Xenova/modnet",
    modelLabel: "MODNet",
    size: "~24 MB",
    task: "background-removal",
  },
  {
    description:
      "Predict per-pixel depth from a single image — far is purple, near is yellow. Same model class used in robotics + AR.",
    device: "CPU",
    icon: LayersIcon,
    id: "depth",
    label: "Depth Estimation",
    model: "onnx-community/depth-anything-v2-small",
    modelLabel: "Depth Anything v2",
    size: "~50 MB",
    task: "depth-estimation",
  },
  {
    description:
      "Chat with a large language model running entirely in your browser",
    device: "GPU",
    dtype: "q4f16",
    icon: ChatIcon,
    id: "chat",
    label: "LLM Chat",
    model: "onnx-community/Llama-3.2-1B-Instruct",
    modelLabel: "Llama 3.2 1B",
    size: "~700 MB",
    task: "text-generation",
  },
  {
    description: "Real-time hand tracking and gesture recognition via webcam",
    device: "GPU",
    icon: EyeIcon,
    id: "camera",
    label: "Computer Vision",
    modelLabel: "GestureRecognizer",
    size: "~10 MB",
  },
  {
    description: "Transcribe speech using Moonshine running locally",
    device: "CPU",
    dtype: "fp32",
    icon: MicIcon,
    id: "speech",
    label: "Speech to Text",
    model: "onnx-community/moonshine-base-ONNX",
    modelLabel: "Moonshine Base",
    size: "~60 MB",
    task: "automatic-speech-recognition",
  },
  {
    description: "Find semantically similar sentences using text embeddings",
    device: "CPU",
    icon: SearchIcon,
    id: "search",
    label: "Semantic Search",
    model: "Xenova/bge-small-en-v1.5",
    modelLabel: "BGE Small v1.5",
    size: "~32 MB",
    task: "feature-extraction",
  },
];

type TransformersPipeline = ((
  input: unknown,
  options?: unknown,
) => Promise<unknown>) & {
  tokenizer?: unknown;
};
type TransformersModule = {
  TextStreamer?: new (
    tokenizer: unknown,
    options?: Record<string, unknown>,
  ) => unknown;
  /** Stopping criterion exposed by transformers.js — calling
   *  `.interrupt()` makes the in-flight generation return early. */
  InterruptableStoppingCriteria?: new () => {
    interrupt: () => void;
    reset: () => void;
  };
  env?: {
    allowLocalModels?: boolean;
    allowRemoteModels?: boolean;
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
  onProgress: (percent: number) => void,
  dtypeOverride?: string,
): Promise<TransformersPipeline> {
  const key = `${task}::${model}::${device}::${dtypeOverride ?? "auto"}`;
  const cached = pipelineCache.get(key);
  if (cached) {
    onProgress(100);
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
      const p = percentFromEvent(event);
      if (p != null) onProgress(p);
    },
  });
  pipelineCache.set(key, pipe);
  return pipe;
}

function percentFromEvent(event: unknown): number | null {
  if (!event || typeof event !== "object") return null;
  const e = event as Record<string, unknown>;
  const progress = typeof e.progress === "number" ? e.progress : 0;
  const loaded = typeof e.loaded === "number" ? e.loaded : 0;
  const total = typeof e.total === "number" ? e.total : 0;
  if (progress > 0) return Math.min(100, progress);
  if (total > 0) return (loaded / total) * 100;
  return null;
}

/* ────────────────────────────────────────────────────────────────────
 * Cache tracking — note which models the visitor has already
 * downloaded so we can swap "Load model" → "Open model" + show a
 * "cached on your machine" hint. transformers.js stores the actual
 * weights in IndexedDB; this is just a UI flag so we know what's
 * already there without probing IndexedDB on every render. */
const CACHED_STORAGE_KEY = "pbs:lab:cached-models";

function getCachedModels(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(CACHED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function markModelCached(modelId: string) {
  if (typeof window === "undefined") return;
  try {
    const set = getCachedModels();
    if (set.has(modelId)) return;
    set.add(modelId);
    window.localStorage.setItem(
      CACHED_STORAGE_KEY,
      JSON.stringify([...set]),
    );
  } catch {
    // localStorage unavailable — silently no-op.
  }
}

async function detectDevice(): Promise<RuntimeDevice> {
  if (typeof navigator !== "undefined") {
    const nav = navigator as { gpu?: { requestAdapter?: () => Promise<unknown> } };
    if (nav.gpu?.requestAdapter) {
      try {
        const adapter = await nav.gpu.requestAdapter();
        if (adapter) return "webgpu";
      } catch {}
    }
  }
  return "wasm";
}

/* ────────────────────────────────────────────────────────────────────
 * MAIN WRAPPER
 * ───────────────────────────────────────────────────────────────── */

export function LocalAiDemo() {
  const [activeId, setActiveId] = useState<TabId>("image");
  const [device, setDevice] = useState<RuntimeDevice | null>(null);
  const activeTab = useMemo(
    () => TABS.find((t) => t.id === activeId)!,
    [activeId],
  );

  useEffect(() => {
    detectDevice().then(setDevice);
  }, []);

  return (
    <div className="mt-10 grid gap-8">
      {/* WEBGPU SUPPORT PILL — centered above the tabs (lives on the
          light page surface; uses light-scope tokens). */}
      <div className="flex justify-center">
        <SupportPill device={device} />
      </div>

      {/* TAB BAR — rounded pills with icons. Sits OUTSIDE the dark
          island so it reads against the light page. Active tab is a
          filled accent pill (high contrast); inactive uses a subtle
          filled surface with a hairline so the pill shape is
          visible. */}
      <div
        aria-label="Demos"
        className="flex flex-wrap justify-center gap-2"
        role="tablist"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              aria-controls={`panel-${tab.id}`}
              aria-selected={isActive}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "border-accent bg-accent text-text-dark shadow-[0_6px_18px_-6px_rgba(41,110,214,0.5)]"
                  : "border-border-light bg-bg-light-2 text-text-light-muted hover:border-accent/40 hover:bg-bg-light hover:text-text-light"
              }`}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              role="tab"
              type="button"
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* DEMO CARD — single rounded dark container */}
      <DemoCard device={device ?? "wasm"} key={activeTab.id} tab={activeTab} />
    </div>
  );
}

function SupportPill({ device }: { device: RuntimeDevice | null }) {
  const supported = device === "webgpu";
  const label = device === null
    ? "Detecting…"
    : supported
      ? "WebGPU Supported"
      : "WASM Fallback";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-light-2 px-3 py-1 font-mono text-[12px] text-text-light">
      <span
        className={`inline-block h-1.5 w-1.5 rounded-full ${
          supported ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" : "bg-text-light-muted"
        }`}
      />
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * DEMO CARD — single dark surface containing the active demo.
 * Owns the per-tab lifecycle (idle/loading/ready/error).
 * ───────────────────────────────────────────────────────────────── */

type LoadStatus = "idle" | "loading" | "ready" | "error";

function DemoCard({
  device,
  tab,
}: {
  device: RuntimeDevice;
  tab: TabConfig;
}) {
  const [status, setStatus] = useState<LoadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [pipe, setPipe] = useState<TransformersPipeline | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [loadDurationMs, setLoadDurationMs] = useState<number | null>(null);

  // Auto-promote to ready if we have a cached pipeline for this tab.
  // Pipelines are callable functions — wrap in `() => …` so React's
  // useState doesn't interpret them as functional-update args.
  useEffect(() => {
    if (!tab.model || !tab.task) return;
    const key = `${tab.task}::${tab.model}::${device}::${tab.dtype ?? "auto"}`;
    const cached = pipelineCache.get(key);
    if (cached) {
      setPipe(() => cached);
      setStatus("ready");
      setProgress(100);
    }
  }, [tab.task, tab.model, tab.dtype, device]);

  // Read the localStorage flag for this model — used to swap the
  // "Load model" CTA into "Open model · cached on your machine".
  useEffect(() => {
    if (!tab.model) {
      setIsCached(false);
      return;
    }
    setIsCached(getCachedModels().has(tab.model));
  }, [tab.model]);

  async function handleLoad() {
    if (!tab.model || !tab.task) {
      // MediaPipe-only tab — the CameraDemo handles its own load lifecycle.
      setStatus("ready");
      return;
    }
    setStatus("loading");
    setProgress(0);
    setErrorMsg(null);
    const loadStart = performance.now();
    try {
      const targetDevice: RuntimeDevice =
        tab.id === "speech" ? "wasm" : device;
      const next = await loadPipeline(
        tab.task,
        tab.model,
        targetDevice,
        (p) => setProgress(p),
        tab.dtype,
      );
      // `next` is a Callable — see comment above. Wrap to store the
      // callable verbatim instead of invoking it.
      setPipe(() => next);
      setStatus("ready");
      setLoadDurationMs(performance.now() - loadStart);
      markModelCached(tab.model);
      setIsCached(true);
    } catch (error) {
      console.error("Pipeline load failed", error);
      setErrorMsg(
        error instanceof Error ? error.message : "Unknown error",
      );
      setStatus("error");
    }
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      aria-labelledby={`title-${tab.id}`}
      className="demo-island-card relative rounded-2xl border border-border-light bg-gradient-to-b from-bg-light-2 to-bg-light p-6 sm:p-8"
      id={`panel-${tab.id}`}
      initial={{ opacity: 0, y: 12 }}
      role="tabpanel"
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3
            className="text-2xl font-semibold tracking-tight text-text-light sm:text-[28px]"
            id={`title-${tab.id}`}
            style={{ letterSpacing: "-0.025em" }}
          >
            {tab.label}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-light-muted sm:text-[15px]">
            {tab.description}
          </p>
        </div>

        <SpecPill
          device={tab.device}
          dtype={tab.dtype}
          modelLabel={tab.modelLabel}
          size={tab.size}
          status={status}
        />
      </div>

      <div className="mt-7">
        {tab.id === "camera" ? (
          <CameraDemo />
        ) : status === "idle" ? (
          <LoadCta
            isCached={isCached}
            modelLabel={tab.modelLabel}
            onLoad={handleLoad}
            size={tab.size}
          />
        ) : status === "loading" ? (
          <LoadProgress progress={progress} />
        ) : status === "error" ? (
          <LoadError message={errorMsg} onRetry={handleLoad} />
        ) : pipe ? (
          <>
            {tab.id === "image" ? <ImageDemo pipe={pipe} /> : null}
            {tab.id === "object" ? <ObjectDemo pipe={pipe} /> : null}
            {tab.id === "bgremove" ? <BgRemoveDemo pipe={pipe} /> : null}
            {tab.id === "depth" ? <DepthDemo pipe={pipe} /> : null}
            {tab.id === "chat" ? <ChatDemo pipe={pipe} /> : null}
            {tab.id === "speech" ? <SpeechDemo pipe={pipe} /> : null}
            {tab.id === "search" ? <SearchDemo pipe={pipe} /> : null}
          </>
        ) : null}
      </div>

      {/* PERFORMANCE FOOTER — small mono line under the workspace.
          Surfaces load time + cached-on-machine state so visitors can
          see why the second visit is so fast. */}
      {status === "ready" && tab.id !== "camera" ? (
        <PerfFooter
          isCached={isCached}
          loadDurationMs={loadDurationMs}
          runtime={tab.device}
        />
      ) : null}

      {tab.id !== "camera" ? <HowItWorks tabId={tab.id} /> : null}
    </motion.section>
  );
}

function SpecPill({
  device,
  dtype,
  modelLabel,
  size,
  status,
}: {
  device: "GPU" | "CPU";
  dtype?: string;
  modelLabel: string;
  size: string;
  status: LoadStatus;
}) {
  const statusLabel =
    status === "ready"
      ? "Ready"
      : status === "loading"
        ? "Loading"
        : status === "error"
          ? "Error"
          : "Idle";
  const statusColor =
    status === "ready"
      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"
      : status === "loading"
        ? "bg-amber-400 animate-pulse"
        : status === "error"
          ? "bg-rose-400"
          : "bg-text-light-muted";
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-light px-3 py-1.5 font-mono text-[11px] text-text-light-muted backdrop-blur-md">
      <span className="text-text-light">{modelLabel}</span>
      <span aria-hidden="true">·</span>
      <span>{size}</span>
      {dtype ? (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-accent">{dtype}</span>
        </>
      ) : null}
      <span aria-hidden="true">·</span>
      <span className={device === "GPU" ? "text-violet-300" : "text-text-light-muted"}>
        {device}
      </span>
      <span aria-hidden="true" className="text-text-light-muted/40">
        ·
      </span>
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${statusColor}`} />
      <span className="text-text-light">{statusLabel}</span>
    </div>
  );
}

function LoadCta({
  isCached,
  modelLabel,
  onLoad,
  size,
}: {
  isCached: boolean;
  modelLabel: string;
  onLoad: () => void;
  size: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-light bg-bg-light-2 py-14 text-center">
      {isCached ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 font-mono text-[11px] text-result-green">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
          cached on your machine
        </span>
      ) : null}
      <p className="max-w-md text-[14.5px] leading-7 text-text-light">
        {isCached
          ? `${modelLabel} is already cached from a previous visit — opening is instant.`
          : `Click load to download ${modelLabel} into your browser cache. First call is the only network round-trip — subsequent runs stay on-device.`}
      </p>
      <p className="font-mono text-[11px] text-text-light-muted">
        — {size}
        {isCached ? " · cached" : " one-time download"}
      </p>
      <button
        className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-text-dark transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-12px_rgba(41,110,214,0.45)]"
        onClick={onLoad}
        type="button"
      >
        {isCached ? "Open model" : "Load model"}
        <span aria-hidden="true">↓</span>
      </button>
    </div>
  );
}

function PerfFooter({
  isCached,
  loadDurationMs,
  runtime,
}: {
  isCached: boolean;
  loadDurationMs: number | null;
  runtime: "GPU" | "CPU";
}) {
  // < 2s after a fresh load = warm cache (IndexedDB hit); otherwise it
  // was a real network download. Phrase the readout in those terms.
  const warm = loadDurationMs != null && loadDurationMs < 2000;
  return (
    <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.14em] text-text-light-muted">
      <span>— runtime · {runtime.toLowerCase()}</span>
      {loadDurationMs != null ? (
        <span>
          {warm ? "warm" : "cold"} ·{" "}
          <span className="text-accent tabular-nums">
            {(loadDurationMs / 1000).toFixed(loadDurationMs < 1000 ? 2 : 1)}s
          </span>{" "}
          load
        </span>
      ) : null}
      {isCached ? (
        <span className="text-result-green">● cached on your machine</span>
      ) : null}
    </div>
  );
}

function LoadProgress({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-stretch gap-3 rounded-xl border border-border-light bg-bg-light-2 px-5 py-10">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[11px] text-result-green">
          — downloading model
        </p>
        <p className="font-mono text-base font-semibold tabular-nums text-text-light">
          {Math.round(progress)}%
        </p>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-border-light">
        <motion.div
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-400"
          initial={false}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="font-mono text-[10px] text-text-light-muted">
        // streaming from the model registry → browser cache · one-time download
      </p>
    </div>
  );
}

function LoadError({
  message,
  onRetry,
}: {
  message: string | null;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/[0.04] py-12 text-center">
      <p className="font-mono text-[11px] text-problem-red">— failed to load</p>
      <p className="max-w-md px-4 text-[14px] leading-7 text-text-light-muted">
        {message ?? "Something went wrong while downloading the model."} Try a
        Chromium-based browser for WebGPU-only demos.
      </p>
      <button
        className="inline-flex items-center gap-2 rounded-md border border-border-light bg-bg-light-2 px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-accent/10"
        onClick={onRetry}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}

function HowItWorks({ tabId }: { tabId: TabId }) {
  const [open, setOpen] = useState(false);
  const text =
    tabId === "image"
      ? "Vision Transformer Base (ViT-B/16) splits the input image into 16×16 patches and classifies it against the 1000-class ImageNet vocabulary. Runs through Transformers.js + ONNX Runtime Web."
      : tabId === "object"
        ? "DETR (DEtection TRansformer) on a ResNet-50 backbone. The model emits 100 candidate boxes per image, each tied to a confidence score for the 91 COCO classes. We threshold at 0.5 and render the survivors as labeled boxes."
        : tabId === "bgremove"
          ? "MODNet is a portrait matting model that predicts a soft alpha mask in a single pass. We multiply the mask into the original image's alpha channel and ship the result as a transparent PNG — no chroma key, no manual cutout."
          : tabId === "depth"
            ? "Depth Anything v2 is a transformer-based monocular depth estimator — predicts a depth value per pixel from a single image. We stretch contrast and colorize through the Turbo palette so the scene reads at a glance."
            : tabId === "chat"
            ? "Llama 3.2 1B Instruct, quantized to q4f16 for WebGPU. Streaming inference via TextStreamer — tokens arrive one by one and we tally them for the tok/s readout."
            : tabId === "speech"
              ? "Moonshine Base is a streaming ASR model. We capture mic audio via MediaRecorder + Web Audio API, then run it through Transformers.js when you stop."
              : "BGE Small v1.5 encodes both your query and the corpus into 384-dim vectors. We rank by cosine similarity — green bars are strong matches, orange are weak.";
  return (
    <div className="mt-6 border-t border-border-light pt-4">
      <button
        aria-expanded={open}
        className="group inline-flex items-center gap-2 font-mono text-[11px] text-text-light-muted transition-colors hover:text-text-light"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ›
        </span>
        How It Works
      </button>
      {open ? (
        <p className="mt-3 max-w-2xl text-[13px] leading-7 text-text-light-muted">
          {text}
        </p>
      ) : null}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 01 IMAGE — ViT classification with drop zone + top-5 score bars.
 * ───────────────────────────────────────────────────────────────── */

// Curated sample images for the Image tab. Public CDN images on
// short-form Unsplash URLs — visitors who don't want to upload can
// click one and watch the classifier light up immediately.
const IMAGE_SAMPLES: { label: string; url: string }[] = [
  {
    label: "cat",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format",
  },
  {
    label: "pizza",
    url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format",
  },
  {
    label: "laptop",
    url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format",
  },
  {
    label: "mountain",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format",
  },
];

function ImageDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [results, setResults] = useState<{ label: string; score: number }[]>(
    [],
  );
  const [latency, setLatency] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [running, setRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function classify(url: string) {
    setResults([]);
    setRunning(true);
    const t0 = performance.now();
    try {
      const out = (await pipe(url, { topk: 5 })) as {
        label: string;
        score: number;
      }[];
      setResults(out);
      setLatency(performance.now() - t0);
    } finally {
      setRunning(false);
    }
  }

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    classify(url).catch((e) => console.error(e));
  }

  function loadSample(sampleUrl: string) {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(sampleUrl);
    classify(sampleUrl).catch((e) => console.error(e));
  }

  function reset() {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setResults([]);
    setLatency(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* LEFT — drop zone (top) + image preview (below) */}
      <div className="grid gap-4">
        <label
          className={`flex aspect-[16/7] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors duration-200 ${
            dragging
              ? "border-accent bg-accent/8"
              : "border-border-light bg-bg-light-2 hover:border-accent/50"
          }`}
          onDragLeave={(e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) onFile(file);
          }}
        >
          <input
            accept="image/*"
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
            ref={fileInputRef}
            type="file"
          />
          <ArrowUpIcon className="h-7 w-7 text-text-light-muted" />
          <p className="text-sm text-text-light">
            Drag & drop an image, or click to browse
          </p>
        </label>

        {/* SAMPLE CHIPS — click to load + classify without uploading */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
            — try
          </span>
          {IMAGE_SAMPLES.map((s) => (
            <button
              className="rounded-full border border-border-light bg-bg-light-2 px-3 py-1 text-[12px] text-text-light transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:cursor-wait disabled:opacity-50"
              disabled={running}
              key={s.label}
              onClick={() => loadSample(s.url)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>

        {imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Selected"
              className="block max-h-[320px] w-full bg-bg-light-2 object-contain"
              src={imageUrl}
            />
          </div>
        ) : null}
      </div>

      {/* RIGHT — top-5 predictions with horizontal bars */}
      <div>
        <ul className="grid gap-4">
          {(results.length > 0
            ? results
            : Array.from({ length: 5 }).map((_, i) => ({
                label: ["—", "—", "—", "—", "—"][i] ?? "—",
                score: 0,
              }))
          ).map((r, i) => (
            <PredictionRow
              isTop={i === 0 && results.length > 0}
              key={`${r.label}-${i}`}
              label={r.label}
              placeholder={results.length === 0}
              score={r.score}
            />
          ))}
        </ul>

        {!imageUrl ? (
          <p className="mt-5 font-mono text-[11px] text-text-light-muted">
            // drop an image to see predictions ranked by confidence
          </p>
        ) : null}

        {imageUrl ? (
          <div className="mt-5 flex items-center gap-4">
            {latency != null ? (
              <span className="rounded-md border border-border-light bg-bg-light-2 px-3 py-1.5 font-mono text-[11px] text-text-light-muted">
                Inference:{" "}
                <span className="text-accent tabular-nums">
                  {Math.round(latency)} ms
                </span>
              </span>
            ) : null}
            <button
              className="font-mono text-[11px] text-text-light-muted transition-colors hover:text-text-light"
              onClick={reset}
              type="button"
            >
              Reset ↺
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PredictionRow({
  isTop,
  label,
  placeholder,
  score,
}: {
  isTop: boolean;
  label: string;
  placeholder?: boolean;
  score: number;
}) {
  const pct = Math.max(0, Math.min(100, score * 100));
  return (
    <li className="grid gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span
          className={`truncate text-[14px] ${
            placeholder
              ? "text-text-light-muted/40"
              : isTop
                ? "font-medium text-text-light"
                : "text-text-light"
          }`}
        >
          {label}
        </span>
        {!placeholder ? (
          <span className="font-mono text-[12px] tabular-nums text-text-light-muted">
            {pct.toFixed(1)}%
          </span>
        ) : null}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-bg-light-2">
        <div
          className={`h-full rounded-full ${
            placeholder ? "bg-transparent" : isTop ? "bg-sky-400" : "bg-sky-400/40"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * OBJECT DETECTION — DETR ResNet-50 with labeled bounding boxes.
 * ───────────────────────────────────────────────────────────────── */

const OBJECT_SAMPLES: { label: string; url: string }[] = [
  {
    label: "street",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&auto=format",
  },
  {
    label: "kitchen",
    url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&auto=format",
  },
  {
    label: "office",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format",
  },
  {
    label: "dog park",
    url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&auto=format",
  },
];

// Rotating hue palette so multiple instances of the same class are
// distinguishable by their box color.
const BOX_HUES = [
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#facc15",
  "#a78bfa",
  "#fb923c",
  "#22d3ee",
  "#f87171",
];

type DetectionBox = {
  box: { xmin: number; ymin: number; xmax: number; ymax: number };
  label: string;
  score: number;
};

function ObjectDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<DetectionBox[]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function detect(url: string) {
    setDetections([]);
    setRunning(true);
    const t0 = performance.now();
    try {
      const out = (await pipe(url, {
        threshold: 0.5,
        percentage: true,
      })) as DetectionBox[];
      setDetections(out);
      setLatency(performance.now() - t0);
    } finally {
      setRunning(false);
    }
  }

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    detect(url).catch((e) => console.error(e));
  }

  function loadSample(url: string) {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(url);
    detect(url).catch((e) => console.error(e));
  }

  function reset() {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setDetections([]);
    setLatency(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* LEFT — drop zone + image with box overlay */}
      <div className="grid gap-4 lg:col-span-3">
        <label
          className={`flex aspect-[16/7] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors duration-200 ${
            dragging
              ? "border-accent bg-accent/8"
              : "border-border-light bg-bg-light-2 hover:border-accent/50"
          }`}
          onDragLeave={(e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDragOver={(e: DragEvent) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDrop={(e: DragEvent) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file && file.type.startsWith("image/")) onFile(file);
          }}
        >
          <input
            accept="image/*"
            className="sr-only"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) onFile(file);
            }}
            ref={fileInputRef}
            type="file"
          />
          <ArrowUpIcon className="h-7 w-7 text-text-light-muted" />
          <p className="text-sm text-text-light">
            Drag & drop an image, or click to browse
          </p>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
            — try
          </span>
          {OBJECT_SAMPLES.map((s) => (
            <button
              className="rounded-full border border-border-light bg-bg-light-2 px-3 py-1 text-[12px] text-text-light transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:cursor-wait disabled:opacity-50"
              disabled={running}
              key={s.label}
              onClick={() => loadSample(s.url)}
              type="button"
            >
              {s.label}
            </button>
          ))}
        </div>

        {imageUrl ? (
          <div className="relative overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Selected"
              className="block max-h-[480px] w-full bg-bg-light-2 object-contain"
              crossOrigin="anonymous"
              src={imageUrl}
            />
            {detections.map((det, i) => {
              const left = det.box.xmin * 100;
              const top = det.box.ymin * 100;
              const w = (det.box.xmax - det.box.xmin) * 100;
              const h = (det.box.ymax - det.box.ymin) * 100;
              const color = BOX_HUES[i % BOX_HUES.length]!;
              const isHovered = hoveredIdx === i;
              return (
                <span
                  className="pointer-events-none absolute"
                  key={`${det.label}-${i}`}
                  style={{
                    border: `2px solid ${color}`,
                    boxShadow: isHovered
                      ? `0 0 0 1px ${color}, 0 0 16px ${color}80`
                      : "none",
                    height: `${h}%`,
                    left: `${left}%`,
                    opacity: hoveredIdx == null || isHovered ? 1 : 0.35,
                    top: `${top}%`,
                    transition: "opacity 0.15s, box-shadow 0.15s",
                    width: `${w}%`,
                  }}
                >
                  <span
                    className="absolute -top-[22px] left-0 inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold text-black"
                    style={{ background: color }}
                  >
                    {det.label}
                    <span className="opacity-75">
                      {(det.score * 100).toFixed(0)}%
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        ) : null}

        {imageUrl ? (
          <div className="flex items-center gap-4">
            {latency != null ? (
              <span className="rounded-md border border-border-light bg-bg-light-2 px-3 py-1.5 font-mono text-[11px] text-text-light-muted">
                Inference:{" "}
                <span className="text-accent tabular-nums">
                  {Math.round(latency)} ms
                </span>
                <span className="mx-2 text-text-light-muted/40">·</span>
                <span className="text-result-green tabular-nums">
                  {detections.length}
                </span>{" "}
                objects
              </span>
            ) : null}
            <button
              className="font-mono text-[11px] text-text-light-muted transition-colors hover:text-text-light"
              onClick={reset}
              type="button"
            >
              Reset ↺
            </button>
          </div>
        ) : null}
      </div>

      {/* RIGHT — detection list with score bars + hover-sync */}
      <div className="lg:col-span-2">
        <p className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
          — detected ({detections.length})
        </p>
        <ul className="mt-4 grid gap-2.5">
          {detections.length === 0 ? (
            <li className="font-mono text-[11px] text-text-light-muted">
              {running
                ? "// detecting…"
                : "// drop an image to see labeled boxes"}
            </li>
          ) : (
            detections.map((d, i) => {
              const color = BOX_HUES[i % BOX_HUES.length]!;
              const pct = Math.max(0, Math.min(100, d.score * 100));
              const isHovered = hoveredIdx === i;
              return (
                <li
                  className={`rounded-md px-3 py-2 transition-colors ${
                    isHovered ? "bg-bg-light-2" : "bg-bg-light-2"
                  }`}
                  key={`row-${d.label}-${i}`}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="flex items-center gap-2 text-[13px] text-text-light">
                      <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ background: color }}
                      />
                      {d.label}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums text-text-light-muted">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-bg-light-2">
                    <div
                      className="h-full rounded-full"
                      style={{ background: color, width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * BACKGROUND REMOVAL — MODNet returns a transparent PNG.
 * ───────────────────────────────────────────────────────────────── */

const BGREMOVE_SAMPLES: { label: string; url: string }[] = [
  {
    label: "portrait",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format",
  },
  {
    label: "headshot",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format",
  },
  {
    label: "product",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format",
  },
];

/** transformers.js RawImage shape — keeps the canvas-export helpers
 *  we rely on without pulling the full type from the package. */
type RawImageLike = {
  width: number;
  height: number;
  toCanvas: () => HTMLCanvasElement;
  toBlob: (type?: string, quality?: number) => Promise<Blob>;
};

function BgRemoveDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [outUrl, setOutUrl] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function strip(url: string) {
    setOutUrl(null);
    setRunning(true);
    const t0 = performance.now();
    try {
      const out = (await pipe(url)) as RawImageLike | RawImageLike[];
      const result = Array.isArray(out) ? out[0] : out;
      if (!result) throw new Error("Model returned an empty result.");
      const blob = await result.toBlob("image/png");
      setOutUrl(URL.createObjectURL(blob));
      setLatency(performance.now() - t0);
    } catch (e) {
      console.error("Background removal failed:", e);
    } finally {
      setRunning(false);
    }
  }

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    strip(url).catch((e) => console.error(e));
  }

  function loadSample(url: string) {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    if (outUrl?.startsWith("blob:")) URL.revokeObjectURL(outUrl);
    setImageUrl(url);
    strip(url).catch((e) => console.error(e));
  }

  function reset() {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    if (outUrl?.startsWith("blob:")) URL.revokeObjectURL(outUrl);
    setImageUrl(null);
    setOutUrl(null);
    setLatency(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="grid gap-5">
      {/* DROP ZONE */}
      <label
        className={`flex aspect-[16/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors duration-200 ${
          dragging
            ? "border-accent bg-accent/8"
            : "border-border-light bg-bg-light-2 hover:border-accent/50"
        }`}
        onDragLeave={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) onFile(file);
        }}
      >
        <input
          accept="image/*"
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
          ref={fileInputRef}
          type="file"
        />
        <ArrowUpIcon className="h-7 w-7 text-text-light-muted" />
        <p className="text-sm text-text-light">
          Drag & drop a photo with a clear subject
        </p>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
          — try
        </span>
        {BGREMOVE_SAMPLES.map((s) => (
          <button
            className="rounded-full border border-border-light bg-bg-light-2 px-3 py-1 text-[12px] text-text-light transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:cursor-wait disabled:opacity-50"
            disabled={running}
            key={s.label}
            onClick={() => loadSample(s.url)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* BEFORE / AFTER */}
      {imageUrl ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-2">
            <p className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
              — input
            </p>
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Input"
                className="block max-h-[440px] w-full bg-bg-light-2 object-contain"
                src={imageUrl}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <p className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
              — output · transparent PNG
            </p>
            <div
              className="overflow-hidden rounded-xl border border-border-light"
              style={{
                backgroundColor: "#1a1a1a",
                backgroundImage:
                  "linear-gradient(45deg, #2a2a2a 25%, transparent 25%), linear-gradient(-45deg, #2a2a2a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2a2a2a 75%), linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)",
                backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                backgroundSize: "16px 16px",
              }}
            >
              {outUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Background removed"
                  className="block max-h-[440px] w-full object-contain"
                  src={outUrl}
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center font-mono text-[11px] text-text-light-muted">
                  {running ? "removing…" : "—"}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* FOOTER ACTIONS */}
      {outUrl ? (
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-md border border-border-light bg-bg-light-2 px-4 py-2 text-sm font-semibold text-text-light transition-colors hover:bg-accent/10"
            download="background-removed.png"
            href={outUrl}
          >
            Download PNG
            <span aria-hidden="true">↓</span>
          </a>
          {latency != null ? (
            <span className="rounded-md border border-border-light bg-bg-light-2 px-3 py-1.5 font-mono text-[11px] text-text-light-muted">
              Inference:{" "}
              <span className="text-accent tabular-nums">
                {Math.round(latency)} ms
              </span>
            </span>
          ) : null}
          <button
            className="font-mono text-[11px] text-text-light-muted transition-colors hover:text-text-light"
            onClick={reset}
            type="button"
          >
            Reset ↺
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * DEPTH ESTIMATION — Depth Anything v2 + Turbo colormap.
 * ───────────────────────────────────────────────────────────────── */

const DEPTH_SAMPLES: { label: string; url: string }[] = [
  {
    label: "street",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&auto=format",
  },
  {
    label: "room",
    url: "https://images.unsplash.com/photo-1486304873000-235643847519?w=900&auto=format",
  },
  {
    label: "landscape",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&auto=format",
  },
  {
    label: "portrait",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format",
  },
];

/** Turbo colormap — Google Research's depth/heatmap palette. Maps
 *  a 0..1 scalar to RGB via a smooth ramp from deep purple (far) to
 *  red/yellow (near). Polynomial approximation, ~5% error vs LUT. */
function turboColor(t: number): [number, number, number] {
  const x = Math.max(0, Math.min(1, t));
  const r = Math.round(
    255 *
      Math.max(
        0,
        Math.min(
          1,
          0.13572138 +
            x * (4.61539260 - x * (42.66032258 - x * (132.13108234 - x * (152.94239396 - x * 59.28637943)))),
        ),
      ),
  );
  const g = Math.round(
    255 *
      Math.max(
        0,
        Math.min(
          1,
          0.09140261 +
            x * (2.19418839 + x * (4.84296658 - x * (14.18503333 - x * (4.27729857 + x * 2.82956604)))),
        ),
      ),
  );
  const b = Math.round(
    255 *
      Math.max(
        0,
        Math.min(
          1,
          0.10667330 +
            x * (12.64194608 - x * (60.58204836 - x * (110.36276771 - x * (89.90310912 - x * 27.34824973)))),
        ),
      ),
  );
  return [r, g, b];
}

/** Apply the Turbo colormap to a grayscale depth canvas and return a
 *  data URL pointing at the colorized PNG.
 *
 *  Transformers.js's `RawImage.toCanvas()` actually returns an
 *  `OffscreenCanvas` — which exposes `getContext("2d")` but NOT
 *  `toDataURL`. We blit it into a regular `<canvas>` first so we
 *  can mutate pixels with the LUT and export with `toDataURL`. */
function colorizeDepth(source: HTMLCanvasElement | OffscreenCanvas): string {
  const out = document.createElement("canvas");
  out.width = source.width;
  out.height = source.height;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable.");
  ctx.drawImage(source as CanvasImageSource, 0, 0);

  const imageData = ctx.getImageData(0, 0, out.width, out.height);
  const data = imageData.data;

  // Two-pass: stretch contrast across the visible range so the
  // palette stays legible regardless of model bias.
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const v = data[i]!;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = Math.max(1, max - min);
  for (let i = 0; i < data.length; i += 4) {
    const v = (data[i]! - min) / range;
    const [r, g, b] = turboColor(v);
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  return out.toDataURL("image/png");
}

function DepthDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [depthUrl, setDepthUrl] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function estimate(url: string) {
    setDepthUrl(null);
    setRunning(true);
    const t0 = performance.now();
    try {
      const out = (await pipe(url)) as { depth: RawImageLike };
      const canvas = out.depth.toCanvas();
      const dataUrl = colorizeDepth(canvas);
      setDepthUrl(dataUrl);
      setLatency(performance.now() - t0);
    } catch (e) {
      console.error("Depth estimation failed:", e);
    } finally {
      setRunning(false);
    }
  }

  function onFile(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    estimate(url).catch((e) => console.error(e));
  }

  function loadSample(url: string) {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(url);
    estimate(url).catch((e) => console.error(e));
  }

  function reset() {
    if (imageUrl?.startsWith("blob:")) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setDepthUrl(null);
    setLatency(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="grid gap-5">
      <label
        className={`flex aspect-[16/5] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition-colors duration-200 ${
          dragging
            ? "border-accent bg-accent/8"
            : "border-border-light bg-bg-light-2 hover:border-accent/50"
        }`}
        onDragLeave={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file && file.type.startsWith("image/")) onFile(file);
        }}
      >
        <input
          accept="image/*"
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) onFile(file);
          }}
          ref={fileInputRef}
          type="file"
        />
        <ArrowUpIcon className="h-7 w-7 text-text-light-muted" />
        <p className="text-sm text-text-light">
          Drag & drop a photo with depth — outdoor, room, portrait
        </p>
      </label>

      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
          — try
        </span>
        {DEPTH_SAMPLES.map((s) => (
          <button
            className="rounded-full border border-border-light bg-bg-light-2 px-3 py-1 text-[12px] text-text-light transition-colors hover:border-accent/40 hover:bg-accent/5 disabled:cursor-wait disabled:opacity-50"
            disabled={running}
            key={s.label}
            onClick={() => loadSample(s.url)}
            type="button"
          >
            {s.label}
          </button>
        ))}
      </div>

      {imageUrl ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="grid gap-2">
            <p className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
              — input
            </p>
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Input"
                className="block max-h-[440px] w-full bg-bg-light-2 object-contain"
                src={imageUrl}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <p className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
              — depth map · purple far · yellow near
            </p>
            <div className="overflow-hidden rounded-xl border border-border-light bg-bg-light-2">
              {depthUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt="Depth map"
                  className="block max-h-[440px] w-full object-contain"
                  src={depthUrl}
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center font-mono text-[11px] text-text-light-muted">
                  {running ? "estimating…" : "—"}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {depthUrl ? (
        <div className="flex flex-wrap items-center gap-4">
          <a
            className="inline-flex items-center gap-2 rounded-md border border-border-light bg-bg-light-2 px-4 py-2 text-sm font-semibold text-text-light transition-colors hover:bg-accent/10"
            download="depth-map.png"
            href={depthUrl}
          >
            Download depth map
            <span aria-hidden="true">↓</span>
          </a>
          {latency != null ? (
            <span className="rounded-md border border-border-light bg-bg-light-2 px-3 py-1.5 font-mono text-[11px] text-text-light-muted">
              Inference:{" "}
              <span className="text-accent tabular-nums">
                {Math.round(latency)} ms
              </span>
            </span>
          ) : null}
          <button
            className="font-mono text-[11px] text-text-light-muted transition-colors hover:text-text-light"
            onClick={reset}
            type="button"
          >
            Reset ↺
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * 02 CHAT — Llama 3.2 1B with streaming + tok/s readout.
 * ───────────────────────────────────────────────────────────────── */

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

type ChatPersona = {
  id: string;
  label: string;
  system: string | null;
};

const CHAT_PERSONAS: ChatPersona[] = [
  {
    id: "default",
    label: "default",
    system: null,
  },
  {
    id: "concise",
    label: "concise",
    system:
      "You are a concise assistant. Answer in 1-3 sentences. No filler, no preamble.",
  },
  {
    id: "chef",
    label: "chef",
    system:
      "You are a friendly professional chef. Answer cooking questions practically and warmly.",
  },
  {
    id: "code-reviewer",
    label: "code reviewer",
    system:
      "You are a careful senior code reviewer. Flag bugs, edge cases, and unclear naming. Be specific and direct.",
  },
  {
    id: "tutor",
    label: "tutor",
    system:
      "You are a patient tutor. Explain concepts step by step with simple examples. Encourage follow-up questions.",
  },
];

type StoppingCriteriaInstance = {
  interrupt: () => void;
  reset: () => void;
};

function ChatDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [tokenCount, setTokenCount] = useState(0);
  const [tokenSpeed, setTokenSpeed] = useState<number | null>(null);
  const [personaId, setPersonaId] = useState<string>("default");
  const stoppingRef = useRef<StoppingCriteriaInstance | null>(null);
  const transcriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    transcriptRef.current?.scrollTo({
      behavior: "smooth",
      top: transcriptRef.current.scrollHeight,
    });
  }, [messages, pending]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || generating) return;
    const userMsg: ChatMsg = {
      id: `${Date.now()}-u`,
      role: "user",
      text: trimmed,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setGenerating(true);
    setPending("");
    setTokenCount(0);
    setTokenSpeed(null);

    const start = performance.now();
    let count = 0;
    let buffered = "";

    try {
      // Build the streamer defensively — if anything goes wrong creating
      // it (missing tokenizer, API mismatch), fall back to a non-streaming
      // call so the user still gets a response.
      let streamer: unknown = undefined;
      try {
        const mod = await getTransformers();
        const tokenizer = pipe.tokenizer;
        if (mod.TextStreamer && tokenizer) {
          streamer = new mod.TextStreamer(tokenizer, {
            skip_prompt: true,
            skip_special_tokens: true,
            callback_function: (chunk: string) => {
              count += 1;
              buffered += chunk;
              setPending(buffered);
              const elapsed = (performance.now() - start) / 1000;
              if (elapsed > 0.3) {
                setTokenCount(count);
                setTokenSpeed(count / elapsed);
              }
            },
          });
        }
      } catch (streamerErr) {
        console.warn("Streamer unavailable, falling back:", streamerErr);
      }

      const persona =
        CHAT_PERSONAS.find((p) => p.id === personaId) ?? CHAT_PERSONAS[0];
      const conversation: { role: string; content: string }[] = [];
      if (persona && persona.system) {
        conversation.push({ role: "system", content: persona.system });
      }
      for (const m of messages) {
        conversation.push({ role: m.role, content: m.text });
      }
      conversation.push({ role: "user", content: trimmed });

      // Build a stopping criterion so the user can interrupt the run.
      let stoppingCriteria: StoppingCriteriaInstance | undefined;
      try {
        const mod = await getTransformers();
        if (mod.InterruptableStoppingCriteria) {
          stoppingCriteria = new mod.InterruptableStoppingCriteria();
          stoppingRef.current = stoppingCriteria;
        }
      } catch (e) {
        console.warn("Stopping criterion unavailable:", e);
      }

      const generationOpts: Record<string, unknown> = {
        do_sample: true,
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
      };
      if (streamer) generationOpts.streamer = streamer;
      if (stoppingCriteria) generationOpts.stopping_criteria = stoppingCriteria;

      const out = (await pipe(conversation, generationOpts)) as unknown;
      stoppingRef.current = null;

      const finalText = (buffered || extractGeneratedText(out)).trim();
      const elapsed = (performance.now() - start) / 1000;
      if (count > 0 && elapsed > 0.05) setTokenSpeed(count / elapsed);
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-a`,
          role: "assistant",
          text: finalText || "(empty response)",
        },
      ]);
      setPending("");
    } catch (error) {
      console.error("Chat generation failed:", error);
      const msg =
        error instanceof Error ? error.message : "Unknown generation error.";
      setMessages((m) => [
        ...m,
        {
          id: `${Date.now()}-a`,
          role: "assistant",
          text: `⚠ ${msg}`,
        },
      ]);
      setPending("");
    } finally {
      stoppingRef.current = null;
      setGenerating(false);
    }
  }

  function stopGeneration() {
    stoppingRef.current?.interrupt();
  }

  const suggestions = [
    "Write a haiku about AI",
    "Explain quantum computing simply",
    "What's the best way to learn React?",
  ];

  return (
    <div className="grid gap-4">
      {/* TRANSCRIPT */}
      <div
        className="grid max-h-[460px] gap-4 overflow-y-auto rounded-xl border border-border-light bg-bg-light-2 p-5"
        ref={transcriptRef}
      >
        {messages.length === 0 && !pending ? (
          <div className="grid gap-3 py-2">
            <p className="text-[13px] text-text-light-muted">Try a prompt:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  className="rounded-full border border-border-light bg-bg-light-2 px-3 py-1.5 text-[12.5px] text-text-light transition-colors hover:border-accent/40 hover:bg-accent/5"
                  key={s}
                  onClick={() => send(s)}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} text={m.text} />
        ))}
        {pending ? (
          <ChatBubble role="assistant" text={pending} />
        ) : null}
        {generating && !pending ? (
          <div className="flex items-center gap-2 self-start font-mono text-[11px] text-text-light-muted">
            <span className="inline-flex gap-0.5">
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.3s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.15s]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400" />
            </span>
            warming up…
          </div>
        ) : null}
      </div>

      {/* PERSONA PICKER — system-prompt presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
          — persona
        </span>
        {CHAT_PERSONAS.map((p) => {
          const isActive = p.id === personaId;
          return (
            <button
              className={`rounded-full border px-3 py-1 text-[12px] transition-colors ${
                isActive
                  ? "border-accent/40 bg-accent/10 text-text-light"
                  : "border-border-light bg-transparent text-text-light-muted hover:border-accent/40 hover:text-text-light"
              }`}
              key={p.id}
              onClick={() => {
                setPersonaId(p.id);
                setMessages([]);
                setPending("");
              }}
              type="button"
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* INPUT */}
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          className="min-h-[48px] max-h-32 flex-1 resize-none rounded-xl border border-border-light bg-bg-light px-4 py-3 text-sm text-text-light placeholder:text-text-light-muted/60 focus:border-accent focus:outline-none"
          disabled={generating}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Type a message..."
          rows={1}
          value={input}
        />
        {generating ? (
          <button
            className="inline-flex h-[48px] items-center gap-2 rounded-xl bg-rose-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-400"
            onClick={stopGeneration}
            type="button"
          >
            <StopSquareIcon className="h-3 w-3" />
            Stop
          </button>
        ) : (
          <button
            className="inline-flex h-[48px] items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-text-dark transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-accent/40 disabled:text-text-dark/60 disabled:hover:translate-y-0"
            disabled={!input.trim()}
            type="submit"
          >
            Send
            <span aria-hidden="true">↑</span>
          </button>
        )}
      </form>

      {/* STATS */}
      <div className="flex items-center gap-4 rounded-lg border border-border-light bg-bg-light-2 px-4 py-2 font-mono text-[11px] text-text-light-muted">
        <span>
          Speed:{" "}
          <span className="text-result-green tabular-nums">
            {tokenSpeed != null ? tokenSpeed.toFixed(1) : "—"}
          </span>{" "}
          tok/s
        </span>
        <span aria-hidden="true" className="text-text-light-muted/40">
          ·
        </span>
        <span>
          Tokens:{" "}
          <span className="text-result-green tabular-nums">{tokenCount}</span>
        </span>
      </div>
    </div>
  );
}

function ChatBubble({
  role,
  text,
}: {
  role: "user" | "assistant";
  text: string;
}) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "items-start gap-3"}`}>
      {!isUser ? (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 ring-1 ring-violet-400/30">
          <BotIcon className="h-4 w-4 text-violet-300" />
        </div>
      ) : null}
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2.5 text-[14px] leading-7 ${
          isUser
            ? "bg-accent text-text-dark ring-1 ring-accent-deep/30"
            : "bg-bg-light-2 text-text-light ring-1 ring-white/8"
        }`}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
      {isUser ? (
        <div className="ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 ring-1 ring-accent/30">
          <UserIcon className="h-4 w-4 text-accent-deep" />
        </div>
      ) : null}
    </div>
  );
}

function extractGeneratedText(result: unknown): string {
  if (!Array.isArray(result)) return String(result);
  const first = result[0];
  if (!first || typeof first !== "object") return String(first);
  const obj = first as Record<string, unknown>;
  if (typeof obj.generated_text === "string") return obj.generated_text;
  if (Array.isArray(obj.generated_text)) {
    const last = obj.generated_text[obj.generated_text.length - 1];
    if (last && typeof last === "object" && "content" in last) {
      return String((last as Record<string, unknown>).content);
    }
  }
  return "";
}

/* ────────────────────────────────────────────────────────────────────
 * 03 CAMERA — MediaPipe GestureRecognizer with landmark skeleton.
 * ───────────────────────────────────────────────────────────────── */

type GestureRecognizerInstance = {
  recognizeForVideo: (
    video: HTMLVideoElement,
    timestamp: number,
  ) => {
    gestures: { categoryName: string; score: number }[][];
    landmarks: { x: number; y: number; z: number }[][];
  };
  close: () => void;
};

type HandLandmarkerStatic = {
  HAND_CONNECTIONS: ReadonlyArray<{ start: number; end: number }>;
};

let gestureRecognizerSingleton: GestureRecognizerInstance | null = null;
let handLandmarkerStatic: HandLandmarkerStatic | null = null;
let mediapipeLoading: Promise<void> | null = null;

async function loadMediapipe(): Promise<{
  recognizer: GestureRecognizerInstance;
  connections: ReadonlyArray<{ start: number; end: number }>;
}> {
  if (gestureRecognizerSingleton && handLandmarkerStatic) {
    return {
      connections: handLandmarkerStatic.HAND_CONNECTIONS,
      recognizer: gestureRecognizerSingleton,
    };
  }
  if (mediapipeLoading) {
    await mediapipeLoading;
    return {
      connections: handLandmarkerStatic!.HAND_CONNECTIONS,
      recognizer: gestureRecognizerSingleton!,
    };
  }
  mediapipeLoading = (async () => {
    const { FilesetResolver, GestureRecognizer, HandLandmarker } = await import(
      "@mediapipe/tasks-vision"
    );
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
    );
    const recognizer = (await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU",
      },
      numHands: 1,
      runningMode: "VIDEO",
    })) as unknown as GestureRecognizerInstance;
    gestureRecognizerSingleton = recognizer;
    handLandmarkerStatic = {
      HAND_CONNECTIONS: HandLandmarker.HAND_CONNECTIONS as ReadonlyArray<{
        start: number;
        end: number;
      }>,
    };
  })();
  await mediapipeLoading;
  return {
    connections: handLandmarkerStatic!.HAND_CONNECTIONS,
    recognizer: gestureRecognizerSingleton!,
  };
}

// Rainbow-ish palette for the 21 hand keypoints. MediaPipe orders the
// landmarks wrist → thumb-tip → index-tip → … etc. Color the dots
// roughly by finger so the skeleton reads as a hand at a glance.
const LANDMARK_COLORS = [
  "#fde047", // wrist
  "#fb923c", "#fb923c", "#fb923c", "#fb923c", // thumb
  "#22c55e", "#22c55e", "#22c55e", "#22c55e", // index
  "#06b6d4", "#06b6d4", "#06b6d4", "#06b6d4", // middle
  "#8b5cf6", "#8b5cf6", "#8b5cf6", "#8b5cf6", // ring
  "#ec4899", "#ec4899", "#ec4899", "#ec4899", // pinky
];

function CameraDemo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const [running, setRunning] = useState(false);
  const [gesture, setGesture] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stopRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);

  async function startCamera() {
    setError(null);
    setLoadStatus("loading");
    try {
      const { recognizer, connections } = await loadMediapipe();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", height: 480, width: 640 },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setLoadStatus("ready");
      setRunning(true);
      stopRef.current = false;
      runLoop(recognizer, connections);
    } catch (e) {
      console.error(e);
      setError(
        e instanceof Error ? e.message : "Camera permission denied or unavailable.",
      );
      setLoadStatus("error");
    }
  }

  function stopCamera() {
    stopRef.current = true;
    setRunning(false);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setGesture(null);
    setScore(null);
    setLoadStatus("idle");
  }

  function runLoop(
    recognizer: GestureRecognizerInstance,
    connections: ReadonlyArray<{ start: number; end: number }>,
  ) {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    let lastVideoTime = -1;

    function tick() {
      if (stopRef.current || !video || !canvas) return;
      const w = video.videoWidth || 640;
      const h = video.videoHeight || 480;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (video.currentTime !== lastVideoTime) {
        lastVideoTime = video.currentTime;
        try {
          const result = recognizer.recognizeForVideo(video, performance.now());
          drawLandmarks(canvas, result.landmarks, connections);
          const top = result.gestures[0]?.[0];
          if (top && top.score > 0.5) {
            setGesture(prettifyGesture(top.categoryName));
            setScore(top.score);
          } else if (result.landmarks.length === 0) {
            setGesture(null);
            setScore(null);
          }
        } catch (e) {
          console.error(e);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    return () => {
      stopRef.current = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="grid place-items-center">
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-border-light bg-black"
        ref={wrapRef}
      >
        <video
          className="block w-full -scale-x-100"
          muted
          playsInline
          ref={videoRef}
          style={{ aspectRatio: "4 / 3" }}
        />
        <canvas
          className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
          ref={canvasRef}
        />
        {!running ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/85 text-center">
            <p className="text-[14px] text-text-light">
              Allow camera to begin real-time hand tracking.
            </p>
            <p className="font-mono text-[11px] text-text-light-muted">
              — frames processed locally · nothing leaves your tab
            </p>
            <button
              className="mt-1 inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
              disabled={loadStatus === "loading"}
              onClick={startCamera}
              type="button"
            >
              {loadStatus === "loading" ? "Loading model…" : "Start camera"}
            </button>
            {error ? (
              <p className="font-mono text-[11px] text-problem-red">{error}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* GESTURE CAPTION */}
      {running ? (
        <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border-light bg-bg-light-2 px-5 py-2.5">
          <span className="text-xl font-semibold tracking-tight text-text-light">
            {gesture ?? "—"}
          </span>
          {score != null ? (
            <span className="font-mono text-[11px] text-text-light-muted">
              {(score * 100).toFixed(0)}%
            </span>
          ) : null}
        </div>
      ) : null}

      {running ? (
        <button
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-rose-500/90 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
          onClick={stopCamera}
          type="button"
        >
          <StopSquareIcon className="h-3 w-3" />
          Stop
        </button>
      ) : null}
    </div>
  );
}

function prettifyGesture(name: string): string {
  switch (name) {
    case "Thumb_Up":
      return "Thumbs Up";
    case "Thumb_Down":
      return "Thumbs Down";
    case "Open_Palm":
      return "Open Palm";
    case "Closed_Fist":
      return "Closed Fist";
    case "Pointing_Up":
      return "Pointing Up";
    case "Victory":
      return "Peace";
    case "ILoveYou":
      return "I Love You";
    case "None":
      return "—";
    default:
      return name.replace(/_/g, " ");
  }
}

function drawLandmarks(
  canvas: HTMLCanvasElement,
  hands: { x: number; y: number; z: number }[][],
  connections: ReadonlyArray<{ start: number; end: number }>,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const landmarks of hands) {
    // Draw connections first (under the dots)
    ctx.lineWidth = 3;
    for (const c of connections) {
      const a = landmarks[c.start];
      const b = landmarks[c.end];
      if (!a || !b) continue;
      const grad = ctx.createLinearGradient(
        a.x * canvas.width,
        a.y * canvas.height,
        b.x * canvas.width,
        b.y * canvas.height,
      );
      grad.addColorStop(0, LANDMARK_COLORS[c.start] ?? "#22d3ee");
      grad.addColorStop(1, LANDMARK_COLORS[c.end] ?? "#22d3ee");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
      ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
      ctx.stroke();
    }
    // Draw the 21 colored keypoint dots
    landmarks.forEach((lm, i) => {
      ctx.fillStyle = LANDMARK_COLORS[i] ?? "#22d3ee";
      ctx.beginPath();
      ctx.arc(lm.x * canvas.width, lm.y * canvas.height, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

/* ────────────────────────────────────────────────────────────────────
 * 04 SPEECH — Moonshine + live mic + waveform visualization.
 * ───────────────────────────────────────────────────────────────── */

const WAVEFORM_BARS = 48;

/** Pick the first MediaRecorder MIME type the browser actually
 * supports — webm/opus is the modern default, mp4 is the Safari
 * fallback, audio/mp4 for older Safari, and "" lets the browser
 * pick if none of those match. */
function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4;codecs=mp4a.40.2",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "";
}

function SpeechDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<
    { timestamp: string; text: string } | null
  >(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waveform, setWaveform] = useState<number[]>(() =>
    new Array(WAVEFORM_BARS).fill(0),
  );
  const [audioStats, setAudioStats] = useState<{
    audioSeconds: number;
    transcriptionMs: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function startRecording() {
    setErrorMsg(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      // Web Audio for waveform
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctor();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder for capture — let the browser pick the best codec
      const mimeType = pickRecorderMime();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recordedChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.start();
      startTimeRef.current = performance.now();
      setRecording(true);
      drawWave();
    } catch (e) {
      console.error(e);
      setErrorMsg(
        e instanceof Error
          ? e.message
          : "Microphone permission denied or unavailable.",
      );
    }
  }

  function drawWave() {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.fftSize);
    function tick() {
      if (!analyserRef.current) return;
      analyserRef.current.getByteTimeDomainData(data);
      const bars: number[] = [];
      const chunk = Math.floor(data.length / WAVEFORM_BARS);
      for (let i = 0; i < WAVEFORM_BARS; i += 1) {
        let sum = 0;
        for (let j = 0; j < chunk; j += 1) {
          const v = (data[i * chunk + j]! - 128) / 128;
          sum += v * v;
        }
        bars.push(Math.sqrt(sum / chunk));
      }
      setWaveform(bars);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  /** Decode an arbitrary audio Blob to a mono Float32Array @ 16kHz,
   *  ready for Moonshine. Handles stereo→mono, native rate→16k, and
   *  validates that the buffer is non-trivial. */
  async function decodeBlobTo16k(blob: Blob): Promise<Float32Array> {
    if (blob.size === 0) {
      throw new Error("Audio file is empty.");
    }
    const arrayBuffer = await blob.arrayBuffer();
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const decodeCtx = new Ctor();
    const decoded = await decodeCtx.decodeAudioData(arrayBuffer.slice(0));
    let channel = decoded.getChannelData(0);
    if (decoded.numberOfChannels > 1) {
      const left = decoded.getChannelData(0);
      const right = decoded.getChannelData(1);
      const mono = new Float32Array(left.length);
      for (let i = 0; i < left.length; i += 1) {
        mono[i] = (left[i]! + right[i]!) * 0.5;
      }
      channel = mono;
    }
    if (decoded.sampleRate !== 16000) {
      channel = resampleTo16k(channel, decoded.sampleRate);
    }
    decodeCtx.close();
    if (channel.length < 1600) {
      throw new Error("Audio is too short — needs at least 1 second.");
    }
    return channel;
  }

  async function transcribeChannel(
    channel: Float32Array,
    audioSeconds: number,
    sourceLabel: string,
  ) {
    setTranscribing(true);
    setErrorMsg(null);
    try {
      const t0 = performance.now();
      const out = (await pipe(channel)) as
        | { text?: string }
        | { text?: string }[];
      const text = Array.isArray(out)
        ? (out[0]?.text ?? "")
        : (out.text ?? "");
      const t1 = performance.now();
      if (!text.trim()) {
        throw new Error("Model returned an empty transcript.");
      }
      const stamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
        second: "2-digit",
      });
      setTranscript({
        text: `${sourceLabel} ${text.trim()}`,
        timestamp: stamp,
      });
      setAudioStats({ audioSeconds, transcriptionMs: t1 - t0 });
    } catch (e) {
      console.error("Transcription failed:", e);
      setErrorMsg(
        e instanceof Error
          ? e.message
          : "Transcription failed for an unknown reason.",
      );
    } finally {
      setTranscribing(false);
    }
  }

  async function stopRecording() {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    const audioSeconds = (performance.now() - startTimeRef.current) / 1000;
    setRecording(false);
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    setWaveform(new Array(WAVEFORM_BARS).fill(0));

    const stopped = new Promise<Blob>((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType,
        });
        resolve(blob);
      };
    });
    recorder.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    const blob = await stopped;

    try {
      const channel = await decodeBlobTo16k(blob);
      await transcribeChannel(channel, audioSeconds, "");
    } catch (e) {
      console.error("Recording decode failed:", e);
      setErrorMsg(e instanceof Error ? e.message : "Decode failed.");
      setTranscribing(false);
    }
  }

  async function transcribeFile(file: File) {
    setUploadedName(file.name);
    setErrorMsg(null);
    setTranscribing(true);
    try {
      const channel = await decodeBlobTo16k(file);
      const seconds = channel.length / 16000;
      await transcribeChannel(channel, seconds, "");
    } catch (e) {
      console.error("File transcribe failed:", e);
      setErrorMsg(e instanceof Error ? e.message : "Decode failed.");
      setTranscribing(false);
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      mediaRecorderRef.current?.state === "recording" &&
        mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close();
    };
  }, []);

  return (
    <div className="grid gap-5">
      {/* WAVEFORM */}
      <div className="flex h-32 items-center gap-[2px] rounded-xl border border-border-light bg-bg-light-2 px-5">
        {waveform.map((v, i) => {
          const height = Math.max(4, Math.min(110, v * 280));
          const hue = 220 + (i / WAVEFORM_BARS) * 60; // sky → violet
          return (
            <span
              className="flex-1 rounded-full"
              key={i}
              style={{
                background: recording
                  ? `linear-gradient(180deg, hsl(${hue} 95% 70%), hsl(${hue + 20} 85% 55%))`
                  : "rgba(120, 130, 160, 0.18)",
                height: `${height}px`,
                opacity: recording ? 1 : 0.25,
                transition: recording ? "none" : "all 0.4s ease",
              }}
            />
          );
        })}
      </div>

      {/* RECORD / UPLOAD CONTROLS */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        {recording ? (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.6)] transition-colors hover:bg-rose-400"
            onClick={stopRecording}
            type="button"
          >
            <StopSquareIcon className="h-3 w-3" />
            Stop Recording
          </button>
        ) : (
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md bg-rose-500/15 px-5 py-2.5 text-sm font-semibold text-problem-red ring-1 ring-rose-500/40 transition-colors hover:bg-rose-500/25 disabled:cursor-wait disabled:opacity-60"
            disabled={transcribing}
            onClick={startRecording}
            type="button"
          >
            <MicIcon className="h-4 w-4" />
            {transcribing ? "Transcribing…" : "Start Recording"}
          </button>
        )}

        {!recording ? (
          <>
            <span className="hidden font-mono text-[11px] text-text-light-muted/60 sm:inline">
              or
            </span>
            <label
              className={`group relative inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors ${
                dragging
                  ? "border-accent bg-accent/10 text-text-light"
                  : "border-border-light bg-bg-light-2 text-text-light hover:border-accent/40 hover:bg-accent/5"
              }`}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragging(false);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file && file.type.startsWith("audio/")) transcribeFile(file);
              }}
            >
              <input
                accept="audio/*"
                className="sr-only"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) transcribeFile(file);
                }}
                ref={fileInputRef}
                type="file"
              />
              <ArrowUpIcon className="h-4 w-4" />
              {uploadedName ?? "Upload audio file"}
            </label>
          </>
        ) : null}
      </div>

      {/* TRANSCRIPT */}
      <div className="min-h-[110px] rounded-xl border border-border-light bg-bg-light-2 px-5 py-4 text-[14.5px] leading-7">
        {transcribing ? (
          <span className="font-mono text-[11px] text-text-light-muted">
            transcribing…
          </span>
        ) : errorMsg ? (
          <p className="font-mono text-[12px] leading-6 text-problem-red">
            — error · {errorMsg}
          </p>
        ) : transcript ? (
          <p className="flex flex-wrap gap-x-3 text-text-light">
            <span className="font-mono text-[11px] text-text-light-muted">
              {transcript.timestamp}
            </span>
            <span className="flex-1">{transcript.text}</span>
          </p>
        ) : (
          <span className="text-text-light-muted">Press record and start speaking...</span>
        )}
      </div>

      {/* STATS */}
      {audioStats ? (
        <div className="flex items-center gap-4 rounded-lg border border-border-light bg-bg-light-2 px-4 py-2 font-mono text-[11px] text-text-light-muted">
          <span>
            Transcription:{" "}
            <span className="text-accent tabular-nums">
              {Math.round(audioStats.transcriptionMs)} ms
            </span>
          </span>
          <span aria-hidden="true" className="text-text-light-muted/40">
            ·
          </span>
          <span>
            Audio:{" "}
            <span className="text-accent tabular-nums">
              {audioStats.audioSeconds.toFixed(1)} s
            </span>
          </span>
        </div>
      ) : null}
    </div>
  );
}

function resampleTo16k(input: Float32Array, fromRate: number): Float32Array {
  const ratio = fromRate / 16000;
  const outLen = Math.round(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i += 1) {
    const idx = i * ratio;
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, input.length - 1);
    const t = idx - lo;
    out[i] = input[lo]! * (1 - t) + input[hi]! * t;
  }
  return out;
}

/* ────────────────────────────────────────────────────────────────────
 * 05 SEARCH — BGE Small with color-coded score bars.
 * ───────────────────────────────────────────────────────────────── */

const SEARCH_CORPUS: { body: string }[] = [
  { body: "Fresh herbs should be added at the end of cooking to preserve their aroma" },
  { body: "The Maillard reaction creates the brown crust and rich flavor when cooking meat" },
  { body: "Slow cooking breaks down tough collagen in meat into tender gelatin" },
  { body: "Fermentation transforms simple ingredients into complex flavors" },
  { body: "Balancing salt, acid, fat, and heat is the key to great cooking" },
  { body: "Sourdough bread requires a living starter culture of wild yeast and bacteria" },
  { body: "Knife skills are the foundation of efficient and safe kitchen work" },
  { body: "Neural networks learn patterns by adjusting weights through backpropagation" },
  { body: "Transformers use attention mechanisms to model relationships between tokens" },
  { body: "Quantization reduces model size by lowering numerical precision of weights" },
  { body: "WebGPU lets browsers run general-purpose compute on the graphics card" },
  { body: "Garbage collection automatically reclaims memory when objects become unreachable" },
  { body: "Pure functions are easier to test because they have no hidden side effects" },
  { body: "Running on a regular basis strengthens the cardiovascular system over time" },
  { body: "Resistance training is the most effective way to build skeletal muscle mass" },
  { body: "Stretching improves joint mobility but does not significantly reduce injury risk" },
  { body: "Sleep is when the body consolidates memories and repairs muscle tissue" },
  { body: "Philosophers have debated for millennia whether life has inherent meaning or whether we create it" },
  { body: "Stoicism teaches focusing only on what is within your control" },
  { body: "Consciousness remains one of the hardest unsolved problems in science" },
];

const SEARCH_SUGGESTIONS = [
  "how computers think",
  "preparing food",
  "the meaning of life",
  "physical exercise",
  "writing code",
];

type SearchResult = { body: string; score: number };

function SearchDemo({ pipe }: { pipe: TransformersPipeline }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  // Live corpus state — starts as the curated SEARCH_CORPUS and grows
  // as the visitor adds their own sentences via the "+ add" input.
  const [corpus, setCorpus] = useState<{ body: string; userAdded?: boolean }[]>(
    () => SEARCH_CORPUS.map((d) => ({ ...d })),
  );
  const corpusVecRef = useRef<number[][]>([]);
  const [latency, setLatency] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [addText, setAddText] = useState("");
  const [embedding, setEmbedding] = useState(false);

  // Re-embed the corpus whenever it changes. The pipeline is fast on
  // BGE-small, so re-embedding the whole list on each add stays
  // sub-100ms for the size we ship.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = (await pipe(corpus.map((d) => d.body), {
        normalize: true,
        pooling: "mean",
      })) as { data: Float32Array; dims: number[] };
      if (cancelled) return;
      const [n, dim] = out.dims;
      const arr: number[][] = [];
      for (let i = 0; i < n; i += 1) {
        const start = i * dim;
        arr.push(Array.from(out.data.slice(start, start + dim)));
      }
      corpusVecRef.current = arr;
      // If a query was already typed, re-rank against the new corpus.
      if (query.trim()) search(query);
    })().catch((e) => console.error(e));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pipe, corpus]);

  async function search(q: string) {
    const trimmed = q.trim();
    setQuery(trimmed);
    if (!trimmed) {
      setResults([]);
      return;
    }
    const vecs = corpusVecRef.current;
    if (vecs.length === 0) return;
    const start = performance.now();
    const out = (await pipe([trimmed], {
      normalize: true,
      pooling: "mean",
    })) as { data: Float32Array; dims: number[] };
    const dim = out.dims[1];
    const queryVec = Array.from(out.data.slice(0, dim));
    const ranked = corpus
      .map((entry, i) => ({
        body: entry.body,
        score: cosine(queryVec, vecs[i]!),
      }))
      .sort((a, b) => b.score - a.score);
    setResults(ranked);
    setLatency(performance.now() - start);
  }

  async function addSentence(text: string) {
    const trimmed = text.trim();
    if (!trimmed || embedding) return;
    setEmbedding(true);
    try {
      setCorpus((c) => [...c, { body: trimmed, userAdded: true }]);
      setAddText("");
    } finally {
      setEmbedding(false);
    }
  }

  return (
    <div className="grid gap-5">
      {/* SEARCH INPUT */}
      <form
        className="relative"
        onSubmit={(e) => {
          e.preventDefault();
          search(query);
        }}
      >
        <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-light-muted" />
        <input
          className="h-12 w-full rounded-xl border border-border-light bg-bg-light pl-11 pr-4 text-sm text-text-light placeholder:text-text-light-muted/60 focus:border-accent focus:outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            search(e.target.value);
          }}
          placeholder="Type a query and watch it rank the corpus by intent…"
          type="search"
          value={query}
        />
      </form>

      {/* SUGGESTION CHIPS */}
      <div className="flex flex-wrap gap-2">
        {SEARCH_SUGGESTIONS.map((s) => (
          <button
            className={`rounded-full border border-border-light px-3 py-1.5 text-[12.5px] transition-colors ${
              query === s
                ? "border-accent/40 bg-accent/10 text-text-light"
                : "bg-transparent text-text-light-muted hover:border-white/20 hover:text-text-light"
            }`}
            key={s}
            onClick={() => search(s)}
            type="button"
          >
            {s}
          </button>
        ))}
        {latency != null ? (
          <span className="ml-auto font-mono text-[11px] text-text-light-muted">
            {Math.round(latency)} ms · {corpus.length} entries
          </span>
        ) : null}
      </div>

      {/* ADD-TO-CORPUS */}
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          addSentence(addText);
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.16em] text-text-light-muted">
          — add
        </span>
        <input
          className="h-9 flex-1 rounded-md border border-border-light bg-bg-light px-3 text-[13px] text-text-light placeholder:text-text-light-muted/60 focus:border-accent focus:outline-none"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setAddText(e.target.value)}
          placeholder="Drop your own sentence into the corpus…"
          type="text"
          value={addText}
        />
        <button
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border-light bg-bg-light-2 px-3 text-[12.5px] font-semibold text-text-light transition-colors hover:bg-accent/10 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={embedding || !addText.trim()}
          type="submit"
        >
          {embedding ? "Embedding…" : "+ add"}
        </button>
      </form>

      {/* RESULTS */}
      <ol className="grid gap-2">
        {results.length === 0 ? (
          <li className="rounded-xl border border-border-light bg-bg-light-2 py-8 text-center font-mono text-[11px] text-text-light-muted/60">
            // type a query above — results are ranked by cosine similarity
          </li>
        ) : (
          results.map((r, i) => (
            <SearchResultRow
              focused={focusedIndex === i}
              index={i}
              key={`${r.body.slice(0, 24)}-${i}`}
              onMouseEnter={() => setFocusedIndex(i)}
              onMouseLeave={() => setFocusedIndex(null)}
              result={r}
            />
          ))
        )}
      </ol>
    </div>
  );
}

function SearchResultRow({
  focused,
  index,
  onMouseEnter,
  onMouseLeave,
  result,
}: {
  focused: boolean;
  index: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  result: SearchResult;
}) {
  // Score buckets — match the screenshot's green/yellow/orange pattern.
  const tone =
    result.score >= 0.5
      ? "emerald"
      : result.score >= 0.4
        ? "yellow"
        : "orange";
  const barColor =
    tone === "emerald"
      ? "bg-emerald-400"
      : tone === "yellow"
        ? "bg-amber-400"
        : "bg-orange-400";
  const labelColor =
    tone === "emerald"
      ? "text-result-green"
      : tone === "yellow"
        ? "text-amber-300"
        : "text-orange-300";

  return (
    <li
      className={`rounded-xl border px-5 py-4 transition-colors duration-150 ${
        focused
          ? "border-white/20 bg-bg-light-2"
          : "border-border-light bg-bg-light-2"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="grid grid-cols-[28px_1fr_auto] items-baseline gap-3">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border-light bg-bg-light-2 font-mono text-[11px] text-text-light-muted">
          {index + 1}
        </span>
        <p className="text-[14px] leading-6 text-text-light">{result.body}</p>
        <span className={`font-mono text-[12px] tabular-nums ${labelColor}`}>
          {result.score.toFixed(3)}
        </span>
      </div>
      <div className="mt-2 ml-[40px] h-1 overflow-hidden rounded-full bg-bg-light-2">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.max(0, Math.min(100, result.score * 100))}%` }}
        />
      </div>
    </li>
  );
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/* ────────────────────────────────────────────────────────────────────
 * ICONS — simple line/filled SVG glyphs used in the tabs + bubbles.
 * ───────────────────────────────────────────────────────────────── */

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="16" rx="2" stroke="currentColor" strokeWidth="1.5" width="18" x="3" y="4" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 18 5-5 4 4 3-3 4 4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="11" rx="1" stroke="currentColor" strokeWidth="1.5" width="13" x="3.5" y="4.5" />
      <rect height="9" rx="1" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1.3" width="9" x="10.5" y="10.5" />
    </svg>
  );
}

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="6" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 8.5 20 17M8 15.5 20 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="m3 13 9 5 9-5M3 18l9 5 9-5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-4 4v-4H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="13" rx="3" stroke="currentColor" strokeWidth="1.5" width="6" x="9" y="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M12 19V5m0 0-6 6m6-6 6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function BotIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <rect height="11" rx="3" stroke="currentColor" strokeWidth="1.5" width="14" x="5" y="8" />
      <path d="M12 5v3M8 5h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="9" cy="13" fill="currentColor" r="1" />
      <circle cx="15" cy="13" fill="currentColor" r="1" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function StopSquareIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <rect height="12" rx="1.5" width="12" x="6" y="6" />
    </svg>
  );
}
