"use client";

import {
  Button,
  ChapterRail,
  CursorHalo,
  GlitchTitle,
  HeroSplitTitle,
  IndexedDivider,
  ParallaxGhost,
  SectionDivider,
  SiteFooter,
  Testimonial,
} from "@/components";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const TESTIMONIAL_BODY: string | null = null;
const TESTIMONIAL_AUTHOR = "";
const TESTIMONIAL_ROLE = "";

export default function BusinessPage() {
  return (
    <main
      className="min-h-screen bg-bg-light text-text-light"
    >
      <BusinessHero />

      {/* Chapter 02 — Process */}
      <div className="scroll-mt-28" id="process">
        <IndexedDivider index="01" label="Process design" />
        <LightSection className="py-20 sm:py-24">
          <ProcessSection />
        </LightSection>
      </div>

      {/* Chapter 03 — Communications */}
      <div className="scroll-mt-28" id="communications">
        <IndexedDivider index="02" label="Communications" />
        <LightSection className="py-20 sm:py-24">
          <CommunicationsSection />
        </LightSection>
      </div>

      {/* Chapter 04 — Team & training (bundles the testimonial frame) */}
      <div className="scroll-mt-28" id="training">
        <IndexedDivider index="03" label="Team & training" />
        <LightSection className="py-20 sm:py-24">
          <TrainingSection />
        </LightSection>
        <LightSection className="pb-20 pt-4 sm:pb-24">
          <Testimonial
            author={TESTIMONIAL_AUTHOR}
            body={TESTIMONIAL_BODY}
            className="mx-auto max-w-3xl"
            role={TESTIMONIAL_ROLE}
          />
        </LightSection>
      </div>

      {/* Chapter 05 — Finance */}
      <div className="scroll-mt-28" id="finance">
        <IndexedDivider index="04" label="Finance & admin" />
        <LightSection className="py-20 sm:py-24">
          <FinanceSection />
        </LightSection>
      </div>

      {/* Chapter 06 — Closer (footer) */}
      <div>
        <SectionDivider direction="light-to-dark" />
        <SiteFooter />
      </div>

      {/* CHAPTER RAIL — completes the cross-site nav coverage. The
          /business chapters use scroll-snap (proximity), so smooth
          scroll to id still lands cleanly. */}
      <ChapterRail
        sections={[
          { id: "process", index: "01", label: "Process" },
          { id: "communications", index: "02", label: "Comms" },
          { id: "training", index: "03", label: "Training" },
          { id: "finance", index: "04", label: "Finance" },
        ]}
      />
    </main>
  );
}

function BusinessHero() {
  return (
    <section className="relative snap-start overflow-hidden">
      <CursorHalo />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden"
      >
        <ParallaxGhost className="ghost-text select-none">OPS</ParallaxGhost>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:py-28">
        {/* TOP STRIP — centered */}
        <div className="flex flex-wrap items-center justify-center gap-3 pb-12">
          <span className="inline-flex items-center gap-3 px-4 py-1.5 backdrop-blur-md">
            <span className="relative inline-flex h-2 w-2">
              <span className="relative inline-block h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs font-medium text-accent">
              /business · for operators
            </span>
          </span>
          <span aria-hidden="true" className="h-px w-12 bg-accent/40" />
          <span className="font-mono text-[11px] text-text-light-muted">
            Chapter 01 / Hero
          </span>
        </div>

        {/* TITLE — centered, single line, welcome-style glitch */}
        <h1
          className="auto-glitch whitespace-nowrap text-center font-semibold text-text-light"
          style={{
            fontSize: "clamp(2.5rem, 10vw, 7.5rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
          }}
        >
          <span className="relative inline-block">
            <HeroSplitTitle text="I ship AI." />
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-0 right-0 h-1.5 rounded-full bg-gradient-to-r from-accent-deep via-accent to-accent-light opacity-50 blur-md"
            />
          </span>
          <span
            aria-hidden="true"
            className="hero-cursor ml-2 -translate-y-[0.1em] align-middle bg-accent"
            style={{
              display: "inline-block",
              height: "0.85em",
              width: "0.08em",
            }}
          />
        </h1>

        {/* CENTERED INTRO */}
        <p className="mx-auto mt-12 max-w-3xl text-center text-lg leading-8 text-text-light-muted sm:text-xl sm:leading-9">
          Not plans. Not decks. Real systems I built from inside the
          operations I was hired to run — and I&apos;m still the one
          running them.
        </p>

        {/* CENTERED CTA */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button arrow className="!px-8 !py-4 !text-base" href="/resume#contact">
            Let&apos;s talk
          </Button>
        </div>
      </div>
    </section>
  );
}

// Process section — six real QA checkpoints that get "ported" from the
// operations manual into the digital inspection system. The animation
// runs row-by-row as the section scrolls into view: dotted bridge
// strokes solid, the paper line gets struck-through, the digital
// checkbox pops in, the status pill lands. Reads as the actual work
// product: pages becoming data.
type ProcessItem = {
  task: string;
  note: string;
};

const PROCESS_ITEMS: ProcessItem[] = [
  { note: "fold w/ corner tucked", task: "Bathroom · towels rolled" },
  { note: "use lemon spray", task: "Kitchen · counters wiped" },
  { note: "cream stripe ok", task: "Bed linens · 90% white" },
  { note: "mop AM only", task: "Floor · vacuumed → mopped" },
  { note: "4 still + 2 sparkling", task: "Mini fridge · restocked" },
  { note: "green cloth, not the blue one", task: "Coffee table · sanitized" },
];

// Six hand-varied checkmark paths drawn around a 14×14 ballot box,
// one per item. Each has slightly different stroke length, angle,
// and reach — so the row of ticks looks human-written, not stamped.
// Most checks OVERSHOOT the box on the upper-right, mimicking the
// flick at the end of a real pen-stroke; the SVG containers have
// `overflow-visible` so those overshoots render outside the box.
// `pathLength="100"` normalizes the dasharray so the GSAP tween
// draws each check at the same pace regardless of total length.
const PAPER_CHECKS = [
  // tall, finishes well past the top-right corner
  "M 3 8 L 6.5 12 L 13.5 1",
  // longer reach, exits high
  "M 2.5 9 L 6 12.5 L 15 -1.5",
  // mid-height tick with a strong upward flick
  "M 3 8 L 7 12 L 14 0.5",
  // very long flick that crosses the box
  "M 3 8.5 L 6.5 12.5 L 15 -1",
  // wider angle, slightly compressed but still extends past edge
  "M 3.5 8 L 7 12 L 13.5 1.5",
  // double-tap hook for character
  "M 3 9.5 L 5.5 11.8 L 7 9.5 L 14.5 -0.5",
];

function ProcessSection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <GlitchTitle
        chapter="01"
        eyebrow="Process"
        meta="// 100+ pages → 1 system"
        title="Manual to system."
      />

      <div className="mt-10">
        <ProcessConversion />
      </div>

      {/* Single-column closing paragraphs centered under the stage. */}
      <div className="mx-auto mt-12 grid max-w-3xl gap-y-5">
        <p className="text-lg leading-8 text-text-light-muted">
          ThePrivateHotels ran on a 100+ page operations manual that no
          one could practically enforce. I digitized the whole manual —
          room by room, process by process — into an auditable QA
          inspection system where every standard became a measurable
          checkpoint.
        </p>
        <p className="text-lg leading-8 text-text-light-muted">
          The system is still running. Inspections that used to live in
          someone&apos;s head now live in the operating system, and the
          property rebuilt itself into the top 10% on Airbnb.{" "}
          <span className="text-text-light">
            If you&apos;re running on guesswork, I&apos;ll give you a
            system that knows.
          </span>
        </p>
      </div>
      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
        <a className="text-accent transition-colors hover:text-accent-deep" href="/atlas#architecture">
          <span className="link-underline">See the codebase</span>{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  );
}

