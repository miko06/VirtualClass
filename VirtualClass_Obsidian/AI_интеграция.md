# AI интеграция — n8n

## Обзор

Модуль `AiModule` интегрирует **n8n** — платформу автоматизации с HTTP Request — для предоставления чат-ассистента. Бэкенд проксирует запросы на n8n webhook, который отправляет их в OpenRouter API через HTTP Request.

**Файлы**:
- `backend/src/ai/ai.module.ts`
- `backend/src/ai/ai.controller.ts`
- `backend/src/ai/ai.service.ts`
- `n8n/virtualclass-ai-workflow.json` — workflow для импорта в n8n

## Эндпоинты

### `POST /ai/chat`

Синхронный ИИ-чат. Возвращает полный ответ после завершения генерации.

**Тело**:
```json
{
  "messages": [
    { "role": "user", "content": "Объясни алгоритм сортировки" }
  ]
}
```

**Ответ**: полный сгенерированный текст.

---

### `POST /ai/chat/stream`

Потоковый ИИ-чат. Возвращает поток данных в реальном времени.

**Тело**: аналогично `/ai/chat`

**Ответ**: поток JSON-объектов или Server-Sent Events.

---

## Механизм работы

### 1. Проксирование на n8n

При каждом запросе `AiService`:

1. Формирует payload с историей сообщений
2. Отправляет POST запрос на `N8N_WEBHOOK_URL` (по умолчанию `http://n8n:5678/webhook/virtualclass-ai`)
3. Получает ответ от n8n workflow
4. Парсит ответ (поддерживает JSON, SSE, NDJSON форматы)
5. Возвращает ответ клиенту

### 2. n8n Workflow

Workflow `virtualclass-ai-workflow.json` состоит из:

1. **Webhook node** — принимает POST запросы на `/webhook/virtualclass-ai`
2. **HTTP Request node (OpenRouter API)** — отправляет запрос к OpenRouter API с моделью `nvidia/nemotron-nano-12b-v2-vl:free` (поддерживает vision/ввод изображений), авторизация через Bearer token (httpHeaderAuth)
3. **Respond to Webhook node** — возвращает ответ клиенту

### 3. Разбор ответа

Бэкенд `ai.service.ts` парсит ответ OpenRouter в формате:
```json
{ "choices": [{ "message": { "content": "..." } }] }
```
Извлекается `choices[0].message.content`.

## Конфигурация

| Переменная | Описание | По умолчанию |
|-----------|----------|-------------|
| `N8N_WEBHOOK_URL` | URL n8n webhook | `http://n8n:5678/webhook/virtualclass-ai` |
| `N8N_ENCRYPTION_KEY` | Ключ шифрования n8n | `your-secret-encryption-key-change-me` |
| `N8N_API_KEY` | API ключ для доступа к n8n | — |

## Настройка n8n

### 1. Импорт workflow

```bash
# Откройте n8n UI: http://localhost:5678
# Перейдите в Workflows → Import from File
# Выберите: n8n/virtualclass-ai-workflow.json
```

### 2. Настройка credentials

1. Откройте workflow в n8n
2. Нажмите на node "HTTP Request"
3. Создайте credential "OpenRouter Auth" типа `httpHeaderAuth` с заголовком `Authorization: Bearer <your-openrouter-api-key>`
4. Активируйте workflow

## Поток данных

```
Пользователь (вводит запрос)
  │
  ▼
FloatingAIAssistant (фронтенд)
  │
  ▼ POST /ai/chat/stream
  │
AiController (бэкенд)
  │
  ▼
AiService
  └── POST {N8N_WEBHOOK_URL}
        │
        ▼
n8n Webhook
  │
  ▼
HTTP Request → OpenRouter API (nvidia/nemotron-nano-12b-v2-vl:free, vision)
  │
  ▼
Respond to Webhook
  │
  ▼
AiService парсит ответ → отправляет клиенту
  │
  ▼
Фронтенд рендерит текст
```

## Связанные документы

- [[Архитектура]] — общий обзор
- [[Бэкенд]] — модульная структура
- [[API]] — эндпоинты ИИ-чата
- [[Инфраструктура]] — Docker, n8n сервис
