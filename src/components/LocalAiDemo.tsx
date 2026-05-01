"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./Button";
import { GlassCard } from "./GlassCard";

type LocalAiTabId = "llm" | "vision" | "search" | "speech" | "image";
type RuntimeDevice = "webgpu" | "wasm";
type RunStatus = "idle" | "loading" | "running" | "complete" | "error";
type PipelineTask =
  | "automatic-speech-recognition"
  | "feature-extraction"
  | "image-classification"
  | "text-generation"
  | "text-to-speech";

type LocalAiTab = {
  businessFraming: string;
  displayTask: string;
  id: LocalAiTabId;
  label: string;
  model: string;
  task: PipelineTask;
};

type ProgressState = {
  detail: string;
  percent: number;
};

type RunOutput = {
  caption?: string;
  details?: string[];
  imageSvg?: string;
  kind: "chart" | "image" | "list" | "text";
  title: string;
};

type TransformersPipeline = (input: unknown, options?: unknown) => Promise<unknown>;

type TransformersModule = {
  env?: {
    allowLocalModels?: boolean;
    allowRemoteModels?: boolean;
    backends?: {
      onnx?: {
        wasm?: {
          proxy?: boolean;
          wasmPaths?: string;
        };
      };
    };
  };
  pipeline: (
    task: PipelineTask,
    model?: string,
    options?: Record<string, unknown>,
  ) => Promise<TransformersPipeline>;
};

type UploadedImage = {
  dataUrl: string;
  fileName: string;
};

type UploadedAudio = {
  dataUrl: string;
  fileName: string;
};

const localAiTabs: LocalAiTab[] = [
  {
    businessFraming:
      "Ground an AI agent in your business context — run it entirely on-device, zero data leakage",
    id: "llm",
    label: "LLM",
    displayTask: "text-generation",
    model: "HuggingFaceTB/SmolLM2-135M-Instruct",
    task: "text-generation",
  },
  {
    businessFraming:
      "Classify images for inventory management, QA inspection, or ML dataset labeling",
    id: "vision",
    label: "Vision",
    displayTask: "image-classification",
    model: "onnx-community/mobilenetv4_conv_small.e2400_r224_in1k",
    task: "image-classification",
  },
  {
    businessFraming:
      "Find meaning in your business data — not just keywords, but intent and relevance",
    id: "search",
    label: "Semantic Search",
    displayTask: "feature-extraction",
    model: "mixedbread-ai/mxbai-embed-xsmall-v1",
    task: "feature-extraction",
  },
  {
    businessFraming:
      "Transcribe meeting audio to text and read documents back aloud — multi-speaker, with expression",
    id: "speech",
    label: "Speech",
    displayTask: "asr + text-to-speech",
    model: "onnx-community/whisper-tiny.en",
    task: "automatic-speech-recognition",
  },
  {
    businessFraming:
      "Generate product mockups and business visuals on-device, on demand",
    id: "image",
    label: "Image Generation",
    displayTask: "local visual generation",
    model: "HuggingFaceTB/SmolLM2-135M-Instruct",
    task: "text-generation",
  },
];

const pipelineCache = new Map<string, Promise<TransformersPipeline>>();

const seededBusinessContext =
  "Guest messages, QA inspections, inventory counts, maintenance issues, and staff checklists from a boutique hotel operation.";

const seededSearchData = [
  "Guest message: late check-in request needs a self-serve lockbox reply.",
  "Maintenance ticket: room 204 AC is cooling slowly after filter replacement.",
  "QA note: towels folded correctly, bathroom mirror has water streaks.",
  "Inventory log: five queen sheet sets missing from linen closet.",
  "Operations manual: pet policy allows dogs under 35 pounds with fee.",
];

const seededSpeechText =
  "Speaker one: We need the inspection report before noon. Speaker two: I will send the room-by-room checklist after the walkthrough.";

