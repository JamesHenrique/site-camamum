import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, MapPin, Bed, Bath, Move } from 'lucide-react';
import { Property } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import Button from './Button';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Combine main image, gallery images, and videos into a single media array
  const mediaItems = [
    { type: 'image', url: property.imageUrl },
    ...(property.galleryImages || []).map(url => ({ type: 'image', url })),
    ...(property.videoUrls || []).map(url => ({ type: 'video', url }))
  ];

  const handleNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrev = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const handleContact = () => {
    const message = encodeURIComponent(`Olá, gostei do imóvel "${property.title}" (ID: ${property.id}) e gostaria de mais informações.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
          {/* Media Carousel Section */}
          <div className="lg:w-3/5 bg-black flex items-center justify-center relative min-h-[300px] lg:h-auto">
            {mediaItems.length > 0 && (
              <>
                <div className="w-full h-full flex items-center justify-center p-4">
                  {currentMedia.type === 'video' ? (
                    <video 
                      src={currentMedia.url} 
                      controls 
                      className="max-w-full max-h-[60vh] rounded shadow-lg"
                    />
                  ) : (
                    <img 
                      src={currentMedia.url} 
                      alt={`View ${currentMediaIndex + 1}`} 
                      className="max-w-full max-h-[60vh] object-contain"
                    />
                  )}
                </div>

                {mediaItems.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="absolute left-4 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="absolute right-4 p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                      <ChevronRight size={32} />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {mediaItems.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMediaIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentMediaIndex ? 'bg-brand-orange w-6' : 'bg-white/50 hover:bg-white'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col bg-white overflow-y-auto">
            <div className="mb-2">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white mb-3 ${
                property.type === 'Venda' ? 'bg-brand-black' : 'bg-brand-orange'
              }`}>
                {property.type}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {property.title}
              </h2>
            </div>
            
            <div className="flex items-center text-gray-500 mb-6 text-sm">
              <MapPin size={18} className="mr-2 text-brand-orange" />
              <span>{property.address}</span>
            </div>

            <div className="text-3xl font-bold text-brand-orange mb-8">
              {property.price}
            </div>

            {/* Icons Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-b border-gray-100 py-6 mb-6">
              <div className="flex flex-col items-center text-center">
                <Bed size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Quartos</span>
                <span className="font-bold text-gray-800">{property.bedrooms}</span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-gray-100">
                <Bath size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Banheiros</span>
                <span className="font-bold text-gray-800">{property.bathrooms}</span>
              </div>
              <div className="flex flex-col items-center text-center border-l border-gray-100">
                <Move size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Área</span>
                <span className="font-bold text-gray-800">{property.area} m²</span>
              </div>
            </div>

            <div className="mb-8 flex-grow">
              <h3 className="text-lg font-semibold mb-3">Sobre o imóvel</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {property.description}
              </p>
            </div>

            <Button 
              fullWidth 
              onClick={handleContact}
              className="mt-auto py-4 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform transition-transform active:scale-95"
            >
              <MessageCircle size={20} />
              Fale conosco no WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;
