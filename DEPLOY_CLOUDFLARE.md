# VirtualClass - Деплой на Ubuntu VM с Cloudflare Tunnel
# Полный план действий

## Быстрый старт (5 минут)

### 1. Скачайте скрипт на VM

В терминале вашей Ubuntu VM выполните:

```bash
cd ~
```

### 2. Скопируйте файлы проекта на VM

**Вариант A: Через git (рекомендуется)**

```bash
git clone <URL_вашего_репозитория> VirtualClass
cd VirtualClass
```

**Вариант B: Через Shared Folder VirtualBox**

1. В VirtualBox: Устройства → Общие папки → Настройки общих папок
2. Добавьте папку с проектом, включите "Автоподключение"
3. Внутри VM:
   ```bash
   sudo mkdir -p /mnt/shared
   sudo mount -t vboxsf <имя_папки> /mnt/shared
   cp -r /mnt/shared/VirtualClass ~/VirtualClass
   cd ~/VirtualClass
   ```

**Вариант C: Через SCP с хоста**

На вашем хосте (macOS/Windows с WSL):
```bash
scp -r /путь/к/VirtualClass mu@172.20.10.2:~/
```

### 3. Отредактируйте скрипт

```bash
nano deploy-full.sh
```

**Обязательно измените строку 19:**
```bash
REPO_URL="https://github.com/ВАШ_ЮЗЕРНЕЙМ/ВАШ_РЕПО.git"
```

Замените на URL вашего репозитория GitHub.

Если вы скопировали проект вручную (не через git), можете оставить как есть — скрипт найдёт папку `~/VirtualClass`.

### 4. Запустите скрипт

```bash
chmod +x deploy-full.sh
./deploy-full.sh
```

Скрипт выполнит всё автоматически:
- Установит Docker
- Установит Git
- Настроит `.env` с безопасными паролями
- Запустит все контейнеры
- Инициализирует базу данных
- Установит Cloudflare Tunnel
- Запустит туннель как сервис

### 5. Авторизация Cloudflare

На шаге 9 скрипт попросит авторизоваться:

```
АВТОРИЗАЦИЯ CLOUDFLARE
========================================
Сейчас откроется ссылка для авторизации.
Если вы в SSH без браузера:
  1. Скопируйте ссылку
  2. Откройте её в браузере на вашем компьютере
  3. Войдите в Cloudflare аккаунт
  4. Выберите домен (если есть) или нажмите Cancel для бесплатного поддомена
```

**Что делать:**

1. Скрипт выведет URL типа:
   ```
   https://dash.cloudflare.com/argotunnel?callback=https%3A%2F%2Flocalhost%3A...%3Ftunnel%3D...
   ```

2. **Скопируйте эту ссылку** (выделите мышкой в терминале, обычно Ctrl+Shift+C)

3. **Откройте ссылку в браузере на вашем основном компьютере** (не в VM)

4. Войдите в Cloudflare аккаунт (или создайте бесплатный)

5. Если у вас **есть свой домен** — выберите его
   
   Если **нет домена** — просто закройте страницу (Cancel) и скрипт создаст бесплатный поддомен `*.trycloudflare.com`

6. В терминале VM нажмите **Enter** для продолжения

### 6. Готово!

Скрипт выведет финальную информацию:

```
============================================
 ДЕПЛОЙ ЗАВЕРШЁН!
============================================

Ваш сайт доступен по адресам:

  Локально в VM:     http://localhost
  В локальной сети:  http://172.20.10.2
  Из интернета:      https://abc123.trycloudflare.com

API Endpoints:
  - Сайт:    http://172.20.10.2/
  - API:     http://172.20.10.2/api
  - n8n:     http://172.20.10.2:5678
```

**Откройте `https://abc123.trycloudflare.com` в браузере** — сайт будет работать из любой точки мира!

---

## Детальное объяснение каждого шага

### Что делает скрипт?

