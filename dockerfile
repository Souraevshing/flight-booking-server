FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3333

EXPOSE 3333

CMD ["node", "dist/main"] 