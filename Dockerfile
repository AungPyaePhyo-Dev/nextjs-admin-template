# syntax=docker/dockerfile:1
#
# Self-contained image for the admin template. Run from inside this folder:
#
#   docker build -t admin-template .
#   docker run -p 3002:3000 admin-template
#
# Relies on Next.js `output: "standalone"` (set in next.config.ts).

ARG NODE_VERSION=24

# ---- base -------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# ---- deps -------------------------------------------------------------------
FROM base AS deps
COPY package.json ./
RUN npm install

# ---- build ------------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runtime ----------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
