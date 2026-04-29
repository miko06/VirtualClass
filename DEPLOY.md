# Деплой VirtualClass на Ubuntu VM (VirtualBox) с интернет-доступом

## Общая схема

```
Интернет
    │
    ▼
[Роутер] ← Port Forwarding (80, 443)
    │
    ▼
[Хост-машина (macOS/Windows)]
    │
    ▼
[VirtualBox VM - Ubuntu] ← Bridge Adapter
    │
    ▼
[Nginx Docker] ← 80/443
    │
    ├── [Frontend] ← React/Vite
    ├── [Backend] ← NestJS API
    ├── [PostgreSQL] ← База данных
    └── [n8n] ← Автоматизация
```

---

## Шаг 1: Настройка сети VirtualBox

### Вариант 1: Bridge Adapter (Рекомендуется)

VM получает IP-адрес в той же сети, что и ваш хост (компьютер).

1. **Выключите VM** (полностью, не сохранять состояние)
2. Откройте VirtualBox → Выберите VM → **Настройки** → **Сеть**
3. **Адаптер 1** → Включить сетевой адаптер
4. **Тип подключения**: `Сетевой мост` (Bridge Adapter)
5. **Имя**: Выберите ваш физический интерфейс (Wi-Fi или Ethernet)
6. Нажмите **OK**
7. Запустите VM

### Проверка IP внутри VM

```bash
ip addr show
```

Ищите строку типа:
```
inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic eth0
```

Запишите IP (в примере: `192.168.1.105`).

### Проверка с хоста

С вашего основного компьютера выполните:
```bash
ping <IP_VM>
```

---

## Шаг 2: Проброс портов на роутере (Port Forwarding)

Чтобы сайт был доступен из интернета, нужно пробросить порты на роутере.

1. Откройте настройки роутера (обычно `192.168.1.1` или `192.168.0.1`)
2. Найдите раздел **Port Forwarding** / **Виртуальные серверы** / **NAT**
3. Добавьте правила:

| Внешний порт | Внутренний IP | Внутренний порт | Протокол |
|-------------|---------------|-----------------|----------|
| 80          | IP вашей VM   | 80              | TCP      |
| 443         | IP вашей VM   | 443             | TCP      |
| 5678        | IP вашей VM   | 5678            | TCP      |

> **Важно**: VM должна иметь **статический IP** в локальной сети. Настройте это в настройках сети Ubuntu или в роутере (DHCP reservations).

---

## Шаг 3: Узнайте ваш внешний IP

На хосте или в VM:
```bash
curl ifconfig.me
```

Это ваш IP для доступа из интернета. Проверьте:
```bash
curl http://<ваш_внешний_IP>/api
```

---

## Шаг 4: Автоматический деплой

### Способ A: Через скрипт (быстрее)

Внутри Ubuntu VM выполните:

```bash
# 1. Установка Docker
sudo apt update && sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker

# 2. Клонирование репозитория
git clone <URL_вашего_репозитория>
cd VirtualClass

# 3. Настройка окружения
cp .env.docker.example .env
nano .env  # Обязательно измените пароли!

# 4. Запуск
docker compose -f docker-compose.prod.yml up -d --build

# 5. Инициализация БД
sleep 15
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed
```

### Способ B: Вручную пошагово

Если скрипт не подходит, выполните каждый шаг вручную:

#### 4.1 Установка Docker

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg lsb-release

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo usermod -aG docker $USER
newgrp docker
```

#### 4.2 Клонирование и настройка

```bash
git clone <URL_репозитория>
cd VirtualClass

cp .env.docker.example .env
# Отредактируйте .env: смените все пароли!
```

#### 4.3 Обязательные изменения в .env

```env
# База данных - СМЕНИТЕ ПАРОЛЬ!
POSTGRES_PASSWORD=ваш_очень_сложный_пароль_123!

# n8n - СМЕНИТЕ КЛЮЧИ!
N8N_ENCRYPTION_KEY=длинный_случайный_ключ_минимум_32_символа
N8N_API_KEY=ваш_секретный_api_ключ

# Вебхук n8n (используйте ваш внешний IP или домен)
N8N_WEBHOOK_URL=http://ваш_ip/webhook/virtualclass-ai
N8N_EDITOR_BASE_URL=http://ваш_ip:5678

# OpenAI (если используете)
OPENAI_API_KEY=sk-...
```

#### 4.4 Запуск

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

#### 4.5 Инициализация базы данных

```bash
# Ждём запуска postgres
sleep 10

