# Проверка работоспособности компонентов

## Содержание
1. [Nginx](#1-nginx)
2. [Fail2ban](#2-fail2ban)
3. [SSH](#3-ssh)
4. [Firewall (UFW)](#4-firewall-ufw)
5. [Backup](#5-backup)

---

## 1. Nginx

Nginx работает как reverse proxy: раздаёт фронтенд на `/`, проксирует API на `/api/`, ограничивает brute-force на `/api/users/login`.

### 1.1 Статус контейнера

```bash
docker compose ps nginx
```

Ожидаемый результат: статус `running` или `Up`.

### 1.2 Конфигурация без ошибок

```bash
docker compose exec nginx nginx -t
```

Ожидаемый результат:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 1.3 HTTP-ответ от сервера

```bash
curl -I http://localhost
```

Ожидаемый результат: `HTTP/1.1 200 OK` и заголовки безопасности:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 1.4 Проксирование API

```bash
curl -s http://localhost/api/users/me
```

Ответ должен прийти от backend (например, `401 Unauthorized` или JSON), а не ошибка nginx.

### 1.5 Rate limit на login

Выполните 9+ быстрых запросов подряд:

```bash
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost/api/users/login \
    -H "Content-Type: application/json" \
    -d '{"email":"x@x.com","password":"wrong"}'
done
```

На 9-м и далее запросах должен появиться `503` (burst=10 исчерпан) — rate limit работает.

### 1.6 Логи nginx

```bash
docker compose logs nginx --tail=50
# или напрямую из volume:
docker compose exec nginx tail -n 50 /var/log/nginx/access.log
```

---

## 2. Fail2ban

Fail2ban защищает от брутфорса `/api/users/login` (nginx-login jail) и SSH (sshd jail).
Запускается только с профилем `security`.

### 2.1 Запуск (если ещё не запущен)

```bash
docker compose --profile security up -d fail2ban
```

### 2.2 Статус контейнера

```bash
docker compose --profile security ps fail2ban
```

Ожидаемый результат: `running`.

### 2.3 Статус jail-ов

```bash
docker compose --profile security exec fail2ban fail2ban-client status
```

Должны отображаться два jail: `nginx-login` и `sshd`.

Детали конкретного jail:

```bash
docker compose --profile security exec fail2ban fail2ban-client status nginx-login
docker compose --profile security exec fail2ban fail2ban-client status sshd
```

Поля `Currently banned` и `Total banned` показывают количество заблокированных IP.

### 2.4 Логи fail2ban

```bash
docker compose --profile security logs -f fail2ban
```

Строки вида `Ban <IP>` подтверждают, что блокировки применяются.

### 2.5 Проверка блокировки вручную

```bash
# Заблокировать тестовый IP
docker compose --profile security exec fail2ban \
  fail2ban-client set nginx-login banip 1.2.3.4

# Убедиться что он заблокирован
docker compose --profile security exec fail2ban \
  fail2ban-client status nginx-login

# Разблокировать после проверки
docker compose --profile security exec fail2ban \
  fail2ban-client set nginx-login unbanip 1.2.3.4
```

### 2.6 Параметры jail (для справки)

| Jail        | maxretry | findtime | bantime |
|-------------|----------|----------|---------|
| nginx-login | 8        | 10m      | 2h      |
| sshd        | 5        | 10m      | 1h      |

---

## 3. SSH

SSH-контейнер разрешает вход только по ключу. Запускается с профилем `security`.

### 3.1 Предварительное условие

Публичный ключ должен находиться в `security/ssh/config/keys/authorized_keys`:

```bash
cat security/ssh/config/keys/authorized_keys
```

### 3.2 Запуск (если ещё не запущен)

```bash
docker compose --profile security up -d ssh
```

### 3.3 Статус контейнера

```bash
docker compose --profile security ps ssh
```

Ожидаемый результат: `running`, порт `2222` открыт.

### 3.4 Доступность порта

```bash
nc -zv localhost 2222
```

Ожидаемый результат: `Connection to localhost port 2222 [tcp/*] succeeded!`

### 3.5 Подключение по SSH

```bash
ssh -p 2222 vcadmin@localhost
```

По умолчанию пользователь `vcadmin` (меняется через переменную `SSH_USER` в `.env`).

Если ключ не в стандартном месте:

```bash
ssh -i /path/to/private_key -p 2222 vcadmin@localhost
```

### 3.6 Проверка отказа парольного входа

```bash
ssh -p 2222 -o PasswordAuthentication=yes vcadmin@localhost
```

Должно вернуть ошибку — парольный доступ отключён (`PASSWORD_ACCESS: false`).

### 3.7 Логи SSH

```bash
docker compose --profile security logs ssh --tail=50
```

---

## 4. Firewall (UFW)

UFW настраивается на **хост-машине** (сервере), не внутри контейнера.
Открытые порты: `80/tcp` (nginx), `443/tcp` (HTTPS), `2222/tcp` (SSH-контейнер).

### 4.1 Первоначальная настройка

```bash
sudo ./security/firewall-setup.sh
```

### 4.2 Статус UFW

```bash
sudo ufw status verbose
```

Ожидаемый результат:
```
Status: active
...
80/tcp    ALLOW IN    Anywhere
443/tcp   ALLOW IN    Anywhere
2222/tcp  ALLOW IN    Anywhere
```

### 4.3 Проверка правил

```bash
sudo ufw status numbered
```

Все правила должны быть только для портов 80, 443 и 2222. По умолчанию всё входящее запрещено (`default deny incoming`).

### 4.4 Проверка закрытости других портов

```bash
# Порт 5432 (PostgreSQL) должен быть закрыт снаружи
nc -zv <IP_сервера> 5432   # должно завершиться с ошибкой Connection refused
nc -zv <IP_сервера> 3001   # backend — тоже не должен быть доступен снаружи
```

### 4.5 Сброс и повторная настройка (при необходимости)

```bash
sudo ufw --force reset
sudo ./security/firewall-setup.sh
```

---

## 5. Backup

Контейнер `backup` снимает дамп PostgreSQL каждые 24 часа (по умолчанию) и хранит файлы 7 дней.

### 5.1 Статус контейнера

```bash
docker compose ps backup
```

Ожидаемый результат: `running`.

### 5.2 Логи backup

```bash
docker compose logs backup --tail=20
```

Ожидаемые строки:
```
[backup] service started: db=vc, retention=7d, interval=86400s
[backup] created /backups/vc_20260308_120000.dump
```

Если в логах `[backup] failed to create dump` — проверьте доступность PostgreSQL.

### 5.3 Проверка наличия файлов

```bash
ls -lh backup/data/
```

Файлы в формате `vc_YYYYMMDD_HHMMSS.dump`. Если папка пуста — первый бэкап ещё не создан (запускается при старте контейнера, затем каждые 24ч).

### 5.4 Запуск бэкапа немедленно (без ожидания)

Перезапустите контейнер — скрипт создаёт дамп сразу при старте:

```bash
docker compose restart backup
docker compose logs backup --tail=10
```

### 5.5 Проверка корректности дампа

```bash
# Посмотреть содержимое дампа без восстановления
pg_restore --list backup/data/<имя_файла>.dump | head -30
```

### 5.6 Тестовое восстановление

> **Осторожно:** выполняйте только в тестовой среде — команда очищает данные в БД (`-c`).

```bash
docker compose exec -T postgres \
  pg_restore -U vc -d vc -c \
  < backup/data/<имя_файла>.dump
```

### 5.7 Настройка интервала и хранения (через .env)

```dotenv
BACKUP_RETENTION_DAYS=7       # сколько дней хранить дампы
BACKUP_INTERVAL_SECONDS=86400 # интервал между дампами (в секундах)
```

После изменения:

```bash
docker compose up -d backup
```

---

## Быстрый чеклист

| Компонент | Команда проверки | Ожидаемый признак работы |
|-----------|-----------------|--------------------------|
| Nginx     | `docker compose ps nginx` | `running` |
| Nginx конфиг | `docker compose exec nginx nginx -t` | `syntax ok` |
| HTTP доступ | `curl -I http://localhost` | `200 OK` |
| Fail2ban  | `docker compose --profile security exec fail2ban fail2ban-client status` | jail-ы `nginx-login`, `sshd` |
| SSH порт  | `nc -zv localhost 2222` | `succeeded` |
| SSH вход  | `ssh -p 2222 vcadmin@localhost` | успешный вход по ключу |
| Firewall  | `sudo ufw status verbose` | `Status: active`, порты 80/443/2222 |
| Backup файлы | `ls -lh backup/data/` | наличие `.dump` файлов |
| Backup логи | `docker compose logs backup --tail=5` | `[backup] created ...` |
