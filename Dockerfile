# syntax=docker/dockerfile:1

# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json yarn.lock* ./

RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

CMD ["node", "dist/main"]
