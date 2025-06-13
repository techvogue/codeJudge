FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache gcc g++ python3 py3-pip 
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
