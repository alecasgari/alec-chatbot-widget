# Alec ChatBot Widget

A modern, customizable chat widget for integrating with n8n workflows. Built with React, TypeScript, and Tailwind CSS.

## Features

- 🚀 **Easy Integration** - One script tag to add to any website
- 🎨 **Customizable Themes** - Colors, positions, and styling options
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔗 **n8n Integration** - Seamless webhook communication
- ⚡ **Real-time Updates** - Live connection status and typing indicators
- 🎯 **Flexible Configuration** - Extensive customization options
- 📦 **Lightweight** - Optimized bundle size
- 🛡️ **Type Safe** - Full TypeScript support

## Quick Start

### 1. Build the Widget

```bash
npm install
npm run build:widget
```

This creates the widget files in the `dist/` directory:
- `widget.js` - The main widget script
- `widget.css` - Styles (if needed)

### 2. Deploy to Your Server

Upload the `dist/` folder contents to your web server.

### 3. Add to Your Website

```html
<script src="https://your-domain.com/widget.js"></script>
<script>
  const chatbot = new AlecChatBot({
    webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
    theme: {
      primaryColor: '#059669',
      position: 'bottom-right'
    }
  });
  chatbot.init();
</script>
```

## Configuration Options

### Basic Configuration

```javascript
const chatbot = new AlecChatBot({
  webhookUrl: 'https://your-n8n-webhook-url',
  theme: {
    primaryColor: '#059669',
    position: 'bottom-right',
    title: 'AI Assistant',
    placeholder: 'Type your message...'
  }
});
```

### Advanced Configuration

```javascript
const chatbot = new AlecChatBot({
  webhookUrl: 'https://your-n8n-webhook-url',
  theme: {
    primaryColor: '#059669',
    position: 'bottom-right', // 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    title: 'AI Assistant',
    placeholder: 'Type your message...'
  },
  features: {
    resizable: true,
    typingAnimation: true,
    connectionStatus: true,
    autoOpen: false
  },
  callbacks: {
    onMessage: (message) => {
      console.log('User sent:', message);
      // Track analytics, etc.
    },
    onOpen: () => {
      console.log('Chat opened');
      // Track chat open events
    },
    onClose: () => {
      console.log('Chat closed');
      // Track chat close events
    },
    onError: (error) => {
      console.error('Chat error:', error);
      // Handle errors
    }
  }
});
```

## API Reference

### ChatBotInstance Methods

```javascript
const chatbot = new AlecChatBot(config);
const instance = chatbot.init();

// Open the chat
instance.open();

// Close the chat
instance.close();

// Send a message programmatically
instance.sendMessage('Hello!');

// Update configuration
instance.updateConfig({
  theme: {
    primaryColor: '#3b82f6'
  }
});

// Destroy the widget
instance.destroy();
```

## n8n Integration

The widget sends messages to your n8n webhook in this format:

```json
{
  "text": "User message",
  "sessionId": "cw-1234567890-abc123",
  "meta": {
    "origin": "https://your-website.com",
    "ua": "Mozilla/5.0...",
    "referer": "https://your-website.com/page"
  }
}
```

Your n8n workflow should respond with:

```json
{
  "reply": "Bot response message",
  "sessionId": "cw-1234567890-abc123"
}
```

## Development

### Local Development

```bash
npm install
npm run dev
```

### Building

```bash
# Build for development
npm run build

# Build widget for production
npm run build:widget

# Preview build
npm run preview
```

## File Structure

```
alec-chatbot-widget/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   └── ChatBot.tsx     # Main chat component
│   ├── services/           # Business logic
│   │   └── webhookService.ts
│   ├── types/              # TypeScript definitions
│   │   └── widget.ts
│   ├── widget/             # Widget entry point
│   │   └── index.ts
│   ├── styles/             # CSS styles
│   │   └── globals.css
│   ├── App.tsx             # Demo app
│   └── main.tsx            # Entry point
├── dist/                   # Built files
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License

## Support

For questions and support, contact Alec Asgari.
