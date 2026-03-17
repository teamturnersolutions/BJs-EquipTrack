# Multi-stage Dockerfile for Next.js with Prisma/SQLite

# 1. Install dependencies
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# 2. Build the app
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV DATABASE_URL="file:/app/prisma/dev.db"
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma Client
RUN npx prisma generate

# Ensure database schema is applied for prerendering
RUN npx prisma db push --accept-data-loss
RUN mkdir -p /app/prisma-init && cp /app/prisma/dev.db /app/prisma-init/dev.db || true

# Build Next.js
RUN npm run build

# Compile maintenance scripts to JS
RUN npx tsc scripts/*.ts --outDir build-scripts --module esnext --moduleResolution node --esModuleInterop --target es2020 --skipLibCheck

# 3. Production image
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache openssl su-exec

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 -G nodejs nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# Copy compiled scripts
COPY --from=builder --chown=nextjs:nodejs /app/build-scripts ./scripts

# Copy the stashed database
COPY --from=builder --chown=nextjs:nodejs /app/prisma-init ./prisma-init

# Add entrypoint script
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 9002
ENV PORT=9002
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
