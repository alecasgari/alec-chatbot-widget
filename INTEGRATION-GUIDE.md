# 🚀 Alec ChatBot Widget - Complete Integration Guide

Welcome to the complete integration guide for the Alec ChatBot Widget! This guide will help you integrate the chatbot into any website in just a few minutes.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Integration Methods](#integration-methods)
  - [Method 1: Simple Integration](#method-1-simple-integration)
  - [Method 2: One-liner Integration](#method-2-one-liner-integration)
  - [Method 3: Advanced Integration](#method-3-advanced-integration)
  - [Method 4: Custom Theme](#method-4-custom-theme)
  - [Method 5: Auto-Open](#method-5-auto-open)
  - [Method 6: Programmatic Control](#method-6-programmatic-control)
- [Configuration Options](#configuration-options)
- [Platform-Specific Guides](#platform-specific-guides)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

The fastest way to add the chatbot to your website:

```html
<!-- Add this before closing </body> tag -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
    }).init();
  });
</script>
```

**That's it!** The chatbot will appear in the bottom-right corner of your page.

---

## 📚 Integration Methods

### Method 1: Simple Integration

**Best for:** Basic implementation, beginners, simple websites

**How it works:** Load the widget with default settings - minimal code required.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>Your content here...</p>
    
    <!-- Alec ChatBot Widget - Simple Integration -->
    <link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
    <script src="https://chat.alecasgari.com/widget.iife.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        new (window.AlecChatBot.default || window.AlecChatBot)({
          webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
        }).init();
      });
    </script>
</body>
</html>
```

**Steps:**
1. Copy the code above
2. Paste it before the closing `</body>` tag in your HTML
3. Save and reload - done!

---

### Method 2: One-liner Integration

**Best for:** Ultra-simple implementation, quick testing

**How it works:** Everything in just two lines - no additional JavaScript needed.

```html
<!-- Add this anywhere in your HTML (preferably before </body>) -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js" onload="new (window.AlecChatBot.default||window.AlecChatBot)({webhookUrl:'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'}).init()"></script>
```

**Steps:**
1. Copy both lines above
2. Paste anywhere in your HTML (recommended: before `</body>`)
3. Done!

---

### Method 3: Advanced Integration

**Best for:** Analytics, event tracking, custom callbacks

**How it works:** Full control with callbacks for user interactions, perfect for Google Analytics, Facebook Pixel, etc.

```html
<!-- Alec ChatBot Widget - Advanced Integration -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
      theme: {
        primaryColor: '#3b82f6',
        position: 'bottom-right',
        title: 'Support Assistant',
        placeholder: 'How can I help you?'
      },
      features: {
        resizable: true,
        typingAnimation: true,
        connectionStatus: true,
        autoOpen: false
      },
      callbacks: {
        onMessage: function(message) {
          console.log('User sent message:', message);
          // Add your analytics code here
          if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_message', {
              'event_category': 'engagement',
              'event_label': 'widget'
            });
          }
        },
        onOpen: function() {
          console.log('Chat opened');
          // Track chat open event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'chat_open', {
              'event_category': 'engagement',
              'event_label': 'widget'
            });
          }
        },
        onClose: function() {
          console.log('Chat closed');
        },
        onError: function(error) {
          console.error('Chatbot error:', error);
        }
      }
    });
    chatbot.init();
  });
</script>
```

**Customize it:**
- Change `primaryColor` to match your brand
- Modify `position` (bottom-right, bottom-left, top-right, top-left)
- Update `title` and `placeholder` text
- Add your own analytics tracking in callbacks

---

### Method 4: Custom Theme

**Best for:** Brand matching, design customization

**How it works:** Customize colors and positioning to match your website's design.

```html
<!-- Alec ChatBot Widget - Custom Theme -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
      theme: {
        primaryColor: '#ff6b6b',      // Your brand color
        position: 'bottom-left',       // bottom-right, bottom-left, top-right, top-left
        title: 'Custom Assistant',     // Chat header title
        placeholder: 'Ask me anything...'  // Input placeholder
      }
    }).init();
  });
