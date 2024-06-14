FROM node:14-alpine
WORKDIR usr/app
COPY ./ ./
COPY ./package.json ./
RUN npm install

CMD ["npm", "start"]
