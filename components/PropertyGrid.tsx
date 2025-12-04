import React, { useState } from 'react';
import PropertyCard from './PropertyCard';
import { useProperties } from '../contexts/PropertyContext';
import PropertyModal from './PropertyModal';
import { Property } from '../types';

const PropertyGrid: React.FC = () => {
  const { properties } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onDetailsClick={() => setSelectedProperty(property)}
            />
          ))}
        </div>
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
