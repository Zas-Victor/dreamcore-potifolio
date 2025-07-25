import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useContacts } from '@/hooks/useSupabaseData';
import { Mail, User, MessageSquare } from 'lucide-react';

const contactSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres").max(1000, "Mensagem muito longa")
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactForm = () => {
  const { toast } = useToast();
  const { addContact } = useContacts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nome: "",
      email: "",
      mensagem: ""
    }
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      await addContact({
        nome: data.nome,
        email: data.email,
        mensagem: data.mensagem
      });
      
      toast({
        title: "Mensagem enviada! 📧",
        description: "Obrigado pelo contato! Retornaremos em breve."
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text mb-4">
          Entre em Contato
        </h3>
        <p className="text-muted-foreground text-lg">
          Tem uma ideia? Vamos transformá-la em realidade juntos!
        </p>
      </div>

      <div className="card-gradient p-8 rounded-2xl border border-border/50 hover:shadow-glow transition-all duration-300">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Seu nome" 
                        {...field} 
                        className="hover-scale bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="seu@email.com" 
                        {...field} 
                        className="hover-scale bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="mensagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Mensagem
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Conte-nos sobre seu projeto, ideia ou como podemos ajudar..."
                      rows={5}
                      {...field} 
                      className="hover-scale bg-background/50 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value?.length || 0}/1000 caracteres
                  </p>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-primary hover:shadow-button font-orbitron gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Enviar Mensagem
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-3">
              🔒 Seus dados são protegidos e nunca serão compartilhados
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Resposta em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span>100% Gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};