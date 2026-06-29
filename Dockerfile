FROM node:24-alpine
WORKDIR /app
# Build context is the already-extracted standalone bundle
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
