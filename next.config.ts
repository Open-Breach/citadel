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
  experimental: {
    // Turbopack keeps compiler results on disk between runs. With that cache
    // a build reused a stale stylesheet after only component files had
    // changed, so a class that was new in a component had no rule in the
    // built CSS. The stylesheet is made by reading every source file, and
    // the cache does not know that. Both caches are off: every start reads
    // the sources afresh, at the cost of a few seconds.
    turbopackFileSystemCacheForBuild: false,
    turbopackFileSystemCacheForDev: false,
  },
  images: {
    // Photographs are delivered sharp: AVIF first, WebP second, and the
    // file's own format for a browser that takes neither.
    formats: ["image/avif", "image/webp"],
    // 75 is the default. 85 is for the photographs, where sharpness wins.
    qualities: [75, 85],
    // Up to the width of the largest photograph file.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2880, 3840],
    // A resized picture is kept for a month. The first request for a large
    // AVIF takes seconds to encode, and the files change only with a release.
    minimumCacheTTL: 2678400,
    // Only the site's own images are resized.
    localPatterns: [{ pathname: "/images/**", search: "" }],
  },
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
