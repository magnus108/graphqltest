FROM node

EXPOSE 3000

WORKDIR /app
# should be pulled from outside container by github
COPY . /app
RUN npm install

CMD [ "npm", "start" ]
