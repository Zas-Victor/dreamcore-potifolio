import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRecruitmentSubmission } from "@/hooks/useRecruitmentSubmission";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  // Identificação
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  idade: z.string().min(1, "Idade é obrigatória"),
  localidade: z.string().min(2, "Localidade é obrigatória"),
  discord: z.string().min(3, "Discord é obrigatório"),
  email: z.string().email("Email inválido"),
  
  // Perfil
  areaInteresse: z.array(z.string()).min(1, "Selecione pelo menos uma área"),
  outroInteresse: z.string().optional(),
  experiencia: z.string().min(10, "Descreva sua experiência brevemente"),
  motivacao: z.string().min(10, "Por que você quer entrar na DreamCore?"),
  relacaoGaming: z.string().min(10, "Qual sua relação com tecnologia ou cultura gamer?"),
  
  // Portfólio
  portfolio: z.string().optional(),
  ferramentas: z.string().min(5, "Descreva as ferramentas que você conhece"),
  experienciaColaborativa: z.string().min(1, "Selecione uma opção"),
  experienciaColaborativaTexto: z.string().optional(),
  
  // Disponibilidade
  horasSemanais: z.string().min(1, "Selecione sua disponibilidade"),
  modeloColaboracao: z.string().min(1, "Selecione um modelo de colaboração"),
  aceitaPoliticas: z.boolean().refine(val => val === true, "Você deve aceitar as políticas"),
  
  // Extras
  habilidadePrincipal: z.string().min(10, "Descreva sua maior habilidade"),
  areaAprender: z.string().optional(),
  comentarioFinal: z.string().optional(),
});

