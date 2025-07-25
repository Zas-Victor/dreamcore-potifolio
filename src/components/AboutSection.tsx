import { Shield, Users, Rocket, Gamepad2 } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Gamepad2,
      title: "Alma Gamer",
      description: "Desenvolvemos com paixão pelos jogos e compreensão da cultura gamer."
    },
    {
      icon: Users,
      title: "Trabalho em Equipe",
      description: "Colaboração efetiva e sinergia entre todos os membros da equipe."
    },
    {
      icon: Rocket,
      title: "Inovação Constante",
      description: "Sempre buscando as tecnologias mais avançadas do mercado."
    },
    {
      icon: Shield,
      title: "Qualidade Premium",
      description: "Comprometimento com excelência em cada projeto entregue."
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-5xl mb-4 gradient-text">
            Sobre a DreamCore
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-inter">
            Somos uma empresa de tecnologia que nasceu da paixão pelos jogos e evolui
            através da inovação constante.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Company Description */}
          <div className="space-y-6">
            <h3 className="font-orbitron font-bold text-2xl lg:text-3xl mb-6 text-foreground">
              Quem Somos
            </h3>
            <div className="space-y-4 text-lg text-muted-foreground font-inter leading-relaxed">
              <p>
                A DreamCore nasceu em 2019 da paixão compartilhada por tecnologia e games.
                Somos uma empresa que entende profundamente a cultura gamer e traduz essa
                compreensão em soluções tecnológicas inovadoras.
              </p>
              <p>
                Nossa equipe é formada por desenvolvedores, designers e estrategistas que
                vivem e respiram a cultura digital. Combinamos expertise técnica com
                criatividade para entregar projetos que superam expectativas.
              </p>
              <p>
                Especializamo-nos em desenvolvimento fullstack, infraestrutura de jogos,
                marketing digital e automação inteligente, sempre com foco na experiência
                do usuário e performance otimizada.
              </p>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card-gradient p-6 rounded-xl text-center glow-effect">
              <div className="text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-2">50+</div>
              <div className="text-muted-foreground font-inter">Projetos Feitos</div>
            </div>
            <div className="card-gradient p-6 rounded-xl text-center glow-effect">
              <div className="text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-2">100%</div>
              <div className="text-muted-foreground font-inter">Segurança</div>
            </div>
            <div className="card-gradient p-6 rounded-xl text-center glow-effect">
              <div className="text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-2">5+</div>
              <div className="text-muted-foreground font-inter">Anos de Experiência</div>
            </div>
            <div className="card-gradient p-6 rounded-xl text-center glow-effect">
              <div className="text-3xl lg:text-4xl font-orbitron font-bold gradient-text mb-2">24/7</div>
              <div className="text-muted-foreground font-inter">Suporte Técnico</div>
            </div>
          </div>
        </div>

        {/* Company Values */}
        <div>
          <h3 className="font-orbitron font-bold text-2xl lg:text-3xl text-center mb-12 text-foreground">
            Nossos Valores
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="card-gradient p-6 rounded-xl text-center group hover:scale-105 transition-all duration-300 glow-effect">
                  <div className="w-16 h-16 hexagon bg-primary mx-auto mb-4 flex items-center justify-center group-hover:animate-glow">
                    <IconComponent size={28} className="text-primary-foreground" />
                  </div>
                  <h4 className="font-orbitron font-bold text-lg mb-3 text-foreground">{value.title}</h4>
                  <p className="text-muted-foreground font-inter leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;