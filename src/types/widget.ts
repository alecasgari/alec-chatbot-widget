export interface ChatBotConfig {
  webhookUrl: string;
  theme?: {
    primaryColor?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    title?: string;
    placeholder?: string;
  };
  features?: {
    resizable?: boolean;
    typingAnimation?: boolean;
    connectionStatus?: boolean;
    autoOpen?: boolean;
  };
  callbacks?: {
    onMessage?: (message: string) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: string) => void;
  };
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface WidgetTheme {
  primaryColor: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  title: string;
  placeholder: string;
}

export interface WidgetFeatures {
  resizable: boolean;
  typingAnimation: boolean;
  connectionStatus: boolean;
  autoOpen: boolean;
}

export interface WidgetCallbacks {
  onMessage?: (message: string) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: string) => void;
}

export interface ChatBotInstance {
  open: () => void;
  close: () => void;
  sendMessage: (message: string) => void;
  destroy: () => void;
  updateConfig: (config: Partial<ChatBotConfig>) => void;
}
