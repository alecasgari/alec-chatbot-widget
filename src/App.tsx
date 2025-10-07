import React from 'react';
import { ChatBot } from './components/ChatBot';

function App() {
  // Demo configuration
  const config = {
    webhookUrl: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a',
    theme: {
      primaryColor: '#059669',
      position: 'bottom-right' as const,
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
      onMessage: (message: string) => {
        console.log('Message sent:', message);
      },
      onOpen: () => {
        console.log('Chat opened');
      },
      onClose: () => {
        console.log('Chat closed');
      },
      onError: (error: string) => {
        console.error('Chat error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Alec ChatBot Widget Demo
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Widget Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li>✅ n8n webhook integration</li>
            <li>✅ Resizable chat window</li>
            <li>✅ Typing animations</li>
            <li>✅ Connection status indicator</li>
            <li>✅ Customizable themes</li>
            <li>✅ Multiple positions</li>
            <li>✅ Responsive design</li>
            <li>✅ Callback functions</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Usage</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Simple Integration:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`<script src="https://your-domain.com/widget.js"></script>
<script>
  const chatbot = new AlecChatBot({
    webhookUrl: 'https://n8n.alecasgari.com/webhook/...',
    theme: {
      primaryColor: '#059669',
      position: 'bottom-right'
    }
  });
  chatbot.init();
</script>`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Advanced Configuration:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`const chatbot = new AlecChatBot({
  webhookUrl: 'https://n8n.alecasgari.com/webhook/...',
  theme: {
    primaryColor: '#059669',
    position: 'bottom-right',
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
    onMessage: (message) => console.log('Message:', message),
    onOpen: () => console.log('Chat opened'),
    onClose: () => console.log('Chat closed'),
    onError: (error) => console.error('Error:', error)
  }
});
chatbot.init();`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* ChatBot Widget */}
      <ChatBot config={config} />
    </div>
  );
}

export default App;
