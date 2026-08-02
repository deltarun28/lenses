import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** Flat config: Next's core-web-vitals and TypeScript presets, then our own rules. */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  {
    ignores: [".next/**", "out/**", "public/sw.js", "node_modules/**", "next-env.d.ts"],
  },
];

export default config;
