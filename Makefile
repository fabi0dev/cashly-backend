dev-mode:
	docker-compose up -d
	npx prisma generate && npx prisma migrate deploy && npx prisma db seed
	nest start --watch
dev-off:
	docker-compose down
