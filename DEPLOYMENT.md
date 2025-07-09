# 🚀 Deployment Guide

Bu kılavuz, IoT Dashboard projesini production ortamına deploy etmek için gerekli adımları içerir.

## 📋 Prerequisites

- Docker ve Docker Compose
- Git
- Domain name (opsiyonel)
- SSL sertifikası (opsiyonel)

## 🔧 Environment Setup

### 1. Environment Variables

Production için `.env` dosyası oluşturun:

```bash
# Server Configuration
NODE_ENV=production
PORT=3001

# Database Configuration
MONGO_PASSWORD=your-secure-mongo-password
MONGODB_URI=mongodb://admin:your-secure-mongo-password@mongodb:27017/iot-dashboard?authSource=admin

# Redis Configuration
REDIS_PASSWORD=your-secure-redis-password
REDIS_URL=redis://:your-secure-redis-password@redis:6379

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-characters

# Frontend Configuration
FRONTEND_URL=https://your-domain.com
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_WS_URL=wss://your-domain.com

# Monitoring
GRAFANA_PASSWORD=your-secure-grafana-password
```

### 2. SSL Certificate (Optional)

HTTPS için SSL sertifikası alın ve `nginx/ssl/` klasörüne yerleştirin:

```bash
mkdir -p nginx/ssl
# SSL sertifikalarınızı buraya kopyalayın
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Development ortamını başlat
docker compose up -d

# Logları görüntüle
docker compose logs -f
```

### Production Environment

```bash
# Production ortamını başlat
docker compose -f docker-compose.prod.yml up -d

# Logları görüntüle
docker compose -f docker-compose.prod.yml logs -f
```

## 📊 Monitoring Setup

### Prometheus Configuration

`monitoring/prometheus.yml` dosyası oluşturun:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: "iot-dashboard-backend"
    static_configs:
      - targets: ["backend:3001"]
    metrics_path: "/metrics"

  - job_name: "iot-dashboard-frontend"
    static_configs:
      - targets: ["frontend:80"]
    metrics_path: "/health"
```

### Grafana Dashboard

1. Grafana'ya giriş yapın: `http://your-domain:3000`
2. Default credentials: `admin/admin`
3. Prometheus data source ekleyin
4. IoT Dashboard dashboard'ını import edin

## 🔒 Security Considerations

### 1. Firewall Configuration

```bash
# Sadece gerekli portları açın
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### 2. Database Security

```bash
# MongoDB authentication
docker exec -it iot-dashboard-mongodb-prod mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: ["root"]
})
```

### 3. Redis Security

```bash
# Redis password protection
docker exec -it iot-dashboard-redis-prod redis-cli
AUTH your-secure-redis-password
```

## 📈 Scaling

### Horizontal Scaling

```yaml
# docker-compose.prod.yml
services:
  backend:
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
```

### Load Balancer

Nginx load balancer konfigürasyonu:

```nginx
upstream backend_servers {
    server backend1:3001;
    server backend2:3001;
    server backend3:3001;
}

server {
    listen 80;
    location /api/ {
        proxy_pass http://backend_servers;
    }
}
```

## 🔄 Backup Strategy

### Database Backup

```bash
# MongoDB backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec iot-dashboard-mongodb-prod mongodump \
  --username admin \
  --password your-password \
  --authenticationDatabase admin \
  --db iot-dashboard \
  --out /backup/mongodb_$DATE

# Backup'ı sıkıştır
tar -czf backup/mongodb_$DATE.tar.gz backup/mongodb_$DATE
```

### Automated Backup

Cron job ekleyin:

```bash
# /etc/crontab
0 2 * * * root /path/to/backup-script.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**

   ```bash
   # Kullanılan portları kontrol et
   netstat -tulpn | grep :3001
   ```

2. **Memory Issues**

   ```bash
   # Container memory kullanımını kontrol et
   docker stats
   ```

3. **Database Connection Issues**
   ```bash
   # MongoDB bağlantısını test et
   docker exec -it iot-dashboard-mongodb-prod mongosh --eval "db.runCommand('ping')"
   ```

### Log Analysis

```bash
# Backend logları
docker compose logs backend

# Frontend logları
docker compose logs frontend

# MongoDB logları
docker compose logs mongodb
```

## 📞 Support

Sorun yaşarsanız:

1. Logları kontrol edin
2. Health check endpoint'lerini test edin
3. Docker container durumlarını kontrol edin
4. Network bağlantılarını test edin

## 🔄 Updates

### Application Updates

```bash
# Yeni versiyonu deploy et
git pull origin main
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Database Migrations

```bash
# Migration script'lerini çalıştır
docker exec -it iot-dashboard-backend-prod npm run migrate
```
