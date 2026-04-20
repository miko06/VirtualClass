# VirtualClass - Виртуальный класс с ИИ

Полная документация по запуску, настройке и использованию проекта VirtualClass.

## 📋 Содержание

- [Описание проекта](#описание-проекта)
- [Архитектура](#архитектура)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Запуск проекта](#запуск-проекта)
- [Доступ к приложению](#доступ-к-приложению)
- [Учетные данные по умолчанию](#учетные-данные-по-умолчанию)
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
- **AI интеграция**: Ollama для AI-ассистента
- **Nginx**: Reverse proxy для маршрутизации
- **Автоматическое резервное копирование**: Ежедневные бэкапы БД
- **Система безопасности**: Fail2ban, SSH доступ по ключу

---

## 🏗 Архитектура

```
VirtualClass/
├── backend/          # NestJS API (порт 3001)
├── frontend/         # React приложение (порт 4173)
├── nginx/            # Reverse proxy конфигурация (порт 80)
├── postgres/         # Инициализация PostgreSQL
├── prisma/           # Схема базы данных
├── backup/           # Скрипты и данные резервного копирования
├── security/         # Fail2ban и SSH конфигурация
└── docker-compose.yml
```

### Сервисы Docker

- **postgres** - База данных PostgreSQL (порт 5432)
- **backend** - API сервер NestJS
- **frontend** - React UI
- **nginx** - Reverse proxy (порт 80)
- **backup** - Автоматическое резервное копирование
- **fail2ban** - Защита от brute-force атак (опционально)
- **ssh** - SSH доступ для администрирования (опционально)
- **jenkins** - CI сервер (опционально, профиль `ci`)

---

## 💻 Требования

- **Docker** 20.10+
- **Docker Compose** 2.0+
- **Ollama** (для AI функциональности) - опционально
- Минимум **4 GB** RAM для Docker
- Порты **80**, **5432**, **2222** должны быть свободны

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

По умолчанию используются следующие настройки:
- БД: `vc` / пользователь: `vc` / пароль: `vc`
- Ollama URL: `http://host.docker.internal:11434`
- Модель AI: `minimax-m2.5`

### 3. Запуск проекта

```bash
docker compose up -d
```

Дождитесь запуска всех контейнеров (1-2 минуты).

### 4. Инициализация базы данных

После первого запуска необходимо создать схему и заполнить тестовыми данными:

```bash
cd backend
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed
```

### 5. Готово!

Откройте браузер: **http://localhost**

---

## 🌐 Доступ к приложению

### Веб-интерфейс

- **URL**: http://localhost
- **Frontend**: http://localhost (маршрутизируется через Nginx)
- **Backend API**: http://localhost/api

### Прямой доступ к сервисам (только для разработки)

- **Backend**: http://localhost:3001 (если пробросить порт)
- **PostgreSQL**: localhost:5432
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
# Запуск всех основных сервисов
docker compose up -d

# Запуск с профилем безопасности (fail2ban + ssh)
docker compose --profile security up -d

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

1. Убедитесь, что Ollama запущен на хосте:
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. Проверьте, что модель загружена:
   ```bash
   ollama list
   ```

3. Загрузите нужную модель:
   ```bash
   ollama pull minimax-m2.5
   ```

4. Проверьте настройки в `.env`:
   ```env
   OLLAMA_BASE_URL=http://host.docker.internal:11434
   OLLAMA_MODEL=minimax-m2.5
   ```

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
