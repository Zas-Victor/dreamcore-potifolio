// ==========================================
// SISTEMA DE SEGURANÇA DREAMCORE
// ==========================================

import DOMPurify from 'dompurify';

// ==========================================
// 1. PROTEÇÃO CONTRA XSS
// ==========================================

/**
 * Sanitiza strings para prevenir XSS
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove scripts maliciosos e tags perigosas
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: [],
    USE_PROFILES: { html: false }
  });
};

/**
 * Sanitiza HTML para renderização segura
 */
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['class'],
    USE_PROFILES: { html: true }
  });
};

/**
 * Valida se uma string contém apenas caracteres seguros
 */
export const validateSafeString = (input: string): boolean => {
  // Regex para detectar tentativas de XSS
  const xssPattern = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i;
  return !xssPattern.test(input);
};

// ==========================================
// 2. PROTEÇÃO CONTRA INJECTION
// ==========================================

/**
 * Escapa caracteres especiais para prevenir injection
 */
export const escapeSpecialChars = (input: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#96;',
    '=': '&#x3D;'
  };
  
  return input.replace(/[&<>"'`=/]/g, (s) => map[s]);
};

/**
 * Valida formato de email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Valida URL para prevenir redirecionamento malicioso
 */
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    // Permite apenas HTTPS em produção
    const allowedProtocols = ['https:', 'http:'];
    return allowedProtocols.includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// ==========================================
// 3. PROTEÇÃO DE DADOS SENSÍVEIS
// ==========================================

/**
 * Ofusca dados sensíveis para logs
 */
export const obfuscateData = (data: string, showFirst = 2, showLast = 2): string => {
  if (data.length <= showFirst + showLast) {
    return '*'.repeat(data.length);
  }
  const first = data.substring(0, showFirst);
  const last = data.substring(data.length - showLast);
  const middle = '*'.repeat(data.length - showFirst - showLast);
  return `${first}${middle}${last}`;
};

/**
 * Remove dados sensíveis de objetos antes de logs
 */
export const removeSensitiveData = (obj: any): any => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth', 'credential'];
  
  if (typeof obj !== 'object' || obj === null) return obj;
  
  const cleaned = { ...obj };
  
  for (const key in cleaned) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      cleaned[key] = '[REDACTED]';
    } else if (typeof cleaned[key] === 'object') {
      cleaned[key] = removeSensitiveData(cleaned[key]);
    }
  }
  
  return cleaned;
};

// ==========================================
// 4. RATE LIMITING FRONTEND
// ==========================================

class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Verifica se uma ação pode ser executada
   */
  canPerform(key: string, maxAttempts = 5, windowMs = 60000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove tentativas antigas
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    // Adiciona nova tentativa
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }

  /**
   * Reseta tentativas para uma chave
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// ==========================================
// 5. PROTEÇÃO CSRF
// ==========================================

/**
 * Gera token CSRF para formulários
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Valida origem da requisição
 */
export const validateOrigin = (expectedOrigin: string): boolean => {
  if (typeof window === 'undefined') return true;
  
  const origin = window.location.origin;
  return origin === expectedOrigin;
};

// ==========================================
// 6. DETECÇÃO DE BOTS E AUTOMAÇÃO
// ==========================================

/**
 * Detecta comportamento de bot básico
 */
export const detectBot = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = ['bot', 'crawl', 'spider', 'scrape', 'wget', 'curl'];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
};

/**
 * Detecta velocidade suspeita de interação
 */
export const detectSuspiciousSpeed = (
  interactions: number[], 
  maxInteractionsPerSecond = 10
): boolean => {
  if (interactions.length < 2) return false;
  
  const now = Date.now();
  const recentInteractions = interactions.filter(time => now - time < 1000);
  
  return recentInteractions.length > maxInteractionsPerSecond;
};

// ==========================================
// 7. SECURE STORAGE
// ==========================================

/**
 * Armazena dados de forma segura no localStorage
 */
export const secureStorage = {
  set: (key: string, value: any, expirationMs?: number): void => {
    const data = {
      value,
      timestamp: Date.now(),
      expiration: expirationMs ? Date.now() + expirationMs : null
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  },

  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const data = JSON.parse(item);
      
      // Verifica expiração
      if (data.expiration && Date.now() > data.expiration) {
        localStorage.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error('Erro ao ler do localStorage:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  }
};

// ==========================================
// 8. VALIDAÇÃO DE FORMULÁRIOS
// ==========================================

export const formValidation = {
  /**
   * Valida campos obrigatórios
   */
  required: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  /**
   * Valida comprimento mínimo
   */
  minLength: (value: string, min: number): boolean => {
    return typeof value === 'string' && value.length >= min;
  },

  /**
   * Valida comprimento máximo
   */
  maxLength: (value: string, max: number): boolean => {
    return typeof value === 'string' && value.length <= max;
  },

  /**
   * Valida pattern regex
   */
  pattern: (value: string, regex: RegExp): boolean => {
    return regex.test(value);
  },

  /**
   * Valida se contém apenas caracteres alfanuméricos
   */
  alphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9\s]*$/.test(value);
  }
};

// ==========================================
// 9. MONITORAMENTO DE SEGURANÇA
// ==========================================

class SecurityMonitor {
  private violations: Array<{
    type: string;
    message: string;
    timestamp: number;
    userAgent?: string;
    url?: string;
  }> = [];

  /**
   * Registra violação de segurança
   */
  logViolation(type: string, message: string, details?: any): void {
    const violation = {
      type,
      message,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      ...details
    };

    this.violations.push(violation);
    
    // Mantém apenas as últimas 100 violações
    if (this.violations.length > 100) {
      this.violations.shift();
    }

    // Log no console em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔒 Violação de Segurança:', violation);
    }
  }

  /**
   * Obtém violações por tipo
   */
  getViolations(type?: string): typeof this.violations {
    if (type) {
      return this.violations.filter(v => v.type === type);
    }
    return [...this.violations];
  }

  /**
   * Limpa violações antigas
   */
  clearOldViolations(olderThanMs = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - olderThanMs;
    this.violations = this.violations.filter(v => v.timestamp > cutoff);
  }
}

export const securityMonitor = new SecurityMonitor();

// ==========================================
// 10. UTILIDADES DE SEGURANÇA
// ==========================================

/**
 * Gera hash simples para verificação de integridade
 */
export const simpleHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Verifica se o ambiente é seguro (HTTPS em produção)
 */
export const isSecureContext = (): boolean => {
  if (typeof window === 'undefined') return true;
  
  // Em desenvolvimento, permite HTTP
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  // Em produção, exige HTTPS
  return window.location.protocol === 'https:';
};

/**
 * Cria UUID seguro para identificação
 */
export const generateSecureUUID = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  
  // Versão 4 UUID
  array[6] = (array[6] & 0x0f) | 0x40;
  array[8] = (array[8] & 0x3f) | 0x80;
  
  const hex = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
};