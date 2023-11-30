all:
	@docker-compose up -d --build
down:
	@docker-compose down
clean:
	@docker stop $$(docker ps -qa);
	@docker rm $$(docker ps -qa);
	@docker rmi -f $$(docker images -qa);
	@docker volume rm transcenduns_backend_data;
	@docker volume rm transcenduns_postgres_data;
	@docker network rm transcenduns_default;
	@docker system prune -af;

migrations:
	@docker exec -it back python /app/crazy_pong/manage.py makemigrations
	@docker exec -it back python /app/crazy_pong/manage.py migrate
