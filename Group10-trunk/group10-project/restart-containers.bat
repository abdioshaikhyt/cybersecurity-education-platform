docker desktop stop
docker desktop start

echo Stopping and removing containers...

docker-compose down

echo Building Docker images...

docker-compose build

echo Starting the containers...

docker-compose up -d