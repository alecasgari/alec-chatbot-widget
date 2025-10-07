# 🎯 Operator Messaging Guide - n8n Integration

This guide explains how to send messages from a human operator to chatbot users via n8n workflows.

## 📋 Overview

The WebSocket server allows n8n (or any external service) to send messages directly to active chat users. This enables human operators to take over conversations when needed.

---

## 🏗️ Architecture

```
User Browser (ChatBot Widget)
        ↕ WebSocket
WebSocket Server (Port 8080)
        ↕ HTTP API (Port 3001)
n8n Workflow
```

---

## 🚀 Quick Start

### Step 1: Get the User's Session ID

When a user sends a message, your n8n workflow receives a `sessionId` in the webhook payload:

```json
{
  "text": "User's message",
  "sessionId": "cw-1234567890-abc123xyz",
  "meta": {
    "origin": "https://example.com",
    "ua": "Mozilla/5.0...",
    "referer": "https://example.com/page"
  }
}
```

**Important:** Store this `sessionId` - you'll need it to send messages back to this specific user.

### Step 2: Send Operator Message

Use an HTTP Request node in n8n to send a message to the user:

**Endpoint:** `POST https://chat.alecasgari.com:3001/api/send-message`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body:**
```json
{
  "sessionId": "cw-1234567890-abc123xyz",
  "text": "Hello! A human operator is here to help you."
}
```

---

## 📝 Complete n8n Workflow Example

Here's a complete workflow for operator handoff:

### Workflow Steps:

1. **Webhook Trigger** - Receives user message
2. **Function Node** - Stores sessionId
3. **AI Response** - Get AI response (optional)
4. **If/Switch Node** - Check if operator needed
5. **HTTP Request** - Send operator message

### Node Configurations:

#### 1. Webhook Trigger Node
- **HTTP Method:** POST
- **Path:** `/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a`
- **Response Mode:** Last Node

#### 2. Function Node (Store Session)
```javascript
// Store the sessionId for later use
return {
  ...items[0].json,
  sessionId: items[0].json.sessionId,
  userMessage: items[0].json.text,
  timestamp: new Date().toISOString()
};
```

#### 3. AI Agent Node (optional)
Your existing AI configuration...

#### 4. Switch Node (Operator Check)
```javascript
// Check if operator is needed
const message = $json.userMessage.toLowerCase();
const needsOperator = 
  message.includes('human') ||
  message.includes('operator') ||
  message.includes('support') ||
  message.includes('speak to someone');

return needsOperator ? 0 : 1;
```

#### 5. HTTP Request Node (Send Operator Message)
- **Method:** POST
- **URL:** `https://chat.alecasgari.com:3001/api/send-message`
- **Authentication:** None (add if needed)
- **Body Parameters:**
  ```json
  {
    "sessionId": "={{$json.sessionId}}",
    "text": "I'm connecting you with a human operator. Please wait a moment..."
  }
  ```

#### 6. Wait for Operator Input (Manual Trigger or External API)
You can set up a manual trigger or connect to your support system here.

#### 7. HTTP Request Node (Send Final Operator Response)
- **Method:** POST
- **URL:** `https://chat.alecasgari.com:3001/api/send-message`
- **Body:**
  ```json
  {
    "sessionId": "={{$json.sessionId}}",
    "text": "={{$json.operatorResponse}}"
  }
  ```

---

## 🔧 API Reference

### Send Message to User

**Endpoint:** `POST /api/send-message`

**Request Body:**
```json
{
  "sessionId": "string (required)",
  "text": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Message sent to user successfully",
  "sessionId": "cw-1234567890-abc123xyz",
  "messageId": "msg-1234567890",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

**Error Responses:**

**400 - Missing Parameters:**
```json
{
  "success": false,
  "error": "sessionId and text are required",
  "received": {
    "sessionId": true,
    "text": false
  }
}
```

**404 - Session Not Found:**
```json
{
  "success": false,
  "error": "Session not found",
  "sessionId": "cw-1234567890-abc123xyz",
  "activeSessions": 3
}
```

**404 - Connection Closed:**
```json
{
  "success": false,
  "error": "Connection closed",
  "sessionId": "cw-1234567890-abc123xyz"
}
```

---

### Get Active Sessions

**Endpoint:** `GET /api/sessions`

**Response:**
```json
{
  "success": true,
  "count": 3,
  "sessions": [
    {
      "sessionId": "cw-1234567890-abc123",
      "connected": true,
      "readyState": 1
    },
    {
      "sessionId": "cw-0987654321-xyz789",
      "connected": true,
      "readyState": 1
    }
  ]
}
```

---

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "service": "Alec ChatBot WebSocket Server",
  "activeSessions": 3,
  "uptime": 3600.5,
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

---

## 🎨 Advanced Use Cases

### 1. Queue System with Multiple Operators

```javascript
// n8n Function Node
const queue = $('Get Queue').all();
const availableOperator = queue.find(op => op.json.status === 'available');

