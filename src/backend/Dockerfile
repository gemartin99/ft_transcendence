FROM node:lts

WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 3000


CMD ["npm", "run", "start:dev"]
