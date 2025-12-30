
# ---------- Build stage ----------
FROM node:24 AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm build


# ---------- Runtime stage ----------
FROM node:24-alpine

WORKDIR /app

# Required for Prisma engine on Alpine
RUN apk add --no-cache openssl

RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000


CMD ["pnpm", "run", "start:prod"]