# ---------- Build stage ----------
FROM node:18 AS builder

WORKDIR /app

RUN corepack enable


COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile


COPY . .


RUN pnpm prisma generate


RUN pnpm build


# ---------- Runtime stage ----------
FROM node:18-alpine

WORKDIR /app


RUN corepack enable

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/src/main.js"]
