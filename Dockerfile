
FROM node:25-alpine AS base
WORKDIR /app
# Corepack was removed in Node.js 25 (https://github.com/nodejs/node/pull/57617)
# Install pnpm directly via npm instead
RUN npm install -g pnpm@10.28.1

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN pnpm build

FROM deps AS dev
# Install postgresql-client for pg_isready (used in docker-entrypoint.sh for migration orchestration)
# Install Chromium and system libs required by Puppeteer headless
RUN apk add --no-cache \
  postgresql-client \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY tsconfig.json ./
COPY src ./src
CMD ["pnpm", "dev"]

# runner inherits node_modules from deps (avoids full reinstall on every build)
FROM deps AS runner
# Install Chromium and system libs required by Puppeteer headless
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  ttf-freefont
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
COPY --from=build --chown=node:node /app/dist ./dist
# Copy source files (drizzle.config.ts imports from ./src/config/database-config)
COPY --chown=node:node src ./src
# Copy drizzle config and migrations for pre-deploy command
COPY --chown=node:node drizzle.config.ts ./
COPY --chown=node:node drizzle ./drizzle
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
