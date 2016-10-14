FROM node:6.2.0

ARG NPM_USER
ARG NPM_PASSWORD

MAINTAINER Fuji Haruka

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
COPY . /usr/src/app

CMD [ "npm", "start" ]
