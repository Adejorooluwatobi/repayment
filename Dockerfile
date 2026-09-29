# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install build dependencies if needed
COPY package*.json ./
RUN npm ci

# Copy source code and build NestJS
COPY . .
RUN npm run build

# Prune development dependencies
RUN npm prune --omit=dev

# ==========================================
# Stage 2: Production runner stage
# ==========================================
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production node_modules from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Create folders for uploads and logs
RUN mkdir -p uploads logs

EXPOSE 3000

CMD ["node", "dist/main"]
