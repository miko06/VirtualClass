# API — Справочник эндпоинтов

## Обзор

REST API на базе **NestJS**, развёрнут на порту **3001**. В production запросы проксируются через **Nginx** с префиксом `/api/`.

**Базовый URL (dev)**: `http://localhost:3001`
**Базовый URL (prod)**: `http://домен/api`

## Пользователи (`/users`)

### `GET /users`

Получить список всех пользователей.

**Ответ**:
```json
[
  {
    "id": 1,
    "email": "admin@enu.kz",
    "name": null,
    "firstName": null,
    "lastName": null,
    "group": null,
    "specialtyCode": null,
    "role": "admin",
    "createdAt": "2026-02-18T..."
  }
]
```

> Пароли не возвращаются.

---

### `POST /users/login`

Аутентификация пользователя.

**Тело**:
```json
{
  "email": "admin@enu.kz",
  "password": "Admin123!"
}
```

**Успешный ответ** (200):
```json
{
  "id": 1,
  "email": "admin@enu.kz",
  "role": "admin",
  "firstName": "Admin",
  ...
}
```

**Ошибка** (401): `UnauthorizedException`

> Rate-limited: 5 запросов/мин на IP (через Nginx)

---

### `POST /users`

Создание нового пользователя.

**Тело** (CreateUserDto):
```json
{
  "email": "student@enu.kz",
  "password": "Student123!",
  "name": "Иванов Иван",
  "role": "student"
}
```

**Валидация**: `class-validator`
- `email` — валидный email
- `password` — минимум 6 символов
- `role` — опционально, один из: `admin` | `teacher` | `student`

---

## Классы (`/classes`)

### `GET /classes/teacher/:teacherId`

Получить все классы преподавателя с дисциплинами и записями студентов.

**Параметры**: `teacherId` (int)

**Ответ**:
```json
[
  {
    "id": 1,
    "name": "Математика - IS-37",
    "description": "...",
    "discipline": { "id": 1, "name": "Математика", "credits": 5 },
    "enrollments": [
      { "student": { "id": 10, "firstName": "...", "group": "IS-37" } }
    ]
  }
]
```

---

### `GET /classes/student/:studentId`

Получить все классы, в которые записан студент.

**Параметры**: `studentId` (int)

**Ответ**:
```json
[
  {
    "id": 1,
    "name": "Математика - IS-37",
    "discipline": { "name": "Математика" },
    "teacher": { "id": 2, "firstName": "...", "lastName": "..." }
  }
]
```

---

### `POST /classes`

Создать новый класс.

**Тело**:
```json
{
  "name": "Физика - AZH-31",
  "description": "Курс общей физики",
  "teacherId": 2,
  "disciplineId": 3,
  "semester": "2026-1"
}
```

---

### `PUT /classes/:id`

Обновить класс (частичное обновление).

**Тело**:
```json
{
  "name": "Новое название",
  "description": "Новое описание",
  "semester": "2026-2"
}
```

---

### `DELETE /classes/:id`

Удалить класс (каскадное удаление enrollments).

**Ответ**: `200 OK`

---

## Материалы (`/materials`)

### `GET /materials`

Все материалы с информацией о преподавателе, по убыванию даты.

---

### `GET /materials/teacher/:teacherId`

Материалы конкретного преподавателя.

**Параметры**: `teacherId` (int)

---

### `POST /materials`

Создать запись о материале (метаданные).

**Тело**:
```json
{
  "title": "Лекция 1",
  "description": "Введение в алгоритмы",
  "type": "pdf",
  "courseName": "Алгоритмы",
  "teacherId": 2
}
```

---

### `POST /materials/upload`

Загрузить файл.

**Тип**: `multipart/form-data`
**Поле**: `file`
**Лимит**: 500 МБ

**Ответ**:
```json
{
  "url": "/uploads/1709abc123-def456-lecture1.pdf"
}
```

> Файлы сохраняются в `/app/uploads/` внутри Docker контейнера (volume `uploads_data`).

---

### `DELETE /materials/:id`

Удалить материал (удаляет только запись из БД, файл остаётся на диске).

---

## Администрирование (`/admin`)

### `GET /admin/classes`

Все классы с агрегированной статистикой по группам.

---

### `GET /admin/groups`

Уникальные студенческие группы с количеством студентов.

**Ответ**:
```json
[
  { "group": "IS-37", "count": 28 },
  { "group": "AZH-31", "count": 30 }
]
```

---

### `GET /admin/groups/:group/students`

Студенты конкретной группы.

**Параметры**: `group` (string) — например `IS-37`

---

### `GET /admin/teachers`

Список всех преподавателей.

---

### `POST /admin/classes/:classId/enroll-group?group=IS-37`

Массовая запись всех студентов группы в класс.

**Параметры запроса**: `group` — название группы

Использует `skipDuplicates` — уже записанные студенты пропускаются.

---

### `DELETE /admin/classes/:classId/unenroll-group?group=IS-37`

Массовое удаление студентов группы из класса.

---

## ИИ-чат (`/ai`)

> Подробности в [[AI интеграция]]

### `POST /ai/chat`

Синхронный чат с ИИ — возвращает полный ответ.

**Тело**:
```json
{
  "messages": [
    { "role": "user", "content": "Объясни сортировку пузырьком" }
  ]
}
```

---

### `POST /ai/chat/stream`

Потоковый чат с ИИ — возвращает ответ в реальном времени через n8n webhook.

**Тело**: аналогично `/ai/chat`

**Ответ**: поток JSON-объектов или Server-Sent Events.

---

## Статические файлы

| Путь | Описание |
|------|----------|
| `/uploads/*` | Загруженные файлы (обслуживаются NestJS статикой) |

## Связанные документы

- [[Бэкенд]] — реализация сервисов
- [[База данных]] — модели данных
- [[AI интеграция]] — подробности об ИИ-чате