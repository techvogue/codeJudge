FROM node:20.13.1-alpine

RUN apk update

WORKDIR /backend

COPY package.json .
RUN npm install

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
