# AI интеграция — n8n

## Обзор

Модуль `AiModule` интегрирует **n8n** — платформу автоматизации с AI Agent — для предоставления чат-ассистента. Бэкенд проксирует запросы на n8n webhook, который обрабатывает их через LLM провайдер (OpenAI или другой).

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
2. **AI Agent node** — обрабатывает запрос через LLM
3. **OpenAI Model node** — использует GPT-4o-mini (настраивается)
4. **Respond to Webhook node** — возвращает ответ клиенту

### 3. Системный промпт

AI Agent настроен с системным промптом:
> "Ты — ИИ-ассистент образовательной платформы VirtualClass. Помогай студентам и преподавателям с учебными вопросами, объясняй темы, помогай с кодом и заданиями. Отвечай на русском языке. Будь дружелюбным и полезным."

## Конфигурация

| Переменная | Описание | По умолчанию |
|-----------|----------|-------------|
| `N8N_WEBHOOK_URL` | URL n8n webhook | `http://n8n:5678/webhook/virtualclass-ai` |
| `N8N_ENCRYPTION_KEY` | Ключ шифрования n8n | `your-secret-encryption-key-change-me` |
| `OPENAI_API_KEY` | API ключ OpenAI | — |

## Настройка n8n

### 1. Импорт workflow

```bash
# Откройте n8n UI: http://localhost:5678
# Перейдите в Workflows → Import from File
# Выберите: n8n/virtualclass-ai-workflow.json
```

### 2. Настройка credentials

1. Откройте workflow в n8n
2. Нажмите на node "OpenAI Model"
3. Создайте credential "OpenAI API" с вашим API ключом
4. Активируйте workflow

### 3. Смена LLM провайдера

В n8n можно заменить OpenAI на любой другой провайдер:
- Anthropic (Claude)
- Google Gemini
- Mistral
- Локальные модели через Ollama node

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
AI Agent → LLM (OpenAI / другой провайдер)
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