</script>
```

**Customization options:**
- `primaryColor`: Any hex color code
- `position`: `bottom-right`, `bottom-left`, `top-right`, `top-left`
- `title`: The text shown in the chat header
- `placeholder`: The text shown in the message input

---

### Method 5: Auto-Open

**Best for:** Landing pages, important announcements, customer support pages

**How it works:** Chat opens automatically when the page loads - great for grabbing attention.

```html
<!-- Alec ChatBot Widget - Auto-Open -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
      features: {
        autoOpen: true
      }
    }).init();
  });
</script>
```

**Note:** The chat will open automatically every time the page loads. Use this sparingly to avoid annoying users!

---

### Method 6: Programmatic Control

**Best for:** Custom triggers, advanced integrations, custom UI

**How it works:** Control the chatbot with JavaScript - open from buttons, links, or any custom trigger.

```html
<!-- Alec ChatBot Widget - Programmatic Control -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
    });
    chatbot.init();
    
    // Store reference for external control
    window.chatbotInstance = chatbot;
  });
</script>

<!-- Example: Custom button to open chat -->
<button onclick="window.chatbotInstance.open()">
  💬 Need Help? Chat with us!
</button>

<!-- Example: Open chat from a link -->
<a href="#" onclick="window.chatbotInstance.open(); return false;">
  Contact Support
</a>
```

**Available methods:**
- `window.chatbotInstance.open()` - Open the chat
- `window.chatbotInstance.close()` - Close the chat
- `window.chatbotInstance.sendMessage('Hello!')` - Send a message programmatically
- `window.chatbotInstance.destroy()` - Remove the chatbot completely
- `window.chatbotInstance.updateConfig({...})` - Update configuration

**Example - Open chat after 5 seconds:**
```javascript
setTimeout(() => {
  window.chatbotInstance.open();
}, 5000);
```

**Example - Open chat when user scrolls 50%:**
```javascript
window.addEventListener('scroll', function() {
  const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (scrollPercent > 50 && !window.chatOpened) {
    window.chatbotInstance.open();
    window.chatOpened = true;
  }
});
```

---

## ⚙️ Configuration Options

### Complete Configuration Object

```javascript
{
  webhookUrl: 'string',  // Required - Your n8n webhook URL
  
  theme: {
    primaryColor: 'string',   // Hex color code (default: '#059669')
    position: 'string',        // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    title: 'string',           // Chat header title (default: 'AI Assistant')
    placeholder: 'string'      // Input placeholder (default: 'Type your message...')
  },
  
  features: {
    resizable: boolean,        // Allow chat resize (default: true)
    typingAnimation: boolean,  // Show typing indicator (default: true)
    connectionStatus: boolean, // Show connection status (default: true)
    autoOpen: boolean         // Auto-open on page load (default: false)
  },
  
  callbacks: {
    onMessage: function(message) {},  // Called when user sends a message
    onOpen: function() {},            // Called when chat is opened
    onClose: function() {},           // Called when chat is closed
    onError: function(error) {}       // Called on errors
  }
}
```

---

## 🌐 Platform-Specific Guides

### WordPress

Add to your theme's `functions.php`:

```php
function alec_chatbot_widget_script() {
    ?>
    <link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
    <script src="https://chat.alecasgari.com/widget.iife.js"></script>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        new (window.AlecChatBot.default || window.AlecChatBot)({
          webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
        }).init();
      });
    </script>
    <?php
}
add_action('wp_footer', 'alec_chatbot_widget_script');
```

### Shopify

Go to **Online Store > Themes > Actions > Edit Code**, then add to `layout/theme.liquid` before `</body>`:

```liquid
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
    }).init();
  });
</script>
```

### React / Next.js

Create a component:

```jsx
import { useEffect } from 'react';

