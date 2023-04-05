FROM node:latest

WORKDIR /app

ADD pacakage.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]