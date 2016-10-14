FROM node

EXPOSE 3000

WORKDIR /app

ADD package.json /app

RUN npm install

##maybe you should not push whole app somestuff is not related to app
ADD . /app

CMD [ "npm", "start" ]
