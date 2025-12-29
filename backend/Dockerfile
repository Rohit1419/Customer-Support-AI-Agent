FROM node:18-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lockfile and package manifest first (better layer cache)
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build the Nest app
RUN pnpm build

# Expose app port (Railway sets PORT env; this is just metadata)
EXPOSE 3000

# Health check (expects /health endpoint)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode); })"

# Start in production (your script points to dist/src/main.js)
CMD ["pnpm", "start:prod"]