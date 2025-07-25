import { Code, Server, Bot, TrendingUp } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Code,
      title: "Desenvolvimento Fullstack",
      description: "Criamos aplicações web completas com tecnologias modernas como React, Node.js, TypeScript e bancos de dados escaláveis.",
      features: [
        "Frontend responsivo e moderno",
        "APIs RESTful e GraphQL",
        "Bancos de dados otimizados",
        "Arquitetura escalável"
      ],
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Server,
      title: "Servidores de Jogo",
      description: "Infraestrutura robusta para jogos online com alta performance, baixa latência e escalabilidade automática.",
      features: [
        "Servidores dedicados",
        "Load balancing inteligente",
        "Monitoramento 24/7",
        "Anti-cheat integrado"
      ],
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      icon: TrendingUp,
      title: "Marketing Digital",
      description: "Estratégias de marketing focadas no público gamer, com campanhas personalizadas e analytics avançados.",
      features: [
        "Social media gaming",
        "Influencer marketing",
        "Analytics em tempo real",
        "ROI otimizado"
      ],
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      icon: Bot,
      title: "Bots & Automação",
      description: "Soluções automatizadas para Discord, Telegram e outras plataformas, com inteligência artificial integrada.",
      features: [
        "Bots Discord personalizados",
        "Automação de tarefas",
        "Integração com APIs",
        "Machine Learning"
      ],
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-5xl mb-4 gradient-text">
            Áreas de Atuação
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Oferecemos soluções completas em tecnologia, desde desenvolvimento até infraestrutura,
            sempre com foco na excelência e inovação.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="card-gradient p-8 rounded-2xl group hover:scale-105 transition-all duration-300 glow-effect"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 hexagon bg-gradient-to-br ${service.gradient} flex items-center justify-center group-hover:animate-glow`}>
                      <IconComponent size={32} className="text-primary" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-orbitron font-bold text-xl lg:text-2xl mb-3 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-inter leading-relaxed mb-6">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex}
                          className="flex items-center text-sm font-inter text-muted-foreground"
                        >
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="card-gradient p-8 lg:p-12 rounded-2xl glow-effect">
            <h3 className="font-orbitron font-bold text-2xl lg:text-3xl mb-4 gradient-text">
              Empresa Indie com Paixão por Tecnologia
            </h3>
            <p className="text-lg text-muted-foreground mb-8 font-inter max-w-2xl mx-auto">
              Somos uma empresa independente que combina criatividade, inovação e tecnologia 
              para criar soluções únicas no mercado gaming e digital.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;