if (availableOperator) {
  return {
    sessionId: $json.sessionId,
    operatorId: availableOperator.json.id,
    operatorName: availableOperator.json.name
  };
}
```

### 2. Typing Indicator

Send multiple messages to simulate typing:

```javascript
// First message
await $http.post('https://chat.alecasgari.com:3001/api/send-message', {
  sessionId: sessionId,
  text: "Typing..."
});

// Wait 2 seconds
await new Promise(resolve => setTimeout(resolve, 2000));

// Actual message
await $http.post('https://chat.alecasgari.com:3001/api/send-message', {
  sessionId: sessionId,
  text: "Here's the answer to your question..."
});
```

### 3. Rich Message Formatting

```javascript
{
  "sessionId": "cw-1234567890-abc123",
  "text": "Hello! 👋\n\nI'm here to help. Please choose an option:\n\n1️⃣ Technical Support\n2️⃣ Billing Questions\n3️⃣ General Inquiry\n\nJust type the number!"
}
```

### 4. Session Handoff Notification

```javascript
// Notify user about handoff
await $http.post('https://chat.alecasgari.com:3001/api/send-message', {
  sessionId: sessionId,
  text: "🔄 Transferring you to our support team..."
});

// Update your CRM or support system
// ...

// Confirm handoff
await $http.post('https://chat.alecasgari.com:3001/api/send-message', {
  sessionId: sessionId,
  text: "✅ Connected to Sarah from Support. How can I help you today?"
});
```

---

## 🐛 Troubleshooting

### Issue: "Session not found"

**Causes:**
1. User closed the chat
2. User refreshed the page (new sessionId generated)
3. WebSocket connection lost

**Solution:**
- Always check for 404 errors
- Implement session timeout logic
- Store sessions in your n8n workflow for reference

### Issue: Messages not appearing in chat

**Causes:**
1. Wrong sessionId
2. WebSocket server down
3. User's browser lost connection

**Debug Steps:**
```bash
# Check server health
curl https://chat.alecasgari.com:3001/health

# List active sessions
curl https://chat.alecasgari.com:3001/api/sessions

# Check server logs
docker logs alec-chatbot-websocket
```

### Issue: Connection timeouts

**Solution:**
- WebSocket connections automatically reconnect after 5 seconds
- Implement retry logic in n8n:
  ```javascript
  let retries = 3;
  while (retries > 0) {
    try {
      const response = await $http.post(...);
      return response;
    } catch (error) {
      retries--;
      if (retries === 0) throw error;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  ```

---

## 📊 Monitoring

### View Active Sessions
```bash
curl https://chat.alecasgari.com:3001/api/sessions
```

### Server Logs
```bash
docker logs -f alec-chatbot-websocket
```

### Test Sending Message
```bash
curl -X POST https://chat.alecasgari.com:3001/api/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "cw-1234567890-abc123",
    "text": "Test message from operator"
  }'
```

---

## 🔒 Security Considerations

1. **Authentication (Recommended):**
   - Add API key authentication to the `/api/send-message` endpoint
   - Store API key in n8n credentials

2. **Rate Limiting:**
   - Implement rate limiting to prevent abuse
   - Limit messages per session per minute

3. **Input Validation:**
   - Server validates all inputs
   - Maximum message length: 5000 characters (configurable)

4. **CORS:**
   - Server has CORS enabled for specified domains
   - Update CORS settings in `websocket-server.js` if needed

---

## 📞 Support

Need help?
- 📧 Email: support@alecasgari.com
- 🌐 Website: https://alecasgari.com
- 📝 Documentation: https://chat.alecasgari.com/docs

---

## 📝 Example n8n Workflow JSON

Save this as a starter template:

```json
{
  "name": "ChatBot Operator Handoff",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "webhook-path",
        "responseMode": "lastNode"
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://chat.alecasgari.com:3001/api/send-message",
        "jsonParameters": true,
        "options": {},
        "bodyParametersJson": "={\"sessionId\": \"{{$json.sessionId}}\", \"text\": \"Connecting you with an operator...\"}"
      },
      "name": "Send Operator Message",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Send Operator Message",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

---

© 2025 Alec Asgari. All rights reserved.

