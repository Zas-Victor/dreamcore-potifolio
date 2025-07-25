import { useState } from "react";
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";
import { useContacts } from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Footer = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    mensagem: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addContact } = useContacts();
  const socialLinks = [
    { icon: Github, href: "https://github.com/dreamcore", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com/company/dreamcore", label: "LinkedIn" },
    { icon: Twitter, href: "https://twitter.com/dreamcore", label: "Twitter" }
  ];

  const footerLinks = [
    {
      title: "Empresa",
      links: [
        { name: "Sobre nós", href: "#about" },
        { name: "Equipe", href: "#team" },
        { name: "Carreira", href: "#recruitment" },
        { name: "Contato", href: "#contact" }
      ]
    },
    {
      title: "Serviços",
      links: [
        { name: "Desenvolvimento", href: "#services" },
        { name: "Game Servers", href: "#services" },
        { name: "Marketing", href: "#services" },
        { name: "Automação", href: "#services" }
      ]
    },
    {
      title: "Projetos",
      links: [
        { name: "GameServer Pro", href: "#projects" },
        { name: "DreamStack", href: "#projects" },
        { name: "MarketBot AI", href: "#projects" },
        { name: "Portfólio", href: "#projects" }
      ]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 hexagon bg-primary flex items-center justify-center">
                <img src={logo} alt="DreamCore" className="w-7 h-7" />
              </div>
              <div>
                <div className="font-orbitron font-bold text-xl gradient-text">DreamCore</div>
                <div className="text-sm text-muted-foreground font-inter">Tecnologia com alma gamer</div>
              </div>
            </div>
            
            <p className="text-muted-foreground font-inter leading-relaxed mb-6">
              Transformamos ideias em realidade digital com tecnologia de ponta e paixão pelos jogos.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail size={16} className="text-primary" />
                <span className="text-muted-foreground font-inter">contato@dreamcore.tech</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone size={16} className="text-primary" />
                <span className="text-muted-foreground font-inter">+55 (11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin size={16} className="text-primary" />
                <span className="text-muted-foreground font-inter">São Paulo, Brasil</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 hexagon bg-secondary hover:bg-primary transition-colors flex items-center justify-center group"
                    aria-label={social.label}
                  >
                    <IconComponent size={18} className="group-hover:text-primary-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="font-orbitron font-bold text-lg mb-6 text-foreground">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => scrollToSection(link.href.replace('#', ''))}
                      className="text-muted-foreground hover:text-primary transition-colors font-inter text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-orbitron font-bold text-2xl lg:text-3xl text-center mb-8 gradient-text">
              Entre em Contato
            </h3>
            <div className="card-gradient p-8 rounded-2xl">
              <form 
                className="grid md:grid-cols-2 gap-6" 
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (!formData.nome || !formData.email || !formData.mensagem) {
                    toast({
                      title: "Campos obrigatórios",
                      description: "Por favor, preencha todos os campos.",
                      variant: "destructive",
                    });
                    return;
                  }

                  setIsSubmitting(true);
                  
                  try {
                    await addContact(formData);
                    toast({
                      title: "Mensagem enviada! 🚀",
                      description: "Obrigado pelo contato! Responderemos em breve.",
                    });
                    setFormData({ nome: "", email: "", mensagem: "" });
                  } catch (error) {
                    toast({
                      title: "Erro ao enviar mensagem",
                      description: "Tente novamente em alguns instantes.",
                      variant: "destructive",
                    });
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <div>
                  <label className="block text-sm font-inter font-medium mb-2 text-foreground">Nome</label>
                  <input 
                    type="text" 
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-inter"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter font-medium mb-2 text-foreground">Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-inter"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-inter font-medium mb-2 text-foreground">Mensagem</label>
                  <textarea 
                    rows={4}
                    value={formData.mensagem}
                    onChange={(e) => setFormData(prev => ({ ...prev, mensagem: e.target.value }))}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-inter resize-none"
                    placeholder="Conte-nos sobre seu projeto..."
                    required
                  ></textarea>
                </div>
                <div className="md:col-span-2 text-center">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="glow-effect bg-primary hover:bg-primary/90 text-primary-foreground font-inter font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-12 mt-12 border-t border-border">
          <p className="text-muted-foreground font-inter">
            © 2025 DreamCore. Todos os direitos reservados. Desenvolvido com 💙 e paixão por tecnologia.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;