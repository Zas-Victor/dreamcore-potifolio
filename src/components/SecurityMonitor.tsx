import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecurity } from './SecurityProvider';
import { securityMonitor } from '@/utils/security';

// ==========================================
// MONITOR DE SEGURANÇA EM TEMPO REAL
// ==========================================

export const SecurityMonitor: React.FC = () => {
  const { violations, isSecure, isBot } = useSecurity();
  const [violationHistory, setViolationHistory] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Atualiza histórico de violações
  useEffect(() => {
    const updateHistory = () => {
      const history = securityMonitor.getViolations();
      setViolationHistory(history.slice(-10)); // Últimas 10 violações
    };

    updateHistory();
    const interval = setInterval(updateHistory, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Só mostra em desenvolvimento ou para admins
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    const isAdmin = localStorage.getItem('dreamcore_admin_session');
    setIsVisible(isDev || !!isAdmin);
  }, []);

  if (!isVisible) return null;

  const getViolationSeverity = (type: string) => {
    const highSeverity = ['XSS_ATTEMPT', 'INJECTION_ATTEMPT', 'MALICIOUS_SCRIPT_INJECTION'];
    const mediumSeverity = ['RATE_LIMIT_EXCEEDED', 'BOT_DETECTED', 'UNSAFE_INPUT'];
    
    if (highSeverity.includes(type)) return 'high';
    if (mediumSeverity.includes(type)) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-yellow-500';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-black/90 backdrop-blur-lg border border-white/20 text-white shadow-2xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-green-400" />
            Monitor de Segurança
            {violations > 0 && (
              <Badge variant="destructive" className="text-xs">
                {violations}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Status Geral */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isSecure ? 'bg-green-400' : 'bg-red-400'}`} />
              {isSecure ? 'Seguro' : 'Inseguro'}
            </div>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isBot ? 'bg-orange-400' : 'bg-green-400'}`} />
              {isBot ? 'Bot' : 'Humano'}
            </div>
          </div>

          {/* Violações Recentes */}
          {violationHistory.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <AlertTriangle className="w-3 h-3" />
                Violações Recentes
              </div>
              
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {violationHistory.map((violation, index) => {
                  const severity = getViolationSeverity(violation.type);
                  return (
                    <div 
                      key={index}
                      className="flex items-start gap-2 text-xs p-2 rounded bg-white/5"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 ${getSeverityColor(severity)}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white truncate">
                          {violation.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-gray-400 text-xs truncate">
                          {violation.message}
                        </div>
                        <div className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(violation.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 py-2">
              <Shield className="w-6 h-6 mx-auto mb-1 text-green-400" />
              Nenhuma violação detectada
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => securityMonitor.clearOldViolations(0)}
            >
              Limpar
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => console.log('Violações:', securityMonitor.getViolations())}
            >
              <Eye className="w-3 h-3 mr-1" />
              Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ==========================================
// COMPONENTE DE STATUS DE SEGURANÇA SIMPLES
// ==========================================

export const SecurityStatus: React.FC = () => {
  const { isSecure, violations } = useSecurity();
  
  return (
    <div className="flex items-center gap-2 text-xs">
      <Shield className={`w-4 h-4 ${isSecure ? 'text-green-500' : 'text-red-500'}`} />
      <span className={isSecure ? 'text-green-600' : 'text-red-600'}>
        {isSecure ? 'Conexão Segura' : 'Conexão Insegura'}
      </span>
      {violations > 0 && (
        <Badge variant="destructive" className="text-xs">
          {violations} violações
        </Badge>
      )}
    </div>
  );
};