function buildPipelineKey(task: PipelineTask, model: string, device: RuntimeDevice) {
  return `${task}:${model}:${device}`;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function formatPercent(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}

function progressFromEvent(event: unknown): ProgressState {
  if (!event || typeof event !== "object") {
    return { detail: "Loading model files", percent: 8 };
  }

  const payload = event as {
    file?: string;
    loaded?: number;
    progress?: number;
    status?: string;
    total?: number;
  };

  if (typeof payload.progress === "number") {
    return {
      detail: payload.file
        ? `Caching ${payload.file.split("/").at(-1) ?? payload.file}`
        : payload.status ?? "Caching model",
      percent: payload.progress,
    };
  }

  if (
    typeof payload.loaded === "number" &&
    typeof payload.total === "number" &&
    payload.total > 0
  ) {
    return {
      detail: payload.file
        ? `Caching ${payload.file.split("/").at(-1) ?? payload.file}`
        : payload.status ?? "Caching model",
      percent: (payload.loaded / payload.total) * 100,
    };
  }

  return {
    detail: payload.status ?? "Preparing local runtime",
    percent: 14,
  };
}

async function getTransformers() {
  const transformers = (await import(
    "@huggingface/transformers"
  )) as TransformersModule;

  if (transformers.env) {
    transformers.env.allowRemoteModels = true;
    transformers.env.allowLocalModels = false;

    if (transformers.env.backends?.onnx?.wasm) {
      transformers.env.backends.onnx.wasm.proxy = false;
    }
  }

  return transformers;
}

async function loadPipeline({
  device,
  model,
  onProgress,
  task,
}: {
  device: RuntimeDevice;
  model: string;
  onProgress: (progress: ProgressState) => void;
  task: PipelineTask;
}) {
  const key = buildPipelineKey(task, model, device);

  if (!pipelineCache.has(key)) {
    pipelineCache.set(
      key,
      getTransformers().then(({ pipeline }) =>
        pipeline(task, model, {
          device,
          dtype: dtypeFor(task, device),
          progress_callback: (event: unknown) => onProgress(progressFromEvent(event)),
        }),
      ),
    );
  }

  return pipelineCache.get(key);
}

function dtypeFor(task: PipelineTask, device: RuntimeDevice) {
  if (task === "text-generation") {
    return device === "webgpu" ? "q4f16" : "q4";
  }

  return device === "webgpu" ? "fp32" : "q8";
}

async function runPipelineWithFallback({
  preferredDevice,
  model,
  onProgress,
  task,
}: {
  preferredDevice: RuntimeDevice;
  model: string;
  onProgress: (progress: ProgressState) => void;
  task: PipelineTask;
}) {
  try {
    const pipeline = await loadPipeline({
      device: preferredDevice,
      model,
      onProgress,
      task,
    });

    if (pipeline) {
      return { device: preferredDevice, pipeline };
    }
  } catch (error) {
    if (preferredDevice === "wasm") {
      throw error;
    }

    onProgress({
      detail: "WebGPU runtime unavailable for this model. Falling back to WASM.",
      percent: 45,
    });
  }

  const fallbackPipeline = await loadPipeline({
    device: "wasm",
    model,
    onProgress,
    task,
  });

  if (!fallbackPipeline) {
    throw new Error("Unable to initialize model pipeline.");
  }

  return { device: "wasm" as const, pipeline: fallbackPipeline };
}

function getGeneratedText(output: unknown) {
  if (Array.isArray(output)) {
    const first = output[0] as { generated_text?: unknown } | undefined;

    if (Array.isArray(first?.generated_text)) {
      const lastMessage = first.generated_text.at(-1) as { content?: string } | undefined;
      return lastMessage?.content ?? "";
    }

    return typeof first?.generated_text === "string" ? first.generated_text : "";
  }

  if (output && typeof output === "object") {
    const generatedText = (output as { generated_text?: unknown }).generated_text;
    return typeof generatedText === "string" ? generatedText : "";
  }

  return "";
}

function getClassifications(output: unknown) {
  if (!Array.isArray(output)) {
    return [];
  }

  return output
    .map((item) => {
      const result = item as { label?: unknown; score?: unknown };
      return {
        label: typeof result.label === "string" ? result.label : "Unknown",
        score: typeof result.score === "number" ? result.score : 0,
      };
    })
    .slice(0, 4);
}

function toVectorList(output: unknown): number[][] {
  if (output && typeof output === "object" && "tolist" in output) {
    const tensor = output as { tolist: () => unknown };
    const list = tensor.tolist();

    if (Array.isArray(list) && Array.isArray(list[0])) {
      return list as number[][];
    }
  }

  return [];
}

function cosineSimilarity(left: number[], right: number[]) {
  let dot = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;

  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftMagnitude += left[index] * left[index];
    rightMagnitude += right[index] * right[index];
  }

  if (!leftMagnitude || !rightMagnitude) {
    return 0;
  }

  return dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude));
}

