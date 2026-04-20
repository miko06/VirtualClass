# Terraform for VirtualClass

Этот каталог поднимает базовую AWS инфраструктуру под VirtualClass:

- VPC + public subnet
- Internet Gateway + route table
- Security Group (80/443/22)
- EC2 instance (Ubuntu 22.04)
- SSH key pair

## Предварительные требования

- Terraform `>= 1.5`
- AWS credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`)

## Быстрый старт

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
terraform init
terraform plan
terraform apply
```

После применения Terraform выведет `instance_public_ip`.

## Важно

- Ограничьте `ssh_allowed_cidr` вашим реальным IP/подсетью.
- Не храните приватные ключи и реальные секреты в git.
