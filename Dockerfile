FROM node:6.6

MAINTAINER Fuji Haruka

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

CMD [ "npm", "start" ]
