FROM node:lts-alpine as frontend-builder

WORKDIR /frontend

RUN apk update && apk upgrade && apk add --no-cache python3 py3-pip make gcc g++
RUN ln -s /usr/bin/python3 /usr/bin/python

# TODO vapid public key configuration (eg. from .env) is missing (suck it :) for now)
COPY ./ .
RUN rm -rf ./node_modules/
RUN rm -rf ./dist/
RUN yarn install
RUN yarn build

FROM alpine:latest

WORKDIR /app

COPY ./main.sh ./

COPY --from=frontend-builder /frontend/dist/ ./original-dist/

CMD ["/app/main.sh"]
