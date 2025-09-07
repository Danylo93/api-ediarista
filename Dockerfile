# syntax=docker/dockerfile:1

FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
# gera lock no Linux (sem opcionais)
RUN npm install --package-lock-only --no-optional --legacy-peer-deps

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/package-lock.json ./package-lock.json
COPY package.json ./
RUN npm ci --no-optional --legacy-peer-deps
COPY . .
# garanta que o lock do host não sobrescreveu:
COPY --from=deps /app/package-lock.json ./package-lock.json
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
RUN npm ci --omit=dev --no-optional --legacy-peer-deps
EXPOSE 3000
CMD ["node","dist/main"]
