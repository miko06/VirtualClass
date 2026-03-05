# SSH

Сервис `ssh` запускается только при профиле `security` и использует ключевую авторизацию.

## Шаги

1. Добавьте публичный ключ в файл:
   - `security/ssh/config/keys/authorized_keys`
2. Запустите сервис:

```bash
docker compose --profile security up -d ssh
```

3. Подключение:

```bash
ssh -p 2222 vcadmin@localhost
```

Пользователь меняется через переменную `SSH_USER`.

