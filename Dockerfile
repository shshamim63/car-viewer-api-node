FROM node:latest

WORKDIR /app

ADD package.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]