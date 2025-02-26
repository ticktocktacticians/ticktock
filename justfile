set dotenv-load

setup:
  cd ./client-web && pnpm install
  just start-infra

# Creates required extensions
setup-server-db:
  export PGPASSWORD=$PGPASSWORD
  docker exec ticktock-db psql -h $PGHOST -d $PGDATABASE -U $PGUSER -p 5432 -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'

# Run app

start-client:
  cd ./client-web && pnpm run dev

start-server:
  cd ./server && DOTENV_PATH=../.env go run *.go

start-infra:
  cd ./infra && docker compose up --detach

stop-infra:
  cd ./infra && docker compose stop
