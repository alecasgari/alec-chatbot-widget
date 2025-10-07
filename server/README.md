# 🚀 Alec ChatBot WebSocket Server

WebSocket server for enabling real-time operator messaging in the Alec ChatBot widget.

## 📋 Features

- ✅ Real-time WebSocket connections
- ✅ HTTP API for sending messages
- ✅ Automatic reconnection
- ✅ Session management
- ✅ Keep-alive ping/pong
- ✅ Health monitoring
- ✅ Docker support

## 🏗️ Installation

### Local Development

```bash
cd server
npm install
npm start
```

### Docker

```bash
docker build -t alec-chatbot-websocket .
docker run -p 3001:3001 -p 8080:8080 alec-chatbot-websocket
```

### Docker Compose (Recommended)

```bash
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Environment (default: production)
- `HTTP_PORT`: HTTP API port (default: 3001)
- `WS_PORT`: WebSocket port (default: 8080)

### Ports

- **3001**: HTTP API for sending messages
- **8080**: WebSocket connections

## 📡 API Endpoints

### Send Message
```bash
POST /api/send-message
Content-Type: application/json

{
  "sessionId": "cw-1234567890-abc123",
  "text": "Message from operator"
}
```

### Get Active Sessions
```bash
GET /api/sessions
```

### Health Check
```bash
GET /health
```

## 🧪 Testing

### Test WebSocket Connection

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'register',
    sessionId: 'test-session-123'
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', event.data);
};
```

### Test HTTP API

```bash
curl -X POST http://localhost:3001/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-123",
    "text": "Test message"
  }'
```

## 📊 Monitoring

### View Logs

```bash
# Docker
docker logs -f alec-chatbot-websocket

# Local
npm start
```

### Check Active Sessions

```bash
curl http://localhost:3001/api/sessions
```

### Health Check

```bash
curl http://localhost:3001/health
```

## 🔒 Security

- CORS enabled for all origins (configure in production)
- Input validation on all endpoints
- WebSocket connection management
- Automatic cleanup of closed connections

## 📝 Dependencies

- `express`: ^4.18.2
- `ws`: ^8.14.2
- `cors`: ^2.8.5

## 🐛 Troubleshooting

### WebSocket won't connect

1. Check if server is running: `curl http://localhost:3001/health`
2. Check firewall settings
3. Verify ports 3001 and 8080 are open

### Messages not being received

1. Check if session is registered: `GET /api/sessions`
2. Verify sessionId matches
3. Check WebSocket connection state

### Server crashes

1. Check logs: `docker logs alec-chatbot-websocket`
2. Verify Node.js version >= 16
3. Check available ports

## 📞 Support

For issues or questions:
- Email: support@alecasgari.com
- Documentation: See OPERATOR-MESSAGING-GUIDE.md

## 📄 License

ISC License - © 2025 Alec Asgari

