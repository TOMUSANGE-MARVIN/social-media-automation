# ── Stage 1: Build frontend ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# ── Stage 2: Production image ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Only install production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy backend source
COPY server ./server

# SQLite data directory (mount a volume here in production)
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "server/index.js"]
