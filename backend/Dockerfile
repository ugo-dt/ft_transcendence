FROM node:latest

WORKDIR /usr/src/app

RUN apt-get -y update

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . ./

EXPOSE 3000

RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "/bin/sh", "./entrypoint.sh" ]