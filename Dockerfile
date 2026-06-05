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

COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend and backend
COPY --from=builder /app/dist ./dist
COPY server ./server

EXPOSE 3001

# Migrations run automatically on startup (see server/index.js)
CMD ["node", "server/index.js"]
