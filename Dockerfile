# jonathansfulton/hapiest-kue
FROM node:4.4.5
MAINTAINER Jonathan Fulton <jonathan.s.fulton@gmail.com>

RUN npm install -g npm@3.10.2

RUN mkdir -p /app

COPY package.json /app/package.json
RUN cd /app && npm install

COPY src /app/src