# 🚀 Deployment Guide - WebSocket Server

راهنمای کامل deployment سرور WebSocket به VPS

---

## 📋 دستورات سرور

### مرحله 1: Pull کردن تغییرات از GitHub

```bash
cd ~/chatbot
git pull origin main
```

### مرحله 2: نصب Dependencies سرور

```bash
cd ~/chatbot/server
npm install
```

### مرحله 3: Build کردن Widget (اگر لازم است)

```bash
cd ~/chatbot
npm run build:widget
```

### مرحله 4: کپی کردن فایل‌های تست

```bash
cp test-widget.html dist/test-widget.html
cp test-custom-theme.html dist/test-custom-theme.html
```

### مرحله 5: Stop کردن containerهای قدیمی

```bash
cd ~/chatbot
docker-compose down
```

### مرحله 6: حذف تصاویر قدیمی (اختیاری)

```bash
docker rmi chatbot_chatbot chatbot_websocket-server 2>/dev/null || true
```

### مرحله 7: Build و Start کردن سرویس‌ها

```bash
docker-compose up -d --build
```

### مرحله 8: بررسی وضعیت

```bash
# بررسی containerها
docker ps | grep chatbot

# بررسی لاگ‌های WebSocket server
docker logs -f alec-chatbot-websocket

# بررسی لاگ‌های Widget server
docker logs -f alec-chatbot-widget
```

---

## 🔧 تنظیمات Nginx Proxy Manager

### Proxy Host برای Widget (موجود)

- **Domain Names:** `chat.alecasgari.com`
- **Scheme:** `http`
- **Forward Hostname / IP:** `alec-chatbot-widget`
- **Forward Port:** `80`
- **SSL:** Let's Encrypt
- **Custom Nginx Config:**
  ```nginx
  # CORS headers
  add_header 'Access-Control-Allow-Origin' '*' always;
  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
  
  # Cache control
  add_header 'Cache-Control' 'no-cache, no-store, must-revalidate' always;
  ```

### Proxy Host جدید برای WebSocket Server

#### HTTP API (Port 3001)

- **Domain Names:** `chat.alecasgari.com`
- **Scheme:** `http`
- **Forward Hostname / IP:** `alec-chatbot-websocket`
- **Forward Port:** `3001`
- **SSL:** Let's Encrypt
- **Custom Locations:**
  
  **Location 1: `/api/*`**
  ```nginx
  proxy_pass http://alec-chatbot-websocket:3001;
  proxy_http_version 1.1;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  
  # CORS
  add_header 'Access-Control-Allow-Origin' '*' always;
  add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
  add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
  ```
  
  **Location 2: `/health`**
  ```nginx
  proxy_pass http://alec-chatbot-websocket:3001;
  proxy_http_version 1.1;
  ```

#### WebSocket (Port 8080)

**مهم:** WebSocket نیاز به یک subdomain جداگانه دارد یا باید از همان domain با path مشخص استفاده شود.

**گزینه 1: Subdomain جداگانه (توصیه می‌شود)**

- **Domain Names:** `ws.chat.alecasgari.com`
- **Scheme:** `http`
- **Forward Hostname / IP:** `alec-chatbot-websocket`
- **Forward Port:** `8080`
- **SSL:** Let's Encrypt
- **Websockets Support:** ✅ (فعال کنید)
- **Custom Nginx Config:**
  ```nginx
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  
  proxy_read_timeout 86400;
  proxy_send_timeout 86400;
  ```

**گزینه 2: استفاده از همان domain با port مشخص**

اگر می‌خواهید از `chat.alecasgari.com:8080` استفاده کنید:

1. در Cloudflare، یک A Record برای `chat.alecasgari.com` ایجاد کنید
2. در firewall سرور، port 8080 را باز کنید:
   ```bash
   sudo ufw allow 8080/tcp
   ```
3. در NPM نیازی به proxy host جداگانه ندارید

---

## 🔥 تنظیمات Firewall

```bash
# اگر از UFW استفاده می‌کنید
sudo ufw allow 3001/tcp
sudo ufw allow 8080/tcp
sudo ufw reload

# اگر از iptables استفاده می‌کنید
sudo iptables -A INPUT -p tcp --dport 3001 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables-save
```

---

## ☁️ تنظیمات Cloudflare

### DNS Records

اضافه کردن یا به‌روزرسانی:

1. **A Record برای WebSocket (اگر از subdomain استفاده می‌کنید):**
   - Type: `A`
   - Name: `ws.chat` یا `ws`
   - Content: `[IP سرور شما]`
   - Proxy status: `DNS only` (غیرفعال - خاکستری)
   - TTL: `Auto`

