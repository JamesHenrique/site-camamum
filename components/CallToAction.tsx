import React from 'react';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';

const CallToAction: React.FC = () => {
  const openWhatsApp = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Olá, visitei o site e gostaria de falar com um atendente.`, '_blank');
  };

  return (
    <section id="contact" className="py-20 bg-brand-orange">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Gostou de algum imóvel?
        </h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          Não perca tempo. Fale agora com nossa equipe especializada e agende uma visita sem compromisso.
        </p>
        <button 
          onClick={openWhatsApp}
          className="bg-white text-brand-orange hover:bg-gray-100 font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105 inline-flex items-center gap-3"
        >
          <MessageCircle size={24} />
          Atendimento via WhatsApp
        </button>
      </div>
    </section>
  );
};

export default CallToAction;