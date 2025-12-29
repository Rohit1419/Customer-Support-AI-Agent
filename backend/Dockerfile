FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy manifests from backend/
COPY backend/pnpm-lock.yaml backend/package.json ./

RUN pnpm install --frozen-lockfile

# Copy source
COPY backend .


# Build Nest
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start:prod"]

