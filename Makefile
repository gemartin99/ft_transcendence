all:
	@docker-compose up -d --build
down:
	@docker-compose down
clean:
	@docker stop $$(docker ps -qa);
	@docker rm $$(docker ps -qa);
	@docker rmi -f $$(docker images -qa);
	@docker volume rm ft_trascendance_backend_data;
	@docker volume rm ft_trascendance_postgres_data;
	@docker network rm ft_trascendance_default;
	@docker system prune -af;
