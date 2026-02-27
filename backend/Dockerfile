# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodeuser -u 1001

WORKDIR /app

# Copy installed node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy source code
COPY . .

# Create directory for SQLite DB
RUN mkdir -p /app/data && chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]