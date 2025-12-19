import React from 'react';
import { Bed, Bath, Move, MapPin, Images, PlayCircle } from 'lucide-react';
import { Property } from '../types';
import Button from './Button';
import { formatPrice } from '../lib/formatters';

interface PropertyCardProps {
  property: Property;
  onDetailsClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDetailsClick }) => {
  return (
    <div className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white ${
            property.type === 'Venda' ? 'bg-brand-black' : 'bg-brand-orange'
          }`}>
            {property.type}
          </span>
        </div>

        {/* Gallery Indicator */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          {property.videoUrls && property.videoUrls.length > 0 && (
             <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
               <PlayCircle size={14} />
               <span>{property.videoUrls.length}</span>
             </div>
          )}
          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Images size={14} />
            <span>+{property.galleryImages.length + 1}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-orange transition-colors">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <MapPin size={16} className="mr-1 text-brand-orange" />
          <span className="truncate">{property.address}</span>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-gray-100 py-4 mb-4">
          <div className="flex flex-col items-center text-center">
            <Bed size={20} className="text-gray-400 mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.bedrooms} Quartos</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-gray-100">
            <Bath size={20} className="text-gray-400 mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.bathrooms} Banheiros</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-gray-100">
            <Move size={20} className="text-gray-400 mb-1" />
            <span className="text-sm font-medium text-gray-700">{property.area} m²</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {property.description}
        </p>

        <div className="mt-auto">
          <div className="text-xl font-bold text-brand-orange mb-4">
            {formatPrice(property.price)}
          </div>
          <Button variant="outline" fullWidth onClick={onDetailsClick}>
            Saiba Mais
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
