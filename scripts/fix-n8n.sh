#!/bin/bash
set -e

# ============================================================
# VirtualClass - Исправление n8n workflow и credentials
# ============================================================
# Запускайте на VM в директории проекта
#
# Использование:
#   chmod +x scripts/fix-n8n.sh
#   ./scripts/fix-n8n.sh
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# --- 1. Проверки -----------------------------------------------------------

if [ ! -f ".env" ]; then
    print_error "Файл .env не найден. Запустите скрипт из корня проекта."
    exit 1
fi

if ! docker ps | grep -q "vc-n8n"; then
    print_error "Контейнер vc-n8n не запущен. Сначала запустите: docker compose up -d n8n"
    exit 1
fi

# Читаем переменные из .env
OPENAI_API_KEY=$(grep "^OPENAI_API_KEY=" .env | cut -d '=' -f2- | tr -d '"' || true)
N8N_API_KEY=$(grep "^N8N_API_KEY=" .env | cut -d '=' -f2- | tr -d '"' || true)
N8N_WEBHOOK_URL=$(grep "^N8N_WEBHOOK_URL=" .env | cut -d '=' -f2- | tr -d '"' || true)

if [ -z "$OPENAI_API_KEY" ]; then
    print_error "OPENAI_API_KEY не найден в .env"
    exit 1
fi

if [ -z "$N8N_API_KEY" ]; then
    print_error "N8N_API_KEY не найден в .env"
    exit 1
fi

print_info "OPENAI_API_KEY найден"
print_info "N8N_API_KEY найден"

# --- 2. Создаём временные файлы с реальными данными ------------------------

TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

CREDS_FILE="$TMP_DIR/credentials.json"
WORKFLOW_FILE="$TMP_DIR/workflow.json"

# Создаём credentials с реальным ключом
cat > "$CREDS_FILE" <<EOF
[
  {
    "name": "OpenRouter Auth",
    "type": "httpHeaderAuth",
    "data": {
      "name": "Authorization",
      "value": "Bearer ${OPENAI_API_KEY}"
    }
  }
]
EOF

print_success "Временные credentials созданы"

# --- 3. Импортируем credentials --------------------------------------------

print_info "Импорт credentials в n8n..."
docker cp "$CREDS_FILE" vc-n8n:/tmp/credentials.json
docker exec -u node vc-n8n n8n import:credentials --input=/tmp/credentials.json || {
    print_error "Не удалось импортировать credentials"
    exit 1
}
print_success "Credentials импортированы"

# Ждём, пока n8n обновит БД
sleep 2

# --- 4. Получаем ID импортированного credential ----------------------------

print_info "Получение ID credential через API..."

CRED_RESPONSE=$(docker exec vc-n8n curl -s -f \
  "http://localhost:5678/api/v1/credentials" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null || true)

if [ -z "$CRED_RESPONSE" ]; then
    # Пробуем снаружи, если порт 5678 проброшен
    CRED_RESPONSE=$(curl -s -f \
      "http://localhost:5678/api/v1/credentials" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null || true)
fi

if [ -z "$CRED_RESPONSE" ]; then
    print_error "Не удалось получить список credentials. Проверьте N8N_API_KEY и доступность n8n API."
    exit 1
fi

