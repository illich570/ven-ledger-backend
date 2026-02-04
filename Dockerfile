
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
RUN apk add --no-cache postgresql-client
COPY tsconfig.json ./
COPY src ./src
CMD ["pnpm", "dev"]

FROM base AS runner
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/dist ./dist
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
