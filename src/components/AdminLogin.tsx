import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdmin';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAdminAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login realizado com sucesso! 🚀",
        description: "Bem-vindo à área administrativa da DreamCore.",
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos. Tente novamente.",
        variant: "destructive"
      });
    }

    setIsLoading(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 hexagon bg-primary/20 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 hexagon bg-accent/20 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <Card className="w-full max-w-md p-8 card-gradient border-primary/20 shadow-glow animate-scale-in relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary shadow-button mb-6 animate-glow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-orbitron font-bold gradient-text mb-2">
            Admin Portal
          </h1>
          <p className="text-muted-foreground text-sm">
            DreamCore Gaming Collective
          </p>
          <div className="w-16 h-px bg-gradient-primary mx-auto mt-4"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Administrativo</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dreamcore.com"
                className="pl-10"
                required
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:shadow-button font-orbitron font-semibold transition-all duration-300 h-12"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Autenticando...
              </div>
            ) : (
              "Acessar Admin"
            )}
          </Button>
        </form>

        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border/50">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Nota:</strong> Esta é uma autenticação temporária. 
            <br />
            Conecte o Supabase para implementar autenticação segura.
          </p>
          <div className="text-xs text-center mt-2 text-primary space-y-1">
            <p>Email: <code>admin@dreamcore.com</code></p>
            <p>Senha: <code>dreamcore2024</code></p>
          </div>
        </div>
      </Card>
    </div>
  );
};