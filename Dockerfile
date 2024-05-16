FROM node:18-alpine as base

RUN npm i -g @nestjs/cli

USER node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

FROM base as app
ENTRYPOINT ["npm", "run", "start:dev"]