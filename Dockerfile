FROM node:18-alpine as base

RUN npm i -g @nestjs/cli

USER node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

############################################################
FROM base as coverage

RUN npm run test:cov

RUN FIND="\/app" && \
REPLACE_WITH=$(echo ${CURRENT_DIR} | sed 's/\//\\\//g') && \
echo "$REPLACE_WITH" && \
sed -i "s/$FIND/$REPLACE_WITH/g" coverage/clover.xml && \
sed -i "s/$FIND/$REPLACE_WITH/g" coverage/coverage-final.json

############################################################
FROM base as app
ENTRYPOINT ["npm", "run", "start:dev"]