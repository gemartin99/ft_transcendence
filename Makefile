all:
	@docker-compose up -d --build
down:
	@docker-compose down
migrate:
	docker exec -it back python /app/crazy_pong/manage.py migrate
clean:
	@docker stop $$(docker ps -qa);
	@docker rm $$(docker ps -qa);
	@docker rmi -f $$(docker images -qa);
	@docker volume rm $$(docker volume ls -q);
	@docker network rm $$(docker network ls -q);
	@docker system prune -a;
