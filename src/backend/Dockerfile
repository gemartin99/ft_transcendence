FROM node:lts

RUN apt-get update && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . /app/

EXPOSE 3000

RUN npm install -g @nestjs/cli

RUN npm install

CMD [ "nest", "start" ]