// Single-frame cinematic loop: the paper page lives center-stage,
// gets ticked off line-by-line, then crumples and disappears as a
// phone rises in its place with the same checklist on a Atlas QA
// app screen. Holds for a beat, fades, paper resets, replays. Two
// absolute-positioned layers in a fixed-aspect stage; GSAP timeline
// orchestrates the swap.
function ProcessConversion() {
  const stageRef = useRef<HTMLDivElement>(null);
  const paperRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFrozen =
      new URLSearchParams(window.location.search).get("frozen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stage = stageRef.current;
    const paper = paperRef.current;
    const phone = phoneRef.current;
    if (!stage || !paper || !phone) return;

    const checks = paper.querySelectorAll<SVGPathElement>(
      "[data-paper-check]",
    );
    const scanChip = paper.querySelector<HTMLElement>("[data-scan-chip]");
    const scanPct = paper.querySelector<HTMLElement>("[data-scan-pct]");
    const phoneRows = phone.querySelectorAll<HTMLElement>("[data-phone-row]");
    const phoneStatus = phone.querySelector<HTMLElement>("[data-phone-status]");

    if (isFrozen) {
      // Screenshot / reduced-motion frame: paper visible at rest
      // with all ticks drawn, phone hidden, scanner not running.
      // The "manual being checked" state reads best as a static
      // single frame for OG previews / shared links.
      checks.forEach((el) => {
        el.style.strokeDashoffset = "0";
      });
      paper.style.setProperty("--scan-progress", "0");
      if (scanChip) scanChip.style.opacity = "0";
      phone.style.opacity = "0";
      return;
    }

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 });

    // ─── BEAT 1: tick boxes on paper, fast (≈1.4 s total) ─────────
    checks.forEach((el, i) => {
      tl.fromTo(
        el,
        { strokeDashoffset: 100 },
        { duration: 0.28, ease: "power2.out", strokeDashoffset: 0 },
        i * 0.18,
      );
    });

    // brief "appreciate the completed checklist" hold
    tl.to({}, { duration: 0.4 });

    // ─── BEAT 2A: scanner activates (≈0.18 s) ─────────────────────
    // Mono "— scanning · 0%" chip fades into the top-right corner of
    // the paper. The scanner bar (already mounted, opacity 0) fades
    // in alongside it. Brief equipment-power-on beat before the
    // sweep itself starts.
    if (scanChip) {
      tl.to(scanChip, { duration: 0.18, ease: "power2.out", opacity: 1 });
    }

    // ─── BEAT 2B: SCANNER SWEEP (≈0.9 s) ──────────────────────────
    // Drive a single CSS variable `--scan-progress` from 0 → 1 on
    // the paper element. The scanner bar's left position, the
    // digital-tint clip-path, and the chip fill-bar all read from
    // this variable, so they advance in perfect lockstep — no risk
    // of desync. A parallel tween counts an integer 0 → 100 and
    // writes it into the chip's <span> via onUpdate so the
    // percentage label tracks the bar in real time.
    const counter = { value: 0 };
    tl.fromTo(
      paper,
      { "--scan-progress": 0 } as gsap.TweenVars,
      {
        duration: 0.9,
        ease: "none",
        "--scan-progress": 1,
      } as gsap.TweenVars,
    );
    tl.fromTo(
      counter,
      { value: 0 },
      {
        duration: 0.9,
        ease: "none",
        value: 100,
        onUpdate: () => {
          if (scanPct) {
            scanPct.textContent = String(Math.round(counter.value));
          }
        },
      },
      "<",
    );

    // ─── BEAT 2C: paper out + phone in (overlaps the end of sweep)
    // Paper fades out while the bar finishes its travel; phone
    // rises from below with a back.out spring. The overlap means
    // there's no dead frame between "scanned page" and "live phone".
    tl.to(
      paper,
      {
        duration: 0.6,
        ease: "power2.in",
        opacity: 0,
      },
      "-=0.25",
    );
    tl.fromTo(
      phone,
      { opacity: 0, scale: 0.5, y: 60 },
      {
        duration: 0.75,
        ease: "back.out(1.5)",
        opacity: 1,
        scale: 1,
        y: 0,
      },
      "-=0.55",
    );

    // ─── BEAT 4: items stagger onto the phone (≈0.85 s) ───────────
    tl.fromTo(
      phoneRows,
      { opacity: 0, y: 10 },
      {
        duration: 0.36,
        ease: "power2.out",
        opacity: 1,
        stagger: 0.08,
        y: 0,
      },
      "-=0.35",
    );
    if (phoneStatus) {
      tl.fromTo(
        phoneStatus,
        { opacity: 0, scale: 0.85 },
        { duration: 0.4, ease: "back.out(2)", opacity: 1, scale: 1 },
        "-=0.2",
      );
    }

    // hold the phone state
    tl.to({}, { duration: 1.6 });

    // ─── BEAT 5: crossfade — phone out + paper back in, parallel ─
    // Snap the paper back to its rest transforms (still opacity 0
    // from the scanner exit — the snap is invisible). Reset
    // --scan-progress to 0 so the bar / tint / chip fill all reset.
    // Hide the chip + zero out the counter text. Then the phone
    // fade-out + paper fade-in run on the same beat so neither
    // moment is empty.
    tl.set(paper, {
      filter: "brightness(1) saturate(1) sepia(0) blur(0px)",
      rotation: -0.6,
      scale: 1,
      skewX: 0,
      skewY: 0,
      x: 0,
      y: 0,
      "--scan-progress": 0,
    } as gsap.TweenVars);
    if (scanChip) tl.set(scanChip, { opacity: 0 }, "<");
    tl.call(
      () => {
        if (scanPct) scanPct.textContent = "0";
        counter.value = 0;
      },
      undefined,
      "<",
    );
    tl.to(
      phone,
      {
        duration: 0.6,
        ease: "power2.inOut",
        opacity: 0,
        scale: 0.94,
        y: -16,
      },
      "<",
    );
    tl.to(
      paper,
      { duration: 0.6, ease: "power2.inOut", opacity: 1 },
      "<",
    );
    // Now that phone is offscreen, reset all the phone-side state
    // for the next loop.
    tl.set(phone, { y: 60, scale: 0.5 });
    tl.set(phoneStatus, { opacity: 0, scale: 0.85 });
    tl.set(phoneRows, { opacity: 0, y: 10 });
    tl.set(checks, { strokeDashoffset: 100 });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tl.play();
          } else {
            tl.pause();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div
      className="relative mx-auto"
      ref={stageRef}
      style={{ height: "560px", maxWidth: "820px" }}
    >
      {/* PAPER LAYER — landscape binder page with a Zone header strip
          and 3-column row layout (checkbox | task | margin notes).
          Hole punches now sit along the LEFT edge of the landscape
          page; coffee ring + approved stamp moved to bottom-right
          corner. */}
      <article
        className="paper-card paper-fiber absolute inset-x-0 top-0 mx-auto pl-14 pr-6 py-6 sm:pl-16"
        ref={paperRef}
        style={{
          // Cream-leaning white — much closer to paper-stock white,
          // just a hint of warmth so it doesn't read as a UI panel.
          background:
            "linear-gradient(180deg, #fcfaf2 0%, #f5f0df 100%)",
          border: "1px solid #d8cdb1",
          borderRadius: "2px",
          boxShadow:
            "0 1px 0 #ffffff inset, 0 26px 48px -30px rgba(122,90,48,0.32), 0 2px 0 -1px rgba(122,90,48,0.14)",
          maxWidth: "780px",
          transform: "rotate(-0.6deg)",
          transformOrigin: "50% 50%",
        }}
      >
        {/* 3-hole punch — vertically distributed along the left edge */}
        {[20, "50%", "calc(100% - 32px)"].map((top, i) => (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 h-3 w-3 rounded-full"
            key={i}
            style={{
              background: "rgba(58,42,26,0.18)",
              boxShadow:
                "inset 0 1px 1px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.4)",
              top: typeof top === "number" ? `${top}px` : top,
              transform: top === "50%" ? "translateY(-50%)" : undefined,
            }}
          />
        ))}

        {/* SCANNER DIGITAL-TINT OVERLAY — reveals from left → right
            via clip-path tied to --scan-progress. Inside the swept
            region the paper takes on an accent-blue tint + a fine
            12-px dot grid, so the half that's been "scanned" reads
            as digital data and the half that hasn't reads as paper.
            mix-blend-mode: multiply keeps the paper texture / text
            visible underneath, just colored. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            backgroundImage: [
              "linear-gradient(180deg, rgba(41,110,214,0.22), rgba(41,110,214,0.14))",
              "radial-gradient(rgba(41,110,214,0.55) 1px, transparent 1px)",
              "linear-gradient(to right, rgba(41,110,214,0.18) 1px, transparent 1px)",
              "linear-gradient(to bottom, rgba(41,110,214,0.18) 1px, transparent 1px)",
            ].join(","),
            backgroundSize:
              "100% 100%, 12px 12px, 24px 24px, 24px 24px",
            borderRadius: "inherit",
            clipPath:
              "inset(0 calc(100% - var(--scan-progress, 0) * 100%) 0 0)",
            mixBlendMode: "multiply",
          }}
        />

        {/* SCANNER BAR — the bright accent-blue line sweeping the
            page. Its `left` is driven by --scan-progress so it stays
            glued to the right edge of the digital-tint reveal. The
            sharp leading edge is the inner span; the trailing glow
            extends to the left via a fade gradient. Crosshair "+"
            registration ticks sit just outside the paper top + bottom
            so they read as scanner equipment, not page decoration. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-[3]"
          style={{
            left: "calc(var(--scan-progress, 0) * 100%)",
            width: "0px",
          }}
        >
          {/* Trailing glow extending to the left */}
          <span
            className="absolute inset-y-0"
            style={{
              right: "0",
              width: "120px",
              background:
                "linear-gradient(to left, rgba(91,155,244,0.4) 0%, rgba(91,155,244,0.08) 55%, transparent 100%)",
              transform: "translateZ(0)",
            }}
          />
          {/* Sharp leading edge — the bright line itself */}
          <span
            className="absolute inset-y-0"
            style={{
              right: "-1px",
              width: "2px",
              background: "#5b9bf4",
              boxShadow:
                "0 0 7px 0 rgba(91,155,244,0.75), 0 0 18px 4px rgba(91,155,244,0.4)",
            }}
          />
          {/* Top crosshair tick */}
          <span
            className="absolute font-mono text-accent"
            style={{
              top: "-14px",
              left: "0",
              transform: "translateX(-50%)",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            +
          </span>
          {/* Bottom crosshair tick */}
          <span
            className="absolute font-mono text-accent"
            style={{
              bottom: "-14px",
              left: "0",
              transform: "translateX(-50%)",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            +
          </span>
        </span>

        {/* SCAN PROGRESS CHIP — small mono pill at the top-right of
            the paper. Counter text is GSAP-driven (onUpdate writes
            the integer percent); the background fill bar grows from
            left, scaleX tied to --scan-progress. Lowercase mono with
            em-dash prefix — no caps tracking. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 z-[4] inline-flex items-center overflow-hidden rounded-[3px] border border-accent/50 px-2.5 py-1 font-mono text-[10px] text-accent"
          data-scan-chip
          style={{
            background: "rgba(252, 250, 242, 0.94)",
            opacity: 0,
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-accent/20"
            style={{
              transform: "scaleX(var(--scan-progress, 0))",
              transformOrigin: "left",
            }}
          />
          <span className="relative whitespace-nowrap">
            — scanning · <span data-scan-pct>0</span>%
          </span>
        </span>

        {/* BINDER HEADER — printed top strip with org + revision */}
        <header className="border-b border-[#b8a16a] pb-3">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-[#7a5a30]/80">
            ThePrivateHotels · Standard Operating Procedure
          </p>
          <div className="mt-1 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[#5a3f1f]">
            <span className="font-semibold">QA · Housekeeping</span>
            <span className="text-[#7a5a30]/90">
              Rev. 03 · Mar 14 2024 · Pg 47/113
            </span>
          </div>
        </header>

        {/* ZONE STRIP — the room/area this page covers, in bold
            handwriting. Sits between the binder header and the
            checklist rows. */}
        <div className="mt-4 flex items-baseline justify-between gap-4 border-b border-[#c9b88a]/70 pb-3">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#7a5a30]">
              Zone
            </span>
            <span className="font-handwritten text-[22px] font-bold leading-none text-[#3a2a1a]">
              Guestroom 12 · Floor 4
            </span>
            <span className="font-handwritten text-[18px] leading-none text-[#7a5a30]">
              § 4.7 Turndown
            </span>
          </div>
          <span className="font-handwritten text-[15px] leading-none text-[#7a5a30]">
            Mar 14 · 9:40 pm
          </span>
        </div>

        {/* COLUMN HEADERS */}
        <div className="mt-3 grid grid-cols-[36px_1fr_220px] gap-x-4 font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#7a5a30]/80">
          <span>✓</span>
          <span>Task</span>
          <span>Notes</span>
        </div>

        {/* CHECKLIST ROWS — checkbox · task · margin note */}
        <ol className="mt-2 divide-y divide-[#c9b88a]/40">
          {PROCESS_ITEMS.map((item, i) => (
            <li
              className="grid grid-cols-[36px_1fr_220px] items-baseline gap-x-4 py-2.5"
              key={item.task}
            >
              {/* checkbox column */}
              <span
                aria-hidden="true"
                className="inline-flex items-center justify-center"
                style={{ width: "20px", height: "20px" }}
              >
                <svg
                  className="block overflow-visible"
                  height="20"
                  viewBox="0 0 14 14"
                  width="20"
                >
                  <rect
                    fill="none"
                    height="11"
                    rx="0.5"
                    stroke="#7a5a30"
                    strokeWidth="1"
                    width="11"
                    x="1.5"
                    y="1.5"
                  />
                  <path
                    d={PAPER_CHECKS[i % PAPER_CHECKS.length]}
                    data-paper-check
                    fill="none"
                    pathLength="100"
                    stroke="#3a2a1a"
                    strokeDasharray="100"
                    strokeDashoffset="100"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.6"
                  />
                </svg>
              </span>
              {/* task column */}
              <span className="font-handwritten text-[18px] leading-tight text-[#3a2a1a]">
                <span className="mr-2 text-[#7a5a30]">
                  4.7.{i + 1}
                </span>
                {item.task}
              </span>
              {/* notes column — handwritten in red pencil, slight
                  per-row rotation so the marginalia look unforced */}
              <span
                className="font-handwritten text-[15px] italic leading-tight"
                style={{
                  color: "#a83232",
                  display: "inline-block",
                  transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.4)}deg)`,
                  textShadow: "0 0 1px rgba(168,50,50,0.15)",
                }}
              >
                {item.note}
              </span>
            </li>
          ))}
        </ol>

        {/* COFFEE RING — moved to bottom-right of the landscape sheet */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-2 right-32 h-14 w-14 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 38%, rgba(101,67,33,0.22) 45%, rgba(101,67,33,0.32) 52%, transparent 60%)",
            transform: "rotate(28deg) scale(1, 0.9)",
          }}
        />

        {/* APPROVED STAMP — bottom-right corner */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-4 select-none border-2 px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-[0.18em]"
          style={{
            borderColor: "rgba(168,50,50,0.55)",
            color: "rgba(168,50,50,0.7)",
            transform: "rotate(-7deg)",
            textShadow: "0 0 1px rgba(168,50,50,0.3)",
          }}
        >
          Approved
        </span>

        {/* SIGN-OFF — bottom-left handwritten signature line */}
        <span
          aria-hidden="true"
          className="font-handwritten pointer-events-none absolute bottom-3 left-16 -rotate-2 text-[17px] leading-tight"
          style={{
            color: "#a83232",
            textShadow: "0 0 1px rgba(168,50,50,0.2)",
          }}
        >
          —Pierre
        </span>
      </article>

      {/* PHONE LAYER — fully-detailed Atlas QA app on a smartphone:
          black bezel, dynamic-island notch, status bar, app bar, the
          same checklist already complete, home indicator. Centered
          in the stage; sized so the bezel + screen feel real, not
          schematic. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        ref={phoneRef}
        style={{ opacity: 0 }}
      >
        <PhoneFrame />
      </div>
    </div>
  );
}

function PhoneFrame() {
  return (
    <div
      className="phone-bezel relative"
      style={{
        width: "264px",
        height: "560px",
        background: "#0a0e1a",
        borderRadius: "38px",
        boxShadow:
          "0 30px 60px -24px rgba(15,23,42,0.55), 0 2px 0 rgba(255,255,255,0.04) inset, 0 -2px 0 rgba(255,255,255,0.04) inset",
        padding: "10px",
      }}
    >
      {/* SIDE BUTTONS — subtle slate ridges on the metal frame */}
      <span
        aria-hidden="true"
        className="absolute left-[-2px] top-[110px] h-9 w-[3px] rounded-l-[2px] bg-[#15192a]"
      />
      <span
        aria-hidden="true"
        className="absolute left-[-2px] top-[170px] h-16 w-[3px] rounded-l-[2px] bg-[#15192a]"
      />
      <span
        aria-hidden="true"
        className="absolute right-[-2px] top-[150px] h-20 w-[3px] rounded-r-[2px] bg-[#15192a]"
      />

      {/* SCREEN — rounded inner display */}
      <div
        className="phone-screen relative h-full w-full overflow-hidden bg-white"
        style={{ borderRadius: "28px" }}
      >
        {/* DYNAMIC ISLAND — top-center pill, sits over the screen */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 -translate-x-1/2"
          style={{
            background: "#0a0e1a",
            borderRadius: "999px",
            height: "20px",
            width: "82px",
          }}
        >
          {/* tiny camera dot */}
          <span
            aria-hidden="true"
            className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
            style={{ background: "#1e2a4a" }}
          />
        </span>

        {/* STATUS BAR — time + signal + battery, padded around the island */}
        <div className="relative flex items-center justify-between px-5 pt-2 font-mono text-[10.5px] font-semibold text-text-light">
          <span className="tabular-nums">9:41</span>
          <span className="flex items-center gap-1.5">
            {/* signal bars */}
            <svg height="9" viewBox="0 0 14 9" width="14">
              <rect fill="currentColor" height="2" rx="0.4" width="2" x="0" y="7" />
              <rect fill="currentColor" height="4" rx="0.4" width="2" x="4" y="5" />
              <rect fill="currentColor" height="6" rx="0.4" width="2" x="8" y="3" />
              <rect fill="currentColor" height="8" rx="0.4" width="2" x="12" y="1" />
            </svg>
            <span className="text-[8.5px] tracking-[0.06em]">5G</span>
            {/* battery */}
            <svg height="9" viewBox="0 0 22 9" width="22">
              <rect
                fill="none"
                height="8"
                rx="1.2"
                stroke="currentColor"
                strokeWidth="0.7"
                width="18"
                x="0.5"
                y="0.5"
              />
              <rect fill="currentColor" height="3" rx="0.4" width="1.2" x="19" y="3" />
              <rect fill="currentColor" height="6" rx="0.6" width="14" x="2" y="1.5" />
            </svg>
          </span>
        </div>

        {/* APP BAR — back chevron + app title + menu dots */}
        <div className="mt-6 flex items-center justify-between border-b border-border-light px-5 pb-3">
          <button
            aria-label="Back"
            className="-ml-1 text-accent"
            type="button"
          >
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path
                d="M10 4 L5 8 L10 12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </svg>
          </button>
          <span className="font-mono text-[11px] font-semibold text-text-light">
            Atlas QA
          </span>
          <span
            aria-hidden="true"
            className="flex items-center gap-0.5 text-text-light-muted"
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
            <span className="h-1 w-1 rounded-full bg-current" />
          </span>
        </div>

        {/* ROOM HEADER */}
        <div className="px-5 pt-4">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-text-light-muted">
            Room 12 · Floor 4 · Today
          </p>
          <div className="mt-1 flex items-baseline justify-between">
            <h3 className="text-[18px] font-bold tracking-tight text-text-light">
              Turndown · Daily
            </h3>
            <span
              className="rounded-full bg-result-green/10 px-2 py-0.5 font-mono text-[9.5px] font-semibold tracking-[0.12em] text-result-green"
              data-phone-status
              style={{ opacity: 0 }}
            >
              6/6 · OK
            </span>
          </div>
        </div>

        {/* CHECKLIST ITEMS — each starts hidden, fades up staggered */}
        <ol className="px-5 pt-4">
          {PROCESS_ITEMS.map((item, i) => (
            <li
              className="flex items-start gap-3 border-b border-border-light/70 py-2.5 last:border-b-0"
              data-phone-row
              key={item.task}
              style={{ opacity: 0 }}
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-result-green bg-result-green/10 text-[9px] font-bold text-result-green"
              >
                ✓
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium leading-tight text-text-light">
                  {item.task}
                </p>
                <p className="mt-0.5 font-mono text-[9px] tracking-[0.06em] text-text-light-muted">
                  4.7.{i + 1} · pierre · 9:4{i}
                </p>
              </div>
              <span className="font-mono text-[9px] text-result-green">OK</span>
            </li>
          ))}
        </ol>

        {/* HOME INDICATOR — thin pill at the bottom */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 h-[3px] w-[100px] -translate-x-1/2 rounded-full"
          style={{ background: "#0a0e1a" }}
        />
      </div>
    </div>
  );
}

// Single phone screen showing the same guest message in two states:
// (1) the slow inbox where the timer accelerates up to 47 hr 51 min;
// (2) post-Atlas, where the AI drafts a reply live and a human taps
// approve. The loop's hero beat is the transition between them —
// an accent-blue sweep across the screen that swaps the lower half
// of the UI from "waiting on reply" to "atlas drafted, ready to send".
const COMMS_GUEST_MESSAGE =
  "Hi! What time is check-in? Also is there parking?";
const COMMS_AI_DRAFT =
  "Hi Maria — check-in is 3 pm. We can hold bags from 11 am if you'd like to drop them early. Parking is free in the underground garage (entrance on Elm St).";

function CommunicationsSection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <GlitchTitle
        chapter="02"
        eyebrow="Communications"
        meta="// 48 hrs → 2 min"
        title="Replies in your voice, in minutes."
      />

      <div className="mt-10">
        <CommsConversion />
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-y-5">
        <p className="text-lg leading-8 text-text-light-muted">
          ThePrivateHotels was losing guests to inbox lag. Messages
          sat unread for two days because the team was drafting
          replies by hand — 15-20 minutes per message, and only
          after we noticed the notification.
        </p>
        <p className="text-lg leading-8 text-text-light-muted">
          I built a chatbot trained on the brand voice plus every
          approved scenario. It drafts inside our operating system;
          a human reviews and approves before send.{" "}
          <span className="text-text-light">
            Same voice. Same approval bar. Reply time went from 48
            hours to under 3 minutes.
          </span>
        </p>
      </div>
      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
        <a className="text-accent transition-colors hover:text-accent-deep" href="/atlas#architecture">
          <span className="link-underline">See the codebase</span>{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  );
}

function CommsConversion() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFrozen =
      new URLSearchParams(window.location.search).get("frozen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stage = stageRef.current;
    if (!stage) return;

    const timerEl = stage.querySelector<HTMLElement>("[data-comms-timer]");
    const delayedBadge = stage.querySelector<HTMLElement>(
      "[data-comms-delayed]",
    );
    const slowState = stage.querySelector<HTMLElement>("[data-comms-slow]");
    const fastState = stage.querySelector<HTMLElement>("[data-comms-fast]");
    const atlasChip = stage.querySelector<HTMLElement>("[data-comms-atlas]");
    const draftEl = stage.querySelector<HTMLElement>("[data-comms-draft]");
    const approveBtn = stage.querySelector<HTMLElement>(
      "[data-comms-approve]",
    );
    const sweep = stage.querySelector<HTMLElement>("[data-comms-sweep]");
    const sent = stage.querySelector<HTMLElement>("[data-comms-sent]");
    if (!timerEl || !slowState || !fastState) return;

    const fmtTimer = (m: number) => {
      const r = Math.round(m);
      if (r < 60) return `${r} min`;
      const h = Math.floor(r / 60);
      const mins = r % 60;
      return `${h}h ${mins.toString().padStart(2, "0")}m`;
    };

    if (isFrozen) {
      // Frozen-state frame: the SLOW inbox just after the delay
      // badge appears (most informative single frame — guest
      // message + bad timer + delayed pill all visible).
      timerEl.textContent = "47h 51m";
      if (delayedBadge) delayedBadge.style.opacity = "1";
      fastState.style.visibility = "hidden";
      fastState.style.opacity = "0";
      if (sweep) sweep.style.opacity = "0";
      return;
    }

    // Initial states
    if (atlasChip) atlasChip.style.opacity = "0";
    if (delayedBadge) delayedBadge.style.opacity = "0";
    if (draftEl) draftEl.textContent = "";
    fastState.style.visibility = "hidden";
    fastState.style.opacity = "0";
    if (sweep) sweep.style.opacity = "0";
    if (sent) sent.style.opacity = "0";

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.0 });

    // ─── PHASE A: timer accelerates (≈2.6 s) ──────────────────────
    // power3.in eases the rate UP non-linearly so the clock starts
    // slow ("4 min") and ends fast ("47 hr 51 min") — reads as
    // "the wait piled on while we weren't watching."
    const timer = { mins: 0 };
    tl.fromTo(
      timer,
      { mins: 0 },
      {
        duration: 2.6,
        ease: "power3.in",
        mins: 2871,
        onUpdate: () => {
          timerEl.textContent = fmtTimer(timer.mins);
        },
      },
    );
    // Delayed badge fades in once we're well past 24 hr
    if (delayedBadge) {
      tl.fromTo(
        delayedBadge,
        { opacity: 0, scale: 0.85 },
        { duration: 0.4, ease: "back.out(2)", opacity: 1, scale: 1 },
        "-=0.7",
      );
    }
    // Hold so the reader registers "this is bad"
    tl.to({}, { duration: 0.5 });

    // ─── PHASE B: Atlas takeover sweep (≈0.85 s) ─────────────────
    // Vertical sweep from top to bottom — accent-blue bar with a
    // soft glow. As the bar passes the lower half, swap slow-state
    // for fast-state (visibility flip happens once the bar covers
    // the area being changed).
    if (sweep) {
      tl.set(sweep, { opacity: 1 });
      tl.fromTo(
        sweep,
        { "--comms-sweep": 0 } as gsap.TweenVars,
        {
          duration: 0.85,
          ease: "power2.inOut",
          "--comms-sweep": 1,
        } as gsap.TweenVars,
      );
    }
    // Mid-sweep: hide slow state, show fast state. The sweep masks
    // the swap visually.
    tl.set(slowState, { visibility: "hidden", opacity: 0 }, "-=0.5");
    tl.set(fastState, { visibility: "visible", opacity: 0 }, "<");
    tl.to(
      fastState,
      { duration: 0.4, ease: "power2.out", opacity: 1 },
      "<",
    );
    if (atlasChip) {
      tl.fromTo(
        atlasChip,
        { opacity: 0, scale: 0.85 },
        { duration: 0.35, ease: "back.out(2)", opacity: 1, scale: 1 },
        "<",
      );
    }
    // Fade sweep out as it exits
    if (sweep) {
      tl.to(
        sweep,
        { duration: 0.2, ease: "power2.in", opacity: 0 },
        "-=0.15",
      );
    }

    // ─── PHASE C: AI types the draft live (≈2.4 s) ────────────────
    const chars = { count: 0 };
    if (draftEl) {
      tl.fromTo(
        chars,
        { count: 0 },
        {
          duration: 2.4,
          ease: "none",
          count: COMMS_AI_DRAFT.length,
          onUpdate: () => {
            draftEl.textContent = COMMS_AI_DRAFT.slice(
              0,
              Math.round(chars.count),
            );
          },
        },
        "+=0.1",
      );
    }

    // Approve button: flash green when AI finishes
    if (approveBtn) {
      tl.to(approveBtn, {
        duration: 0.35,
        ease: "power2.out",
        background: "rgb(16, 185, 129)",
        borderColor: "rgb(16, 185, 129)",
        color: "#ffffff",
      });
    }
    // Sent confirmation appears
    if (sent) {
      tl.fromTo(
        sent,
        { opacity: 0, y: 4 },
        { duration: 0.35, ease: "power2.out", opacity: 1, y: 0 },
        "-=0.15",
      );
    }

    // Hold the "sent" beat
    tl.to({}, { duration: 1.4 });

    // ─── RESET for next loop ──────────────────────────────────────
    tl.to(
      [slowState, fastState, atlasChip, delayedBadge, sent],
      { duration: 0.5, ease: "power2.inOut", opacity: 0 },
    );
    tl.call(() => {
      timer.mins = 0;
      chars.count = 0;
      timerEl.textContent = "0 min";
      if (draftEl) draftEl.textContent = "";
      if (approveBtn) {
        approveBtn.style.background = "transparent";
        approveBtn.style.borderColor = "";
        approveBtn.style.color = "";
      }
    });
    tl.set(slowState, { visibility: "visible", opacity: 1 });
    tl.set(fastState, { visibility: "hidden", opacity: 0 });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tl.play();
          } else {
            tl.pause();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div
      className="relative mx-auto"
      ref={stageRef}
      style={{ height: "620px", maxWidth: "560px" }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <InboxPhoneFrame />
      </div>
    </div>
  );
}

// Inbox-app variant of the phone frame. Shares chrome (bezel, notch,
// status bar) with the Process PhoneFrame; differs in the app
// content — guest-message thread on top, dynamic lower half that
// swaps between "waiting on reply" (slow) and "atlas drafted"
// (fast). The Atlas sweep is a fixed-position overlay covering the
// whole screen during the transition.
function InboxPhoneFrame() {
  return (
    <div
      className="phone-bezel relative"
      style={{
        background: "#0a0e1a",
        borderRadius: "40px",
        boxShadow:
          "0 30px 60px -24px rgba(15,23,42,0.55), 0 2px 0 rgba(255,255,255,0.04) inset, 0 -2px 0 rgba(255,255,255,0.04) inset",
        height: "584px",
        padding: "10px",
        width: "278px",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-[-2px] top-[110px] h-9 w-[3px] rounded-l-[2px] bg-[#15192a]"
      />
      <span
        aria-hidden="true"
        className="absolute left-[-2px] top-[170px] h-16 w-[3px] rounded-l-[2px] bg-[#15192a]"
      />
      <span
        aria-hidden="true"
        className="absolute right-[-2px] top-[150px] h-20 w-[3px] rounded-r-[2px] bg-[#15192a]"
      />

      <div
        className="phone-screen relative h-full w-full overflow-hidden bg-white"
        style={{ borderRadius: "30px" }}
      >
        {/* Dynamic island */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 -translate-x-1/2"
          style={{
            background: "#0a0e1a",
            borderRadius: "999px",
            height: "20px",
            width: "82px",
          }}
        >
          <span
            aria-hidden="true"
            className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full"
            style={{ background: "#1e2a4a" }}
          />
        </span>

        {/* Status bar */}
        <div className="relative flex items-center justify-between px-5 pt-2 font-mono text-[10.5px] font-semibold text-text-light">
          <span className="tabular-nums">10:42</span>
          <span className="flex items-center gap-1.5">
            <svg height="9" viewBox="0 0 14 9" width="14">
              <rect fill="currentColor" height="2" rx="0.4" width="2" x="0" y="7" />
              <rect fill="currentColor" height="4" rx="0.4" width="2" x="4" y="5" />
              <rect fill="currentColor" height="6" rx="0.4" width="2" x="8" y="3" />
              <rect fill="currentColor" height="8" rx="0.4" width="2" x="12" y="1" />
            </svg>
            <span className="text-[8.5px] tracking-[0.06em]">5G</span>
            <svg height="9" viewBox="0 0 22 9" width="22">
              <rect fill="none" height="8" rx="1.2" stroke="currentColor" strokeWidth="0.7" width="18" x="0.5" y="0.5" />
              <rect fill="currentColor" height="3" rx="0.4" width="1.2" x="19" y="3" />
              <rect fill="currentColor" height="6" rx="0.6" width="14" x="2" y="1.5" />
            </svg>
          </span>
        </div>

        {/* App bar */}
        <div className="mt-6 flex items-center justify-between border-b border-border-light px-5 pb-3">
          <button
            aria-label="Back"
            className="-ml-1 text-accent"
            type="button"
          >
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path d="M10 4 L5 8 L10 12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" />
            </svg>
          </button>
          <span className="font-mono text-[11px] font-semibold text-text-light">
            Atlas Ops · Inbox
          </span>
          <span
            aria-hidden="true"
            data-comms-atlas
            className="rounded-[3px] border border-accent/45 px-1.5 py-0.5 font-mono text-[8.5px] text-accent"
            style={{ background: "rgba(41,110,214,0.08)", opacity: 0 }}
          >
            — atlas
          </span>
        </div>

        {/* Conversation header */}
        <div className="flex items-center gap-3 border-b border-border-light px-5 py-3">
          <span
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 font-mono text-[11px] font-bold text-accent"
          >
            M
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text-light">
              Maria · Room 14
            </p>
            <p className="font-mono text-[9.5px] text-text-light-muted">
              check-in question · arrived 10:42 am
            </p>
          </div>
        </div>

        {/* Guest message — shared across both states */}
        <div className="px-5 pt-4">
          <div
            className="inline-block max-w-[80%] rounded-[12px] rounded-bl-[3px] px-3 py-2 text-[12.5px] leading-snug text-text-light"
            style={{ background: "rgb(241, 245, 249)" }}
          >
            {COMMS_GUEST_MESSAGE}
          </div>
          <p className="mt-1 ml-1 font-mono text-[9px] text-text-light-muted">
            10:42 am
          </p>
        </div>

        {/* DYNAMIC LOWER HALF — two states layered, only one visible
            at a time. Slow state is the initial render. */}

        {/* PHASE A: slow inbox — waiting timer */}
        <div
          className="absolute inset-x-0 px-5 pt-5"
          data-comms-slow
          style={{ top: "295px" }}
        >
          <p className="font-mono text-[9.5px] text-text-light-muted">
            — awaiting reply
          </p>
          <p
            className="mt-1 font-mono font-bold tabular-nums text-problem-red"
            data-comms-timer
            style={{
              fontSize: "30px",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            0 min
          </p>
          <span
            className="mt-3 inline-flex items-center gap-1.5 rounded-[3px] px-2 py-0.5 font-mono text-[9.5px] text-problem-red"
            data-comms-delayed
            style={{
              background: "rgba(239, 68, 68, 0.12)",
              opacity: 0,
            }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-problem-red"
            />
            — delayed · sla breached
          </span>

          {/* Empty composer at bottom of the slow state */}
          <div className="mt-7 rounded-[10px] border border-border-light bg-bg-light-2 px-3 py-2.5">
            <p className="font-mono text-[9.5px] text-text-light-muted/70">
              draft a reply…
            </p>
          </div>
        </div>

        {/* PHASE C: fast inbox — atlas drafted, ready to approve */}
        <div
          className="absolute inset-x-0 px-5 pt-5"
          data-comms-fast
          style={{ top: "295px", visibility: "hidden", opacity: 0 }}
        >
          <div
            className="rounded-[10px] border px-3 py-2.5"
            style={{
              background: "rgba(41,110,214,0.05)",
              borderColor: "rgba(41,110,214,0.4)",
            }}
          >
            <p className="font-mono text-[9px] text-accent">
              — atlas · drafting reply
            </p>
            <p
              className="mt-1.5 text-[12px] leading-snug text-text-light"
              style={{ minHeight: "60px" }}
            >
              <span data-comms-draft />
              <span
                aria-hidden="true"
                className="inline-block align-text-bottom"
                style={{
                  animation: "comms-caret 0.7s steps(1) infinite",
                  background: "currentColor",
                  height: "12px",
                  marginLeft: "1.5px",
                  width: "1.5px",
                }}
              />
            </p>
          </div>

          <button
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[8px] border px-3 py-2 font-mono text-[10.5px]"
            data-comms-approve
            style={{
              background: "transparent",
              borderColor: "rgba(41,110,214,0.55)",
              color: "rgb(41,110,214)",
              transition: "none",
            }}
            type="button"
          >
            ✓ approve · pierre
          </button>

          <p
            className="mt-3 text-center font-mono text-[9.5px] text-result-green"
            data-comms-sent
            style={{ opacity: 0 }}
          >
            — sent · 2 min reply time
          </p>
        </div>

        {/* ATLAS SWEEP OVERLAY — full-screen accent-blue bar that
            travels top → bottom during the transition. The bar's
            position is driven by --comms-sweep (0 → 1) on this
            element. Sits at z-20 so it covers all content during
            the swap. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          data-comms-sweep
          style={{
            background: [
              "linear-gradient(180deg, transparent calc(var(--comms-sweep, 0) * 110% - 90px), rgba(91, 155, 244, 0.0) calc(var(--comms-sweep, 0) * 110% - 90px), rgba(91, 155, 244, 0.5) calc(var(--comms-sweep, 0) * 110% - 4px), #5b9bf4 calc(var(--comms-sweep, 0) * 110%), transparent calc(var(--comms-sweep, 0) * 110% + 4px))",
            ].join(","),
            borderRadius: "inherit",
            opacity: 0,
          }}
        />

        {/* Home indicator */}
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-1/2 h-[3px] w-[100px] -translate-x-1/2 rounded-full"
          style={{ background: "#0a0e1a" }}
        />
      </div>
    </div>
  );
}

// 6 housekeepers Pierre trained. Each runs same-day turnovers
// across the Airbnb properties and POSTS the work into the PMS
// after they finish. The PMS becomes the system of record — Pierre
// reads it instead of being on-site.
type StaffMember = {
  initial: string;
  name: string;
};
const STAFF: StaffMember[] = [
  { initial: "M", name: "Maria" },
  { initial: "J", name: "Jamie" },
  { initial: "S", name: "Sam" },
  { initial: "R", name: "Ravi" },
  { initial: "T", name: "Talia" },
  { initial: "K", name: "Kai" },
];

// PMS activity feed — this week's posts. Each entry is one
// housekeeper logging the work from a turnover. 3 turnovers across
// the week, each with two posts ("cleaning complete" + "supplies
// restocked") so the team's collaboration shows up.
type PmsPost = {
  action: string;
  property: string;
  staffIdx: number;
  time: string;
};
const PMS_POSTS: PmsPost[] = [
  {
    action: "cleaning complete",
    property: "412 Oak St",
    staffIdx: 0,
    time: "Tue · 10:15 am",
  },
  {
    action: "supplies restocked · photos uploaded",
    property: "412 Oak St",
    staffIdx: 1,
    time: "Tue · 11:30 am",
  },
  {
    action: "cleaning complete",
    property: "88 Pine St",
    staffIdx: 2,
    time: "Thu · 9:20 am",
  },
  {
    action: "supplies restocked · photos uploaded",
    property: "88 Pine St",
    staffIdx: 3,
    time: "Thu · 10:45 am",
  },
  {
    action: "cleaning complete",
    property: "12 Beach Rd",
    staffIdx: 4,
    time: "Sat · 11:05 am",
  },
  {
    action: "supplies restocked · photos uploaded",
    property: "12 Beach Rd",
    staffIdx: 5,
    time: "Sat · 12:20 pm",
  },
];

// Refresh-loop arrow — turnover = full reset cycle between guests.
function RefreshIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 16 16"
      width={size}
    >
      <path d="M 13.5 8 A 5.5 5.5 0 1 1 8 2.5" />
      <path d="M 5.5 4.5 L 8 2.5 L 9.5 5" />
    </svg>
  );
}

function TrainingSection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <GlitchTitle
        chapter="03"
        eyebrow="Training"
        meta="// 1 team · 6 housekeepers · same-day turnovers"
        title="The system that runs without me."
      />

      <div className="mt-10">
        <TrainingPublish />
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-y-5">
        <p className="text-lg leading-8 text-text-light-muted">
          Building a system is half the job. The other half is making
          sure the team can run it. I supervised a 6-person
          housekeeping team handling same-day turnovers across the
          Airbnb properties — 2 to 3 turnovers a week, every step
          documented and trained.
        </p>
        <p className="text-lg leading-8 text-text-light-muted">
          The point of training isn&apos;t presence — it&apos;s
          accountability that doesn&apos;t require me in the room.{" "}
          <span className="text-text-light">
            Standards hold whether I&apos;m on the property or in a
            different time zone.
          </span>
        </p>
      </div>
      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
        <a className="text-accent transition-colors hover:text-accent-deep" href="/resume#experience">
          <span className="link-underline">See the codebase</span>{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  );
}

// Two-band stage:
//   TOP STRIP — Pierre's training card + dashed flow line + 6 team
//   avatars. Shows "I gave the knowledge → 6 housekeepers."
//   BOTTOM PANEL — the PMS dashboard (Atlas Ops · This Week) with
//   an activity feed that populates one post at a time. Each row
//   has the team-member's initial + action + property + timestamp.
//   On post, the corresponding avatar in the top strip pulses,
//   making the cause-and-effect ("Sam finished → PMS shows it")
//   visible.
function TrainingPublish() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFrozen =
      new URLSearchParams(window.location.search).get("frozen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stage = stageRef.current;
    if (!stage) return;

    const author = stage.querySelector<HTMLElement>("[data-train-author]");
    const flow = stage.querySelector<SVGPathElement>("[data-train-flow]");
    const avatars = stage.querySelectorAll<HTMLElement>(
      "[data-train-avatar]",
    );
    const pmsPanel = stage.querySelector<HTMLElement>("[data-pms-panel]");
    const pmsRows = stage.querySelectorAll<HTMLElement>("[data-pms-row]");
    const pmsCount = stage.querySelector<HTMLElement>("[data-pms-count]");

    if (isFrozen) {
      // Frozen frame: full PMS dashboard populated. Panel visible,
      // all 6 posts visible, count showing the total.
      avatars.forEach((a) => {
        a.style.opacity = "1";
      });
      if (pmsPanel) {
        pmsPanel.style.opacity = "1";
        pmsPanel.style.transform = "none";
      }
      pmsRows.forEach((r) => {
        r.style.opacity = "1";
        r.style.transform = "none";
      });
      if (pmsCount) {
        pmsCount.textContent = `${PMS_POSTS.length} posts · 3 turnovers`;
      }
      if (flow) flow.style.strokeDashoffset = "0";
      return;
    }

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.2 });

    // ─── 1 · TRAINING BAND (≈0.9 s) — Pierre + arrow + team ───────
    if (author) {
      tl.fromTo(
        author,
        { opacity: 0, scale: 0.85, y: -8 },
        {
          duration: 0.45,
          ease: "back.out(2)",
          opacity: 1,
          scale: 1,
          y: 0,
        },
      );
    }
    if (flow) {
      const flowLen = flow.getTotalLength();
      tl.fromTo(
        flow,
        { strokeDashoffset: flowLen },
        {
          duration: 0.55,
          ease: "power2.out",
          strokeDashoffset: 0,
        },
        "-=0.15",
      );
    }
    tl.fromTo(
      avatars,
      { opacity: 0, scale: 0.5 },
      {
        duration: 0.4,
        ease: "back.out(2.2)",
        opacity: 1,
        scale: 1,
        stagger: 0.05,
      },
      "-=0.25",
    );

    // ─── 2 · PMS PANEL (≈0.4 s) — chrome slides in ────────────────
    if (pmsPanel) {
      tl.fromTo(
        pmsPanel,
        { opacity: 0, y: 24 },
        {
          duration: 0.5,
          ease: "power3.out",
          opacity: 1,
          y: 0,
        },
        "+=0.2",
      );
    }

    // ─── 3 · FEED POPULATES — each post fades in, originating
    // staff avatar pulses brightly to show the post came FROM
    // them. Counter at the bottom of the panel updates on each.
    const counter = { value: 0 };
    pmsRows.forEach((row, i) => {
      const post = PMS_POSTS[i];
      const sourceAvatar = avatars[post.staffIdx];
      tl.fromTo(
        row,
        { opacity: 0, y: 6 },
        {
          duration: 0.32,
          ease: "power2.out",
          opacity: 1,
          y: 0,
        },
      );
      if (sourceAvatar) {
        // Quick pulse: scale up briefly then back, to read as "this
        // team member just posted".
        tl.to(
          sourceAvatar,
          {
            duration: 0.18,
            ease: "power2.out",
            scale: 1.18,
            yoyo: true,
            repeat: 1,
          },
          "<",
        );
      }
      if (pmsCount) {
        tl.call(
          () => {
            counter.value = i + 1;
            pmsCount.textContent = `${counter.value} of ${PMS_POSTS.length} posts · ${Math.ceil((i + 1) / 2)} turnovers`;
          },
          undefined,
          ">-=0.05",
        );
      }
    });

    // ─── 4 · HOLD (1.6 s) — full dashboard visible ────────────────
    tl.to({}, { duration: 1.6 });

    // ─── 5 · RESET ────────────────────────────────────────────────
    tl.to(
      [pmsPanel, ...Array.from(pmsRows), author, ...Array.from(avatars)],
      { duration: 0.5, ease: "power2.inOut", opacity: 0 },
    );
    tl.call(() => {
      counter.value = 0;
      if (pmsCount) pmsCount.textContent = "0 of 6 posts · 0 turnovers";
      pmsRows.forEach((r) => {
        r.style.transform = "translateY(6px)";
      });
      if (flow) flow.style.strokeDashoffset = String(flow.getTotalLength());
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tl.play();
          } else {
            tl.pause();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div
      className="relative mx-auto"
      ref={stageRef}
      style={{ minHeight: "660px", maxWidth: "880px" }}
    >
      {/* ─── TOP BAND · TRAINING ────────────────────────────────────
          Pierre's author card on the left, a dashed flow line going
          right, 6 team avatars at the end. Reads: "I trained them." */}
      <div
        className="grid items-center gap-4"
        style={{
          gridTemplateColumns: "240px 96px 1fr",
          paddingBottom: "24px",
        }}
      >
        {/* PIERRE'S TRAINING CARD */}
        <article
          aria-hidden="true"
          className="relative px-4 py-3"
          data-train-author
          style={{
            background:
              "linear-gradient(180deg, #fcfaf2 0%, #f5f0df 100%)",
            border: "1px solid #d8cdb1",
            borderRadius: "3px",
            boxShadow:
              "0 14px 28px -18px rgba(122,90,48,0.45), 0 1px 0 rgba(255,255,255,0.8) inset",
            transform: "rotate(-1.5deg)",
          }}
        >
          <div className="flex items-center gap-2 text-accent">
            <RefreshIcon size={11} />
            <p className="font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#7a5a30]/80">
              — sop · turnover
            </p>
          </div>
          <p className="font-handwritten mt-1 text-[18px] font-bold leading-tight text-[#3a2a1a]">
            Same-day Turnover
          </p>
          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="font-handwritten text-[13px] text-[#7a5a30]">
              12 steps · trained 1×
            </span>
            <span
              className="font-handwritten text-[13px] italic"
              style={{ color: "#a83232" }}
            >
              —Pierre
            </span>
          </div>
          <svg
            aria-hidden="true"
            className="absolute -left-2 -top-3"
            fill="none"
            height="18"
            viewBox="0 0 14 18"
            width="14"
          >
            <path
              d="M 3 4 L 3 14 Q 3 16 5 16 Q 7 16 7 14 L 7 5 Q 7 3 9 3 Q 11 3 11 5 L 11 12"
              stroke="#a8a3a0"
              strokeLinecap="round"
              strokeWidth="1.2"
            />
          </svg>
        </article>

        {/* FLOW LINE — dashed accent-blue arrow from Pierre to the
            team strip. Animates via stroke-dashoffset on enter. */}
        <svg
          aria-hidden="true"
          className="text-accent"
          height="40"
          viewBox="0 0 96 40"
          width="96"
        >
          <path
            d="M 4 20 L 80 20"
            data-train-flow
            fill="none"
            stroke="currentColor"
            strokeDasharray="80"
            strokeDashoffset="80"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
          <path
            d="M 76 14 L 84 20 L 76 26"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
          <text
            className="font-mono"
            fill="currentColor"
            fontSize="9"
            textAnchor="middle"
            x="44"
            y="14"
          >
            trained →
          </text>
        </svg>

        {/* TEAM STRIP — 6 housekeepers in a row */}
        <div className="grid grid-cols-6 gap-2">
          {STAFF.map((staff, idx) => (
            <div
              className="flex flex-col items-center gap-1"
              data-train-avatar
              data-train-idx={idx}
              key={staff.name}
              style={{ opacity: 0 }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-bg-light-2 font-mono text-[12px] font-bold text-text-light"
                style={{
                  border: "1px solid rgba(41,110,214,0.5)",
                  willChange: "transform",
                }}
              >
                {staff.initial}
              </span>
              <span className="font-mono text-[8.5px] text-text-light-muted">
                {staff.name.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BOTTOM PANEL · PMS DASHBOARD ──────────────────────────
          The Property Management System. Header strip + activity
          feed + footer count. Feed entries populate one by one as
          the team posts from each turnover. */}
      <div
        className="overflow-hidden rounded-xl border border-border-light bg-white shadow-[0_22px_44px_-28px_rgba(15,23,42,0.18)]"
        data-pms-panel
        style={{ opacity: 0, transform: "translateY(24px)" }}
      >
        {/* PMS HEADER */}
        <div className="flex items-center justify-between border-b border-border-light px-5 py-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 rounded-full bg-result-green"
            />
            <span className="font-mono text-[10.5px] font-semibold text-text-light">
              Atlas Ops · Property Manager
            </span>
            <span className="font-mono text-[9.5px] text-text-light-muted">
              — this week
            </span>
          </div>
          <span className="font-mono text-[9.5px] text-text-light-muted">
            live · 6 staff active
          </span>
        </div>

        {/* COLUMN HEADERS */}
        <div className="grid grid-cols-[36px_1fr_220px_120px] gap-3 border-b border-border-light bg-bg-light-2/60 px-5 py-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-text-light-muted">
          <span>who</span>
          <span>action · property</span>
          <span>timestamp</span>
          <span className="text-right">status</span>
        </div>

        {/* ACTIVITY FEED — one row per post */}
        <ul>
          {PMS_POSTS.map((post, i) => {
            const staff = STAFF[post.staffIdx];
            return (
              <li
                className="grid grid-cols-[36px_1fr_220px_120px] items-center gap-3 border-b border-border-light/70 px-5 py-3 last:border-b-0"
                data-pms-row
                key={i}
                style={{ opacity: 0, transform: "translateY(6px)" }}
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-bg-light-2 font-mono text-[11px] font-bold text-text-light"
                  style={{ border: "1px solid rgba(41,110,214,0.4)" }}
                >
                  {staff.initial}
                </span>
                <span className="min-w-0 text-[12.5px] leading-tight text-text-light">
                  <span className="font-semibold">
                    {staff.name.toLowerCase()}
                  </span>
                  <span className="text-text-light-muted">
                    {" · "}
                    {post.action}
                    {" · "}
                  </span>
                  <span className="text-accent">{post.property}</span>
                </span>
                <span className="font-mono text-[10px] text-text-light-muted">
                  {post.time}
                </span>
                <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] text-result-green">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-result-green"
                  />
                  posted
                </span>
              </li>
            );
          })}
        </ul>

        {/* PMS FOOTER */}
        <div className="flex items-center justify-between border-t border-border-light bg-bg-light-2/60 px-5 py-2.5 font-mono text-[10px] text-text-light-muted">
          <span data-pms-count>0 of 6 posts · 0 turnovers</span>
          <span>— pierre · viewing from anywhere</span>
        </div>
      </div>
    </div>
  );
}

// 6 months of QuickBooks bookkeeping, every month closed clean.
// Used to drive both the GL ledger feed AND the "0 errors" tally
// at the end of the loop.
type LedgerMonth = {
  closed: string;
  date: string;
  entries: number;
  month: string;
};
const LEDGER_MONTHS: LedgerMonth[] = [
  { closed: "Feb 03, 2024", date: "Jan 2024", entries: 142, month: "Jan" },
  { closed: "Mar 04, 2024", date: "Feb 2024", entries: 128, month: "Feb" },
  { closed: "Apr 02, 2024", date: "Mar 2024", entries: 159, month: "Mar" },
  { closed: "May 03, 2024", date: "Apr 2024", entries: 137, month: "Apr" },
  { closed: "Jun 04, 2024", date: "May 2024", entries: 168, month: "May" },
  { closed: "Jul 02, 2024", date: "Jun 2024", entries: 151, month: "Jun" },
];

function FinanceSection() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <GlitchTitle
        chapter="04"
        eyebrow="Finance & administration"
        meta="// 6 months · quickbooks · zero variances"
        title="Six months. Zero errors."
      />

      <div className="mt-10">
        <FinanceLedger />
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-y-5">
        <p className="text-lg leading-8 text-text-light-muted">
          Before I was building AI systems, I was keeping the books.
          As Finance Data Entry Assistant at ThePrivateHotels, I
          owned the company&apos;s bookkeeping in QuickBooks for six
          months — first time doing it, zero variances at month-end
          close.
        </p>
        <p className="text-lg leading-8 text-text-light-muted">
          I research until I have mastery, then execute without
          errors.{" "}
          <span className="text-text-light">
            That habit runs through everything I do — whether
            it&apos;s reconciling a GL or shipping an agent.
          </span>
        </p>
      </div>
      <p className="mt-10 text-center font-mono text-[11px] tracking-[0.18em] text-text-light-muted">
        <a className="text-accent transition-colors hover:text-accent-deep" href="/resume#experience">
          <span className="link-underline">See the codebase</span>{" "}
          <span aria-hidden="true">→</span>
        </a>
      </p>
    </div>
  );
}

// Math.sin/cos can drift in the last few ULPs between Node V8 and
// Chromium V8 — quantizing SVG coords to 2 decimals keeps SSR and
// hydration byte-identical without affecting visual output.
const r2 = (n: number) => Math.round(n * 100) / 100;

// Magazine-spread layout: huge serif "0" on the left, a Q1-Q2 2024
// GL ledger on the right that fills row-by-row as each month gets
// closed. Each row lands with a stamped "OK" mark. After the 6th
// month closes, the big "0" reveals at scale and an "errors" tag
// fades in beneath it. Closes the chapter on the metric.
function FinanceLedger() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isFrozen =
      new URLSearchParams(window.location.search).get("frozen") === "1" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stage = stageRef.current;
    if (!stage) return;

    const ledger = stage.querySelector<HTMLElement>("[data-fin-ledger]");
    const rows = stage.querySelectorAll<HTMLElement>("[data-fin-row]");
    const stamps = stage.querySelectorAll<HTMLElement>("[data-fin-stamp]");
    const arcs = stage.querySelectorAll<SVGPathElement>("[data-fin-arc]");
    const arcLabels = stage.querySelectorAll<SVGTextElement>(
      "[data-fin-arc-label]",
    );
    const zeroBig = stage.querySelector<SVGTextElement>("[data-fin-zero-big]");
    const zeroSmall = stage.querySelector<SVGTextElement>(
      "[data-fin-zero-label-small]",
    );
    const tagLabel = stage.querySelector<HTMLElement>("[data-fin-label]");
    const footer = stage.querySelector<HTMLElement>("[data-fin-footer]");

    if (isFrozen) {
      // Frozen frame: full ledger populated, every arc drawn, "0"
      // at center, tag + footer visible.
      if (ledger) {
        ledger.style.opacity = "1";
        ledger.style.transform = "none";
      }
      rows.forEach((r) => {
        r.style.opacity = "1";
        r.style.transform = "none";
      });
      stamps.forEach((s) => {
        s.style.opacity = "1";
        s.style.transform = "scale(1) rotate(-6deg)";
      });
      arcs.forEach((a) => {
        a.style.strokeDashoffset = "0";
      });
      arcLabels.forEach((l) => {
        l.setAttribute("opacity", "0.55");
      });
      if (zeroBig) zeroBig.setAttribute("opacity", "1");
      if (zeroSmall) zeroSmall.setAttribute("opacity", "0.7");
      if (tagLabel) tagLabel.style.opacity = "1";
      if (footer) footer.style.opacity = "1";
      return;
    }

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 1.4 });

    // 1 · Ledger chrome + top tag fade in together
    if (ledger) {
      tl.fromTo(
        ledger,
        { opacity: 0, y: 12 },
        { duration: 0.5, ease: "power2.out", opacity: 1, y: 0 },
      );
    }
    if (tagLabel) {
      tl.fromTo(
        tagLabel,
        { opacity: 0, y: -4 },
        { duration: 0.4, ease: "power2.out", opacity: 1, y: 0 },
        "-=0.3",
      );
    }

    // 2 · For each month: row lands + stamp pops + corresponding
    // arc of the ring draws. The 6 arcs are built in parallel with
    // the ledger rows so the "0" is literally constructed from the
    // 6 closes — month 1 draws the top arc, etc. By the 6th row,
    // the full ring is complete.
    rows.forEach((row, i) => {
      tl.fromTo(
        row,
        { opacity: 0, x: -10 },
        {
          duration: 0.32,
          ease: "power2.out",
          opacity: 1,
          x: 0,
        },
      );
      if (stamps[i]) {
        tl.fromTo(
          stamps[i],
          { opacity: 0, rotate: -22, scale: 0.4 },
          {
            duration: 0.3,
            ease: "back.out(2.4)",
            opacity: 1,
            rotate: -6,
            scale: 1,
          },
          "-=0.15",
        );
      }
      if (arcs[i]) {
        tl.fromTo(
          arcs[i],
          { strokeDashoffset: 100 },
          {
            duration: 0.45,
            ease: "power2.out",
            strokeDashoffset: 0,
          },
          "<-=0.1",
        );
      }
      if (arcLabels[i]) {
        tl.fromTo(
          arcLabels[i],
          { attr: { opacity: 0 } },
          {
            duration: 0.3,
            ease: "power2.out",
            attr: { opacity: 0.55 },
          },
          "-=0.25",
        );
      }
    });

    // 3 · After the 6th arc draws, the ring briefly pulses (small
    // scale-up + back to 1) like a "completed" beat. Then the big
    // "0" STAMPS into the center (scale 0.4 → 1.18 → 1 with a tiny
    // rotation kick) — reads as an audit-stamp landing, not just a
    // fade. The "— variances" caption fades up below the 0.
    if (arcs.length > 0) {
      tl.to(
        Array.from(arcs),
        {
          duration: 0.32,
          ease: "power2.inOut",
          strokeWidth: 46,
          yoyo: true,
          repeat: 1,
        },
        "+=0.1",
      );
    }
    if (zeroBig) {
      tl.fromTo(
        zeroBig,
        { attr: { opacity: 0 }, scale: 0.4, rotation: -8 },
        {
          attr: { opacity: 1 },
          duration: 0.55,
          ease: "back.out(2.4)",
          rotation: 0,
          scale: 1,
        },
        "-=0.1",
      );
    }
    if (zeroSmall) {
      tl.fromTo(
        zeroSmall,
        { attr: { opacity: 0 }, y: -4 },
        {
          attr: { opacity: 0.7 },
          duration: 0.35,
          ease: "power2.out",
          y: 0,
        },
        "-=0.2",
      );
    }
    if (footer) {
      tl.fromTo(
        footer,
        { opacity: 0, y: 4 },
        { duration: 0.35, ease: "power2.out", opacity: 1, y: 0 },
        "-=0.3",
      );
    }

    // 4 · Hold the full spread — biggest payoff beat
    tl.to({}, { duration: 2.0 });

    // 5 · Reset
    tl.to(
      [ledger, tagLabel, footer, ...Array.from(rows), ...Array.from(stamps)],
      { duration: 0.5, ease: "power2.inOut", opacity: 0 },
    );
    tl.to(
      Array.from(arcs),
      { duration: 0.5, ease: "power2.inOut", opacity: 0 },
      "<",
    );
    if (zeroBig) {
      tl.to(
        zeroBig,
        { duration: 0.5, ease: "power2.inOut", attr: { opacity: 0 } },
        "<",
      );
    }
    if (zeroSmall) {
      tl.to(
        zeroSmall,
        { duration: 0.5, ease: "power2.inOut", attr: { opacity: 0 } },
        "<",
      );
    }
    if (arcLabels.length) {
      tl.to(
        Array.from(arcLabels),
        { duration: 0.5, ease: "power2.inOut", attr: { opacity: 0 } },
        "<",
      );
    }
    tl.call(() => {
      rows.forEach((r) => {
        r.style.transform = "translateX(-10px)";
      });
      stamps.forEach((s) => {
        s.style.transform = "scale(0.4) rotate(-22deg)";
      });
      arcs.forEach((a) => {
        a.style.opacity = "";
        a.style.strokeDashoffset = "100";
      });
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            tl.play();
          } else {
            tl.pause();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(stage);

    return () => {
      io.disconnect();
      tl.kill();
    };
  }, []);

  return (
    <div
      className="relative mx-auto grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center"
      ref={stageRef}
      style={{ minHeight: "480px" }}
    >
      {/* LEFT · THE "0" BUILT FROM 6 ARCS — each arc represents one
          closed month. The arcs draw in sync with the ledger rows
          on the right (Jan's arc draws when Jan's row lands, and so
          on), so the "0" is constructed FROM the receipts. By the
          time the 6th month closes, the ring is complete. The
          number isn't a stamp; it's a sum. Small "Q1-Q2 2024" tag
          + month abbreviations around the ring add editorial chrome
          so it reads as a designed annual-report panel, not a bare
          number. */}
      <div className="relative flex items-center justify-center">
        <svg
          aria-hidden="true"
          className="block text-text-light"
          height="360"
          viewBox="0 0 360 360"
          width="360"
        >
          {/* 6 ARCS — each is 60° of the perimeter. Starting at the
              top (-90°) and going clockwise. pathLength normalized
              to 100 so the GSAP stroke-dashoffset 100 → 0 tween
              draws each at the same pace regardless of actual
              length. */}
          {Array.from({ length: 6 }).map((_, i) => {
            const cx = 180;
            const cy = 180;
            const r = 132;
            const startAngle = -90 + i * 60;
            const endAngle = startAngle + 60;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;
            const x1 = r2(cx + r * Math.cos(startRad));
            const y1 = r2(cy + r * Math.sin(startRad));
            const x2 = r2(cx + r * Math.cos(endRad));
            const y2 = r2(cy + r * Math.sin(endRad));
            const d = `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`;
            return (
              <path
                d={d}
                data-fin-arc
                fill="none"
                key={i}
                pathLength="100"
                stroke="currentColor"
                strokeDasharray="100"
                strokeDashoffset="100"
                strokeLinecap="butt"
                strokeWidth="40"
              />
            );
          })}
          {/* MONTH ABBREVIATIONS — tiny mono labels at the centroid
              of each arc, so the visual reads as a calendar wheel
              while staying recognizable as a "0". */}
          {["jan", "feb", "mar", "apr", "may", "jun"].map((m, i) => {
            const cx = 180;
            const cy = 180;
            const r = 175;
            const angle = -90 + i * 60 + 30;
            const rad = (angle * Math.PI) / 180;
            const tx = r2(cx + r * Math.cos(rad));
            const ty = r2(cy + r * Math.sin(rad));
            return (
              <text
                className="font-mono"
                data-fin-arc-label
                data-arc-idx={i}
                fill="currentColor"
                fontSize="9"
                key={m}
                opacity="0"
                style={{ letterSpacing: "0.12em" }}
                textAnchor="middle"
                x={tx}
                y={ty + 3}
              >
                {m}
              </text>
            );
          })}
          {/* CENTER LABELS — the "0" sits boldly in the ring's
              hole. The "— variances" caption sits BELOW it (still
              inside the hole) so the answer reads number-first,
              context-second without the big glyph eating the
              caption text. */}
          <text
            data-fin-zero-big
            fill="currentColor"
            fontFamily="var(--font-display), 'Times New Roman', Times, Georgia, serif"
            fontSize="116"
            fontWeight="800"
            opacity="0"
            style={{
              letterSpacing: "-0.05em",
              transformBox: "fill-box",
              transformOrigin: "50% 50%",
            }}
            textAnchor="middle"
            x={180}
            y={196}
          >
            0
          </text>
          <text
            data-fin-zero-label-small
            fill="currentColor"
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontSize="10"
            opacity="0"
            style={{ letterSpacing: "0.18em" }}
            textAnchor="middle"
            x={180}
            y={230}
          >
            — variances
          </text>
        </svg>

        {/* TOP-LEFT TAG — "Q1-Q2 2024" floating sticker for
            editorial flair, like a magazine pull-quote credit. */}
        <span
          className="absolute -top-2 left-2 font-mono text-[9.5px] text-text-light-muted"
          data-fin-label
          style={{ opacity: 0 }}
        >
          — Q1-Q2 2024 · 885 GL entries · audited
        </span>
      </div>

      {/* RIGHT · LEDGER PANEL — Q1-Q2 2024 close summary. Each row
          is a closed month; on each row, an "OK" stamp lands at a
          slight rotation so it reads as physically stamped, not
          dynamically rendered. */}
      <div
        className="overflow-hidden rounded-xl border border-border-light bg-white shadow-[0_22px_44px_-28px_rgba(15,23,42,0.18)]"
        data-fin-ledger
        style={{ opacity: 0, transform: "translateY(12px)" }}
      >
        <div className="flex items-center justify-between border-b border-border-light px-5 py-3 font-mono text-[10.5px]">
          <div className="flex items-center gap-3 text-text-light">
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 rounded-full bg-result-green"
            />
            <span className="font-semibold">ThePrivateHotels · Books</span>
            <span className="text-text-light-muted">— Q1-Q2 2024</span>
          </div>
          <span className="text-text-light-muted">QuickBooks</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_72px] gap-3 border-b border-border-light bg-bg-light-2/60 px-5 py-2 font-mono text-[8.5px] uppercase tracking-[0.16em] text-text-light-muted">
          <span>period</span>
          <span>entries · closed on</span>
          <span className="text-right">status</span>
        </div>

        <ul>
          {LEDGER_MONTHS.map((m, i) => (
            <li
              className="relative grid grid-cols-[1fr_auto_72px] items-center gap-3 border-b border-border-light/70 px-5 py-3 last:border-b-0"
              data-fin-row
              key={m.month}
              style={{ opacity: 0, transform: "translateX(-10px)" }}
            >
              <div>
                <p className="text-[13px] font-semibold text-text-light">
                  {m.date}
                </p>
                <p className="font-mono text-[9px] text-text-light-muted">
                  general ledger · reconciled
                </p>
              </div>
              <div className="text-right font-mono text-[10px] tabular-nums text-text-light-muted">
                <p>
                  <span className="text-text-light">{m.entries}</span> entries
                </p>
                <p>closed {m.closed}</p>
              </div>
              <div className="relative flex items-center justify-end">
                {/* "OK" stamp — accent-green border with rotation
                    so it reads as a physical accounting stamp. */}
                <span
                  aria-hidden="true"
                  className="inline-flex select-none items-center justify-center border-2 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                  data-fin-stamp
                  data-stamp-idx={i}
                  style={{
                    borderColor: "rgba(16, 185, 129, 0.7)",
                    color: "rgb(16, 185, 129)",
                    letterSpacing: "0.14em",
                    opacity: 0,
                    transform: "scale(0.4) rotate(-22deg)",
                  }}
                >
                  ok
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div
          className="flex items-center justify-between border-t border-border-light bg-bg-light-2/60 px-5 py-2.5 font-mono text-[10px] text-text-light-muted"
          data-fin-footer
          style={{ opacity: 0 }}
        >
          <span>885 entries · 6 closes · 0 variances</span>
          <span>— pierre · finance data entry</span>
        </div>
      </div>
    </div>
  );
}

function LightSection({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
