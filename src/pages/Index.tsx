import Header from "@/components/Header";
import ProjectSlider from "@/components/ProjectSlider";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section id="projects">
          <ProjectSlider />
        </section>
        <section id="about">
          <AboutSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
      </main>
      <section id="contact">
        <Footer />
      </section>
      
    </div>
  );
};

export default Index;
