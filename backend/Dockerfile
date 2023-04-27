FROM node:latest

WORKDIR /usr/src/app

RUN apt-get -y update

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .
EXPOSE 5173
CMD [ "npm", "run", "start:dev" ]