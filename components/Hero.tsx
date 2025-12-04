import React from 'react';
import Button from './Button';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const scrollToProperties = () => {
    const element = document.getElementById('properties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/id/48/1920/1080" 
          alt="Imóveis modernos" 
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
          Encontre o imóvel ideal com a <span className="text-brand-orange">CAMAMUM</span>
        </h1>
        <p className="text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto font-light">
          Imóveis para comprar ou alugar com facilidade, transparência e rapidez.
          Descubra o lugar que combina com o seu estilo de vida.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={scrollToProperties} className="text-lg px-8 py-4 shadow-xl">
            Ver Imóveis
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer" onClick={scrollToProperties}>
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

export default Hero;