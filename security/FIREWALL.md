# Firewall

Firewall настраивается на хост-машине (не внутри контейнера).

## Быстрый запуск (UFW)

```bash
sudo ./security/firewall-setup.sh
```

Открытые порты:

- `80/tcp` (nginx)
- `443/tcp` (nginx TLS, если добавите сертификат)
- `2222/tcp` (ssh контейнер, профиль `security`)

