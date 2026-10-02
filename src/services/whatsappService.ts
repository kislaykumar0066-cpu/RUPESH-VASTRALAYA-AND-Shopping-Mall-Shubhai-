import { WhatsAppMessageLog, WhatsAppCampaign } from '../types';

export interface SendWhatsAppParams {
  toPhone: string;
  customerName: string;
  template: 'ORDER_PLACED' | 'ORDER_CONFIRMED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'REVIEW_REQUEST' | 'OLD_STOCK_OFFER' | 'CUSTOM';
  variables: Record<string, string | number>;
}

export interface WhatsAppServiceConfig {
  apiUrl: string;
  accessToken: string;
  phoneNumberId: string;
  verifyToken: string;
  isMock: boolean;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppServiceConfig = {
  apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  verifyToken: import.meta.env.VITE_WHATSAPP_VERIFY_TOKEN || '',
  isMock: !import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN, // Auto-detect mock mode if no token
};

export class WhatsAppAutomationService {
  private config: WhatsAppServiceConfig;
  private messageLogs: WhatsAppMessageLog[] = [];

  constructor(config: WhatsAppServiceConfig = DEFAULT_WHATSAPP_CONFIG) {
    this.config = config;
    this.initializeMockLogs();
  }

  private initializeMockLogs() {
    this.messageLogs = [
      {
        id: 'wlog-01',
        recipientPhone: '+91 94312 XXXXX',
        recipientName: 'Ramesh Kumar',
        templateName: 'ORDER_PLACED',
        content: 'नमस्ते रमेश जी! रूपेश वस्त्रालय शुभाई चौक से आपका आर्डर #RV-8421 प्राप्त हो गया है। राशि: ₹3,450। हम 24 घंटे में आपके पते पर होम डिलीवरी करेंगे।',
        status: 'DELIVERED',
        direction: 'OUTBOUND',
        isMock: true,
        timestamp: 'Today, 02:15 PM',
      },
      {
        id: 'wlog-02',
        recipientPhone: '+91 98350 XXXXX',
        recipientName: 'Sunita Devi',
        templateName: 'ORDER_CONFIRMED',
        content: 'नमस्ते सुनीता जी! आपका आर्डर #RV-8420 (Bridal Georgette Saree) कन्फर्म हो गया है और डिलीवरी बॉय असाइन कर दिया गया है।',
        status: 'READ',
        direction: 'OUTBOUND',
        isMock: true,
        timestamp: 'Today, 01:50 PM',
      },
      {
        id: 'wlog-03',
        recipientPhone: '+91 91224 XXXXX',
        recipientName: 'Amit Jha',
        templateName: 'ORDER_SHIPPED',
        content: 'नमस्ते अमित जी! आपका आर्डर #RV-8419 शुभाई स्टोर से निकल चुका है। डिलीवरी बॉय: विकास कुमार (राजेन्द्र चौक)। OTP: 4892',
        status: 'DELIVERED',
        direction: 'OUTBOUND',
        isMock: true,
        timestamp: 'Today, 12:45 PM',
      },
      {
        id: 'wlog-04',
        recipientPhone: '+91 99318 XXXXX',
        recipientName: 'Priya Singh',
        templateName: 'REVIEW_REQUEST',
        content: 'नमस्ते प्रिया जी! रूपेश वस्त्रालय से आपकी साड़ी की खरीदारी कैसी रही? कृपया 1 से 5 स्टार रेटिंग दें और अपना अनुभव बताएं।',
        status: 'SENT',
        direction: 'OUTBOUND',
        isMock: true,
        timestamp: 'Today, 11:20 AM',
      },
    ];
  }

  public isMockMode(): boolean {
    return this.config.isMock;
  }

  public getLogs(): WhatsAppMessageLog[] {
    return [...this.messageLogs];
  }

