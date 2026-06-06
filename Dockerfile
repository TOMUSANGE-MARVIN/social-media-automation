# ── Stage 1: Build frontend ───────────────────────────────────────────
# cache-bust: 2026-06-06
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

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
