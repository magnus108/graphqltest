FROM node

EXPOSE 3000

WORKDIR /app

COPY package.json .

RUN npm install

##maybe you should not push whole app somestuff is not related to app
COPY . /app

CMD [ "npm", "start" ]
