import React, { useEffect } from 'react';

// Alec ChatBot Widget - React Integration
const AlecChatBotWidget = ({ 
  webhookUrl = 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
  theme = {
    primaryColor: '#059669',
    position: 'bottom-right',
    title: 'AI Assistant',
    placeholder: 'Type your message...'
  },
  features = {
    resizable: true,
    typingAnimation: true,
    connectionStatus: true,
    autoOpen: false
  },
  callbacks = {}
}) => {
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
      if (window.AlecChatBot) {
        const AlecChatBotClass = window.AlecChatBot.default || window.AlecChatBot;
        const chatbot = new AlecChatBotClass({
          webhookUrl,
          theme,
          features,
          callbacks
        });
        chatbot.init();
        
        // Store reference for cleanup
        window.chatbotInstance = chatbot;
      }
    };
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (window.chatbotInstance) {
        window.chatbotInstance.destroy();
        window.chatbotInstance = null;
      }
    };
  }, [webhookUrl, theme, features, callbacks]);

  return null; // This component doesn't render anything
};

// Usage example
const App = () => {
  const handleMessage = (message) => {
    console.log('User sent message:', message);
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'chat_message', {
        'event_category': 'engagement',
        'event_label': 'widget'
      });
    }
  };

  const handleOpen = () => {
    console.log('Chat opened');
    if (typeof gtag !== 'undefined') {
      gtag('event', 'chat_open', {
        'event_category': 'engagement',
        'event_label': 'widget'
      });
    }
  };

  return (
    <div>
      <h1>My React App</h1>
      <p>This is a React app with the Alec ChatBot widget integrated.</p>
      
      <AlecChatBotWidget
        theme={{
          primaryColor: '#3b82f6',
          position: 'bottom-right',
          title: 'Support Assistant',
          placeholder: 'How can I help you?'
        }}
        features={{
          resizable: true,
          typingAnimation: true,
          connectionStatus: true,
          autoOpen: false
        }}
        callbacks={{
          onMessage: handleMessage,
          onOpen: handleOpen,
          onClose: () => console.log('Chat closed'),
          onError: (error) => console.error('Chatbot error:', error)
        }}
      />
    </div>
  );
};

export default AlecChatBotWidget;
export { App };
