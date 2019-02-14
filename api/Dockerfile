FROM node:10.15.1

WORKDIR /tranquill/api

COPY package*.json ./

RUN npm install -g nodemon # this will prolly need to go away before prod deploy
RUN npm install

COPY . .
