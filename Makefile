all:
	sudo docker compose up -d --build
down:
	sudo docker compose down
list:
	sudo docker volume ls
migrate:
	sudo docker exec -it back python /app/crazy_pong/manage.py migrate
clean:
#   sudo docker stop $$(sudo docker ps -qa);
# 	sudo docker rm $$(sudo docker ps -qa);
# 	sudo docker rmi -f $$(sudo docker images -qa);
	sudo docker volume rm $(sudo docker volume ls -q)
	sudo docker network rm $(sudo docker network ls -q);
	sudo docker system prune -a;
