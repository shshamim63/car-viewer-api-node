FROM alpine:3.18
RUN adduser -D myuser
RUN apk add --no-cache nodejs npm
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY . .
HEALTHCHECK --interval=35s --timeout=4s CMD curl -f https://localhost/ || exit 1
EXPOSE 8080
USER myuser
CMD [ "npm", "run", "dev" ]