FROM node:latest

WORKDIR /usr/src/app

RUN apt-get -y update

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

COPY . .

RUN chmod +x ./entrypoint.sh

EXPOSE 5173
CMD [ "/bin/bash", "./entrypoint.sh" ]