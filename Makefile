start-prod:
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

start:
    docker compose up --build -d

stop:
    docker compose down

stop-prod:
    docker compose -f docker-compose.yml -f docker-compose.prod.yml down

restart:
    docker compose restart

restart-prod:
    docker compose -f docker-compose.yml -f docker-compose.prod.yml restart
