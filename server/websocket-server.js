const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');

const app = express();
const HTTP_PORT = 3001;
const WS_PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store active WebSocket connections by sessionId
const sessions = new Map();

// Create WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

console.log(`🚀 WebSocket Server starting...`);

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`✅ New WebSocket connection from ${clientIp}`);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'WebSocket connection established'
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log(`📨 Received message:`, data);
      
      // Register session
      if (data.type === 'register' && data.sessionId) {
        // Remove old connection if exists
        if (sessions.has(data.sessionId)) {
          const oldWs = sessions.get(data.sessionId);
          if (oldWs !== ws && oldWs.readyState === WebSocket.OPEN) {
            oldWs.close();
          }
        }
        
        sessions.set(data.sessionId, ws);
        console.log(`✅ Session registered: ${data.sessionId} (Total active: ${sessions.size})`);
        
        ws.send(JSON.stringify({ 
          type: 'registered', 
          sessionId: data.sessionId,
          timestamp: new Date().toISOString()
        }));
      }
      
      // Handle ping/pong for keep-alive
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ 
          type: 'pong',
          timestamp: new Date().toISOString()
        }));
      }
      
    } catch (error) {
      console.error('❌ Error processing WebSocket message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: 'Invalid message format' 
      }));
    }
  });
  
  ws.on('close', () => {
    // Remove session on disconnect
    let removedSessionId = null;
    for (const [sessionId, socket] of sessions.entries()) {
      if (socket === ws) {
        sessions.delete(sessionId);
        removedSessionId = sessionId;
        break;
      }
    }
    
    if (removedSessionId) {
      console.log(`🔌 Session disconnected: ${removedSessionId} (Remaining: ${sessions.size})`);
    } else {
      console.log(`🔌 Unregistered connection closed`);
    }
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

// HTTP API endpoint for n8n to send operator messages
app.post('/api/send-message', (req, res) => {
  const { sessionId, text } = req.body;
  
  console.log(`📬 API Request - Send message to session: ${sessionId}`);
  
  // Validate input
  if (!sessionId || !text) {
    console.log(`❌ Validation failed - Missing sessionId or text`);
    return res.status(400).json({ 
      success: false, 
      error: 'sessionId and text are required',
      received: { sessionId: !!sessionId, text: !!text }
    });
  }
  
  // Find the WebSocket connection for this session
  const ws = sessions.get(sessionId);
  
  if (!ws) {
    console.log(`❌ Session not found: ${sessionId}`);
    console.log(`📊 Active sessions: ${Array.from(sessions.keys()).join(', ')}`);
    return res.status(404).json({ 
      success: false, 
      error: 'Session not found',
      sessionId: sessionId,
      activeSessions: sessions.size
    });
  }
  
  if (ws.readyState !== WebSocket.OPEN) {
    console.log(`❌ Connection closed for session: ${sessionId}`);
    sessions.delete(sessionId);
    return res.status(404).json({ 
      success: false, 
      error: 'Connection closed',
      sessionId: sessionId
    });
  }
  
  // Send message to the client
  try {
    const messagePayload = {
      type: 'operator_message',
      text: text,
      timestamp: new Date().toISOString(),
      messageId: `msg-${Date.now()}`
    };
    
    ws.send(JSON.stringify(messagePayload));
    
    console.log(`✅ Message sent successfully to session: ${sessionId}`);
    console.log(`📝 Message: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
    
    res.json({ 
      success: true, 
      message: 'Message sent to user successfully',
      sessionId: sessionId,
      messageId: messagePayload.messageId,
      timestamp: messagePayload.timestamp
    });
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message',
      details: error.message
    });
  }
});

// Get active sessions (for monitoring)
app.get('/api/sessions', (req, res) => {
  const activeSessions = Array.from(sessions.keys()).map(sessionId => ({
    sessionId,
    connected: true,
    readyState: sessions.get(sessionId).readyState
  }));
  
  res.json({
    success: true,
    count: sessions.size,
    sessions: activeSessions
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'Alec ChatBot WebSocket Server',
    activeSessions: sessions.size,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Alec ChatBot WebSocket Server',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      sendMessage: 'POST /api/send-message',
      sessions: 'GET /api/sessions'
    },
    websocket: {
      port: WS_PORT,
      activeSessions: sessions.size
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start HTTP server
app.listen(HTTP_PORT, () => {
  console.log(`✅ HTTP API Server listening on port ${HTTP_PORT}`);
  console.log(`✅ WebSocket Server listening on port ${WS_PORT}`);
  console.log(`\n📌 Endpoints:`);
  console.log(`   - Health Check: http://localhost:${HTTP_PORT}/health`);
  console.log(`   - Send Message: POST http://localhost:${HTTP_PORT}/api/send-message`);
  console.log(`   - Active Sessions: GET http://localhost:${HTTP_PORT}/api/sessions`);
  console.log(`   - WebSocket: ws://localhost:${WS_PORT}`);
  console.log(`\n🚀 Server ready!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM received, closing servers...');
  wss.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, closing servers...');
  wss.close(() => {
    console.log('✅ WebSocket server closed');
    process.exit(0);
  });
});

