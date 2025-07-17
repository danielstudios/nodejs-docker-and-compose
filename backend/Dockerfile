FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
RUN apk add --no-cache openssl
RUN npm install -g pm2
COPY --from=builder app/package*.json ./
RUN npm ci --only=production
COPY --from=builder app/dist ./dist
COPY --from=builder app/ecosystem.config.js ./
EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js"]