export default function ChatBotWidget() {
  useEffect(() => {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://chat.alecasgari.com/widget.css';
    document.head.appendChild(link);

    // Load script
    const script = document.createElement('script');
    script.src = 'https://chat.alecasgari.com/widget.iife.js';
    script.onload = () => {
      const AlecChatBot = window.AlecChatBot.default || window.AlecChatBot;
      const chatbot = new AlecChatBot({
        webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
      });
      chatbot.init();
      window.chatbotInstance = chatbot;
    };
    document.head.appendChild(script);

    return () => {
      if (window.chatbotInstance) {
        window.chatbotInstance.destroy();
      }
    };
  }, []);

  return null;
}
```

### Vue.js

Add to your main component or layout:

```vue
<script>
export default {
  mounted() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://chat.alecasgari.com/widget.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://chat.alecasgari.com/widget.iife.js';
    script.onload = () => {
      const AlecChatBot = window.AlecChatBot.default || window.AlecChatBot;
      this.chatbot = new AlecChatBot({
        webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
      });
      this.chatbot.init();
    };
    document.head.appendChild(script);
  },
  beforeDestroy() {
    if (this.chatbot) {
      this.chatbot.destroy();
    }
  }
}
</script>
```

---

## 💡 Examples

### Example 1: E-commerce Site with Custom Theme

```html
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
      theme: {
        primaryColor: '#ff6b35',
        title: 'Shopping Assistant',
        placeholder: 'Ask about products, shipping, returns...'
      }
    }).init();
  });
</script>
```

### Example 2: Landing Page with Auto-Open + Analytics

```html
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
      features: {
        autoOpen: true
      },
      callbacks: {
        onMessage: function(message) {
          // Track with Google Analytics
          gtag('event', 'chat_message', {
            'event_category': 'engagement',
            'event_label': 'landing_page'
          });
          
          // Track with Facebook Pixel
          fbq('track', 'Contact');
        }
      }
    }).init();
  });
</script>
```

### Example 3: Support Page with Custom Trigger Button

```html
<!-- Custom button in your page -->
<button id="support-btn" class="btn btn-primary">
  Need Help? Chat with Support
</button>

<!-- Widget code -->
<link rel="stylesheet" href="https://chat.alecasgari.com/widget.css">
<script src="https://chat.alecasgari.com/widget.iife.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const chatbot = new (window.AlecChatBot.default || window.AlecChatBot)({
      webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
    });
    chatbot.init();
    
    // Open chat when custom button is clicked
    document.getElementById('support-btn').addEventListener('click', function() {
      chatbot.open();
    });
  });
</script>
```

---

## 🔧 Troubleshooting

### Widget not appearing?

1. **Check browser console for errors** (F12 or Cmd+Option+I)
2. **Verify the script loads:** Open Network tab and check for `widget.iife.js` and `widget.css`
3. **Check placement:** Make sure the code is inside `<body>`, preferably before `</body>`

### Widget appears but doesn't respond?

1. **Check webhook URL:** Verify your webhook URL is correct
2. **Test webhook directly:** Try sending a POST request to your webhook
3. **Check n8n workflow:** Make sure your n8n workflow is active

### Styling conflicts?

1. **CSS conflicts:** The widget uses scoped styles, but if you have conflicts, increase specificity
2. **Z-index issues:** The widget uses `z-index: 999999`. Adjust if needed

### Widget loads twice?

1. **Check for duplicate code:** Make sure you only include the widget code once
2. **Framework issues:** In React/Vue, ensure proper cleanup in `useEffect`/`beforeDestroy`

---

## 📞 Support

Need help? Contact us:
- 📧 Email: support@alecasgari.com
- 🌐 Website: https://alecasgari.com
- 💬 Live Chat: https://chat.alecasgari.com/test-widget.html

---

## 📝 License

This widget is proprietary software. Unauthorized use, distribution, or modification is prohibited.

© 2025 Alec Asgari. All rights reserved.

