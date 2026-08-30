FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install axios ws
COPY . .
CMD ["node", "dist/index.js"]
