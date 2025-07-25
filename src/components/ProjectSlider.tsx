import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProjects, type Project } from "@/hooks/useAdmin";

// Fallback projects se não houver projetos carregados
const fallbackProjects: Project[] = [
  {
    id: "1",
    name: "GameServer Pro",
    description: "Plataforma avançada de servidores de jogos com alta performance e baixa latência. Suporte para múltiplos jogos e escalabilidade automática.",
    image: "/src/assets/project-1.jpg",
    status: "active" as const,
    link: "https://gameserver.dreamcore.com",
    tags: ["Game Servers", "Cloud Computing", "DevOps"],
    order: 1,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "2",
    name: "DreamStack",
    description: "Framework fullstack moderno para desenvolvimento rápido de aplicações web. Arquitetura escalável com integração nativa de gaming APIs.",
    image: "/src/assets/project-2.jpg",
    status: "development" as const,
    tags: ["Fullstack", "React", "Node.js", "Gaming APIs"],
    order: 2,
    isActive: true,
    createdAt: new Date()
  },
  {
    id: "3",
    name: "MarketBot AI",
    description: "Sistema de automação de marketing inteligente para empresas de gaming. Analytics avançados e integração com redes sociais.",
    image: "/src/assets/project-3.jpg",
    status: "active" as const,
    link: "https://marketbot.dreamcore.com",
    tags: ["AI", "Marketing", "Automation", "Analytics"],
    order: 3,
    isActive: true,
    createdAt: new Date()
  }
];

const ProjectSlider = () => {
  const { getActiveProjects, isLoading } = useProjects();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Pega os projetos ativos ou usa os fallback - sempre garante um array
  const activeProjects = getActiveProjects() || [];
  const displayProjects = Array.isArray(activeProjects) && activeProjects.length > 0 
    ? activeProjects 
    : fallbackProjects;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayProjects.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayProjects.length) % displayProjects.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [displayProjects.length]);

  const handleProjectAccess = (project: Project) => {
    if (project.status === "active" && project.link) {
      window.open(project.link, "_blank");
    }
  };

  // Mostrar loading enquanto carrega
  if (isLoading) {
    return (
      <section className="relative w-full h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Carregando projetos...</span>
        </div>
      </section>
    );
  }

  // Verificação extra para garantir que temos projetos válidos
  if (!Array.isArray(displayProjects) || displayProjects.length === 0) {
    return (
      <section className="relative w-full h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Nenhum projeto disponível</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      {/* Project Banner Slider */}
      <div className="relative w-full">
        <div className="overflow-hidden">
          <div 
            className="flex transition-all duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {displayProjects.map((project) => (
              <div key={project.id} className="w-full flex-shrink-0">
                <div 
                  className="relative h-screen bg-cover bg-center overflow-hidden"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/50" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 flex items-end p-8">
                    <div className="space-y-4 text-white">
                      {/* Status Badge */}
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium ${
                        project.status === "active" 
                          ? "bg-green-500/80 text-white" 
                          : "bg-orange-500/80 text-white"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          project.status === "active" ? "bg-white" : "bg-white"
                        }`} />
                        <span>{project.status === "active" ? "ATIVO" : "EM DESENVOLVIMENTO"}</span>
                      </div>

                      {/* Project Title */}
                      <h3 className="font-orbitron font-bold text-2xl lg:text-4xl text-white">
                        {project.name}
                      </h3>

                      {/* Description */}
                      <p className="text-lg text-white/90 font-inter max-w-2xl">
                        {project.description}
                      </p>

                      {/* Access Button */}
                      <Button 
                        onClick={project.status === "active" && project.link ? () => handleProjectAccess(project) : undefined}
                        disabled={project.status !== "active" || !project.link}
                        className={`font-inter font-semibold mt-4 ${
                          project.status === "active" && project.link
                            ? "bg-primary hover:bg-primary/90 text-white"
                            : "bg-gray-500 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        <ExternalLink className="mr-2" size={16} />
                        {project.status === "active" ? "ACESSAR SISTEMA" : "EM BREVE"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center text-white"
        >
          <ChevronRight size={20} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {displayProjects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? "bg-white w-8" 
                  : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSlider;