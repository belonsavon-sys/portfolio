import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The site uses literal `// ` mono prefixes as an editorial
      // design choice — file-path captions, eyebrow labels, status
      // comments. The default rule treats those as accidental
      // JS-style comments inside JSX. Off project-wide.
      "react/jsx-no-comment-textnodes": "off",
      // Many components defer client-only state (timestamps, mouse,
      // matchMedia) via `setX(value)` inside an effect — a cascading
      // render is the EXPLICIT intent there, to avoid SSR/CSR
      // hydration mismatch. The rule fires across the codebase; we
      // disable it project-wide rather than paper over with disables.
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
