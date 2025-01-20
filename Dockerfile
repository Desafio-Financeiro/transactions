FROM node:20.16.0-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV PUBLIC_BASE_URL=http://localhost:8080

EXPOSE 3002 

CMD ["npm", "start"]