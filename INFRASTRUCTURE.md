# VirtualClass Infrastructure

Структура после внедрения:

```text
VirtualClass
 ├ backend
 ├ frontend
 ├ nginx
 ├ postgres
 ├ backup
 ├ security
 │   ├ fail2ban
 │   └ ssh
 └ docker-compose.yml
```

## Что внедрено

- `nginx` reverse proxy для `frontend` + `backend`
- Защита от brute-force:
  - rate limit на `/api/users/login` в nginx
  - fail2ban фильтр по логам nginx
- `backup` контейнер для регулярного `pg_dump`
- `ssh` контейнер с доступом по ключу (профиль `security`)
- host firewall скрипт на UFW
- backend AI endpoint `/ai/chat` с доступом к файлам проекта (`PROJECT_ROOT=/workspace`)

## Запуск

```bash
docker compose up -d
```

Сервис безопасности:

```bash
docker compose --profile security up -d
```

## Память контейнеров (Docker Compose)

Лимиты памяти заданы через переменные в `docker-compose.yml`:

- `POSTGRES_MEM_LIMIT`
- `BACKEND_MEM_LIMIT`
- `FRONTEND_MEM_LIMIT`
- `NGINX_MEM_LIMIT`
- `BACKUP_MEM_LIMIT`
- `FAIL2BAN_MEM_LIMIT`
- `SSH_MEM_LIMIT`

Как изменить:

1. Скопируйте `.env.docker.example` в `.env.docker`.
2. Измените нужные значения (например `BACKEND_MEM_LIMIT=1g`).
3. Запустите:

```bash
docker compose --env-file .env.docker up -d --build
```

## Глобальная память Docker Desktop

Если контейнеры упираются в общий лимит Docker:

1. Docker Desktop -> `Settings`
2. `Resources`
3. `Memory` -> выставьте нужный объём
4. `Apply & Restart`