| Шаг | Действие | Время |
|-----|----------|-------|
| 1 | Обновление Ubuntu | 1-2 мин |
| 2 | Установка Docker + Docker Compose | 2-3 мин |
| 3 | Установка Git | 10 сек |
| 4 | Клонирование/обновление репозитория | 10-30 сек |
| 5 | Создание `.env` с безопасными паролями | 5 сек |
| 6 | Сборка и запуск Docker контейнеров | 3-5 мин |
| 7 | Применение миграций Prisma + Seed | 30 сек |
| 8 | Установка Cloudflare Tunnel | 30 сек |
| 9 | Авторизация и создание туннеля | 1-2 мин |
| 10 | Запуск туннеля как системный сервис | 10 сек |

**Итого: ~10-15 минут**

### Что такое Cloudflare Tunnel?

Это безопасный туннель от вашей VM к сети Cloudflare. Работает так:

```
[Интернет] ←→ [Cloudflare CDN] ←→ [Cloudflare Tunnel] ←→ [Ваша VM]
```

**Преимущества:**
- Не нужен белый IP
- Не нужно настраивать роутер
- Работает за NAT и CGNAT
- Автоматический HTTPS
- DDoS защита
- Бесплатно

### Структура Docker в продакшене

```
nginx (порт 80) ← Reverse Proxy
  ├── /api/* → backend:3001 (NestJS)
  ├── / → frontend:4173 (React)
  
backend:3001 ← API сервер
  └── postgres:5432 ← PostgreSQL
  
n8n:5678 ← Автоматизация
```

---

## После деплоя

### Управление проектом

```bash
cd ~/VirtualClass

# Статус контейнеров
docker compose -f docker-compose.prod.yml ps

# Логи
docker compose -f docker-compose.prod.yml logs -f
docker compose -f docker-compose.prod.yml logs -f backend

# Перезапуск
docker compose -f docker-compose.prod.yml restart

# Пересборка после изменений
docker compose -f docker-compose.prod.yml up -d --build

# Полный сброс (удалит данные БД!)
docker compose -f docker-compose.prod.yml down -v
```

### Управление туннелем

```bash
# Статус туннеля
sudo systemctl status cloudflared

# Перезапуск туннеля
sudo systemctl restart cloudflared

# Логи туннеля
sudo journalctl -u cloudflared -f

# Список туннелей
cloudflared tunnel list

# Удалить туннель
cloudflared tunnel delete virtualclass
```

### Обновление проекта

Если вы внесли изменения в код и запушили в GitHub:

```bash
cd ~/VirtualClass
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### Резервное копирование БД

```bash
# Ручной бэкап
docker exec vc-postgres pg_dump -U vc -d vc > backup_$(date +%Y%m%d_%H%M%S).sql

# Автоматический бэкап уже настроен (контейнер backup)
ls ~/VirtualClass/backup/data/
```

---

## Устранение неполадок

### "Docker permission denied"

```bash
newgrp docker
# или перелогиньтесь и запустите заново
```

### "Port 80 is already allocated"

```bash
# Найдите, что занимает порт
sudo lsof -i :80

# Остановите apache/nginx на хосте VM
sudo systemctl stop apache2
sudo systemctl stop nginx
```

### Туннель не создаётся

```bash
# Запустите туннель вручную для диагностики
cloudflared tunnel --url http://localhost:80
```

### Нет доступа к trycloudflare.com

Некоторые провайдеры или корпоративные сети блокируют `*.trycloudflare.com`. Попробуйте:
1. Использовать VPN
2. Или настроить свой домен в Cloudflare

### База данных не инициализирована

```bash
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed
```

### Забыли пароль администратора

```bash
cd ~/VirtualClass/backend
docker exec -it vc-backend npx ts-node reset-admin-pwd.ts
```

---

## Безопасность

1. **Смените пароли** — скрипт генерирует случайные, но вы можете изменить в `.env`
2. **Не коммитьте `.env`** — он уже в `.gitignore`
3. **Включите фаервол**:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP (для nginx)
   sudo ufw enable
   ```
4. **Обновляйте систему регулярно**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

---

## Вопросы?

Если что-то не работает:

1. Проверьте логи: `docker compose -f docker-compose.prod.yml logs`
2. Проверьте статус туннеля: `sudo systemctl status cloudflared`
3. Убедитесь, что VM имеет интернет: `ping google.com`
4. Проверьте, что все контейнеры работают: `docker ps`

Успехов! 🚀
