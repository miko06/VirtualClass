#!/bin/bash
set -e

# ============================================================
# VirtualClass - Полный скрипт деплоя с Cloudflare Tunnel
# ============================================================
# Запускайте на Ubuntu 22.04/24.04 VM
#
# Использование:
#   chmod +x deploy-full.sh
#   ./deploy-full.sh
#
# Перед запуском замените REPO_URL на свой!
# ============================================================

REPO_URL="https://github.com/ВАШ_ЮЗЕРНЕЙМ/ВАШ_РЕПО.git"
PROJECT_DIR="$HOME/VirtualClass"
TUNNEL_NAME="virtualclass"
DOMAIN=""  # Оставьте пустым для автоматического поддомена trycloudflare.com

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}============================================${NC}"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# ============================================================
# 0. Проверка параметров
# ============================================================
print_header "VirtualClass - Полный деплой"

if [ "$REPO_URL" = "https://github.com/ВАШ_ЮЗЕРНЕЙМ/ВАШ_РЕПО.git" ]; then
    print_error "Замените REPO_URL в скрипте на URL вашего репозитория!"
    echo "Отредактируйте файл deploy-full.sh, строку:"
    echo '  REPO_URL="https://github.com/ВАШ_ЮЗЕРНЕЙМ/ВАШ_РЕПО.git"'
    exit 1
fi

# ============================================================
# 1. Обновление системы
# ============================================================
print_header "[1/10] Обновление системы"
sudo apt-get update -y
sudo apt-get upgrade -y
print_success "Система обновлена"

# ============================================================
# 2. Установка Docker
# ============================================================
print_header "[2/10] Установка Docker"

if command -v docker &> /dev/null; then
    print_success "Docker уже установлен: $(docker --version)"
else
    echo "Установка Docker..."
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    print_success "Docker установлен"
    print_warning "Docker добавлен в группу. Если сейчас будут ошибки прав, выполните: newgrp docker"
fi

# Проверяем, что docker работает
docker ps &>/dev/null || {
    print_error "Docker не доступен. Выполните: newgrp docker, затем перезапустите скрипт"
    exit 1
}

# ============================================================
# 3. Установка Git
# ============================================================
print_header "[3/10] Установка Git"

if command -v git &> /dev/null; then
    print_success "Git уже установлен: $(git --version)"
else
    sudo apt-get install -y git
    print_success "Git установлен"
fi

# ============================================================
# 4. Клонирование / обновление репозитория
# ============================================================
print_header "[4/10] Клонирование репозитория"

if [ -d "$PROJECT_DIR/.git" ]; then
    echo "Репозиторий уже существует. Обновляем..."
    cd "$PROJECT_DIR"
    git pull
    print_success "Репозиторий обновлён"
else
    echo "Клонирование $REPO_URL ..."
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
    print_success "Репозиторий клонирован в $PROJECT_DIR"
fi

# ============================================================
# 5. Настройка .env
# ============================================================
print_header "[5/10] Настройка окружения (.env)"

if [ -f ".env" ]; then
    print_warning "Файл .env уже существует. Используем текущий."
    echo "Если хотите пересоздать, удалите .env и перезапустите скрипт."
else
    if [ -f ".env.docker.example" ]; then
        cp .env.docker.example .env
    else
        # Создаём базовый .env если example не найден
        cat > .env << 'EOF'
POSTGRES_DB=vc
POSTGRES_USER=vc
POSTGRES_PASSWORD=vc

POSTGRES_MEM_LIMIT=512m
BACKEND_MEM_LIMIT=768m
FRONTEND_MEM_LIMIT=512m
NGINX_MEM_LIMIT=256m
BACKUP_MEM_LIMIT=256m

BACKUP_RETENTION_DAYS=7
BACKUP_INTERVAL_SECONDS=86400

N8N_WEBHOOK_URL=http://n8n:5678/webhook/virtualclass-ai
N8N_ENCRYPTION_KEY=your-secret-encryption-key-change-me
N8N_API_KEY=n8n_api_key_change_me
N8N_EDITOR_BASE_URL=http://localhost:5678
OPENAI_API_KEY=

