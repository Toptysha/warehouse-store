FROM node:18

WORKDIR  /usr/src/app

COPY . .

WORKDIR  /usr/src/app/client
RUN npm i
RUN npm run build

WORKDIR  /usr/src/app/server
RUN npm i

EXPOSE 7000

CMD ["node", "app.js"]