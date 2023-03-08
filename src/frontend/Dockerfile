#FROM node:lts

#RUN apt-get update && \
#	apt-get autoremove -y && \
#	apt-get clean && \
#	rm -rf /var/lib/apt/lists/*


#WORKDIR /frontend

#COPY . /frontend/

##COPY . .

#EXPOSE 4200

#EXPOSE 80

#RUN npm install -g @angular/cli

#RUN npm install --save bulma

#RUN npm install

##CMD [ "ng", "serve" ]

#ENTRYPOINT [ "/bin/sh", "-c", "ng serve --live-reload --host 0.0.0.0 --public-host crazy-pong.com" ]

FROM node:lts

RUN apt-get update && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*

WORKDIR /frontend

COPY . /frontend/

EXPOSE 4200

EXPOSE 80

RUN npm install -g @angular/cli

RUN npm install --save bulma

RUN npm install

ENTRYPOINT [ "/bin/sh", "-c", "ng serve --live-reload --host 0.0.0.0 --public-host crazy-pong.com" ]













