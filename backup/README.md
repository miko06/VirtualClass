# Backup

Автоматический backup PostgreSQL создаётся контейнером `backup`.

## Где лежат бэкапы

- Папка: `backup/data`
- Формат: `vc_YYYYMMDD_HHMMSS.dump`

## Восстановление

```bash
docker compose exec -T postgres pg_restore -U vc -d vc -c < backup/data/<имя_файла>.dump
```

