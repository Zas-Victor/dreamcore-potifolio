import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        toast({
          title: 'Erro ao fazer login',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Login realizado!',
          description: 'Bem-vindo de volta!'
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.fullName);
      
      if (error) {
        toast({
          title: 'Erro ao criar conta',
          description: error.message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Conta criada!',
          description: 'Sua conta foi criada com sucesso. Você já pode fazer login.'
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        title: 'Erro ao criar conta',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 hexagon bg-primary/20 animate-float"></div>
        <div className="absolute top-60 right-20 w-24 h-24 hexagon bg-accent/20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 hexagon bg-primary/15 animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 hexagon bg-accent/15 animate-float" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 animate-fade-in group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="card-gradient border-primary/20 animate-scale-in shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full blur-3xl"></div>
            
            <CardHeader className="text-center relative z-10">
              <CardTitle className="text-2xl font-orbitron gradient-text">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </CardTitle>
              <CardDescription>
                {isLogin 
                  ? 'Entre na sua conta DreamCore' 
                  : 'Junte-se à comunidade DreamCore'
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10">
              {isLogin ? (
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-6">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-primary hover:shadow-button font-orbitron gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4" />
                          Entrar
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-6">
                    <FormField
                      control={signupForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Seu nome completo"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="seu@email.com"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Senha</FormLabel>
                          <FormControl>
                            <Input 
                              type="password"
                              placeholder="••••••••"
                              {...field}
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-gradient-primary hover:shadow-button font-orbitron gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Criar Conta
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {isLogin 
                    ? 'Não tem conta? Criar nova conta' 
                    : 'Já tem conta? Fazer login'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;