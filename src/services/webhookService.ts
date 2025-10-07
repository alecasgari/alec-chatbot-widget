export interface WebhookMessage {
  text: string;
  sessionId: string;
  meta?: {
    origin: string;
    ua: string;
    referer: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  response?: string;
  error?: string;
}

class WebhookService {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  async sendMessage(message: string, sessionId: string): Promise<WebhookResponse> {
    try {
      const payload: WebhookMessage = {
        text: message,
        sessionId: sessionId,
        meta: {
          origin: window.location.origin,
          ua: navigator.userAgent,
          referer: document.referrer || window.location.href
        }
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      
      // Try to parse as JSON first
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Webhook response data:', data);
      } catch (e) {
        // If not JSON, treat as plain text
        data = { response: responseText };
        console.log('Webhook response text:', responseText);
      }
      
      // Ensure we always return a string
      let finalResponse = '';
      if (data.reply) {
        finalResponse = typeof data.reply === 'string' ? data.reply : JSON.stringify(data.reply);
      } else if (data.response) {
        finalResponse = typeof data.response === 'string' ? data.response : JSON.stringify(data.response);
      } else if (data.message) {
        finalResponse = typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
      } else if (typeof data === 'string') {
        finalResponse = data;
      } else if (data) {
        finalResponse = JSON.stringify(data);
      } else {
        finalResponse = responseText || 'No response received';
      }

      return {
        success: true,
        response: finalResponse
      };
    } catch (error) {
      console.error('Webhook error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}

// Export for external use
export { WebhookService };
