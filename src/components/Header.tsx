import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: "Projetos", href: "#projects", isExternal: false },
    { name: "Sobre", href: "#about", isExternal: false },
    { name: "Áreas de Atuação", href: "#services", isExternal: false },
    { name: "Recrutamento", href: "/recrutamento", isExternal: true },
    { name: "Contato", href: "#contact", isExternal: false }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 hexagon bg-primary flex items-center justify-center">
              <img src={logo} alt="DreamCore" className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-lg gradient-text">DreamCore</span>
              <span className="text-xs text-muted-foreground font-inter">Tecnologia com alma gamer</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isExternal ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium nav-link"
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href.replace('#', ''))}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium nav-link"
                >
                  {item.name}
                </button>
              )
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-secondary hover:bg-primary transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg border-b border-border">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                item.isExternal ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href.replace('#', ''))}
                    className="block text-left w-full text-foreground hover:text-primary transition-colors duration-300 font-inter font-medium py-2"
                  >
                    {item.name}
                  </button>
                )
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;