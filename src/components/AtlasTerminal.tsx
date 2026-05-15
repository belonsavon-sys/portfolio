"use client";

/**
 * Atlas terminal scene — faithful HTML/SVG recreation of the real
 * CLI. Static frame here; the scripted-playback layer is added in
 * Task 7 (AtlasTerminalScripts).
 */
export function AtlasTerminal() {
  return (
    <section
      aria-label="Atlas terminal session"
      className="relative mx-auto mt-16 w-full max-w-3xl overflow-hidden rounded-md border border-zinc-700 bg-zinc-950 font-mono text-[13px] text-zinc-300 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
    >
      {/* TOP BAR — fake terminal title bar */}
      <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900 px-4 py-2">
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-3 text-[11px] text-zinc-500">pierrebelonsavon — atlas — 100x32</span>
      </div>

      <div className="grid gap-3 px-5 py-5 sm:px-7 sm:py-6">
        {/* PROMPT LINE */}
        <p className="text-zinc-500">
          Last login: Thu May 14 12:17:04 on ttys001
        </p>
        <p>
          <span className="text-zinc-500">[pierrebelonsavon@MacBook-Pro portfolio %</span>{" "}
          <span className="text-zinc-200">atlas</span>
        </p>

        {/* ATLAS ASCII LOGO */}
        <AtlasAsciiLogo />

        {/* MODEL + PATH */}
        <div className="mt-4 grid gap-1">
          <p>
            <span className="text-amber-300">★</span>{" "}
            <span className="text-zinc-400">ollama / </span>
            <span className="text-zinc-200">qwen3-coder:30b</span>
          </p>
          <p>
            <span className="text-emerald-300">△</span>{" "}
            <span className="text-zinc-400">~/Documents/Portfolio</span>
          </p>
        </div>

        {/* RESUME SESSION */}
        <div className="mt-3 grid gap-1">
          <p>
            <span className="text-violet-300">↻</span>{" "}
            <span className="text-zinc-400">resume last session</span>{" "}
            <span className="text-zinc-600">(1d ago · &quot;what would you recommend me doing next?&quot;)</span>
          </p>
        </div>

        {/* TRY PROMPTS */}
        <div className="mt-3 grid gap-1">
          <p className="text-zinc-500">Try:</p>
          <p className="pl-6 text-zinc-500">&quot;what changed in this folder recently?&quot;</p>
          <p className="pl-6 text-zinc-500">&quot;explain this codebase&quot;</p>
          <p className="pl-6 text-zinc-500">&quot;open a task in my workspace&quot;</p>
        </div>

        {/* CURSOR */}
        <p className="mt-4">
          <span aria-hidden="true" className="inline-block h-[14px] w-[7px] animate-pulse bg-zinc-300 align-middle" />
        </p>
      </div>
    </section>
  );
}

/**
 * Pixel-stair ASCII recreation of the ATLAS logo from Pierre's
 * actual CLI. Three-stop gradient (cyan → violet → pink) applied to
 * the SVG fill so the letterforms keep the original feel.
 *
 * The grid below maps each cell of the ASCII art to an SVG <rect>.
 * Each letterform occupies 9 cols × 6 rows of 18 px tiles.
 */
function AtlasAsciiLogo() {
  // Cell size + spacing
  const cell = 14;
  const gap = 4;

  // Each letter encoded as a list of (row, col) lit cells. Compact
  // pixel-stair forms — not strict ImageNet pixels, but legible.
  const letters: Array<{ rows: number[][]; width: number }> = [
    // A
    {
      rows: [
        [0, 1, 2, 3],
        [0, 4],
        [0, 1, 2, 3, 4],
        [0, 4],
        [0, 4],
        [0, 4],
      ],
      width: 5,
    },
    // T
    {
      rows: [[0, 1, 2, 3, 4], [2], [2], [2], [2], [2]],
      width: 5,
    },
    // L
    {
      rows: [[0], [0], [0], [0], [0], [0, 1, 2, 3]],
      width: 5,
    },
    // A
    {
      rows: [
        [0, 1, 2, 3],
        [0, 4],
        [0, 1, 2, 3, 4],
        [0, 4],
        [0, 4],
        [0, 4],
      ],
      width: 5,
    },
    // S
    {
      rows: [
        [1, 2, 3, 4],
        [0],
        [1, 2, 3],
        [4],
        [4],
        [0, 1, 2, 3],
      ],
      width: 5,
    },
  ];

  const interLetter = 10;
  const totalCols =
    letters.reduce((sum, l) => sum + l.width, 0) +
    interLetter * (letters.length - 1);
  const totalRows = 6;

  const svgWidth = totalCols * (cell + gap);
  const svgHeight = totalRows * (cell + gap);

  return (
    <svg
      aria-label="ATLAS"
      className="my-2"
      height={svgHeight}
      role="img"
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      width="100%"
      style={{ maxWidth: 540 }}
    >
      <defs>
        <linearGradient id="atlas-grad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7be4e4" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#ec96b6" />
        </linearGradient>
      </defs>
      {(() => {
        let colCursor = 0;
        const out: React.ReactElement[] = [];
        letters.forEach((letter, li) => {
          letter.rows.forEach((row, ri) => {
            row.forEach((c) => {
              const x = (colCursor + c) * (cell + gap);
              const y = ri * (cell + gap);
              out.push(
                <rect
                  fill="url(#atlas-grad)"
                  height={cell}
                  key={`${li}-${ri}-${c}`}
                  rx={1.5}
                  width={cell}
                  x={x}
                  y={y}
                />,
              );
            });
          });
          colCursor += letter.width + (li < letters.length - 1 ? 10 : 0);
        });
        return out;
      })()}
    </svg>
  );
}