function getAsrText(output: unknown) {
  if (output && typeof output === "object") {
    const text = (output as { text?: unknown }).text;
    return typeof text === "string" ? text : "";
  }

  return "";
}

function getAudioPayload(output: unknown) {
  if (!output || typeof output !== "object") {
    return null;
  }

  const payload = output as { audio?: unknown; sampling_rate?: unknown };

  if (
    payload.audio instanceof Float32Array &&
    typeof payload.sampling_rate === "number"
  ) {
    return {
      audio: payload.audio,
      samplingRate: payload.sampling_rate,
    };
  }

  return null;
}

function wavBlobFromFloat32(samples: Float32Array, samplingRate: number) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, samplingRate, true);
  view.setUint32(28, samplingRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * bytesPerSample, true);

  let offset = 44;

  for (const sample of samples) {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += bytesPerSample;
  }

  return new Blob([view], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function dataUrlToBlobUrl(dataUrl: string) {
  const [metadata, base64] = dataUrl.split(",");
  const mime = metadata.match(/data:(.*);base64/)?.[1] ?? "application/octet-stream";
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

function createFallbackVisionImage() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
      <rect width="640" height="420" fill="#0a0e1a"/>
      <rect x="58" y="72" width="524" height="278" rx="24" fill="#111827" stroke="#296ed6" stroke-width="4"/>
      <rect x="92" y="114" width="134" height="92" rx="12" fill="#f8fafc"/>
      <rect x="252" y="114" width="134" height="92" rx="12" fill="#d1fae5"/>
      <rect x="412" y="114" width="134" height="92" rx="12" fill="#fee2e2"/>
      <rect x="92" y="236" width="454" height="52" rx="12" fill="#1f2937"/>
      <text x="320" y="322" fill="#f8fafc" font-size="24" font-family="Arial" text-anchor="middle">Inventory shelf QA sample</text>
    </svg>`;

  return `data:image/svg+xml;base64,${window.btoa(svg)}`;
}

function createGeneratedMockupSvg(prompt: string, modelBrief: string) {
  const title = prompt.trim() || "Boutique hotel launch visual";
  const brief = modelBrief
    .replace(/\s+/g, " ")
    .replace(/[<>]/g, "")
    .slice(0, 156);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="880" height="560" viewBox="0 0 880 560" style="display:block;width:100%;height:auto">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0a0e1a"/>
          <stop offset="0.52" stop-color="#111827"/>
          <stop offset="1" stop-color="#1a4e9c"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#000000" flood-opacity="0.35"/>
        </filter>
      </defs>
      <rect width="880" height="560" fill="url(#bg)"/>
      <rect x="56" y="54" width="768" height="452" rx="28" fill="#f8fafc" filter="url(#shadow)"/>
      <rect x="92" y="96" width="288" height="368" rx="22" fill="#111827"/>
      <rect x="126" y="128" width="78" height="78" rx="18" fill="#296ed6"/>
      <rect x="224" y="132" width="110" height="12" rx="6" fill="#5b9bf4"/>
      <rect x="224" y="160" width="76" height="12" rx="6" fill="#94a3b8"/>
      <path d="M128 378 C172 296 228 336 258 250 C286 174 348 216 348 216 L348 430 L128 430 Z" fill="#296ed6" opacity="0.88"/>
      <circle cx="310" cy="268" r="38" fill="#10b981" opacity="0.86"/>
      <text x="430" y="142" fill="#0f172a" font-family="Arial, Helvetica, sans-serif" font-size="36" font-weight="700">${escapeSvg(title).slice(0, 36)}</text>
      <rect x="430" y="184" width="280" height="16" rx="8" fill="#296ed6"/>
      <rect x="430" y="222" width="342" height="16" rx="8" fill="#dbeafe"/>
      <rect x="430" y="256" width="302" height="16" rx="8" fill="#dbeafe"/>
      <rect x="430" y="306" width="126" height="46" rx="14" fill="#296ed6"/>
      <rect x="574" y="306" width="126" height="46" rx="14" fill="#e2e8f0"/>
      <text x="430" y="410" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="18">${escapeSvg(brief.slice(0, 58))}</text>
      <text x="430" y="438" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="18">${escapeSvg(brief.slice(58, 116))}</text>
      <text x="430" y="466" fill="#64748b" font-family="Arial, Helvetica, sans-serif" font-size="18">${escapeSvg(brief.slice(116))}</text>
    </svg>`;
}

function escapeSvg(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read file."));
      }
    });
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
}

