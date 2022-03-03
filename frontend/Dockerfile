FROM node:lts-alpine

WORKDIR /app

RUN apk add --no-cache python3 py3-pip make gcc g++
RUN ln -s /usr/bin/python3 /usr/bin/python

# TODO vapid public key configuration (eg. from .env) is missing (suck it :) for now)
COPY ./ .
RUN rm -rf ./node_modules/
RUN rm -rf ./dist/
RUN yarn install

CMD [ "yarn", "build" ]
