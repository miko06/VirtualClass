# VirtualClass - Виртуальный класс с ИИ

Полная документация по запуску, настройке и использованию проекта VirtualClass.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура](#архитектура)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Доступ к приложению](#доступ-к-приложению)
- [Учетные данные по умолчанию](#учетные-данные-по-умолчанию)
- [🤖 AI Интеграция](#-ai-интеграция)
- [📊 Мониторинг](#-мониторинг)
- [🔐 HTTPS](#-https)
- [Работа с базой данных](#работа-с-базой-данных)
- [Разработка](#разработка)
- [Управление контейнерами](#управление-контейнерами)
- [Резервное копирование](#резервное-копирование)
- [Безопасность](#безопасность)
- [CI/CD и IaC](#cicd-и-iac)
- [Устранение неполадок](#устранение-неполадок)

---

## 📝 Описание проекта

VirtualClass - это веб-платформа для управления виртуальными классами с интеграцией искусственного интеллекта. Проект включает в себя:

- **Frontend**: React-приложение с Vite
- **Backend**: NestJS API с TypeScript
- **База данных**: PostgreSQL 15
- **AI интеграция**: n8n + OpenRouter API для AI-ассистента
- **Nginx**: Reverse proxy с HTTPS
- **Мониторинг**: Prometheus + Grafana + Alertmanager + Telegram Bot
- **Автоматическое резервное копирование**: Ежедневные бэкапы БД
- **Система безопасности**: Fail2ban, SSH доступ по ключу, SSL/TLS

---

## 🏗 Архитектура

```
VirtualClass/
├── backend/              # NestJS API (порт 3001)
├── frontend/             # React приложение (порт 4173)
├── nginx/                # Reverse proxy + SSL (порты 80, 443)
├── postgres/             # Инициализация PostgreSQL
├── prisma/               # Схема базы данных
├── backup/               # Скрипты и данные резервного копирования
├── security/             # Fail2ban и SSH конфигурация
├── monitoring/           # Prometheus + Grafana + Alertmanager + Telegram Bot
├── n8n/                  # n8n workflows (AI интеграция)
├── scripts/              # Вспомогательные скрипты
└── docker-compose.yml
```

### Сервисы Docker

- **postgres** - База данных PostgreSQL (порт 5432)
- **backend** - API сервер NestJS (порт 3001)
- **frontend** - React UI (порт 4173, через nginx)
- **nginx** - Reverse proxy с HTTPS (порты 80, 443)
- **n8n** - AI workflow automation (порт 5678)
- **backup** - Автоматическое резервное копирование
- **prometheus** - Сбор метрик (порт 9090)
- **node-exporter** - Метрики хостовой системы (порт 9100)
- **postgres-exporter** - Метрики PostgreSQL (порт 9187)
- **grafana** - Визуализация метрик (порт 3000)
- **alertmanager** - Управление алертами (порт 9093)
- **telegram-bot** - Telegram мониторинг-бот
- **fail2ban** - Защита от brute-force атак (опционально)
- **ssh** - SSH доступ для администрирования (опционально)
- **jenkins** - CI сервер (опционально, профиль `ci`)

---

## 💻 Требования

- **Docker** 20.10+
- **Docker Compose** 2.0+
- Минимум **4 GB** RAM для Docker (рекомендуется 8 GB)
- Порты **80**, **443**, **5432**, **2222**, **3000**, **9090**, **9093**, **5678**, **9100**, **9187** должны быть свободны
- OpenRouter API ключ для AI функциональности

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd VirtualClass
```

### 2. Настройка окружения

Скопируйте файл с примером конфигурации:

```bash
cp .env.docker.example .env
```

Отредактируйте `.env` и укажите:
- `POSTGRES_PASSWORD` — пароль базы данных
- `OPENAI_API_KEY` — OpenRouter API ключ (для AI)
- `TELEGRAM_BOT_TOKEN` — токен Telegram бота (для мониторинга)
- `TELEGRAM_CHAT_ID` — ваш Telegram chat ID
- `SERVER_IP` — публичный IP сервера

### 3. Генерация SSL сертификата

```bash
chmod +x scripts/generate-ssl.sh
./scripts/generate-ssl.sh
```

### 4. Запуск проекта

```bash
docker compose up -d
```

Дождитесь запуска всех контейнеров (1-2 минуты).

### 5. Инициализация базы данных

После первого запуска необходимо создать схему и заполнить тестовыми данными:

```bash
cd backend
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed
```

### 6. Готово!

Откройте браузер: **https://localhost**

---

## 🌐 Доступ к приложению

### Веб-интерфейс

- **URL**: https://localhost (редирект с HTTP)
- **Frontend**: https://localhost (маршрутизируется через Nginx)
- **Backend API**: https://localhost/api

### Прямой доступ к сервисам (только для разработки)

- **Backend**: https://localhost:3001
- **PostgreSQL**: localhost:5432
- **n8n**: http://localhost:5678
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin / admin123)
- **Alertmanager**: http://localhost:9093
- **SSH (при включенном профиле security)**: localhost:2222

---

## 🔑 Учетные данные по умолчанию

После выполнения `npx prisma db seed` создаются следующие пользователи:

### Администратор

```
Email: admin@enu.kz
Пароль: Admin123!
Роль: admin
```

### Преподаватели

```
Email: zheglisov.k@enu.kz
Пароль: Teacher123!
Роль: teacher

Email: zhukabaeva.t@enu.kz
Пароль: Teacher123!
Роль: teacher

Email: makhajanova.u@enu.kz
Пароль: Teacher123!
Роль: teacher

Email: yesenova.m@enu.kz
Пароль: Teacher123!
Роль: teacher
```

### Студенты

```
Email: student{N}@enu.kz  (где N = 1, 2, 3...)
Пароль: Student123!
Роль: student
```

### Сброс пароля администратора

Если вы забыли пароль администратора:

```bash
cd backend
docker exec -it vc-backend npx ts-node reset-admin-pwd.ts
```

Пароль будет сброшен на `Admin123!`

---

## 🤖 AI Интеграция

AI-ассистент реализован через **n8n** + **OpenRouter API**.

### Как это работает

1. **n8n** запущен как Docker-сервис и содержит workflow `virtualclass-ai-workflow.json`
2. **OpenRouter API** — сервис, предоставляющий доступ к различным AI-моделям (GPT, Claude, Gemini и др.)
3. Бэкенд отправляет запросы к n8n webhook, n8n обрабатывает их и вызывает OpenRouter API
4. Ответ от AI-модели возвращается пользователю в реальном времени

### Настройка

В `.env` файле укажите:

```env
OPENAI_API_KEY=sk-or-v1-your-openrouter-api-key
N8N_ENCRYPTION_KEY=your-secret-encryption-key
N8N_API_KEY=n8n_api_key
```

### Проверка работоспособности

1. Откройте n8n редактор: http://localhost:5678
2. Убедитесь, что workflow `virtualclass-ai` активен
3. В приложении откройте AI-ассистент и отправьте сообщение

---

## 📊 Мониторинг

Полный стек мониторинга на основе Prometheus:

### Сервисы

| Сервис | Порт | Назначение |
|--------|------|------------|
| **Prometheus** | `9090` | Сбор и хранение метрик |
| **Node Exporter** | `9100` | Метрики хостовой системы (CPU, RAM, диск, uptime) |
| **Postgres Exporter** | `9187` | Метрики PostgreSQL |
| **Grafana** | `3000` | Визуализация метрик и дашборды |
| **Alertmanager** | `9093` | Управление алертами |
| **Telegram Bot** | — | Мониторинг через Telegram с кнопками |

### Доступ

- **Prometheus UI**: http://localhost:9090
- **Grafana**: http://localhost:3000 (логин: `admin`, пароль: `admin123`)
- **Alertmanager**: http://localhost:9093

### Алерты

Настроены следующие алерты:
- **HighCpuUsage** — CPU > 80% (2 мин)
- **HighMemoryUsage** — RAM > 85% (2 мин)
- **LowDiskSpace** — диск < 15% (5 мин)
- **ServiceDown** — любой сервис недоступен (1 мин)
- **PostgresDown** — PostgreSQL недоступен

### Telegram Bot

Бот предоставляет мониторинг через Telegram с меню:

- 📊 **Статус сервисов** — запрашивает `up` метрики из Prometheus
- 💾 **Метрики сервера** — CPU, RAM, диск, uptime с прогресс-барами
- 🗄️ **База данных** — статус, соединения, размер, транзакции
- 🔔 **Активные алерты** — список из Alertmanager
- 📈 **Графики** — ссылки на Grafana дашборды

**Настройка:**
1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. В `.env` укажите `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`
3. Бот автоматически получает алерты от Alertmanager через webhook

---

## 🔐 HTTPS

Проект использует самоподписанный SSL сертификат.

### Генерация сертификата

```bash
chmod +x scripts/generate-ssl.sh
./scripts/generate-ssl.sh
```

Сертификат генерируется в `nginx/ssl/`:
- `server.crt` — сертификат
- `server.key` — приватный ключ

### Настройки Nginx

- HTTP (порт 80) → автоматический редирект на HTTPS
- HTTPS (порт 443) → само приложение
- Поддерживаются TLSv1.2 и TLSv1.3
- Заголовки безопасности: HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### Для продакшена

Замените самоподписанный сертификат на сертификат от Let's Encrypt (Certbot) или другого CA.

---

## 🗄 Работа с базой данных

### Подключение к PostgreSQL

**Через Docker:**

```bash
docker exec -it vc-postgres psql -U vc -d vc
```

**С хост-машины (если установлен psql):**

```bash
psql -h localhost -U vc -d vc
```

Пароль: `vc` (или из вашего `.env` файла)

### Просмотр данных

```sql
-- Список всех пользователей
SELECT id, email, name, role FROM "User";

-- Список дисциплин
SELECT * FROM "Discipline";

-- Список классов
SELECT * FROM "Class";

-- Проверка администратора
SELECT * FROM "User" WHERE email = 'admin@enu.kz';
```

### GUI инструменты

Вы можете использовать любой PostgreSQL клиент:

**Параметры подключения:**
- Хост: `localhost`
- Порт: `5432`
- База данных: `vc`
- Пользователь: `vc`
- Пароль: `vc`

Рекомендуемые инструменты:
- [pgAdmin](https://www.pgadmin.org/)
- [DBeaver](https://dbeaver.io/)
- [DataGrip](https://www.jetbrains.com/datagrip/)
- [Postico](https://eggerapps.at/postico/) (macOS)

### Работа с Prisma

**Применить миграции:**

```bash
cd backend
docker exec -it vc-backend npx prisma migrate deploy
```

**Создать новую миграцию:**

```bash
cd backend
docker exec -it vc-backend npx prisma migrate dev --name migration_name
```

**Просмотр схемы в Prisma Studio:**

```bash
cd backend
docker exec -it vc-backend npx prisma studio
```

Откроется веб-интерфейс на http://localhost:5555

**Пересоздать БД и заполнить данными:**

```bash
cd backend
docker exec -it vc-backend npx prisma migrate reset
```

---

## 💻 Разработка

### Локальная разработка (без Docker)

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend запустится на http://localhost:3001

**Требования:**
- Node.js 18+
- PostgreSQL должен быть запущен (можно через Docker)
- Настроить `backend/.env` с правильным `DATABASE_URL`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend запустится на http://localhost:5173

**Требования:**
- Node.js 18+
- Backend должен быть запущен

### Просмотр логов

**Все сервисы:**

```bash
docker compose logs -f
```

**Конкретный сервис:**

```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f postgres
```

**Логи Nginx:**

```bash
docker exec -it vc-nginx tail -f /var/log/nginx/access.log
docker exec -it vc-nginx tail -f /var/log/nginx/error.log
```

### Проверка статуса контейнеров

```bash
docker compose ps
```

---

## 🐳 Управление контейнерами

### Запуск

```bash
# Запуск всех основных сервисов (включая мониторинг и AI)
docker compose up -d

# Запуск с профилем безопасности (fail2ban + ssh)
docker compose --profile security up -d

# Запуск с Telegram ботом (если указан TELEGRAM_BOT_TOKEN)
# Бот запускается автоматически в составе основных сервисов

# Запуск Jenkins профиля
docker compose --profile ci up -d
```

Jenkins будет доступен на `http://localhost:8081`.

---

## 🔁 CI/CD и IaC

В проект добавлены:

- `Jenkinsfile` - pipeline для frontend/backend (install, build, lint, test, docker build)
- `infra/terraform/` - AWS инфраструктура (VPC, subnet, SG, EC2)
- `infra/ansible/` - provisioning хоста и deploy Docker Compose

### Jenkins

1. Запуск:

```bash
docker compose --profile ci up -d --build jenkins
```

2. Откройте `http://localhost:8081`
3. Получите initial admin password:

```bash
docker exec -it vc-jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

4. Установите рекомендуемые плагины и создайте Pipeline Job, укажите `Pipeline script from SCM` и путь `Jenkinsfile`.

### Terraform

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

### Ansible

```bash
cd infra/ansible
ansible-playbook -i inventories/dev/hosts.ini playbooks/provision.yml
ansible-playbook -i inventories/dev/hosts.ini playbooks/deploy.yml
```

Подробности: `infra/README.md`, `infra/terraform/README.md`, `infra/ansible/README.md`.

### Остановка

```bash
# Остановить все сервисы
docker compose down

# Остановить и удалить volumes (ВНИМАНИЕ: удалит данные БД!)
docker compose down -v
```

### Перезапуск

```bash
# Перезапустить все сервисы
docker compose restart

# Перезапустить конкретный сервис
docker compose restart backend
```

### Пересборка

```bash
# Пересобрать и запустить
docker compose up -d --build

# Пересобрать конкретный сервис
docker compose up -d --build backend
```

### Масштабирование ресурсов

Отредактируйте `.env` файл:

```env
POSTGRES_MEM_LIMIT=512m
BACKEND_MEM_LIMIT=768m
FRONTEND_MEM_LIMIT=512m
NGINX_MEM_LIMIT=256m
PROMETHEUS_MEM_LIMIT=512m
GRAFANA_MEM_LIMIT=256m
```

Затем пересоздайте контейнеры:

```bash
docker compose up -d --force-recreate
```

---

## 💾 Резервное копирование

### Автоматическое резервное копирование

Контейнер `backup` автоматически создает дампы PostgreSQL.

**Настройки в `.env`:**

```env
BACKUP_RETENTION_DAYS=7        # Хранить бэкапы 7 дней
BACKUP_INTERVAL_SECONDS=86400  # Создавать каждые 24 часа
```

**Расположение бэкапов:**

```
backup/data/
```

### Ручное резервное копирование

**Создать дамп:**

```bash
docker exec -it vc-postgres pg_dump -U vc -d vc > backup_$(date +%Y%m%d_%H%M%S).sql
```

**Восстановить из дампа:**

```bash
cat backup_20260405_120000.sql | docker exec -i vc-postgres psql -U vc -d vc
```

### Просмотр бэкапов

```bash
ls -lah backup/data/
```

---

## 🔒 Безопасность

### Fail2ban (защита от brute-force)

Запустить с профилем безопасности:

```bash
docker compose --profile security up -d
```

**Конфигурация:**
- `security/fail2ban/jail.local` - правила блокировки
- `security/fail2ban/filter.d/` - фильтры для логов

**Просмотр забаненных IP:**

```bash
docker exec -it vc-fail2ban fail2ban-client status nginx-limit-req
```

### SSH доступ

При запуске с профилем `security` доступен SSH на порту `2222`.

**Настройка ключа:**

1. Поместите публичный ключ в `security/ssh/config/keys/authorized_keys`
2. Запустите сервис

**Подключение:**

```bash
ssh -p 2222 vcadmin@localhost
```

**Доступ к бэкапам через SSH:**

```bash
ssh -p 2222 vcadmin@localhost "ls /workspace/backup"
```

### Смена паролей в продакшене

**Обязательно** измените пароли перед развертыванием в продакшене!

1. Отредактируйте `.env`:
   ```env
   POSTGRES_PASSWORD=your_secure_password
   ```

2. Обновите `backend/.env`:
   ```env
   DATABASE_URL="postgresql://vc:your_secure_password@postgres:5432/vc?schema=public"
   ```

3. Пересоздайте контейнеры:
   ```bash
   docker compose down -v
   docker compose up -d
   ```

4. Пересоздайте БД:
   ```bash
   cd backend
   docker exec -it vc-backend npx prisma migrate deploy
   docker exec -it vc-backend npx prisma db seed
   ```

---

## 🔧 Устранение неполадок

### Проблема: Контейнеры не запускаются

**Решение:**

```bash
# Проверить логи
docker compose logs

# Проверить статус
docker compose ps

# Пересоздать контейнеры
docker compose down
docker compose up -d --build
```

### Проблема: Ошибка подключения к БД

**Решение:**

```bash
# Проверить, что PostgreSQL запущен
docker compose ps postgres

# Проверить логи PostgreSQL
docker compose logs postgres

# Проверить healthcheck
docker inspect vc-postgres | grep -A 10 Health

# Перезапустить PostgreSQL
docker compose restart postgres
```

### Проблема: Frontend показывает ошибку API

**Решение:**

```bash
# Проверить, что backend запущен
docker compose ps backend

# Проверить логи backend
docker compose logs backend

# Проверить конфигурацию Nginx
docker exec -it vc-nginx nginx -t

# Перезапустить nginx и backend
docker compose restart nginx backend
```

### Проблема: Порт 80 уже занят

**Решение:**

```bash
# Найти процесс, использующий порт
sudo lsof -i :80

# Изменить порт в docker-compose.yml
# Найдите секцию nginx -> ports и измените на:
ports:
  - "8080:80"

# Теперь доступ будет через http://localhost:8080
```

### Проблема: Нет места для Docker

**Решение:**

```bash
# Очистить неиспользуемые образы и контейнеры
docker system prune -a

# Очистить volumes (ВНИМАНИЕ: удалит данные!)
docker volume prune
```

### Проблема: Миграции Prisma не применяются

**Решение:**

```bash
# Сбросить БД и применить миграции заново
cd backend
docker exec -it vc-backend npx prisma migrate reset

# Или применить миграции вручную
docker exec -it vc-backend npx prisma migrate deploy
```

### Проблема: Забыли пароль администратора

**Решение:**

```bash
cd backend
docker exec -it vc-backend npx ts-node reset-admin-pwd.ts
```

Пароль будет: `Admin123!`

### Проблема: AI не работает

**Решение:**

1. Убедитесь, что n8n запущен:
   ```bash
   docker compose ps n8n
   ```

2. Проверьте логи n8n:
   ```bash
   docker compose logs n8n
   ```

3. Проверьте OpenRouter API ключ в `.env`:
   ```env
   OPENAI_API_KEY=sk-or-v1-your-openrouter-api-key
   ```

4. Убедитесь, что workflow активен в n8n:
   - Откройте http://localhost:5678
   - Проверьте статус workflow `virtualclass-ai`

### Проблема: Мониторинг не работает

**Решение:**

1. Проверьте статус мониторинг-сервисов:
   ```bash
   docker compose ps prometheus grafana alertmanager
   ```

2. Проверьте логи Prometheus:
   ```bash
   docker compose logs prometheus
   ```

3. Проверьте, что Targets доступны в Prometheus UI: http://localhost:9090/targets

---

## 📚 Дополнительные ресурсы

- **Backend**: [NestJS Documentation](https://docs.nestjs.com/)
- **Frontend**: [React Documentation](https://react.dev/)
- **Database**: [Prisma Documentation](https://www.prisma.io/docs)
- **Infrastructure**: См. [INFRASTRUCTURE.md](./INFRASTRUCTURE.md)

---

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [раздел устранения неполадок](#устранение-неполадок)
2. Проверьте логи контейнеров: `docker compose logs`
3. Проверьте статус сервисов: `docker compose ps`

---

## 📄 Лицензия

UNLICENSED (частный проект)
