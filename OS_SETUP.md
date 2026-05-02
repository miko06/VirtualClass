# OS Setup — VirtualClass

Инструкция по развертыванию проекта VirtualClass на Ubuntu Server.

---

## 1. Выбранная ОС

**Ubuntu Server 22.04 LTS** — стабильный, долгосрочный релиз с поддержкой Docker и всеми необходимыми инструментами.

---

## 2. Минимальные требования

| Ресурс | Минимум | Рекомендуется |
|--------|---------|---------------|
| CPU | 2 ядра | 4 ядра |
| RAM | 4 GB | 8 GB |
| Диск | 30 GB | 50 GB SSD |
| ОС | Ubuntu Server 22.04 | Ubuntu Server 22.04 |

> **Примечание**: 4 GB RAM может быть недостаточно при одновременной работе всех сервисов (включая мониторинг). Рекомендуется 8 GB.

---

## 3. Установка системы

### 3.1 Обновление пакетов

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git vim htop net-tools ca-certificates gnupg lsb-release
```

### 3.2 Установка Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
newgrp docker
```

### 3.3 Установка Docker Compose plugin

```bash
sudo apt install -y docker-compose-plugin
```

Проверка:

```bash
docker --version
docker compose version
```

### 3.4 Настройка UFW Firewall

```bash
# Разрешить SSH (если стандартный порт 22, иначе замените)
sudo ufw allow 22/tcp

# Основные порты проекта
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Мониторинг
sudo ufw allow 9090/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 9093/tcp

# n8n
sudo ufw allow 5678/tcp

# SSH контейнер (профиль security)
sudo ufw allow 2222/tcp

# Jenny CI (опционально)
sudo ufw allow 8081/tcp

# Включить фаервол
sudo ufw enable
sudo ufw status verbose
```

---

## 4. Управление пользователями

### 4.1 Создание пользователя

```bash
sudo useradd -m -s /bin/bash vcadmin
sudo passwd vcadmin
```

### 4.2 Добавление в группы

```bash
sudo usermod -aG docker,sudo vcadmin
```

### 4.3 Настройка прав на папку проекта

```bash
sudo chown -R vcadmin:vcadmin /opt/VirtualClass
```

---

## 5. Переменные окружения

Полный список всех переменных в `.env` файле:

### База данных

```env
POSTGRES_DB=vc                    # Название базы данных
POSTGRES_USER=vc                  # Пользователь БД
POSTGRES_PASSWORD=YOUR_PASSWORD   # Пароль БД

# CORS (для продакшена — укажите URL фронтенда)
FRONTEND_URL=
```

### n8n (AI интеграция)

```env
N8N_WEBHOOK_URL=http://n8n:5678/webhook/virtualclass-ai
N8N_ENCRYPTION_KEY=your-secret-key  # Ключ шифрования n8n
N8N_API_KEY=n8n_api_key             # API ключ n8n
N8N_EDITOR_BASE_URL=http://localhost:5678
```

### OpenRouter API (для AI)

```env
OPENAI_API_KEY=sk-or-v1-your-key    # API ключ с openrouter.ai
```

### Telegram Bot (мониторинг)

```env
TELEGRAM_BOT_TOKEN=                 # Токен бота от @BotFather
TELEGRAM_CHAT_ID=                   # ID чата/пользователя для уведомлений
SERVER_IP=                          # Публичный IP сервера для ссылок
```

### Grafana

```env
GRAFANA_USER=admin
GRAFANA_PASSWORD=admin123           # Смените в продакшене!
```

### SSH (профиль security)

```env
SSH_USER=vcadmin
SSH_PUID=1000
SSH_PGID=1000
```

### Лимиты памяти (опционально)

```env
POSTGRES_MEM_LIMIT=512m
BACKEND_MEM_LIMIT=768m
FRONTEND_MEM_LIMIT=512m
NGINX_MEM_LIMIT=256m
N8N_MEM_LIMIT=512m
BACKUP_MEM_LIMIT=256m
FAIL2BAN_MEM_LIMIT=256m
SSH_MEM_LIMIT=128m
JENKINS_MEM_LIMIT=1024m
PROMETHEUS_MEM_LIMIT=512m
NODE_EXPORTER_MEM_LIMIT=128m
POSTGRES_EXPORTER_MEM_LIMIT=128m
GRAFANA_MEM_LIMIT=256m
ALERTMANAGER_MEM_LIMIT=128m
TELEGRAM_BOT_MEM_LIMIT=256m
```

### Резервное копирование

```env
BACKUP_RETENTION_DAYS=7             # Хранить бэкапы N дней
BACKUP_INTERVAL_SECONDS=86400       # Интервал (86400 = 24 часа)
```

### Часовой пояс

```env
TZ=Asia/Almaty
```

---

## 6. Запуск проекта

### 6.1 Клонирование репозитория

```bash
git clone <repository-url> /opt/VirtualClass
cd /opt/VirtualClass
```

### 6.2 Настройка окружения

```bash
cp .env.docker.example .env
nano .env   # заполните все необходимые переменные
```

### 6.3 Генерация SSL сертификата

```bash
chmod +x scripts/generate-ssl.sh
./scripts/generate-ssl.sh
```

### 6.4 Запуск Docker Compose

```bash
# Основные сервисы
docker compose up -d

# С профилем безопасности (fail2ban + ssh)
docker compose --profile security up -d

# С Jenkins
docker compose --profile ci up -d
```

### 6.5 Инициализация БД (первый запуск)

```bash
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed
```

---

## 7. Проверка работоспособности

### Основные сервисы

| Сервис | URL | Статус |
|--------|-----|--------|
| Приложение | https://SERVER_IP | ⬜ |
| Backend API | https://SERVER_IP/api | ⬜ |
| n8n | http://SERVER_IP:5678 | ⬜ |

### Мониторинг

| Сервис | URL | Статус |
|--------|-----|--------|
| Prometheus | http://SERVER_IP:9090 | ⬜ |
| Grafana | http://SERVER_IP:3000 | ⬜ |
| Alertmanager | http://SERVER_IP:9093 | ⬜ |

### Проверка через CLI

```bash
# Статус всех контейнеров
docker compose ps

# Проверка Prometheus targets
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool

# Проверка Alertmanager алертов
curl -s http://localhost:9093/api/v1/alerts | python3 -m json.tool

# Проверка Grafana (должен вернуть 200)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health

# Проверка nginx
curl -I -k https://localhost

# Проверка БД
docker exec -it vc-postgres psql -U vc -d vc -c "SELECT version();"
```
