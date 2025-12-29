FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build Nest
RUN pnpm build

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && pnpm start:prod"]