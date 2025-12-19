import React from 'react';
import { ShieldCheck, Clock, HeartHandshake } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-6">
              Quem é a <span className="text-brand-orange">CAMAMUM</span>?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed text-justify">
              Somos especialistas na administração de bens imobiliários, conectando pessoas aos seus novos lares com segurança e agilidade. 
              Com anos de experiência no mercado, nossa missão é desburocratizar o processo de compra, venda e aluguel.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed text-justify">
              Nosso compromisso é com a transparência. Entendemos que cada imóvel representa um sonho ou um investimento importante, 
              e tratamos cada negociação com a seriedade que ela merece.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                  <ShieldCheck size={24} />
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-semibold text-gray-900">Segurança Jurídica</h4>
                  <p className="text-gray-500">Contratos claros e assessoria completa.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                  <Clock size={24} />
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-semibold text-gray-900">Agilidade no Atendimento</h4>
                  <p className="text-gray-500">Respostas rápidas e processos otimizados.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                  <HeartHandshake size={24} />
                </div>
                <div className="ml-4 text-left">
                  <h4 className="text-lg font-semibold text-gray-900">Transparência</h4>
                  <p className="text-gray-500">Sem letras miúdas. Você sabe o que está contratando.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-72 h-72 bg-brand-orange/20 rounded-full blur-3xl opacity-50"></div>
            <img 
              src="https://picsum.photos/id/180/800/800" 
              alt="Reunião de negócios" 
              className="relative rounded-2xl shadow-2xl w-full object-cover z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;