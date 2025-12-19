import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { useProperties } from '../contexts/PropertyContext';
import PropertyModal from './PropertyModal';
import { Property } from '../types';

type FilterType = 'Todos' | 'Venda' | 'Aluguel';

const PropertyGrid: React.FC = () => {
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState<FilterType>('Todos');

  const filteredProperties = filter === 'Todos' 
    ? properties 
    : properties.filter(p => p.type === filter);

  return (
    <section id="properties" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
            Destaques da Semana
          </h2>
          <div className="w-24 h-1 bg-brand-orange mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Selecionamos as melhores oportunidades de compra e aluguel para você. 
            Confira nossa lista exclusiva.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white rounded-lg shadow-md p-1 gap-1">
            {(['Todos', 'Venda', 'Aluguel'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 ${
                  filter === type 
                    ? 'bg-brand-orange text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onDetailsClick={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Sem imóveis disponíveis
            </h3>
            <p className="text-gray-500">
              {filter === 'Todos' 
                ? 'Não há imóveis cadastrados no momento.' 
                : `Não há imóveis para ${filter.toLowerCase()} no momento.`}
            </p>
          </div>
        )}
      </div>

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </section>
  );
};

export default PropertyGrid;
