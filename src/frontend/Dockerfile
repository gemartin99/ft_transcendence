FROM node:lts

RUN npm install -g @angular/cli@15.1.2

WORKDIR /frontend

COPY package*.json ./

RUN npm install --save bulma

RUN npm install

COPY . .

CMD ["npm", "start"]












