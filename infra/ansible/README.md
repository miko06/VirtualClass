# Ansible for VirtualClass

Ansible используется для двух задач:

- `provision`: подготовка сервера (Docker, зависимости)
- `deploy`: выкладка и запуск `docker compose`

## Структура

- `inventories/dev/hosts.ini` - хосты
- `inventories/dev/group_vars/virtualclass.yml` - переменные окружения
- `playbooks/provision.yml` - подготовка сервера
- `playbooks/deploy.yml` - деплой приложения

## Быстрый старт

```bash
cd infra/ansible
cp inventories/dev/hosts.ini inventories/dev/hosts.local.ini
# укажите IP в hosts.local.ini

ansible-playbook -i inventories/dev/hosts.local.ini playbooks/provision.yml
ansible-playbook -i inventories/dev/hosts.local.ini playbooks/deploy.yml
```

## Что нужно настроить

1. В `inventories/dev/hosts.ini` (или `hosts.local.ini`) укажите публичный IP.
2. В `inventories/dev/group_vars/virtualclass.yml` задайте:
   - `repo_url`
   - секреты в `app_env` (особенно `POSTGRES_PASSWORD`)

Для прода рекомендуется хранить секреты через Ansible Vault.
