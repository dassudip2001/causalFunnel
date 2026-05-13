# =========================
# Stage 1 - Builder
# =========================
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy package files first 
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# =========================
# Stage 2 - Production
# =========================
FROM oven/bun:1-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy only required files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Non-root user 
USER bun

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD bun -e "fetch('http://localhost:5000').then(() => process.exit(0)).catch(() => process.exit(1))"

CMD ["bun", "./dist/server.js"]