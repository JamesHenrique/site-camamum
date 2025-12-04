import React from 'react';
import { Instagram, Facebook, Phone, Mail, MapPin, Lock } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

interface FooterProps {
  onAdminClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-brand-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-brand-orange">CAMAMUM</h3>
            <p className="text-gray-400 mb-6 max-w-xs">
              Sua parceira de confiança na administração de bens. Facilitando o caminho até o seu imóvel ideal.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-orange transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-orange transition-colors">
                <Facebook size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-orange">Navegação</h4>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Início</a></li>
              <li><a href="#properties" className="text-gray-400 hover:text-white transition-colors">Imóveis</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-brand-orange">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-brand-orange mr-3 flex-shrink-0" />
                <span className="text-gray-400">Rua Exemplo, 123 - Centro, São Paulo - SP</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-brand-orange mr-3 flex-shrink-0" />
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="text-gray-400 hover:text-white">
                  (11) 99999-9999
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-brand-orange mr-3 flex-shrink-0" />
                <span className="text-gray-400">contato@camamum.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center flex flex-col items-center gap-2">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CAMAMUM – Administração de Bens. Todos os direitos reservados.
          </p>
          {onAdminClick && (
            <button 
                onClick={onAdminClick} 
                className="text-gray-800 hover:text-gray-600 text-xs flex items-center gap-1 transition-colors"
            >
                <Lock size={10} /> Área Administrativa
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
