import type { NextConfig } from "next";

/*
 * The build for the browser tests sets CITADEL_FIXTURES, which switches on
 * the test pages under /fixtures (see src/app/fixtures/layout.tsx). It goes
 * to a folder of its own, so that it never replaces the build that
 * `npm run start` serves.
 */
const forTests = process.env.CITADEL_FIXTURES === "1";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  distDir: forTests ? ".next-e2e" : ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
