import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, House } from 'lucide-react';
import Button from './Button';
import { WHATSAPP_NUMBER } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}`, '_blank');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4 bg-gradient-to-b from-black/50 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo - Black House Icon + Orange Text */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
             <div className="relative">
                <House size={32} className="text-black fill-current" strokeWidth={1.5} />
                <div className="absolute top-1 left-1.5 w-2 h-2 bg-white rounded-sm"></div>
             </div>
            <div className="flex flex-col leading-none">
                <span className="text-2xl font-bold tracking-tight text-brand-orange">
                CAMAMUM
                </span>
                <span className={`text-[10px] tracking-widest font-semibold uppercase ${isScrolled ? 'text-gray-500' : 'text-gray-200'}`}>
                    Administração de Bens
                </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Início', 'Imóveis', 'Sobre', 'Contato'].map((item) => {
               const id = item === 'Início' ? 'home' : item === 'Imóveis' ? 'properties' : item === 'Sobre' ? 'about' : 'contact';
               return (
                <button
                  key={item}
                  onClick={() => scrollToSection(id)}
                  className={`text-sm font-medium transition-colors hover:text-brand-orange ${
                    isScrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {item}
                </button>
               );
            })}
          </nav>

          {/* WhatsApp Button (Desktop) */}
          <div className="hidden md:block">
            <Button 
              variant="primary" 
              onClick={openWhatsApp}
              className="py-2 px-4 text-sm flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Fale no WhatsApp
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${isScrolled ? 'text-gray-800' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg py-4 px-4 flex flex-col space-y-4 animate-fadeIn">
          {['Início', 'Imóveis', 'Sobre', 'Contato'].map((item) => {
            const id = item === 'Início' ? 'home' : item === 'Imóveis' ? 'properties' : item === 'Sobre' ? 'about' : 'contact';
            return (
              <button
                key={item}
                onClick={() => scrollToSection(id)}
                className="text-left text-base font-medium text-gray-900 hover:text-brand-orange py-2"
              >
                {item}
              </button>
            );
          })}
          <Button 
            variant="primary" 
            fullWidth 
            onClick={openWhatsApp}
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} />
            Fale no WhatsApp
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
