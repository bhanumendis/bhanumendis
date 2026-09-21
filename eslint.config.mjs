/**
 * © 2025–2026 Bhanu Mendis · https://bhanumendis.com
 * All rights reserved. Designed, built and maintained by Bhanu Mendis.
 * Unauthorised copying, redistribution or reuse of this file, in whole or in
 * part, is prohibited without written permission. See LICENSE.
 */
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local-only trees that are not part of the site: agent worktrees (each a
    // full copy of the repo plus its own .next), quarantined OneDrive conflict
    // copies, and image working sources. Linting them buried the one real
    // error in ~8,700 unrelated reports.
    ".claude/**",
    "_conflict_backups/**",
    "design-src/**",
  ]),
]);

export default eslintConfig;
