docker desktop stop
docker desktop start

echo Stopping and removing containers...

docker-compose down

echo Removing old images...

docker rmi $(docker images -q)

echo Building Docker images...

docker-compose build --no-cache

echo Starting the containers...

docker-compose up -d