# Извлекаем ID первого httpHeaderAuth credential
CRED_ID=$(echo "$CRED_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data.get('data', []):
    if item.get('type') == 'httpHeaderAuth':
        print(item.get('id'))
        break
" 2>/dev/null || true)

if [ -z "$CRED_ID" ]; then
    # Fallback: пробуем через grep/sed
    CRED_ID=$(echo "$CRED_RESPONSE" | grep -o '"id":"[^"]*"' | grep -m1 '"id"' | sed 's/.*:"\([^"]*\)".*/\1/' || true)
fi

if [ -z "$CRED_ID" ]; then
    print_error "Не удалось определить ID credential"
    print_info "Ответ API: $CRED_RESPONSE"
    exit 1
fi

print_success "Credential ID: $CRED_ID"

# --- 5. Обновляем workflow с реальным credential ID ------------------------

print_info "Обновление workflow..."

python3 <<PYEOF
import json

with open("n8n/virtualclass-ai-workflow.json", "r") as f:
    workflow = json.load(f)

# Заменяем ID credential во всех nodes
for node in workflow.get("nodes", []):
    creds = node.get("credentials", {})
    if "httpHeaderAuth" in creds:
        creds["httpHeaderAuth"]["id"] = "${CRED_ID}"

with open("${WORKFLOW_FILE}", "w") as f:
    json.dump(workflow, f, indent=2, ensure_ascii=False)

print("Workflow обновлён")
PYEOF

print_success "Workflow JSON обновлён с ID credential"

# --- 6. Импортируем workflow -----------------------------------------------

print_info "Импорт workflow в n8n..."
docker cp "$WORKFLOW_FILE" vc-n8n:/tmp/workflow.json
docker exec -u node vc-n8n n8n import:workflow --input=/tmp/workflow.json || {
    print_error "Не удалось импортировать workflow"
    exit 1
}
print_success "Workflow импортирован"

sleep 2

# --- 7. Получаем ID workflow -----------------------------------------------

print_info "Получение ID workflow через API..."

WF_RESPONSE=$(docker exec vc-n8n curl -s -f \
  "http://localhost:5678/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null || true)

if [ -z "$WF_RESPONSE" ]; then
    WF_RESPONSE=$(curl -s -f \
      "http://localhost:5678/api/v1/workflows" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" 2>/dev/null || true)
fi

if [ -z "$WF_RESPONSE" ]; then
    print_error "Не удалось получить список workflows"
    exit 1
fi

WORKFLOW_ID=$(echo "$WF_RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for item in data.get('data', []):
    if item.get('name') == 'VirtualClass AI Assistant':
        print(item.get('id'))
        break
" 2>/dev/null || true)

if [ -z "$WORKFLOW_ID" ]; then
    WORKFLOW_ID=$(echo "$WF_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*' || true)
fi

if [ -z "$WORKFLOW_ID" ]; then
    print_error "Не удалось определить ID workflow"
    print_info "Ответ API: $WF_RESPONSE"
    exit 1
fi

print_success "Workflow ID: $WORKFLOW_ID"

# --- 8. Активируем workflow ------------------------------------------------

print_info "Активация workflow..."

ACTIVATE_RESULT=$(docker exec vc-n8n curl -s -w "%{http_code}" -o /tmp/activate_resp.txt \
  -X PATCH "http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' 2>/dev/null || true)

if [ -z "$ACTIVATE_RESULT" ]; then
    ACTIVATE_RESULT=$(curl -s -w "%{http_code}" -o /tmp/activate_resp.txt \
      -X PATCH "http://localhost:5678/api/v1/workflows/${WORKFLOW_ID}" \
      -H "X-N8N-API-KEY: $N8N_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"active": true}' 2>/dev/null || true)
fi

if [ "$ACTIVATE_RESULT" = "200" ]; then
    print_success "Workflow активирован"
else
    print_warning "Workflow может быть не активирован (HTTP $ACTIVATE_RESULT)"
    if [ -f /tmp/activate_resp.txt ]; then
        cat /tmp/activate_resp.txt
    fi
fi

# --- 9. Проверка webhook ---------------------------------------------------

print_info "Проверка webhook..."

WEBHOOK_TEST=$(docker exec vc-n8n curl -s -o /dev/null -w "%{http_code}" \
  -X POST "http://localhost:5678/webhook/virtualclass-ai" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}]}' 2>/dev/null || true)

if [ "$WEBHOOK_TEST" = "200" ]; then
    print_success "Webhook отвечает (HTTP 200)"
elif [ "$WEBHOOK_TEST" = "404" ]; then
    print_error "Webhook не найден (HTTP 404). Возможно, workflow не активирован."
else
    print_warning "Webhook вернул HTTP $WEBHOOK_TEST"
fi

# --- 10. Финал -------------------------------------------------------------

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  n8n настроен!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Проверьте:"
echo "  1. Workflow 'VirtualClass AI Assistant' активен в n8n UI"
echo "  2. Credential 'OpenRouter Auth' использует правильный API ключ"
echo ""
echo "Если webhook всё ещё не работает:"
echo "  docker compose -f docker-compose.prod.yml logs -f n8n"
echo ""
