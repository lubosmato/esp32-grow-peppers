FROM node:lts-alpine

WORKDIR /app

RUN apk update && apk upgrade && apk add --no-cache python3 py3-pip make gcc g++
RUN ln -s /usr/bin/python3 /usr/bin/python

COPY ./ .
RUN rm -rf ./node_modules/
RUN rm -f ./.env
RUN rm -rf ./db/*
RUN yarn install
RUN yarn global add ts-node

RUN apk del python3 py3-pip make gcc g++

EXPOSE 8080
CMD [ "npx", "ts-node", "src/app.ts" ]
