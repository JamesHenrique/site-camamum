import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, MessageCircle } from 'lucide-react';
import Button from './Button';
import { WHATSAPP_NUMBER } from '../constants';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoWithBackground, setShowLogoWithBackground] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 5;
      
      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (scrolled) {
        // Scrolling down: background first, then logo
        setIsScrolled(true);
        timeoutRef.current = setTimeout(() => setShowLogoWithBackground(true), 50);
      } else {
        // Scrolling up: logo first, then background
        setShowLogoWithBackground(false);
        timeoutRef.current = setTimeout(() => setIsScrolled(false), 50);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
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
          {/* Logo */}
          <div 
            className="cursor-pointer transition-opacity hover:opacity-80" 
            onClick={() => scrollToSection('home')}
          >
            <img 
              src={showLogoWithBackground ? "/img/banner-p-395x71.png" : "/img/banner-black.png"} 
              alt="CAMAMUM - Administração de Bens" 
              className="h-10 sm:h-12 w-auto transition-opacity duration-300"
            />
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
