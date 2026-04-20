# Infrastructure as Code and CI/CD

В проект добавлены:

- `Jenkins` для CI/CD pipeline
- `Terraform` для поднятия инфраструктуры AWS
- `Ansible` для provisioning и деплоя Docker-стека

## Каталоги

- `Jenkinsfile` - pipeline (frontend/backend build + test + docker build)
- `ci/jenkins/` - Dockerfile Jenkins c Docker CLI
- `infra/terraform/` - инфраструктура AWS
- `infra/ansible/` - provisioning и deploy playbooks

## Рекомендуемый workflow

1. `Terraform` поднимает сервер в AWS.
2. `Ansible provision` ставит Docker и зависимости.
3. `Ansible deploy` выкладывает проект и поднимает `docker compose`.
4. `Jenkins` запускает pipeline на каждый push/PR.
