FROM node:22-alpine AS builder
WORKDIR /consultas-medicas
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /consultas-medicas
RUN apk add --no-cache bash
COPY --from=builder /consultas-medicas/dist ./dist
COPY --from=builder /consultas-medicas/package*.json ./
COPY .env ./
RUN npm install --only=production
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh
CMD ["/wait-for-it.sh", "postgres-db:5432", "--", "node", "dist/main"]