TZ=Asia/Almaty
EOF
    fi

    # Генерируем безопасные пароли
    RANDOM_PASS=$(openssl rand -base64 24 2>/dev/null || tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c 24)
    RANDOM_KEY=$(openssl rand -base64 32 2>/dev/null || tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32)
    RANDOM_API=$(openssl rand -base64 24 2>/dev/null || tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 24)

    # Заменяем дефолтные значения
    sed -i "s/POSTGRES_PASSWORD=vc/POSTGRES_PASSWORD=${RANDOM_PASS}/" .env
    sed -i "s/N8N_ENCRYPTION_KEY=your-secret-encryption-key-change-me/N8N_ENCRYPTION_KEY=${RANDOM_KEY}/" .env
    sed -i "s/N8N_API_KEY=n8n_api_key_change_me/N8N_API_KEY=${RANDOM_API}/" .env

    print_success "Файл .env создан с автоматически сгенерированными паролями"
    echo ""
    echo -e "${YELLOW}ВАЖНО: Сохраните эти пароли!${NC}"
    echo "  POSTGRES_PASSWORD: ${RANDOM_PASS}"
    echo "  N8N_ENCRYPTION_KEY: ${RANDOM_KEY}"
    echo "  N8N_API_KEY: ${RANDOM_API}"
    echo ""
fi

# Обновляем FRONTEND_URL если пустой
if ! grep -q "^FRONTEND_URL=" .env || grep -q "^FRONTEND_URL=$" .env; then
    echo "FRONTEND_URL=http://localhost" >> .env
fi

# ============================================================
# 6. Запуск Docker Compose
# ============================================================
print_header "[6/10] Запуск Docker контейнеров"

docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml pull 2>/dev/null || true
docker compose -f docker-compose.prod.yml up -d --build

print_success "Контейнеры запущены"

# ============================================================
# 7. Инициализация базы данных
# ============================================================
print_header "[7/10] Инициализация базы данных"

echo "Ожидание запуска PostgreSQL (15 сек)..."
sleep 15

echo "Применение миграций..."
docker exec vc-backend npx prisma migrate deploy 2>/dev/null || {
    print_warning "Миграции не применены (возможно, уже есть или нужно подождать). Повторите вручную позже."
}

echo "Заполнение тестовыми данными..."
docker exec vc-backend npx prisma db seed 2>/dev/null || {
    print_warning "Сид не выполнен (возможно, уже есть). Повторите вручную позже."
}

print_success "База данных инициализирована"

# ============================================================
# 8. Установка Cloudflare Tunnel
# ============================================================
print_header "[8/10] Установка Cloudflare Tunnel"

if command -v cloudflared &> /dev/null; then
    print_success "cloudflared уже установлен: $(cloudflared --version 2>&1 | head -1)"
else
    echo "Скачивание cloudflared..."
    curl -L --output /tmp/cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
    sudo dpkg -i /tmp/cloudflared.deb
    rm /tmp/cloudflared.deb
    print_success "cloudflared установлен"
fi

# ============================================================
# 9. Настройка Cloudflare Tunnel
# ============================================================
print_header "[9/10] Настройка Cloudflare Tunnel"

TUNNEL_DIR="$HOME/.cloudflared"
mkdir -p "$TUNNEL_DIR"

# Проверяем, есть ли уже туннель
if [ -f "$TUNNEL_DIR/$TUNNEL_NAME.json" ]; then
    print_success "Туннель '$TUNNEL_NAME' уже существует. Используем существующий."
    TUNNEL_ID=$(cat "$TUNNEL_DIR/$TUNNEL_NAME.json" | grep -o '"TunnelID":"[^"]*"' | cut -d'"' -f4)
