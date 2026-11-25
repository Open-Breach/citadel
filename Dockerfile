# The site's image: the standalone output of the build, served over HTTPS by
# scripts/serve.mjs with the certificates from Key Vault. It listens on 3000
# for HTTPS and on 3080 for plain HTTP, which only redirects.
#
# The image holds no certificate, no key and no name of a vault or of a
# certificate. A deployment gives it KEYVAULT_URL and KEYVAULT_CERTIFICATES
# and an identity that may read the certificates (see README.md).

# ---- dependencies ----------------------------------------------------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# ---- build -----------------------------------------------------------------
FROM node:22-alpine AS builder
WORKDIR /app
# The main address the pages name as their canonical address. Empty means the
# default in next.config.ts.
ARG PUBLIC_BASE_URL=
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUBLIC_BASE_URL=${PUBLIC_BASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- the start scripts' own modules ----------------------------------------
# What fetch-cert.mjs imports. The build above does not trace the scripts, so
# its standalone output does not hold these. The other scripts import nothing
# but Node's own modules.
FROM node:22-alpine AS scripts
WORKDIR /scripts
COPY package.json ./root-package.json
# The same versions as the root package.json, nothing else.
RUN node -e ' \
    const root = require("./root-package.json"); \
    const keep = ["@azure/identity", "@azure/keyvault-certificates", "@azure/keyvault-secrets", "node-forge"]; \
    const dependencies = Object.fromEntries(keep.map((name) => [name, root.dependencies[name]])); \
    require("fs").writeFileSync("package.json", JSON.stringify({ name: "citadel-scripts", private: true, dependencies }, null, 2)); \
  ' && npm install --omit=dev --ignore-scripts --no-audit --no-fund

# ---- runtime ---------------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app
# The version of package.json with the short commit, given by the build.
ARG APP_VERSION=0.0.0
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_VERSION=${APP_VERSION}
ENV PORT=3000
ENV HTTP_PORT=3080
# No HOSTNAME: scripts/listen.mjs decides the address, every one of the
# machine, IPv4 and IPv6.
ENV CERT_DIR=/app/.certs

# The two folders the container writes to: the certificates it downloads, and
# the photographs it has resized (.next/cache/images). With a read-only root
# file system these two are mounted writable.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nextjs \
    && mkdir -p /app/.certs /app/.next/cache \
    && chown nextjs:nodejs /app/.certs /app/.next/cache \
    && chmod 700 /app/.certs

# The standalone output carries what Next.js needs to resize the photographs
# on this platform: sharp and its library for Alpine.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY scripts/certificates.mjs scripts/dotenv.mjs scripts/fetch-cert.mjs scripts/listen.mjs scripts/redirect.mjs scripts/serve.mjs ./scripts/
COPY --from=scripts /scripts/node_modules ./scripts/node_modules

LABEL org.opencontainers.image.title="citadel" \
      org.opencontainers.image.description="The website of Open-Breach" \
      org.opencontainers.image.source="https://github.com/Open-Breach/citadel" \
      org.opencontainers.image.version="${APP_VERSION}"

USER nextjs
EXPOSE 3000 3080
CMD ["node", "scripts/serve.mjs"]