# Применяем миграции
docker exec -it vc-backend npx prisma migrate deploy

# Заполняем тестовыми данными
docker exec -it vc-backend npx prisma db seed
```

---

## Шаг 5: Проверка работы

### Внутри VM

```bash
docker compose -f docker-compose.prod.yml ps
```

Должно быть 6 контейнеров: postgres, backend, frontend, nginx, n8n, backup — все со статусом `Up`.

### С хост-машины

```bash
curl http://<IP_VM>/api
```

### Из интернета

Откройте в браузере:
```
http://<ваш_внешний_IP>
```

---

## Шаг 6: Настройка домена (опционально, но рекомендуется)

### Если у вас есть домен

1. Создайте A-запись у регистратора:
   - Имя: `@` (или `vc`, `app`)
   - Значение: `<ваш_внешний_IP>`

2. Подождите 5-30 минут (распространение DNS)

3. Обновите `nginx/nginx.prod.conf`:
```nginx
server {
  listen 80;
  server_name ваш-домен.kz;
  # ...
}
```

### Если нет домена / динамический IP

Используйте **No-IP** или **DuckDNS** для бесплатного домена:

```bash
# DuckDNS (бесплатно)
# Зарегистрируйтесь на duckdns.org
# Установите клиент обновления IP
```

---

## Шаг 7: Настройка HTTPS (SSL) - Опционально

Для продакшена **настоятельно рекомендуется** HTTPS.

### Через Let's Encrypt + Certbot

```bash
# На VM (не в Docker!)
sudo apt install -y certbot

# Получение сертификата
sudo certbot certonly --standalone -d ваш-домен.kz

# Сертификаты будут в:
# /etc/letsencrypt/live/ваш-домен.kz/fullchain.pem
# /etc/letsencrypt/live/ваш-домен.kz/privkey.pem
```

### Обновление nginx для HTTPS

Создайте `nginx/nginx.ssl.conf`:

```nginx
server {
  listen 80;
  server_name ваш-домен.kz;
  return 301 https://$server_name$request_uri;
}

server {
  listen 443 ssl;
  server_name ваш-домен.kz;

  ssl_certificate /etc/letsencrypt/live/ваш-домен.kz/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/ваш-домен.kz/privkey.pem;

  # ... остальная конфигурация
}
```

Обновите docker-compose.prod.yml для монтирования сертификатов.

---

## Шаг 8: Обновление CORS для продакшена

В `backend/src/main.ts` уже настроено чтение `FRONTEND_URL` из переменных окружения.

Добавьте в `.env` (или docker-compose.prod.yml environment для backend):

```env
FRONTEND_URL=http://ваш_ip_или_домен
```

Если оставить пустым — CORS разрешит все домены (только для теста!).

---

## Управление проектом

### Перезапуск

```bash
cd ~/VirtualClass
docker compose -f docker-compose.prod.yml restart
```

### Обновление после git push

```bash
cd ~/VirtualClass
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Просмотр логов

```bash
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f backend
```

### Остановка

```bash
docker compose -f docker-compose.prod.yml down
```

### Полный сброс (удалит данные БД!)

```bash
docker compose -f docker-compose.prod.yml down -v
```

---

## Устранение неполадок

### Порт 80 занят на VM

```bash
sudo lsof -i :80
sudo systemctl stop apache2  # если apache
sudo systemctl stop nginx     # если nginx на хосте
```

### Нет доступа из интернета

1. Проверьте, что порт 80 открыт на VM:
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

2. Проверьте настройки роутера (Port Forwarding)

3. Проверьте, что ваш провайдер не блокирует 80 порт (некоторые мобильные провайдеры блокируют)

### VM не получает IP по Bridge

```bash
# Внутри VM
sudo dhclient -v eth0
```

Или используйте NAT с Port Forwarding:
- VirtualBox → Настройки → Сеть → Дополнительно → Проброс портов
- Добавьте: Хост-порт 80 → Гостевой порт 80
- Добавьте: Хост-порт 443 → Гостевой порт 443

### Проблемы с Docker

```bash
# Перезапуск Docker
sudo systemctl restart docker

# Очистка
sudo docker system prune -a
```

---

## Безопасность

1. **Обязательно смените пароли** в `.env`
2. **Отключите root-доступ** по SSH
3. **Настройте фаервол**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
4. **Регулярно обновляйте систему**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
