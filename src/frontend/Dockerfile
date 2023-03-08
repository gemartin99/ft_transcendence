FROM node:lts

RUN apt-get update && \
	apt-get autoremove -y && \
	apt-get clean && \
	rm -rf /var/lib/apt/lists/*


WORKDIR /app

RUN npm install -g @angular/cli

EXPOSE 4200

ENTRYPOINT [ "/bin/sh", "-c", "ng new frontend && cd frontend && ng serve --host 0.0.0.0" ]