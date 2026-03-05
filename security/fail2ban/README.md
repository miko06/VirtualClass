# Fail2ban

`fail2ban` защищает от brute-force (подбора пароля) по:

- `POST /api/users/login` через Nginx access log
- SSH (порт `2222`, если включён профиль `security`)

## Запуск

```bash
docker compose --profile security up -d fail2ban
```

## Проверка

```bash
docker compose --profile security logs -f fail2ban
```

