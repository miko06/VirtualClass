#!/bin/bash
set -e

# ============================================================
# VirtualClass - Скрипт деплоя на Ubuntu VM
# ============================================================
# Запускайте на чистой Ubuntu 22.04/24.04
# curl -sSL https://raw.githubusercontent.com/ВАШ_РЕПО/main/deploy-vm.sh | bash
# ============================================================

REPO_URL="https://github.com/ВАШ_ЮЗЕРНЕЙМ/ВАШ_РЕПО.git"
PROJECT_DIR="$HOME/VirtualClass"

echo "============================================"
echo " VirtualClass - Автоматический деплой"
echo "============================================"

# 1. Обновление системы
echo "[1/7] Обновление системы..."
sudo apt-get update -y
sudo apt-get upgrade -y

# 2. Установка Docker
echo "[2/7] Установка Docker..."
if ! command -v docker &> /dev/null; then
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
    echo "Docker установлен. ВАЖНО: перелогиньтесь или выполните 'newgrp docker'"
else
    echo "Docker уже установлен"
fi

# 3. Установка Git
echo "[3/7] Установка Git..."
sudo apt-get install -y git

# 4. Клонирование репозитория
echo "[4/7] Клонирование репозитория..."
if [ -d "$PROJECT_DIR" ]; then
    echo "Директория $PROJECT_DIR уже существует. Обновляем..."
    cd "$PROJECT_DIR"
    git pull
else
    git clone "$REPO_URL" "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# 5. Настройка .env
echo "[5/7] Настройка окружения..."
if [ ! -f ".env" ]; then
    cp .env.docker.example .env
    echo ""
    echo "=========================================="
    echo " ВНИМАНИЕ: Нужно настроить .env файл!"
    echo "=========================================="
    echo "Отредактируйте файл: $PROJECT_DIR/.env"
    echo ""
    echo "Обязательно измените:"
    echo "  POSTGRES_PASSWORD=ваш_сложный_пароль"
    echo "  N8N_ENCRYPTION_KEY=длинный_случайный_ключ"
    echo "  N8N_API_KEY=ваш_api_ключ"
    echo ""
    echo "Затем перезапустите скрипт или выполните:"
    echo "  cd $PROJECT_DIR && docker compose -f docker-compose.prod.yml up -d"
    exit 0
fi

# 6. Запуск контейнеров
echo "[6/7] Запуск контейнеров..."
docker compose -f docker-compose.prod.yml down 2>/dev/null || true
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d --build

# 7. Инициализация базы данных
echo "[7/7] Инициализация базы данных..."
sleep 10  # Ждём запуска postgres

docker exec -it vc-backend npx prisma migrate deploy 2>/dev/null || echo "Миграции уже применены или нужно подождать"
docker exec -it vc-backend npx prisma db seed 2>/dev/null || echo "Сид уже выполнен или нужно подождать"

echo ""
echo "============================================"
echo " Деплой завершён!"
echo "============================================"
echo ""
echo "Проверьте статус: docker compose -f docker-compose.prod.yml ps"
echo ""
echo "Доступ к приложению:"
echo "  - Сайт: http://$(hostname -I | awk '{print $1}')"
echo "  - API:  http://$(hostname -I | awk '{print $1}')/api"
echo "  - n8n:  http://$(hostname -I | awk '{print $1}'):5678"
echo ""
