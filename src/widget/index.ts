import '../styles/globals.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatBot } from '../components/ChatBot';
import type { ChatBotConfig, ChatBotInstance } from '../types/widget';

class AlecChatBot {
  private config: ChatBotConfig;
  private container: HTMLElement | null = null;
  private root: any = null;
  private instance: ChatBotInstance | null = null;

  constructor(config: ChatBotConfig) {
    this.config = config;
  }

  init(): ChatBotInstance {
    // Create container element
    this.container = document.createElement('div');
    this.container.id = 'alec-chatbot-widget';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999999;
    `;

    // Append to body
    document.body.appendChild(this.container);

    // Create React root
    this.root = createRoot(this.container);

    // Render ChatBot component
    this.root.render(React.createElement(ChatBot, { config: this.config }));

    // Return instance methods
    this.instance = {
      open: this.open.bind(this),
      close: this.close.bind(this),
      sendMessage: this.sendMessage.bind(this),
      destroy: this.destroy.bind(this),
      updateConfig: this.updateConfig.bind(this)
    };

    return this.instance;
  }

  private open(): void {
    // This will be handled by the ChatBot component
    if (this.config.callbacks?.onOpen) {
      this.config.callbacks.onOpen();
    }
  }

  private close(): void {
    // This will be handled by the ChatBot component
    if (this.config.callbacks?.onClose) {
      this.config.callbacks.onClose();
    }
  }

  private sendMessage(message: string): void {
    // This will be handled by the ChatBot component
    if (this.config.callbacks?.onMessage) {
      this.config.callbacks.onMessage(message);
    }
  }

  private destroy(): void {
    if (this.root) {
      this.root.unmount();
    }
    if (this.container) {
      document.body.removeChild(this.container);
    }
    this.container = null;
    this.root = null;
    this.instance = null;
  }

  private updateConfig(newConfig: Partial<ChatBotConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Re-render with new config
    if (this.root && this.container) {
      this.root.render(React.createElement(ChatBot, { config: this.config }));
    }
  }
}

// Global API
declare global {
  interface Window {
    AlecChatBot: typeof AlecChatBot;
  }
}

// Export for global use
window.AlecChatBot = AlecChatBot;

// Default export for module systems
export default AlecChatBot;
export { AlecChatBot, ChatBotConfig, ChatBotInstance };
