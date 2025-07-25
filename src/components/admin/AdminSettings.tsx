import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  Database,
  Shield,
  Bell,
  Mail,
  Palette,
  Users,
  Key,
  Globe,
  Download,
  Eye,
  EyeOff,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const AdminSettings = () => {
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settings, setSettings] = useState({
    siteName: 'DreamCore Gaming Collective',
    adminEmail: 'admin@dreamcore.com',
    autoApproval: false,
    emailNotifications: true,
    maintenanceMode: false,
    recruitmentOpen: true,
  });

  const handleSave = () => {
    // TODO: Integrar com Supabase para salvar configurações
    toast({
      title: "Configurações salvas! ✨",
      description: "As alterações foram aplicadas com sucesso.",
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro na confirmação",
        description: "A nova senha e confirmação não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Senha muito fraca",
        description: "A nova senha deve ter pelo menos 8 caracteres.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmittingPassword(true);

    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Integrar com Supabase para alterar senha
    toast({
      title: "Senha alterada com sucesso! 🔐",
      description: "Sua nova senha foi salva e já está ativa.",
    });

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    setIsSubmittingPassword(false);
  };

  const handleExportData = () => {
    // TODO: Implementar exportação de dados
    toast({
      title: "Exportação iniciada",
      description: "Os dados serão baixados em breve.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-orbitron font-bold gradient-text mb-3 text-shadow">
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground text-sm sm:text-lg">
          Gerencie as configurações da plataforma DreamCore
        </p>
        <div className="w-16 h-1 bg-gradient-primary rounded-full mt-4"></div>
      </div>

      {/* General Settings */}
      <Card className="p-4 sm:p-6 card-gradient border-border/50 hover:shadow-glow transition-all duration-300 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-primary/20 flex items-center justify-center">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold font-orbitron">Configurações Gerais</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Configurações básicas da plataforma</p>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName" className="text-sm">Nome do Site</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminEmail" className="text-sm">Email do Administrador</Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                className="text-sm"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Modo de Manutenção</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Ativa o modo de manutenção para toda a plataforma
                </p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Recrutamento Aberto</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Permite o envio de novas candidaturas
                </p>
              </div>
              <Switch
                checked={settings.recruitmentOpen}
                onCheckedChange={(checked) => setSettings({...settings, recruitmentOpen: checked})}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Aprovação Automática</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Aprova candidaturas automaticamente (não recomendado)
                </p>
              </div>
              <Switch
                checked={settings.autoApproval}
                onCheckedChange={(checked) => setSettings({...settings, autoApproval: checked})}
                className="self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Notificações por Email</Label>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receba emails sobre novas candidaturas
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                className="self-start sm:self-auto"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Integration Status */}
      <Card className="p-6 card-gradient border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status das Integrações</h2>
            <p className="text-sm text-muted-foreground">Verifique o status das conexões externas</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Supabase Database</p>
                <p className="text-sm text-muted-foreground">Banco de dados principal</p>
              </div>
            </div>
            <Badge variant="destructive">Desconectado</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Supabase Auth</p>
                <p className="text-sm text-muted-foreground">Sistema de autenticação</p>
              </div>
            </div>
            <Badge variant="destructive">Desconectado</Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Service</p>
                <p className="text-sm text-muted-foreground">Notificações por email</p>
              </div>
            </div>
            <Badge variant="destructive">Desconectado</Badge>
          </div>
        </div>
      </Card>

      {/* Security & Password */}
      <Card className="p-6 card-gradient border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Segurança e Acesso</h2>
            <p className="text-sm text-muted-foreground">Gerencie sua senha e configurações de segurança</p>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="mb-6">
          <h3 className="text-md font-semibold mb-4 flex items-center gap-2">
            <Key className="w-4 h-4 text-primary" />
            Alterar Senha
          </h3>
          
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Senha Atual</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Digite sua senha atual"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Digite uma nova senha"
                  className="pr-10"
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Mínimo de 8 caracteres
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme a nova senha"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmittingPassword}
              className="bg-gradient-primary hover:shadow-button"
            >
              {isSubmittingPassword ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Alterando senha...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Alterar Senha
                </>
              )}
            </Button>
          </form>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-3" disabled>
            <Bell className="w-4 h-4" />
            Configurar Notificações de Segurança (Em breve)
          </Button>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 card-gradient border-border/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <Download className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Gerenciamento de Dados</h2>
            <p className="text-sm text-muted-foreground">Backup e exportação de dados</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button onClick={handleExportData} variant="outline" className="w-full justify-start gap-3">
            <Download className="w-4 h-4" />
            Exportar Dados das Candidaturas
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3">
            <Database className="w-4 h-4" />
            Backup Manual dos Dados
          </Button>

          <Button variant="outline" className="w-full justify-start gap-3" disabled>
            <Globe className="w-4 h-4" />
            Importar Dados (Disponível com Supabase)
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <Button variant="outline" className="order-2 sm:order-1">
          Restaurar Padrões
        </Button>
        <Button onClick={handleSave} className="bg-gradient-primary hover:shadow-button h-10 sm:h-11 px-6 sm:px-8 font-semibold text-sm sm:text-base order-1 sm:order-2">
          Salvar Configurações
        </Button>
      </div>

      {/* Supabase Integration Notice */}
      <Card className="p-6 bg-muted/30 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold text-sm">🚀</span>
          </div>
          <div>
            <h4 className="font-semibold text-primary mb-1">
              Configurações Avançadas com Supabase
            </h4>
            <p className="text-sm text-muted-foreground">
              Conecte o Supabase para desbloquear configurações avançadas como:
              autenticação multi-fator, políticas de segurança, webhooks,
              configurações de email automático e muito mais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};