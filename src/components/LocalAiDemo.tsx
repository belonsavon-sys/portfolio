"use client";

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
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="flex items-center gap-2 rounded-full border border-result-green/40 bg-[rgba(16,185,129,0.08)] px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-result-green">
          <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-result-green" />
          {device === "webgpu"
            ? "WebGPU Supported"
            : device === "wasm"
              ? "Running on WASM"
              : "Detecting hardware…"}
        </span>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              aria-pressed={isActive}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-[background,border-color,color] duration-150 ${
                isActive
                  ? "border-accent/60 bg-[rgba(41,110,214,0.18)] text-text-dark"
                  : "border-[rgba(41,110,214,0.18)] bg-bg-dark-2/60 text-text-dark-muted hover:border-[rgba(41,110,214,0.4)] hover:text-text-dark"
              }`}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              type="button"
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
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

  async function onUpload(file: File) {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setRunning(true);
    setResults([]);
    try {
      const out = (await pipe(url, { topk: 5 })) as { label: string; score: number }[];
      setResults(out);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <label className="block">
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
            Upload image
          </span>
          <div className="rounded-xl border border-dashed border-[rgba(41,110,214,0.4)] bg-bg-dark/60 p-4 transition-colors hover:border-accent/60">
            <input
              accept="image/*"
              className="block w-full text-sm text-text-dark-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              type="file"
            />
          </div>
        </label>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className="mt-4 max-h-64 rounded-xl border border-[rgba(41,110,214,0.25)] object-contain" src={imageUrl} />
        ) : null}
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
          Top predictions
        </p>
        {running ? (
          <p className="mt-4 text-sm text-text-dark-muted">Running inference…</p>
        ) : results.length > 0 ? (
          <ul className="mt-4 grid gap-2">
            {results.map((r) => (
              <li className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-3 py-2" key={r.label}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-dark">{r.label}</span>
                  <span className="font-mono text-xs text-accent-light">
                    {Math.round(r.score * 100)}%
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-[rgba(41,110,214,0.15)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-light"
                    style={{ width: `${Math.round(r.score * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-text-dark-muted">Upload an image to begin.</p>
        )}
      </div>
    </div>
  );
}

// ---------------- LLM Chat ----------------

function LlmChatRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [prompt, setPrompt] = useState(
    "Suggest a 3-step QA process for hotel housekeeping that a small team can run.",
  );
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    setOutput("");
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
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
          Prompt
        </span>
        <textarea
          className="min-h-24 rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark p-3 font-mono text-sm text-text-dark outline-none focus:border-accent"
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          value={prompt}
        />
      </label>
      <div>
        <Button disabled={running || !prompt.trim()} onClick={run}>
          {running ? "Generating…" : "Generate"}
        </Button>
      </div>
      {output ? (
        <div className="rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
            Output
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-text-dark">
            {output}
          </p>
        </div>
      ) : null}
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
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2">
          <video
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
            muted
            playsInline
            ref={videoRef}
          />
          <canvas className="hidden" ref={canvasRef} />
          {!active ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={start}>Start Camera</Button>
            </div>
          ) : null}
          {active ? (
            <button
              className="absolute bottom-3 right-3 rounded-md border border-[rgba(255,255,255,0.2)] bg-bg-dark/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-text-dark hover:border-problem-red/50"
              onClick={stop}
              type="button"
            >
              Stop
            </button>
          ) : null}
        </div>

        <div className="flex flex-col justify-center rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
            Recognized
          </p>
          <p className="mt-3 text-3xl font-semibold leading-tight text-text-dark">
            {active && topMatch ? topMatch.label : "—"}
          </p>
          {active && topMatch ? (
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-accent-light">
              {Math.round(topMatch.score * 100)}% confidence
            </p>
          ) : (
            <p className="mt-2 text-xs leading-5 text-text-dark-muted">
              Start the camera and hold up a gesture. The recognized word
              updates in real time.
            </p>
          )}
          <p className="mt-6 text-[11px] leading-5 text-text-dark-muted">
            Frames processed locally. Nothing uploaded.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---------------- Speech to Text ----------------

function SpeechToTextRunner({ pipe }: { pipe: TransformersPipeline }) {
  const [transcript, setTranscript] = useState("");
  const [running, setRunning] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function onUpload(file: File) {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setTranscript("");
    setRunning(true);
    try {
      const result = (await pipe(url)) as { text?: string };
      setTranscript(result.text ?? "");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="grid gap-4">
      <label className="block">
        <span className="mb-3 block font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
          Upload audio (.wav, .mp3, .m4a)
        </span>
        <div className="rounded-xl border border-dashed border-[rgba(41,110,214,0.4)] bg-bg-dark/60 p-4 transition-colors hover:border-accent/60">
          <input
            accept="audio/*"
            className="block w-full text-sm text-text-dark-muted file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
            type="file"
          />
        </div>
      </label>
      {audioUrl ? <audio className="w-full" controls src={audioUrl} /> : null}
      {running ? (
        <p className="text-sm text-text-dark-muted">Transcribing…</p>
      ) : transcript ? (
        <div className="rounded-xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
            Transcript
          </p>
          <p className="mt-3 text-sm leading-7 text-text-dark">{transcript}</p>
        </div>
      ) : null}
    </div>
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

  return (
    <div className="grid gap-4">
      <label className="grid gap-2">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
          Query
        </span>
        <input
          className="rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-3 py-3 font-mono text-sm text-text-dark outline-none focus:border-accent"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
        />
      </label>
      <div>
        <Button disabled={running || !query.trim()} onClick={run}>
          {running ? "Ranking…" : "Search"}
        </Button>
      </div>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
          Sample dataset
        </p>
        <p className="mt-2 text-xs text-text-dark-muted">
          {SEARCH_DATASET.length} mock hospitality ops rows
        </p>
      </div>
      {results.length > 0 ? (
        <ol className="grid gap-2">
          {results.map((r, i) => (
            <li className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-3" key={r.row}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-light">
                  #{i + 1}
                </span>
                <span className="font-mono text-xs text-accent-light">
                  {Math.round(r.score * 100)}%
                </span>
              </div>
              <p className="mt-2 text-sm text-text-dark">{r.row}</p>
            </li>
          ))}
        </ol>
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
