import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Eye, Clock, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecurity } from '@/components/SecurityProvider';
import { securityMonitor } from '@/utils/security';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SecurityMonitorPage: React.FC = () => {
  const { violations, isSecure, isBot } = useSecurity();
  const [violationHistory, setViolationHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalViolations: 0,
    highSeverity: 0,
    mediumSeverity: 0,
    lowSeverity: 0,
    lastHour: 0,
    last24Hours: 0
  });

  // Atualiza dados de segurança
  const updateSecurityData = () => {
    const history = securityMonitor.getViolations();
    setViolationHistory(history);

    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;

    const highSeverityTypes = ['XSS_ATTEMPT', 'INJECTION_ATTEMPT', 'MALICIOUS_SCRIPT_INJECTION'];
    const mediumSeverityTypes = ['RATE_LIMIT_EXCEEDED', 'BOT_DETECTED', 'UNSAFE_INPUT'];

    setStats({
      totalViolations: history.length,
      highSeverity: history.filter(v => highSeverityTypes.includes(v.type)).length,
      mediumSeverity: history.filter(v => mediumSeverityTypes.includes(v.type)).length,
      lowSeverity: history.filter(v => !highSeverityTypes.includes(v.type) && !mediumSeverityTypes.includes(v.type)).length,
      lastHour: history.filter(v => now - v.timestamp < oneHour).length,
      last24Hours: history.filter(v => now - v.timestamp < oneDay).length,
    });
  };

  useEffect(() => {
    updateSecurityData();
    const interval = setInterval(updateSecurityData, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  const handleClearViolations = () => {
    securityMonitor.clearOldViolations(0);
    updateSecurityData();
  };

  const handleExportLogs = () => {
    const logs = securityMonitor.getViolations();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `security-logs-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-3 text-shadow flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Monitor de Segurança
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
            Monitoramento em tempo real das atividades de segurança
          </p>
          <div className="w-20 h-1 bg-gradient-primary rounded-full mt-4 mx-auto lg:mx-0"></div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Status Geral</p>
              <p className={`text-xl sm:text-2xl font-bold font-orbitron ${isSecure ? 'text-green-400' : 'text-red-400'}`}>
                {isSecure ? 'SEGURO' : 'INSEGURO'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isBot ? 'Bot detectado' : 'Usuário humano'}
              </p>
            </div>
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2 ${isSecure ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              <Shield className={`w-5 h-5 sm:w-7 sm:h-7 ${isSecure ? 'text-green-400' : 'text-red-400'}`} />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total de Violações</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron">{stats.totalViolations}</p>
              <p className="text-xs text-muted-foreground">
                {stats.last24Hours} nas últimas 24h
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <AlertTriangle className="w-5 h-5 sm:w-7 sm:h-7 text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Alta Severidade</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron text-red-400">{stats.highSeverity}</p>
              <p className="text-xs text-muted-foreground">
                Requerem atenção imediata
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Activity className="w-5 h-5 sm:w-7 sm:h-7 text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow group">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Última Hora</p>
              <p className="text-2xl sm:text-3xl font-bold font-orbitron text-yellow-400">{stats.lastHour}</p>
              <p className="text-xs text-muted-foreground">
                Atividade recente
              </p>
            </div>
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ml-2">
              <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-yellow-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Button onClick={updateSecurityData} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Atualizar Dados
        </Button>
        <Button onClick={handleClearViolations} variant="outline" className="gap-2">
          <AlertTriangle className="w-4 h-4" />
          Limpar Violações
        </Button>
        <Button onClick={handleExportLogs} variant="outline" className="gap-2">
          <Eye className="w-4 h-4" />
          Exportar Logs
        </Button>
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="violations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="violations">Violações Detectadas</TabsTrigger>
          <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="violations" className="space-y-4">
          <Card className="card-gradient border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Histórico de Violações
              </CardTitle>
            </CardHeader>
            <CardContent>
              {violationHistory.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {violationHistory.map((violation, index) => {
                    const severity = getViolationSeverity(violation.type);
                    return (
                      <div 
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(severity)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">
                              {violation.type.replace(/_/g, ' ')}
                            </h4>
                            <Badge variant={getSeverityBadge(severity) as any}>
                              {severity === 'high' ? 'Alta' : severity === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {violation.message}
                          </p>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(violation.timestamp)}
                          </div>
                          {violation.details && (
                            <details className="mt-2">
                              <summary className="text-xs cursor-pointer text-primary">
                                Ver detalhes
                              </summary>
                              <pre className="text-xs bg-muted/50 p-2 rounded mt-1 overflow-x-auto">
                                {JSON.stringify(violation.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Shield className="w-16 h-16 text-green-400 mx-auto mb-6 opacity-50" />
                  <h4 className="text-xl font-semibold mb-3 font-orbitron">Sistema Seguro</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Nenhuma violação de segurança foi detectada. O sistema está funcionando normalmente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Distribuição por Severidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Alta Severidade</span>
                    <Badge variant="destructive">{stats.highSeverity}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Média Severidade</span>
                    <Badge variant="secondary">{stats.mediumSeverity}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Baixa Severidade</span>
                    <Badge variant="outline">{stats.lowSeverity}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-gradient border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contexto Seguro</span>
                    <Badge variant={isSecure ? "default" : "destructive"}>
                      {isSecure ? 'Sim' : 'Não'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Detecção de Bot</span>
                    <Badge variant={isBot ? "secondary" : "default"}>
                      {isBot ? 'Detectado' : 'Humano'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monitoramento</span>
                    <Badge variant="default">Ativo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};