const Recrutamento = () => {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const { submitRecruitment } = useRecruitmentSubmission();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      idade: "",
      localidade: "",
      discord: "",
      email: "",
      areaInteresse: [],
      outroInteresse: "",
      experiencia: "",
      motivacao: "",
      relacaoGaming: "",
      portfolio: "",
      ferramentas: "",
      experienciaColaborativa: "",
      experienciaColaborativaTexto: "",
      horasSemanais: "",
      modeloColaboracao: "",
      aceitaPoliticas: false,
      habilidadePrincipal: "",
      areaAprender: "",
      comentarioFinal: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await submitRecruitment(values as any);
      
      toast({
        title: "Candidatura enviada! 🚀",
        description: "Obrigado por se candidatar à DreamCore! Avaliaremos seu perfil e entraremos em contato via Discord ou e-mail. Bem-vindo ao futuro da cultura gamer-tech!",
      });
      
      form.reset();
      setSelectedAreas([]);
    } catch (error) {
      toast({
        title: "Erro ao enviar candidatura",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const areasInteresse = [
    "Programação",
    "Design", 
    "Marketing",
    "Game Design",
    "Roteiro",
    "Administração",
    "Modding",
    "Outro"
  ];

  const handleAreaChange = (area: string, checked: boolean) => {
    const newAreas = checked 
      ? [...selectedAreas, area]
      : selectedAreas.filter(a => a !== area);
    
    setSelectedAreas(newAreas);
    form.setValue("areaInteresse", newAreas);
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background/95 to-card/30 pt-20 pb-24">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5"></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 animate-fade-in group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Voltar ao início
            </Link>
          </div>

          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            <div className="relative mb-8">
              <h1 className="text-5xl lg:text-7xl font-orbitron font-bold mb-6 relative z-10">
                Junte-se à <span className="gradient-text glow-effect">DreamCore</span>
              </h1>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>
            
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 font-inter leading-relaxed max-w-3xl mx-auto">
              Um coletivo gamer-tech inovador, onde criatividade, liberdade e colaboração moldam o futuro. 
              <br />
              <span className="text-primary font-medium">Seja parte de algo que vai além do comum.</span>
            </p>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="card-gradient p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">+50</div>
                <div className="text-muted-foreground">Projetos Realizados</div>
              </div>
              <div className="card-gradient p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-muted-foreground">Comunidade Ativa</div>
              </div>
              <div className="card-gradient p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform">100%</div>
                <div className="text-muted-foreground">Colaborativo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Form Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/20 mb-6">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="text-primary font-medium">Formulário de Candidatura</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-4">
                Transforme sua paixão em realidade
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Preencha o formulário abaixo e dê o primeiro passo para fazer parte da nossa comunidade inovadora.
              </p>
            </div>

            <Card className="p-10 lg:p-12 card-gradient border-primary/20 animate-scale-in shadow-2xl relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/15 to-primary/15 rounded-full blur-3xl"></div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
                  
                  {/* Seção 1 - Identificação */}
                  <div className="space-y-8 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        1
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text">
                          Identificação
                        </h2>
                        <p className="text-muted-foreground">Conte-nos quem você é</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="nomeCompleto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} className="hover-scale" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="idade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Sua idade" {...field} className="hover-scale" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="localidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cidade / Estado / País</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: São Paulo, SP, Brasil" {...field} className="hover-scale" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="discord"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discord</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome#1234" {...field} className="hover-scale" />
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
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} className="hover-scale" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Seção 2 - Perfil */}
                  <div className="space-y-8 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        2
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text">
                          Perfil
                        </h2>
                        <p className="text-muted-foreground">Mostre suas habilidades e paixões</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="areaInteresse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qual sua área principal de interesse? (múltipla escolha)</FormLabel>
                          <FormControl>
                            <div className="grid md:grid-cols-2 gap-3">
                              {areasInteresse.map((area) => (
                                <label key={area} className="flex items-center space-x-3 cursor-pointer hover-scale">
                                  <input
                                    type="checkbox"
                                    checked={selectedAreas.includes(area)}
                                    onChange={(e) => handleAreaChange(area, e.target.checked)}
                                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                                  />
                                  <span className="text-sm font-inter">{area}</span>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {selectedAreas.includes("Outro") && (
                      <FormField
                        control={form.control}
                        name="outroInteresse"
                        render={({ field }) => (
                          <FormItem className="animate-fade-in">
                            <FormLabel>Especifique sua área de interesse</FormLabel>
                            <FormControl>
                              <Input placeholder="Descreva sua área de interesse" {...field} className="hover-scale" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="experiencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descreva brevemente sua experiência nessa área</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte sobre sua experiência, projetos que já trabalhou, tempo de atuação..."
                              rows={4}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motivacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Por que você quer entrar na DreamCore?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="O que te motiva a fazer parte do nosso coletivo? Quais são suas expectativas?"
                              rows={4}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="relacaoGaming"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qual sua relação com tecnologia ou cultura gamer?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte sobre sua paixão por games, tecnologia, experiências relevantes..."
                              rows={4}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Seção 3 - Portfólio e Experiência */}
                  <div className="space-y-8 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        3
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text">
                          Portfólio e Experiência
                        </h2>
                        <p className="text-muted-foreground">Compartilhe seus trabalhos e conhecimentos</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfólio, GitHub ou links de projetos</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Cole aqui seus links de portfólio, GitHub, projetos, etc. (um por linha)"
                              rows={3}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ferramentas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Com quais ferramentas, linguagens ou plataformas você já trabalhou?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Ex: JavaScript, React, Unity, Photoshop, Blender, etc."
                              rows={3}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="experienciaColaborativa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Já participou de equipes ou comunidades colaborativas?</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover-scale"
                              {...field}
                            >
                              <option value="">Selecione uma opção</option>
                              <option value="sim">Sim</option>
                              <option value="nao">Não</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("experienciaColaborativa") === "sim" && (
                      <FormField
                        control={form.control}
                        name="experienciaColaborativaTexto"
                        render={({ field }) => (
                          <FormItem className="animate-fade-in">
                            <FormLabel>Conte sobre sua experiência colaborativa</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Descreva as equipes/comunidades que participou e sua experiência..."
                                rows={3}
                                {...field} 
                                className="hover-scale"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Seção 4 - Disponibilidade e Participação */}
                  <div className="space-y-8 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        4
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text">
                          Disponibilidade e Participação
                        </h2>
                        <p className="text-muted-foreground">Defina seu envolvimento com o coletivo</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="horasSemanais"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantas horas por semana você pode colaborar?</FormLabel>
                          <FormControl>
                            <select 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover-scale"
                              {...field}
                            >
                              <option value="">Selecione sua disponibilidade</option>
                              <option value="menos-5h">Menos de 5h</option>
                              <option value="5h-10h">5h a 10h</option>
                              <option value="10h-20h">10h a 20h</option>
                              <option value="mais-20h">Mais de 20h</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="modeloColaboracao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qual modelo de colaboração você prefere?</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              {[
                                {
                                  value: "voluntario",
                                  title: "Voluntário",
                                  description: "Ajuda nos projetos por afinidade, aprendizado e participação, sem fins financeiros."
                                },
                                {
                                  value: "ajuda-custo",
                                  title: "Ajuda de custo fixa",
                                  description: "Recebe um valor simbólico mensal (se disponível no projeto)."
                                },
                                {
                                  value: "participacao-lucros",
                                  title: "Participação nos lucros",
                                  description: "Colabora ativamente no desenvolvimento e recebe uma porcentagem do lucro líquido quando o projeto gerar receita."
                                }
                              ].map((opcao) => (
                                <label key={opcao.value} className="flex items-start space-x-3 cursor-pointer p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover-scale">
                                  <input
                                    type="radio"
                                    value={opcao.value}
                                    checked={field.value === opcao.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    className="w-4 h-4 text-primary bg-background border-border mt-1 focus:ring-primary focus:ring-2"
                                  />
                                  <div>
                                    <div className="font-semibold text-foreground">{opcao.title}</div>
                                    <div className="text-sm text-muted-foreground mt-1">{opcao.description}</div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="aceitaPoliticas"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <label className="flex items-start space-x-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={field.onChange}
                                className="w-4 h-4 text-primary bg-background border-border rounded mt-1 focus:ring-primary focus:ring-2"
                              />
                              <span className="text-sm font-inter">
                                Está disposto a seguir as políticas internas da DreamCore (ética, conduta e estrutura colaborativa)?
                              </span>
                            </label>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Seção 5 - Extras */}
                  <div className="space-y-8 relative">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                        5
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-orbitron font-bold gradient-text">
                          Extras
                        </h2>
                        <p className="text-muted-foreground">Compartilhe mais sobre você</p>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="habilidadePrincipal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qual sua maior habilidade que você pode trazer para a DreamCore?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Descreva sua principal habilidade e como ela pode contribuir para nossos projetos..."
                              rows={4}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="areaAprender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Há alguma área nova que gostaria de aprender ou se desenvolver aqui dentro?</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Conte sobre áreas que gostaria de explorar ou habilidades que deseja desenvolver..."
                              rows={3}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="comentarioFinal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comentário ou observação final (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Alguma observação adicional que gostaria de compartilhar..."
                              rows={3}
                              {...field} 
                              className="hover-scale"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Finalização */}
                  <div className="pt-12 mt-12 border-t border-primary/20 relative">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-orbitron font-bold gradient-text mb-3">
                        Pronto para decolar? 🚀
                      </h3>
                      <p className="text-muted-foreground">
                        Sua jornada na DreamCore está prestes a começar!
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                      <Button 
                        type="submit" 
                        className="relative w-full bg-primary hover:bg-primary/90 text-primary-foreground font-orbitron font-semibold text-lg py-8 rounded-2xl transition-all duration-300 hover:scale-105"
                        size="lg"
                      >
                        <Rocket className="mr-3 h-6 w-6" />
                        Enviar candidatura e juntar-se à DreamCore
                      </Button>
                    </div>

                    <div className="text-center mt-6 text-sm text-muted-foreground">
                      <p>✨ Analisaremos sua candidatura com carinho e retornaremos em breve!</p>
                    </div>
                  </div>
                </form>
              </Form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recrutamento;