FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_API_URL=$VITE_API_URL

RUN npm run build
ENV VITE_API_URL=$VITE_API_URL
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=development
EXPOSE 4173

# Corrigido para expor o preview para fora do container (--host)
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]