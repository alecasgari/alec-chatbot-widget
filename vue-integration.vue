<template>
  <div>
    <!-- Your Vue component content -->
    <h1>My Vue App</h1>
    <p>This is a Vue app with the Alec ChatBot widget integrated.</p>
  </div>
</template>

<script>
export default {
  name: 'AlecChatBotWidget',
  props: {
    webhookUrl: {
      type: String,
      default: 'https://n8n.alecasgari.com/webhook/2531f7c2-f516-435e-9f56-9ed98b3d673a'
    },
    theme: {
      type: Object,
      default: () => ({
        primaryColor: '#059669',
        position: 'bottom-right',
        title: 'AI Assistant',
        placeholder: 'Type your message...'
      })
    },
    features: {
      type: Object,
      default: () => ({
        resizable: true,
        typingAnimation: true,
        connectionStatus: true,
        autoOpen: false
      })
    },
    callbacks: {
      type: Object,
      default: () => ({})
    }
  },
  mounted() {
    this.loadChatbot();
  },
  beforeDestroy() {
    this.destroyChatbot();
  },
  methods: {
    loadChatbot() {
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
          this.chatbotInstance = new AlecChatBotClass({
            webhookUrl: this.webhookUrl,
            theme: this.theme,
            features: this.features,
            callbacks: {
              onMessage: (message) => {
                console.log('User sent message:', message);
                this.$emit('message', message);
                if (this.callbacks.onMessage) {
                  this.callbacks.onMessage(message);
                }
              },
              onOpen: () => {
                console.log('Chat opened');
                this.$emit('open');
                if (this.callbacks.onOpen) {
                  this.callbacks.onOpen();
                }
              },
              onClose: () => {
                console.log('Chat closed');
                this.$emit('close');
                if (this.callbacks.onClose) {
                  this.callbacks.onClose();
                }
              },
              onError: (error) => {
                console.error('Chatbot error:', error);
                this.$emit('error', error);
                if (this.callbacks.onError) {
                  this.callbacks.onError(error);
                }
              }
            }
          });
          this.chatbotInstance.init();
        }
      };
      document.head.appendChild(script);
    },
    destroyChatbot() {
      if (this.chatbotInstance) {
        this.chatbotInstance.destroy();
        this.chatbotInstance = null;
      }
    }
  },
  data() {
    return {
      chatbotInstance: null
    };
  }
};
</script>

<style scoped>
/* Your component styles */
</style>