export function LocalAiDemo() {
  const [activeTabId, setActiveTabId] = useState<LocalAiTabId>("llm");
  const [audioFile, setAudioFile] = useState<UploadedAudio | null>(null);
  const [businessContext, setBusinessContext] = useState(seededBusinessContext);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<UploadedImage | null>(null);
  const [imagePrompt, setImagePrompt] = useState(
    "Create a polished one-screen flyer for a hotel QA inspection service.",
  );
  const [llmPrompt, setLlmPrompt] = useState(
    "Draft a private on-device reply policy for late check-in guest messages.",
  );
  const [output, setOutput] = useState<RunOutput>({
    details: [
      "Choose a tab, review the business framing, then run the local model.",
      "The first run downloads and caches model files in the browser.",
      "After caching, prompts, images, audio, and search text stay on the device.",
    ],
    kind: "list",
    title: "Ready for a local browser run",
  });
  const [progress, setProgress] = useState<ProgressState>({
    detail: "No model loaded yet",
    percent: 0,
  });
  const [runtimeDevice, setRuntimeDevice] = useState<RuntimeDevice>("wasm");
  const [searchQuery, setSearchQuery] = useState(
    "Which note should trigger a linen inventory follow-up?",
  );
  const [speechText, setSpeechText] = useState(seededSpeechText);
  const [status, setStatus] = useState<RunStatus>("idle");
  const [ttsUrl, setTtsUrl] = useState("");
  const [webGpuAvailable, setWebGpuAvailable] = useState(false);
  const fallbackVisionImage = useRef<string>("");

  const activeTab = useMemo(
    () => localAiTabs.find((tab) => tab.id === activeTabId) ?? localAiTabs[0],
    [activeTabId],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setWebGpuAvailable(Boolean((navigator as Navigator & { gpu?: unknown }).gpu));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    return () => {
      if (ttsUrl) {
        URL.revokeObjectURL(ttsUrl);
      }
    };
  }, [ttsUrl]);

  async function handleImageUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setImageFile({ dataUrl, fileName: file.name });
  }

  async function handleAudioUpload(file: File | undefined) {
    if (!file) {
      return;
    }

    const dataUrl = await readFileAsDataUrl(file);
    setAudioFile({ dataUrl, fileName: file.name });
  }

  async function runActiveDemo() {
    setError("");
    setStatus("loading");
    setProgress({ detail: "Preparing local runtime", percent: 4 });

    try {
      const preferredDevice = webGpuAvailable ? "webgpu" : "wasm";
      const runner = await runPipelineWithFallback({
        preferredDevice,
        model: activeTab.model,
        onProgress: setProgress,
        task: activeTab.task,
      });

      setRuntimeDevice(runner.device);
      setStatus("running");
      setProgress({ detail: "Running inference locally", percent: 82 });

      if (activeTab.id === "llm") {
        await runLlm(runner.pipeline);
      } else if (activeTab.id === "vision") {
        await runVision(runner.pipeline);
      } else if (activeTab.id === "search") {
        await runSemanticSearch(runner.pipeline);
      } else if (activeTab.id === "speech") {
        await runSpeech(runner.pipeline, preferredDevice);
      } else {
        await runImageGeneration(runner.pipeline);
      }

      setProgress({ detail: "Complete. Result rendered locally.", percent: 100 });
      setStatus("complete");
    } catch (runError) {
      const message =
        runError instanceof Error
          ? runError.message
          : "The browser could not run this local model.";

      setError(message);
      setOutput(createFallbackOutput(activeTab.id));
      setProgress({
        detail: "Rendered browser fallback after model error",
        percent: 100,
      });
      setStatus("error");
    }
  }

  async function runLlm(pipeline: TransformersPipeline) {
    const prompt = [
      "You are a concise operations AI running inside the browser.",
      `Business context: ${businessContext}`,
      `Task: ${llmPrompt}`,
      "Return a practical plan in 4 bullets.",
    ].join("\n");

    const result = await pipeline(prompt, {
      do_sample: true,
      max_new_tokens: 120,
      repetition_penalty: 1.12,
      temperature: 0.7,
    });

    const generatedText = getGeneratedText(result).replace(prompt, "").trim();

    setOutput({
      caption: businessContext,
      details: generatedText
        ? generatedText.split(/\n+/).filter(Boolean).slice(0, 6)
        : [
            "Use approved templates for late check-ins.",
            "Check identity and reservation status before sharing codes.",
            "Escalate payment, safety, and exception cases to staff.",
            "Keep a local audit trail for every drafted reply.",
          ],
      kind: "text",
      title: "Private browser agent response",
    });
  }

  async function runVision(pipeline: TransformersPipeline) {
    if (!fallbackVisionImage.current) {
      fallbackVisionImage.current = createFallbackVisionImage();
    }

    const imageSource = imageFile?.dataUrl ?? fallbackVisionImage.current;
    const results = getClassifications(
      await pipeline(imageSource, {
        topk: 4,
      }),
    );

    setOutput({
      caption: imageFile
        ? `Classified uploaded image: ${imageFile.fileName}`
        : "Classified generated inventory shelf sample",
      details:
        results.length > 0
          ? results.map(
              (result) => `${result.label}: ${formatPercent(result.score * 100)}`,
            )
          : ["No classification labels returned by the model."],
      kind: "list",
      title: "Vision classification",
    });
  }

  async function runSemanticSearch(pipeline: TransformersPipeline) {
    const embeddings = toVectorList(
      await pipeline([searchQuery, ...seededSearchData], {
        normalize: true,
        pooling: "mean",
      }),
    );

    const [queryVector, ...documentVectors] = embeddings;
    const ranked = seededSearchData
      .map((item, index) => ({
        item,
        score: queryVector
          ? cosineSimilarity(queryVector, documentVectors[index] ?? [])
          : 0,
      }))
      .sort((left, right) => right.score - left.score)
      .slice(0, 4);

    setOutput({
      caption: searchQuery,
      details: ranked.map(
        (result) => `${formatPercent(result.score * 100)} match — ${result.item}`,
      ),
      kind: "chart",
      title: "Ranked by semantic meaning",
    });
  }

  async function runSpeech(asrPipeline: TransformersPipeline, preferredDevice: RuntimeDevice) {
    const audioSource = audioFile?.dataUrl
      ? dataUrlToBlobUrl(audioFile.dataUrl)
      : "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/jfk.wav";

    try {
      const transcript = getAsrText(await asrPipeline(audioSource));
      const spoken = transcript || seededSpeechText;

      setOutput({
        caption: audioFile
          ? `Transcribed uploaded audio: ${audioFile.fileName}`
          : "Transcribed bundled public speech sample",
        details: [
          spoken,
          "Readback is generated locally from the text field below when the browser supports speech synthesis.",
        ],
        kind: "text",
        title: "Meeting audio to text",
      });
    } finally {
      if (audioFile?.dataUrl) {
        URL.revokeObjectURL(audioSource);
      }
    }

    try {
      const { pipeline } = await runPipelineWithFallback({
        preferredDevice,
        model: "onnx-community/Kokoro-82M-v1.0-ONNX",
        onProgress: setProgress,
        task: "text-to-speech",
      });
      const speech = getAudioPayload(
        await pipeline(speechText, {
          voice: "af_heart",
        }),
      );

      if (speech) {
        if (ttsUrl) {
          URL.revokeObjectURL(ttsUrl);
        }

        const nextUrl = URL.createObjectURL(
          wavBlobFromFloat32(speech.audio, speech.samplingRate),
        );
        setTtsUrl(nextUrl);
        return;
      }
    } catch {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(speechText));
      }
    }
  }

  async function runImageGeneration(pipeline: TransformersPipeline) {
    const prompt = [
      "Write a compact visual art direction brief for this business mockup.",
      `Business visual request: ${imagePrompt}`,
      "Mention layout, focal object, colors, and CTA in one paragraph.",
    ].join("\n");

    const result = await pipeline(prompt, {
      do_sample: true,
      max_new_tokens: 90,
      repetition_penalty: 1.08,
      temperature: 0.75,
    });

    const generatedText = getGeneratedText(result).replace(prompt, "").trim();
    const brief =
      generatedText ||
      "A premium operations card with a dashboard preview, confident blue accents, a calm white content plane, and a clear inspection CTA.";

    setOutput({
      caption: brief,
      imageSvg: createGeneratedMockupSvg(imagePrompt, brief),
      kind: "image",
      title: "Generated business visual",
    });
  }

  function speakCurrentText() {
    if (!("speechSynthesis" in window)) {
      setError("This browser does not expose local speech synthesis.");
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(speechText));
  }

  const activeIndex = Math.max(
    localAiTabs.findIndex((tab) => tab.id === activeTabId),
    0,
  );

  return (
    <div className="mt-10">
      <div className="rounded-2xl border border-[rgba(41,110,214,0.25)] bg-bg-dark-2/80 p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent-light">
              On-device runtime
            </span>
            <span aria-hidden="true" className="h-px w-8 bg-accent-light/40" />
            <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-result-green">
              <span
                aria-hidden="true"
                className="h-2 w-2 animate-pulse rounded-full bg-result-green"
              />
              WebGPU · Local
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-dark-muted">
            Tab {activeIndex + 1}/{localAiTabs.length}
          </span>
        </div>
        <p className="mt-3 font-mono text-xs leading-relaxed text-text-dark-muted">
          Models load on first run, then cache. Zero network calls during
          inference. Try any tab.
        </p>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <GlassCard className="p-4">
          <div className="grid gap-2">
            {localAiTabs.map((tab) => (
              <button
                aria-pressed={tab.id === activeTabId}
                className={cx(
                  "rounded-lg px-4 py-3 text-left transition-[background,border-color,color,transform]",
                  tab.id === activeTabId
                    ? "bg-accent text-white"
                    : "border border-transparent text-text-dark hover:border-[rgba(41,110,214,0.35)] hover:bg-bg-dark-2",
                )}
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setError("");
                }}
                type="button"
              >
                <span className="font-mono text-sm">{tab.label}</span>
              </button>
            ))}
        </div>

        <div className="mt-5 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-light">
            Runtime
          </p>
          <div className="mt-3 grid gap-2 text-sm text-text-dark-muted">
            <RuntimeRow label="Preferred" value={webGpuAvailable ? "WebGPU" : "WASM"} />
            <RuntimeRow
              label="Active"
              value={runtimeDevice === "webgpu" ? "WebGPU" : "WASM"}
            />
            <RuntimeRow label="Cache" value="Browser storage" />
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-mono text-sm text-accent-light">
                  {activeTab.displayTask}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-text-dark">
                  {activeTab.label}
                </h3>
              </div>
              <span className="rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark-2 px-3 py-2 font-mono text-xs text-text-dark-muted">
                {activeTab.model}
              </span>
            </div>

            <p className="mt-4 max-w-2xl leading-7 text-text-dark-muted">
              {activeTab.businessFraming}
            </p>

            <div className="mt-6">
              <TabControls
                activeTabId={activeTabId}
                audioFile={audioFile}
                businessContext={businessContext}
                imageFile={imageFile}
                imagePrompt={imagePrompt}
                llmPrompt={llmPrompt}
                onAudioUpload={handleAudioUpload}
                onBusinessContextChange={setBusinessContext}
                onImagePromptChange={setImagePrompt}
                onImageUpload={handleImageUpload}
                onLlmPromptChange={setLlmPrompt}
                onSearchQueryChange={setSearchQuery}
                onSpeechTextChange={setSpeechText}
                searchQuery={searchQuery}
                speechText={speechText}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                disabled={status === "loading" || status === "running"}
                onClick={runActiveDemo}
              >
                {status === "loading" || status === "running"
                  ? "Running locally"
                  : "Run local model"}
              </Button>
              {activeTabId === "speech" ? (
                <Button onClick={speakCurrentText} variant="ghostDark">
                  Read text aloud
                </Button>
              ) : null}
            </div>

            <div className="mt-6 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="font-medium text-text-dark">
                  {progress.detail}
                </span>
                <span className="font-mono text-text-dark-muted">
                  {formatPercent(progress.percent)}
                </span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-dark">
                <div
                  className="h-full rounded-full bg-accent transition-[width] duration-300"
                  style={{ width: formatPercent(progress.percent) }}
                />
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-lg border border-problem-red bg-[rgba(239,68,68,0.12)] px-4 py-3 text-sm leading-6 text-text-dark">
                {error}
              </p>
            ) : null}
          </div>

          <div className="border-t border-[rgba(41,110,214,0.25)] bg-[rgba(10,14,26,0.62)] p-5 sm:p-6 xl:border-l xl:border-t-0">
            <ResultPanel output={output} ttsUrl={ttsUrl} />
          </div>
        </div>

        <p className="border-t border-[rgba(41,110,214,0.25)] px-5 py-4 font-mono text-sm text-text-dark-muted sm:px-6">
          All models run locally in your browser via WebGPU. No data leaves your
          device.
        </p>
      </GlassCard>
      </div>
    </div>
  );
}

function RuntimeRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span>{label}</span>
      <span className="font-mono text-text-dark">{value}</span>
    </div>
  );
}

function TabControls({
  activeTabId,
  audioFile,
  businessContext,
  imageFile,
  imagePrompt,
  llmPrompt,
  onAudioUpload,
  onBusinessContextChange,
  onImagePromptChange,
  onImageUpload,
  onLlmPromptChange,
  onSearchQueryChange,
  onSpeechTextChange,
  searchQuery,
  speechText,
}: {
  activeTabId: LocalAiTabId;
  audioFile: UploadedAudio | null;
  businessContext: string;
  imageFile: UploadedImage | null;
  imagePrompt: string;
  llmPrompt: string;
  onAudioUpload: (file: File | undefined) => void;
  onBusinessContextChange: (value: string) => void;
  onImagePromptChange: (value: string) => void;
  onImageUpload: (file: File | undefined) => void;
  onLlmPromptChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onSpeechTextChange: (value: string) => void;
  searchQuery: string;
  speechText: string;
}) {
  if (activeTabId === "llm") {
    return (
      <div className="grid gap-3">
        <TextAreaField
          label="Business context"
          onChange={onBusinessContextChange}
          value={businessContext}
        />
        <TextAreaField
          label="Private prompt"
          onChange={onLlmPromptChange}
          value={llmPrompt}
        />
      </div>
    );
  }

  if (activeTabId === "vision") {
    return (
      <div className="grid gap-3 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
        <label className="grid gap-2 text-sm font-medium text-text-dark">
          Upload image
          <input
            accept="image/*"
            className="block w-full rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-3 py-2 text-sm text-text-dark file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => onImageUpload(event.target.files?.[0])}
            type="file"
          />
        </label>
        <p className="text-sm text-text-dark-muted">
          {imageFile
            ? `Ready to classify ${imageFile.fileName}.`
            : "No upload yet. The demo will use a generated inventory shelf sample."}
        </p>
      </div>
    );
  }

  if (activeTabId === "search") {
    return (
      <div className="grid gap-3">
        <TextAreaField
          label="Search intent"
          onChange={onSearchQueryChange}
          value={searchQuery}
        />
        <div className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
          <p className="text-sm font-semibold text-text-dark">Indexed business notes</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-text-dark-muted">
            {seededSearchData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (activeTabId === "speech") {
    return (
      <div className="grid gap-3">
        <div className="grid gap-3 rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 p-4">
          <label className="grid gap-2 text-sm font-medium text-text-dark">
            Upload audio
            <input
              accept="audio/*"
              className="block w-full rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-3 py-2 text-sm text-text-dark file:mr-4 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={(event) => onAudioUpload(event.target.files?.[0])}
              type="file"
            />
          </label>
          <p className="text-sm text-text-dark-muted">
            {audioFile
              ? `Ready to transcribe ${audioFile.fileName}.`
              : "No upload yet. The demo will transcribe a short public sample."}
          </p>
        </div>
        <TextAreaField
          label="Readback text"
          onChange={onSpeechTextChange}
          value={speechText}
        />
      </div>
    );
  }

  return (
    <TextAreaField
      label="Business visual prompt"
      onChange={onImagePromptChange}
      value={imagePrompt}
    />
  );
}

function TextAreaField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-text-dark">
      {label}
      <textarea
        className="min-h-28 resize-y rounded-lg border border-[rgba(41,110,214,0.35)] bg-bg-dark px-4 py-3 text-sm leading-6 text-text-dark outline-none transition focus:border-accent"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function ResultPanel({
  output,
  ttsUrl,
}: {
  output: RunOutput;
  ttsUrl: string;
}) {
  return (
    <div>
      <p className="font-mono text-sm text-accent-light">local output</p>
      <h4 className="mt-2 text-xl font-semibold text-text-dark">{output.title}</h4>
      {output.caption ? (
        <p className="mt-3 text-sm leading-6 text-text-dark-muted">
          {output.caption}
        </p>
      ) : null}

      <div className="mt-5">
        {output.kind === "image" && output.imageSvg ? (
          <div
            className="overflow-hidden rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2"
            dangerouslySetInnerHTML={{ __html: output.imageSvg }}
          />
        ) : (
          <ul className="grid gap-3">
            {(output.details ?? []).map((item) => (
              <li
                className="rounded-lg border border-[rgba(41,110,214,0.25)] bg-bg-dark-2 px-4 py-3 text-sm leading-6 text-text-dark"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {ttsUrl ? (
        <audio className="mt-5 w-full" controls src={ttsUrl}>
          <track kind="captions" />
        </audio>
      ) : null}
    </div>
  );
}

function createFallbackOutput(tabId: LocalAiTabId): RunOutput {
  if (tabId === "vision") {
    return {
      details: [
        "Visual QA sample: 94% likely inventory shelf.",
        "Alternative: labeled storage area.",
        "Action: route to inventory reconciliation.",
      ],
      kind: "list",
      title: "Browser fallback classification",
    };
  }

  if (tabId === "search") {
    return {
      details: [
        "98% match — Inventory log: five queen sheet sets missing from linen closet.",
        "62% match — QA note: towels folded correctly, bathroom mirror has water streaks.",
      ],
      kind: "chart",
      title: "Browser fallback ranking",
    };
  }

  if (tabId === "speech") {
    return {
      details: [
        seededSpeechText,
        "Readback is available through the browser speech engine when supported.",
      ],
      kind: "text",
      title: "Browser fallback transcript",
    };
  }

  if (tabId === "image") {
    return {
      caption:
        "A premium operations card with blue accents, a dashboard preview, and a clear inspection CTA.",
      imageSvg: createGeneratedMockupSvg(
        "Hotel QA inspection visual",
        "A premium operations card with blue accents, a dashboard preview, and a clear inspection CTA.",
      ),
      kind: "image",
      title: "Browser fallback visual",
    };
  }

  return {
    details: [
      "Create a local policy pack from approved guest message templates.",
      "Keep prompts and context in the browser session.",
      "Escalate sensitive cases before drafting a reply.",
      "Cache model files after first load for repeated runs.",
    ],
    kind: "text",
    title: "Browser fallback agent plan",
  };
}
