FROM node:8.6.0-alpine

RUN apk update && apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN NODE_ENV=development npm install

COPY . /usr/src/app/
RUN cd /usr/src/app/client && npm install && npm run build

EXPOSE 3000
CMD [ "npm", "start" ]
