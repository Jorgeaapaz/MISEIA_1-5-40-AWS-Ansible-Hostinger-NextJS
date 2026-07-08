FROM node:24-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY app/data ./app/data
EXPOSE 4000
ENV NODE_ENV=production
ENV PORT=4000
CMD ["npx", "tsx", "server/index.ts"]
