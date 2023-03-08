FROM node:lts

RUN apt-get update && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*


WORKDIR /frontend

COPY . /frontend/

#COPY . .

EXPOSE 4200

EXPOSE 80

RUN npm install -g @angular/cli

RUN npm install --save bulma

RUN npm install

#CMD [ "ng", "serve" ]

ENTRYPOINT [ "/bin/sh", "-c", "ng serve --host 0.0.0.0 --public-host crazy-pong.com" ]







# FROM node:lts

# RUN apt-get update && \
# 	apt-get autoremove -y && \
# 	apt-get clean && \
# 	rm -rf /var/lib/apt/lists/*


# WORKDIR /app

# RUN npm install -g @angular/cli

# EXPOSE 4200

# ENTRYPOINT [ "/bin/sh", "-c", "ng new frontend && cd frontend && ng serve --host 0.0.0.0" ]