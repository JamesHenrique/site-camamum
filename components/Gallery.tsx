import React from 'react';

const Gallery: React.FC = () => {
  // Using placeholder images for the gallery
  const images = [
    'https://picsum.photos/id/16/600/400',
    'https://picsum.photos/id/15/600/400',
    'https://picsum.photos/id/24/600/400',
    'https://picsum.photos/id/49/600/400',
    'https://picsum.photos/id/57/600/400',
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-3xl font-bold text-brand-black mb-2">Ambientes Inspiradores</h2>
        <p className="text-gray-500">Explore o padrão de qualidade dos nossos imóveis.</p>
      </div>
      
      {/* Infinite Scroll Effect Container */}
      <div className="relative w-full">
        <div className="flex space-x-4 animate-[scroll_30s_linear_infinite] w-max hover:[animation-play-state:paused]">
          {/* Double the images to create seamless loop */}
          {[...images, ...images].map((src, index) => (
            <div key={index} className="w-80 h-56 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
              <img 
                src={src} 
                alt={`Galeria ${index}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default Gallery;