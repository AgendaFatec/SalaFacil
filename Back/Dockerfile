FROM node:20-slim AS builder

RUN apt-get update && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

RUN npx prisma generate

RUN npx tsoa routes && npx tsoa spec

RUN npx tsc && npx tsc-alias -p tsconfig.json

FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

ENV NODE_ENV=development
EXPOSE 3000

CMD npx prisma db push --url "$DATABASE_URL" --accept-data-loss && npx tsx prisma/seed.ts && npm start