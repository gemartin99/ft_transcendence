all:
	@docker-compose up -d --build
down:
	@docker-compose down
clean:
	@docker stop $$(docker ps -qa);
	@docker rm $$(docker ps -qa);
	@docker rmi -f $$(docker images -qa);
	@docker volume rm $$(docker volume ls -q);
	@docker network rm transcenduns_default;
	@docker system prune -af;
