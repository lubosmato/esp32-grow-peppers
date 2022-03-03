FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache python3 py3-pip make gcc g++
RUN ln -s /usr/bin/python3 /usr/bin/python

COPY ./ .
RUN rm -rf ./node_modules/
RUN rm -f ./.env
RUN yarn install
RUN yarn global add ts-node

EXPOSE 8883
CMD [ "npx", "ts-node", "app.ts" ]