else
    echo ""
    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}  АВТОРИЗАЦИЯ CLOUDFLARE${NC}"
    echo -e "${YELLOW}========================================${NC}"
    echo ""
    echo "Сейчас откроется ссылка для авторизации."
    echo "Если вы в SSH без браузера:"
    echo "  1. Скопируйте ссылку"
    echo "  2. Откройте её в браузере на вашем компьютере"
    echo "  3. Войдите в Cloudflare аккаунт"
    echo "  4. Выберите домен (если есть) или нажмите Cancel для бесплатного поддомена"
    echo ""
    echo "Нажмите Enter чтобы продолжить..."
    read

    cloudflared tunnel login

    echo ""
    echo "Создание туннеля '$TUNNEL_NAME'..."
    cloudflared tunnel create "$TUNNEL_NAME"

    TUNNEL_ID=$(ls "$TUNNEL_DIR"/*.json | grep -v "cert.pem" | head -1 | xargs cat | grep -o '"TunnelID":"[^"]*"' | cut -d'"' -f4)

    print_success "Туннель создан. ID: $TUNNEL_ID"
fi

# Создаём конфигурацию туннеля
cat > "$TUNNEL_DIR/config.yml" << EOF
tunnel: $TUNNEL_ID
credentials-file: $TUNNEL_DIR/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN
    service: http://localhost:80
  - service: http_status:404
EOF

print_success "Конфигурация туннеля создана: $TUNNEL_DIR/config.yml"

# ============================================================
# 10. Запуск туннеля как сервис
# ============================================================
print_header "[10/10] Запуск Cloudflare Tunnel"

# Устанавливаем как systemd сервис
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared

# Ждём запуска
sleep 3

if systemctl is-active --quiet cloudflared; then
    print_success "Cloudflare Tunnel запущен как сервис"
else
    print_warning "Не удалось запустить сервис. Запускаем вручную..."
    nohup cloudflared tunnel --config "$TUNNEL_DIR/config.yml" run > /tmp/cloudflared.log 2>&1 &
    sleep 2
fi

# Получаем URL туннеля
echo ""
echo -e "${GREEN}Получение публичного URL туннеля...${NC}"
TUNNEL_URL=$(cloudflared tunnel list | grep "$TUNNEL_NAME" | awk '{print $4}')

if [ -z "$TUNNEL_URL" ]; then
    # Для бесплатных туннелей trycloudflare.com
    TUNNEL_LOG=$(journalctl -u cloudflared --no-pager -n 20 2>/dev/null || cat /tmp/cloudflared.log 2>/dev/null)
    TUNNEL_URL=$(echo "$TUNNEL_LOG" | grep -oP 'https://[a-zA-Z0-9-]+\.trycloudflare\.com' | head -1)
fi

# ============================================================
# ФИНАЛЬНЫЙ ВЫВОД
# ============================================================
print_header "ДЕПЛОЙ ЗАВЕРШЁН!"

VM_IP=$(hostname -I | awk '{print $1}')

 echo ""
echo -e "${GREEN}Ваш сайт доступен по адресам:${NC}"
echo ""
echo -e "  ${YELLOW}Локально в VM:${NC}     http://localhost"
echo -e "  ${YELLOW}В локальной сети:${NC} http://$VM_IP"
if [ -n "$TUNNEL_URL" ]; then
    echo -e "  ${YELLOW}Из интернета:${NC}     $TUNNEL_URL"
fi
echo ""
echo -e "${BLUE}API Endpoints:${NC}"
echo "  - Сайт:    http://$VM_IP/"
echo "  - API:     http://$VM_IP/api"
echo "  - n8n:     http://$VM_IP:5678"
echo ""
echo -e "${BLUE}Управление:${NC}"
echo "  docker compose -f docker-compose.prod.yml ps       - статус контейнеров"
echo "  docker compose -f docker-compose.prod.yml logs -f  - логи"
echo "  docker compose -f docker-compose.prod.yml down     - остановить"
echo "  docker compose -f docker-compose.prod.yml up -d    - запустить"
echo "  sudo systemctl status cloudflared                  - статус туннеля"
echo ""
echo -e "${BLUE}Учётные данные по умолчанию:${NC}"
echo "  Admin:    admin@enu.kz / Admin123!"
echo "  Teacher:  zheglisov.k@enu.kz / Teacher123!"
echo "  Student:  student1@enu.kz / Student123!"
echo ""
echo -e "${YELLOW}ВАЖНО: Сохраните файл .env и пароли!${NC}"
echo ""
