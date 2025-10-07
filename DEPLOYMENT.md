# Alec ChatBot Widget - Deployment Guide

This guide will help you deploy the Alec ChatBot Widget to your VPS server.

## 📦 Build Files

After running `npm run build:widget`, you'll have:

```
dist/
├── widget.iife.js    # Main widget script (297KB)
└── index.html        # Test page
```

## 🚀 Deployment Options

### Option 1: Simple HTTP Server

1. **Upload files to your server:**
   ```bash
   scp -r dist/* user@your-server:/var/www/chatbot/
   ```

2. **Configure Nginx:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location /chatbot/ {
           alias /var/www/chatbot/;
           add_header Access-Control-Allow-Origin *;
           add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
           add_header Access-Control-Allow-Headers "Content-Type";
           
           # Enable gzip compression
           gzip on;
           gzip_types text/javascript application/javascript;
       }
   }
   ```

3. **Test the widget:**
   ```
   https://your-domain.com/chatbot/index.html
   ```

### Option 2: CDN Integration

1. **Upload to CDN:**
   - Upload `widget.iife.js` to your CDN
   - Example: `https://cdn.your-domain.com/widget.js`

2. **Use in websites:**
   ```html
   <script src="https://cdn.your-domain.com/widget.js"></script>
   <script>
     const chatbot = new AlecChatBot({
       webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
       theme: { primaryColor: '#059669' }
     });
     chatbot.init();
   </script>
   ```

## 🔧 Server Configuration

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/chatbot
server {
    listen 80;
    server_name chatbot.your-domain.com;
    root /var/www/chatbot;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # CORS headers for widget
    location / {
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### Apache Configuration

```apache
# /etc/apache2/sites-available/chatbot.conf
<VirtualHost *:80>
    ServerName chatbot.your-domain.com
    DocumentRoot /var/www/chatbot

    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \
            \.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \
            \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>

    # CORS headers
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type"

    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
</VirtualHost>
```

## 📋 Usage Examples

### Basic Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <!-- Your website content -->
    
    <!-- ChatBot Widget -->
    <script src="https://chatbot.your-domain.com/widget.iife.js"></script>
    <script>
        const chatbot = new AlecChatBot({
            webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
        });
        chatbot.init();
    </script>
</body>
</html>
```

### Advanced Integration

```html
<script src="https://chatbot.your-domain.com/widget.iife.js"></script>
<script>
    const chatbot = new AlecChatBot({
        webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
        theme: {
            primaryColor: '#3b82f6',
            position: 'bottom-left',
            title: 'Support Chat',
            placeholder: 'How can we help you?'
        },
        features: {
            resizable: false,
            typingAnimation: true,
            connectionStatus: true,
            autoOpen: false
        },
        callbacks: {
            onMessage: (message) => {
                // Track analytics
                gtag('event', 'chat_message', {
                    'event_category': 'engagement',
                    'event_label': 'chatbot'
                });
            },
            onOpen: () => {
                console.log('Chat opened');
                // Track chat open
            },
            onClose: () => {
                console.log('Chat closed');
                // Track chat close
            },
            onError: (error) => {
                console.error('Chat error:', error);
                // Handle errors
            }
        }
    });

    // Initialize widget
    const instance = chatbot.init();

    // Optional: Programmatic control
    document.getElementById('open-chat').addEventListener('click', () => {
        instance.open();
    });
</script>
```

## 🔒 Security Considerations

1. **HTTPS Only:** Always serve the widget over HTTPS
2. **CORS Configuration:** Properly configure CORS headers
3. **Content Security Policy:** Add CSP headers if needed
4. **Rate Limiting:** Implement rate limiting for webhook endpoints

## 📊 Monitoring

### Analytics Integration

```javascript
// Google Analytics integration
const chatbot = new AlecChatBot({
    // ... config
    callbacks: {
        onMessage: (message) => {
            gtag('event', 'chat_message', {
                'event_category': 'engagement',
                'event_label': 'chatbot'
            });
        },
        onOpen: () => {
            gtag('event', 'chat_open', {
                'event_category': 'engagement',
                'event_label': 'chatbot'
            });
        }
    }
});
```

### Error Monitoring

```javascript
const chatbot = new AlecChatBot({
    // ... config
    callbacks: {
        onError: (error) => {
            // Send to error tracking service
            Sentry.captureException(new Error('ChatBot Error: ' + error));
        }
    }
});
```

## 🚀 Performance Optimization

1. **CDN:** Use a CDN for faster global delivery
2. **Compression:** Enable gzip/brotli compression
3. **Caching:** Set appropriate cache headers
4. **Minification:** The widget is already minified

## 📝 Testing Checklist

- [ ] Widget loads on HTTPS
- [ ] CORS headers are set correctly
- [ ] Widget communicates with n8n webhook
- [ ] Responsive design works on mobile
- [ ] Theme customization works
- [ ] Callback functions are triggered
- [ ] Error handling works properly
- [ ] Performance is acceptable (< 3s load time)

## 🆘 Troubleshooting

### Common Issues

1. **Widget not loading:**
   - Check CORS headers
   - Verify HTTPS
   - Check browser console for errors

2. **Webhook not responding:**
   - Verify webhook URL
   - Check n8n workflow is active
   - Test webhook directly

3. **Styling issues:**
   - Check CSS conflicts
   - Verify Tailwind CSS is loaded
   - Check z-index conflicts

### Debug Mode

```javascript
const chatbot = new AlecChatBot({
    // ... config
    callbacks: {
        onError: (error) => {
            console.error('ChatBot Debug:', error);
            // Add your debugging logic here
        }
    }
});
```

## 📞 Support

For deployment issues or questions, contact Alec Asgari.
