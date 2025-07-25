import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  securityMonitor, 
  isSecureContext, 
  detectBot, 
  validateOrigin,
  generateCSRFToken 
} from '@/utils/security';

// ==========================================
// CONTEXTO DE SEGURANÇA
// ==========================================

interface SecurityContextType {
  csrfToken: string;
  isSecure: boolean;
  isBot: boolean;
  violations: number;
  refreshCSRFToken: () => void;
  reportViolation: (type: string, message: string, details?: any) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// ==========================================
// PROVIDER DE SEGURANÇA
// ==========================================

interface SecurityProviderProps {
  children: ReactNode;
  expectedOrigin?: string;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ 
  children, 
  expectedOrigin = window.location.origin 
}) => {
  const [csrfToken, setCSRFToken] = useState<string>('');
  const [violations, setViolations] = useState(0);
  const [isSecure] = useState(isSecureContext());
  const [isBot] = useState(detectBot());

  // Gera token CSRF inicial
  useEffect(() => {
    const token = generateCSRFToken();
    setCSRFToken(token);
  }, []);

  // Verificações de segurança na inicialização
  useEffect(() => {
    // Verifica contexto seguro
    if (!isSecure) {
      securityMonitor.logViolation(
        'INSECURE_CONTEXT',
        'Aplicação executando em contexto inseguro (HTTP em produção)'
      );
    }

    // Verifica origem
    if (!validateOrigin(expectedOrigin)) {
      securityMonitor.logViolation(
        'INVALID_ORIGIN',
        `Origem inválida detectada. Esperado: ${expectedOrigin}, Atual: ${window.location.origin}`
      );
    }

    // Detecta bot
    if (isBot) {
      securityMonitor.logViolation(
        'BOT_DETECTED',
        'Comportamento de bot detectado no user agent'
      );
    }

    // Configura Content Security Policy via meta tag se não existir
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https:",
        "media-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'"
      ].join('; ');
      document.head.appendChild(cspMeta);
    }

    // Previne clickjacking
    if (window.top !== window.self) {
      securityMonitor.logViolation(
        'CLICKJACKING_ATTEMPT',
        'Aplicação está sendo executada em um iframe'
      );
      
      // Opcional: quebrar frame
      // window.top.location = window.self.location;
    }

    // Monitora tentativas de acesso ao console
    const originalConsole = { ...console };
    let consoleAccessCount = 0;

    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      (console as any)[method] = (...args: any[]) => {
        consoleAccessCount++;
        if (consoleAccessCount > 50) {
          securityMonitor.logViolation(
            'SUSPICIOUS_CONSOLE_ACTIVITY',
            'Uso excessivo do console detectado'
          );
        }
        (originalConsole as any)[method](...args);
      };
    });

    // Monitora mudanças no DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              
              // Detecta scripts maliciosos
              if (element.tagName === 'SCRIPT') {
                const scriptContent = element.textContent || '';
                if (scriptContent.includes('eval(') || scriptContent.includes('Function(')) {
                  securityMonitor.logViolation(
                    'MALICIOUS_SCRIPT_INJECTION',
                    'Script com eval() ou Function() detectado'
                  );
                }
              }

              // Detecta iframes maliciosos
              if (element.tagName === 'IFRAME') {
                const src = element.getAttribute('src');
                if (src && !src.startsWith(window.location.origin)) {
                  securityMonitor.logViolation(
                    'EXTERNAL_IFRAME',
                    `Iframe externo detectado: ${src}`
                  );
                }
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src', 'href', 'onclick']
    });

    return () => {
      observer.disconnect();
    };
  }, [expectedOrigin, isSecure, isBot]);

  // Atualiza contador de violações
  useEffect(() => {
    const updateViolations = () => {
      setViolations(securityMonitor.getViolations().length);
    };

    const interval = setInterval(updateViolations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Regenera token CSRF periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const newToken = generateCSRFToken();
      setCSRFToken(newToken);
    }, 15 * 60 * 1000); // 15 minutos

    return () => clearInterval(interval);
  }, []);

  const refreshCSRFToken = () => {
    const newToken = generateCSRFToken();
    setCSRFToken(newToken);
  };

  const reportViolation = (type: string, message: string, details?: any) => {
    securityMonitor.logViolation(type, message, details);
    setViolations(prev => prev + 1);
  };

  const contextValue: SecurityContextType = {
    csrfToken,
    isSecure,
    isBot,
    violations,
    refreshCSRFToken,
    reportViolation
  };

  return (
    <SecurityContext.Provider value={contextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

// ==========================================
// HOOK PARA USAR CONTEXTO DE SEGURANÇA
// ==========================================

export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity deve ser usado dentro de SecurityProvider');
  }
  return context;
};

// ==========================================
// HOC PARA PROTEGER COMPONENTES
// ==========================================

interface SecureComponentProps {
  requireSecure?: boolean;
  blockBots?: boolean;
  onViolation?: (type: string, message: string) => void;
}

export const withSecurity = <P extends object>(
  Component: React.ComponentType<P>,
  options: SecureComponentProps = {}
) => {
  return (props: P) => {
    const { isSecure, isBot, reportViolation } = useSecurity();
    
    // Verifica se precisa de contexto seguro
    if (options.requireSecure && !isSecure) {
      reportViolation(
        'INSECURE_COMPONENT_ACCESS',
        `Tentativa de acessar componente seguro em contexto inseguro: ${Component.name}`
      );
      
      if (options.onViolation) {
        options.onViolation('INSECURE_CONTEXT', 'Componente requer contexto seguro');
      }
      
      return (
        <div className="p-4 border border-red-500 bg-red-50 rounded">
          <p className="text-red-700 font-medium">⚠️ Acesso Negado</p>
          <p className="text-red-600 text-sm">Este componente requer conexão segura (HTTPS).</p>
        </div>
      );
    }

    // Bloqueia bots se necessário
    if (options.blockBots && isBot) {
      reportViolation(
        'BOT_COMPONENT_ACCESS',
        `Bot tentou acessar componente protegido: ${Component.name}`
      );
      
      if (options.onViolation) {
        options.onViolation('BOT_ACCESS', 'Acesso de bot detectado');
      }
      
      return (
        <div className="p-4 border border-yellow-500 bg-yellow-50 rounded">
          <p className="text-yellow-700 font-medium">🤖 Acesso Restrito</p>
          <p className="text-yellow-600 text-sm">Este componente não está disponível para bots.</p>
        </div>
      );
    }

    return <Component {...props} />;
  };
};