2. **A Record اصلی:**
   - Type: `A`
   - Name: `chat`
   - Content: `[IP سرور شما]`
   - Proxy status: `Proxied` (فعال - نارنجی)
   - TTL: `Auto`

**توجه:** برای WebSocket، Cloudflare Proxy را **غیرفعال** کنید (DNS only) تا مشکلی پیش نیاید.

---

## 🧪 تست کردن

### 1. تست Widget

```bash
# از مرورگر
https://chat.alecasgari.com/test-widget.html
```

### 2. تست WebSocket Connection

باز کردن Console مرورگر (F12) و بررسی لاگ‌ها:
```
🔌 Connecting to WebSocket: wss://chat.alecasgari.com:8080
✅ WebSocket connected
✅ Session registered: cw-1234567890-abc123
```

### 3. تست HTTP API

```bash
# Health check
curl https://chat.alecasgari.com/health

# Get active sessions
curl https://chat.alecasgari.com/api/sessions

# Send test message (نیاز به sessionId فعال)
curl -X POST https://chat.alecasgari.com/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "cw-1234567890-abc123",
    "text": "Test message from operator"
  }'
```

### 4. تست از n8n

1. به n8n بروید
2. یک HTTP Request node اضافه کنید
3. تنظیمات:
   - Method: `POST`
   - URL: `https://chat.alecasgari.com/api/send-message`
   - Body:
     ```json
     {
       "sessionId": "{{$json.sessionId}}",
       "text": "Hello from n8n!"
     }
     ```
4. Execute کنید

---

## 📊 Monitoring و Debugging

### بررسی لاگ‌ها

```bash
# WebSocket server logs
docker logs -f alec-chatbot-websocket

# Widget server logs  
docker logs -f alec-chatbot-widget

# همه لاگ‌ها
docker-compose logs -f
```

### بررسی وضعیت سرویس‌ها

```bash
# List running containers
docker ps

# Check health
docker inspect --format='{{.State.Health.Status}}' alec-chatbot-websocket

# Network info
docker network inspect web-network
```

### بررسی active sessions

```bash
curl https://chat.alecasgari.com/api/sessions
```

---

## 🐛 Troubleshooting

### مشکل: WebSocket اتصال برقرار نمی‌کند

**راه‌حل:**
1. بررسی firewall: `sudo ufw status`
2. بررسی port: `netstat -tlnp | grep 8080`
3. بررسی لاگ: `docker logs alec-chatbot-websocket`
4. بررسی Cloudflare: proxy را غیرفعال کنید
5. تست local: `wscat -c ws://localhost:8080`

### مشکل: CORS errors

**راه‌حل:**
1. بررسی Nginx config
2. اضافه کردن CORS headers در NPM
3. Restart کردن proxy: در NPM، proxy host را disable و enable کنید

### مشکل: Container بالا نمی‌آید

**راه‌حل:**
```bash
# Remove old containers
docker-compose down -v

# Rebuild completely
docker-compose up -d --build --force-recreate

# Check logs
docker-compose logs
```

### مشکل: Port already in use

**راه‌حل:**
```bash
# پیدا کردن process
sudo lsof -i :8080
sudo lsof -i :3001

# Kill کردن process
sudo kill -9 [PID]

# یا تغییر port در docker-compose.yml
```

---

## 🔄 به‌روزرسانی

برای به‌روزرسانی در آینده:

```bash
cd ~/chatbot
git pull origin main
cd server && npm install && cd ..
npm run build:widget
cp test-widget.html dist/
docker-compose down
docker-compose up -d --build
```

---

## 📞 پشتیبانی

اگر مشکلی پیش آمد:

1. لاگ‌ها را بررسی کنید
2. مستندات را مطالعه کنید: `OPERATOR-MESSAGING-GUIDE.md`
3. تماس با پشتیبانی: support@alecasgari.com

---

## ✅ Checklist نهایی

قبل از تست production:

- [ ] git pull انجام شد
- [ ] Dependencies نصب شد
- [ ] Widget build شد
- [ ] docker-compose up موفق بود
- [ ] Containers running هستند
- [ ] Nginx proxy hosts تنظیم شدند
- [ ] Cloudflare DNS تنظیم شد
- [ ] Firewall ports باز هستند
- [ ] test-widget.html کار می‌کند
- [ ] WebSocket اتصال برقرار می‌شود
- [ ] API endpoints پاسخ می‌دهند
- [ ] n8n می‌تواند پیام بفرستد

---

© 2025 Alec Asgari. All rights reserved.