  public renderMessage(template: string, vars: Record<string, string | number>): string {
    switch (template) {
      case 'ORDER_PLACED':
        return `नमस्ते ${vars.customerName || 'ग्राहक'} जी! 🙏\nरूपेश वस्त्रालय एवं शॉपिंग मॉल, शुभाई चौक से आपका आर्डर #${vars.orderId} प्राप्त हो गया है।\nकुल राशि: ₹${vars.totalAmount} (${vars.paymentMethod})\nआइटम: ${vars.itemsSummary}\n⚡ 5km के भीतर 24 घंटे में होम डिलीवरी की जाएगी।\nसहायता के लिए कॉल करें: 6206875074`;

      case 'ORDER_CONFIRMED':
        return `नमस्ते ${vars.customerName} जी! आपका आर्डर #${vars.orderId} कन्फर्म हो गया है। हमारी टीम पैकिंग कर रही है।`;

      case 'ORDER_SHIPPED':
        return `नमस्ते ${vars.customerName} जी! आपका आर्डर #${vars.orderId} स्टोर से डिस्पैच हो गया है।\nडिलीवरी एक्जीक्यूटिव: ${vars.riderName || 'राकेश कुमार'}\nसुरक्षित डिलीवरी हेतु OTP: ${vars.otp || '5821'}`;

      case 'ORDER_DELIVERED':
        return `नमस्ते ${vars.customerName} जी! आशा है आपको रूपेश वस्त्रालय की शॉपिंग पसंद आई होगी। आपका आर्डर #${vars.orderId} डिलीवर हो गया है। धन्यवाद!`;

      case 'REVIEW_REQUEST':
        return `नमस्ते ${vars.customerName} जी! रूपेश वस्त्रालय से आपकी हाल की खरीदारी कैसी रही? कृपया 1 से 5 तक रेटिंग देने के लिए इस लिंक पर टैप करें: https://rupeshvastralaya.in/review/${vars.orderId}`;

      case 'OLD_STOCK_OFFER':
        return `नमस्ते! रूपेश वस्त्रालय शुभाई का स्पेशल क्लीयरेंस ऑफर — फ्लैट 60% छूट सिर्फ आपके लिए! ✨\nप्रिय ग्राहक, शादी व त्योहार के चुनिंदा बनारसी सिल्क, लहंगे और कुर्ते अब स्पेशल सेल में उपलब्ध हैं। हमारे शुभाई चौक स्थित स्टोर पर आएं या 24 घंटे में होम डिलीवरी पाएं।\n👉 कैटलॉग देखने और 3.2km फ्री होम डिलीवरी के लिए 'BUY' रिप्लाई करें।`;

      default:
        return String(vars.customText || 'नमस्ते रूपेश वस्त्रालय से संपर्क करने के लिए धन्यवाद!');
    }
  }

  public async sendMessage(params: SendWhatsAppParams): Promise<{ success: boolean; log: WhatsAppMessageLog; message: string }> {
    const content = this.renderMessage(params.template, params.variables);
    const newLog: WhatsAppMessageLog = {
      id: `wlog-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipientPhone: params.toPhone,
      recipientName: params.customerName,
      templateName: params.template,
      content,
      status: this.config.isMock ? 'DELIVERED' : 'SENT',
      direction: 'OUTBOUND',
      isMock: this.config.isMock,
      timestamp: 'Just now',
    };

    this.messageLogs.unshift(newLog);

    if (this.config.isMock) {
      // Clean mock response clearly logged
      return {
        success: true,
        log: newLog,
        message: 'Mock WhatsApp notification dispatched (MOCK MODE active - no external SMS charges incurred).',
      };
    }

    try {
      // In production mode with real token:
      const response = await fetch(`${this.config.apiUrl}/${this.config.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: params.toPhone.replace(/\D/g, ''),
          type: 'text',
          text: { body: content },
        }),
      });

      if (!response.ok) {
        newLog.status = 'FAILED';
        return { success: false, log: newLog, message: `WhatsApp API error: ${response.statusText}` };
      }

      return { success: true, log: newLog, message: 'Real WhatsApp message successfully sent via Meta Graph API.' };
    } catch (err: any) {
      newLog.status = 'FAILED';
      return { success: false, log: newLog, message: `Network error sending WhatsApp: ${err.message}` };
    }
  }

  public createOldStockCampaign(campaignData: {
    title: string;
    audienceTag: string;
    productCount: number;
    discountPercent: number;
  }): WhatsAppCampaign {
    return {
      id: `camp-${Date.now()}`,
      title: campaignData.title,
      audienceTag: campaignData.audienceTag,
      recipientCount: 480,
      deliveredCount: 472,
      inquiryCount: 64,
      status: 'ACTIVE',
      previewText: `नमस्ते! रूपेश वस्त्रालय शुभाई का स्पेशल क्लीयरेंस ऑफर — फ्लैट ${campaignData.discountPercent}% छूट...`,
      createdAt: 'Just now',
    };
  }
}

export const whatsappService = new WhatsAppAutomationService();
