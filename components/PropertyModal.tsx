import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, MapPin, Bed, Bath, Move, Maximize2 } from 'lucide-react';
import { Property } from '../types';
import { WHATSAPP_NUMBER } from '../constants';
import Button from './Button';
import { formatPrice } from '../lib/formatters';

interface PropertyModalProps {
  property: Property;
  onClose: () => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

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
    const message = encodeURIComponent(`Olá, gostei do imóvel "${property.title}" e gostaria de mais informações.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <>
      {/* Fullscreen Image Zoom (Mobile) */}
      {isImageZoomed && currentMedia.type === 'image' && (
        <div className="fixed inset-0 z-[60] bg-black flex items-center justify-center">
          <button 
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          
          <div className="w-full h-full overflow-auto p-4">
            <img 
              src={currentMedia.url} 
              alt={`View ${currentMediaIndex + 1}`} 
              className="w-full h-auto object-contain"
              style={{ 
                minHeight: '100%',
                touchAction: 'pan-x pan-y pinch-zoom'
              }}
            />
          </div>

          {mediaItems.length > 1 && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute left-2 p-1.5 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-2 p-1.5 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                {mediaItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentMediaIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === currentMediaIndex ? 'bg-brand-orange w-4' : 'bg-white/50 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Modal */}
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
          <div className="lg:w-3/5 bg-black flex items-center justify-center relative h-[40vh] lg:min-h-0 lg:max-h-none lg:h-auto flex-shrink-0">
            {mediaItems.length > 0 && (
              <>
                <div className="w-full h-full flex items-center justify-center p-2 sm:p-4 relative">
                  {currentMedia.type === 'video' ? (
                    <video 
                      src={currentMedia.url} 
                      controls 
                      className="w-full h-full max-w-full max-h-full object-contain rounded shadow-lg"
                    />
                  ) : (
                    <>
                      <img 
                        src={currentMedia.url} 
                        alt={`View ${currentMediaIndex + 1}`} 
                        className="w-full h-full max-w-full max-h-full object-contain cursor-pointer lg:cursor-default"
                        onClick={() => window.innerWidth < 1024 && setIsImageZoomed(true)}
                      />
                      {/* Zoom Icon - Mobile Only */}
                      <button
                        onClick={() => setIsImageZoomed(true)}
                        className="lg:hidden absolute bottom-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                      >
                        <Maximize2 size={18} />
                      </button>
                    </>
                  )}
                </div>

                {mediaItems.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrev}
                      className="absolute left-2 sm:left-4 p-1.5 sm:p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    <button 
                      onClick={handleNext}
                      className="absolute right-2 sm:right-4 p-1.5 sm:p-2 bg-white/10 hover:bg-white/30 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                    </button>
                    
                    {/* Dots Indicator */}
                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                      {mediaItems.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMediaIndex(idx)}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                            idx === currentMediaIndex ? 'bg-brand-orange w-4 sm:w-6' : 'bg-white/50 hover:bg-white'
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
              {formatPrice(property.price)}
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
    </>
  );
};

export default PropertyModal;
