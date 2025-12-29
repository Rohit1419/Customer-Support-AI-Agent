# ---------- Build stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

# Enable pnpm (official way)
RUN corepack enable

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client (pgvector works here)
RUN pnpm prisma generate

# Build NestJS
RUN pnpm build


# ---------- Runtime stage ----------
FROM node:18-alpine

WORKDIR /app


RUN corepack enable

# Copy only runtime artifacts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Start NestJS
CMD ["node", "dist/src/main.js"]
