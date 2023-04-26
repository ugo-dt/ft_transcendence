FROM node:latest

WORKDIR /usr/src/app

RUN apt-get -y update

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 3000
CMD [ "/bin/bash", "./entrypoint.sh" ]