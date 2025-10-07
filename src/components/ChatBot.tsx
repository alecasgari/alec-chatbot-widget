import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MessageCircle, X, Send, Bot, User, Type } from 'lucide-react';
import { Resizable } from 're-resizable';
import { WebhookService } from '../services/webhookService';
import { ChatBotConfig, Message, WidgetTheme, WidgetFeatures, WidgetCallbacks } from '../types/widget';

interface ChatBotProps {
  config: ChatBotConfig;
}

export function ChatBot({ config }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(config.features?.autoOpen || false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant powered by n8n. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [fontSize, setFontSize] = useState('text-sm');
  const [chatSize, setChatSize] = useState({ width: 384, height: 500 });
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [sessionId] = useState(() => `cw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize webhook service
  const webhookService = new WebhookService(config.webhookUrl);

  // Theme configuration
  const theme: WidgetTheme = {
    primaryColor: config.theme?.primaryColor || '#059669',
    position: config.theme?.position || 'bottom-right',
    title: config.theme?.title || 'AI Assistant',
    placeholder: config.theme?.placeholder || 'Type your message...'
  };

  // Features configuration
  const features: WidgetFeatures = {
    resizable: config.features?.resizable ?? true,
    typingAnimation: config.features?.typingAnimation ?? true,
    connectionStatus: config.features?.connectionStatus ?? true,
    autoOpen: config.features?.autoOpen ?? false
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll when typing animation ends
  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [isTyping]);

  // Force scroll when new message is added
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  // Additional scroll trigger for message changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 200);
    return () => clearTimeout(timer);
  }, [messages]);

  // Check webhook connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        const response = await webhookService.sendMessage('test connection', sessionId);
        setConnectionStatus(response.success ? 'connected' : 'disconnected');
      } catch (error) {
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    // Call onMessage callback
    if (config.callbacks?.onMessage) {
      config.callbacks.onMessage(currentInput);
    }

    try {
      // Send message to webhook
      const response = await webhookService.sendMessage(currentInput, sessionId);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.success 
          ? (response.response || 'I received your message but have no response.')
          : `Sorry, I encountered an error: ${response.error || 'Unknown error'}`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I couldn't process your message. Please try again.`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);

      // Call onError callback
      if (config.callbacks?.onError) {
        config.callbacks.onError('Failed to send message');
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleToggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    if (newIsOpen && config.callbacks?.onOpen) {
      config.callbacks.onOpen();
    } else if (!newIsOpen && config.callbacks?.onClose) {
      config.callbacks.onClose();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const fontSizeOptions = [
    { value: 'text-xs', label: 'Small' },
    { value: 'text-sm', label: 'Medium' },
    { value: 'text-base', label: 'Large' },
    { value: 'text-lg', label: 'Extra Large' }
  ];

  // Position classes
  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4'
  };

  return (
    <div className={`${positionClasses[theme.position]} z-50`}>
      {/* Chat Widget */}
      {isOpen && (
        features.resizable ? (
          <Resizable
            size={{ width: chatSize.width, height: chatSize.height }}
            onResizeStop={(e, direction, ref, d) => {
              setChatSize({
                width: chatSize.width + d.width,
                height: chatSize.height + d.height,
              });
            }}
            minWidth={320}
            minHeight={400}
            maxWidth={600}
            maxHeight={800}
            enable={{
              top: true,
              left: true,
              topLeft: true,
              bottom: false,
              right: false,
              bottomRight: false,
              bottomLeft: false,
              topRight: false
            }}
            className="mb-4"
          >
            <Card className="w-full h-full shadow-lg border-border flex flex-col">
              <CardHeader 
                className="flex flex-row items-center justify-between p-4 rounded-t-lg flex-shrink-0"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-white" style={{ color: theme.primaryColor }}>
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-white">{theme.title}</CardTitle>
                    {features.connectionStatus && (
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${
                          connectionStatus === 'connected' ? 'bg-green-400' : 
                          connectionStatus === 'checking' ? 'bg-yellow-400 animate-pulse' : 
                          'bg-red-400'
                        }`}></div>
                        <span className="text-xs text-white/80">
                          {connectionStatus === 'connected' ? 'Connected' : 
                           connectionStatus === 'checking' ? 'Connecting...' : 
                           'Disconnected'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={fontSize} onValueChange={setFontSize}>
                    <SelectTrigger className="w-20 h-8 bg-white/20 border-white/30 text-white text-xs">
                      <Type className="w-3 h-3" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontSizeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleChat}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            
              <CardContent className="p-0 flex flex-col" style={{ height: `${chatSize.height - 80}px` }}>
                {/* Messages Area */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" style={{ height: `${chatSize.height - 160}px` }}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="bg-muted">
                              <Bot className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'text-white'
                              : 'bg-muted'
                          }`}
                          style={message.sender === 'user' ? { backgroundColor: theme.primaryColor } : {}}
                        >
                          <p className={fontSize}>{message.text}</p>
                          <span className={`${fontSize === 'text-xs' ? 'text-xs' : 'text-xs'} opacity-70 mt-1 block`}>
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        
                        {message.sender === 'user' && (
                          <Avatar className="w-6 h-6 mt-1">
                            <AvatarFallback className="text-white" style={{ backgroundColor: theme.primaryColor }}>
                              <User className="w-3 h-3" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && features.typingAnimation && (
                      <div className="flex gap-2 justify-start">
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarFallback className="bg-muted">
                            <Bot className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-4 border-t border-border flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder={theme.placeholder}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      size="sm"
                      className="text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Resizable>
        ) : (
          <Card className="w-96 h-[500px] shadow-lg border-border flex flex-col mb-4">
            <CardHeader 
              className="flex flex-row items-center justify-between p-4 rounded-t-lg flex-shrink-0"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-white" style={{ color: theme.primaryColor }}>
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <CardTitle className="text-white">{theme.title}</CardTitle>
                  {features.connectionStatus && (
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-green-400' : 
                        connectionStatus === 'checking' ? 'bg-yellow-400 animate-pulse' : 
                        'bg-red-400'
                      }`}></div>
                      <span className="text-xs text-white/80">
                        {connectionStatus === 'connected' ? 'Connected' : 
                         connectionStatus === 'checking' ? 'Connecting...' : 
                         'Disconnected'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleChat}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
          
            <CardContent className="p-0 flex flex-col flex-1">
              {/* Messages Area */}
              <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.sender === 'bot' && (
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarFallback className="bg-muted">
                            <Bot className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'text-white'
                            : 'bg-muted'
                        }`}
                        style={message.sender === 'user' ? { backgroundColor: theme.primaryColor } : {}}
                      >
                        <p className={fontSize}>{message.text}</p>
                        <span className={`${fontSize === 'text-xs' ? 'text-xs' : 'text-xs'} opacity-70 mt-1 block`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {message.sender === 'user' && (
                        <Avatar className="w-6 h-6 mt-1">
                          <AvatarFallback className="text-white" style={{ backgroundColor: theme.primaryColor }}>
                            <User className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && features.typingAnimation && (
                    <div className="flex gap-2 justify-start">
                      <Avatar className="w-6 h-6 mt-1">
                        <AvatarFallback className="bg-muted">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 max-w-[70%]">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              {/* Input Area */}
              <div className="p-4 border-t border-border flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    placeholder={theme.placeholder}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    size="sm"
                    className="text-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
      
      {/* Floating Chat Button */}
      <div className="relative">
        <Button
          onClick={handleToggleChat}
          className="w-16 h-16 rounded-full shadow-lg text-white border-2 border-white"
          size="lg"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
        
        {/* Start Here Badge */}
        {!isOpen && (
          <div className="absolute -top-3 -left-8 transform -translate-x-full">
            <Badge className="text-white border-2 border-white shadow-lg whitespace-nowrap px-3 py-1 rounded-full animate-pulse" style={{ backgroundColor: theme.primaryColor }}>
              Start here 👋
            </Badge>
            <div 
              className="absolute top-1/2 right-0 transform translate-x-full -translate-y-1/2 w-0 h-0 border-l-8 border-t-4 border-t-transparent border-b-4 border-b-transparent"
              style={{ borderLeftColor: theme.primaryColor }}
            ></div>
          </div>
        )}
        
        {/* Online Status Indicator */}
        {!isOpen && (
          <Badge className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white p-0">
            <span className="sr-only">Online</span>
          </Badge>
        )}
      </div>
    </div>
  );
}
