import { Property } from './types';

export const WHATSAPP_NUMBER = "5511999999999"; // Replace with actual number

export const PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Apartamento Luxo no Centro',
    type: 'Aluguel',
    price: 'R$ 2.500,00/mês',
    address: 'Av. Paulista, Centro',
    bedrooms: 2,
    bathrooms: 2,
    area: 85,
    description: 'Apartamento reformado, andar alto, vista panorâmica e acabamento de primeira linha.',
    imageUrl: 'https://picsum.photos/id/10/800/600',
    galleryImages: ['https://picsum.photos/id/11/800/600', 'https://picsum.photos/id/12/800/600'],
    videoUrls: []
  },
  {
    id: '2',
    title: 'Casa em Condomínio Fechado',
    type: 'Venda',
    price: 'R$ 850.000,00',
    address: 'Jardins, Zona Sul',
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    description: 'Casa espaçosa com área gourmet, piscina privativa e segurança 24h.',
    imageUrl: 'https://picsum.photos/id/28/800/600',
    galleryImages: ['https://picsum.photos/id/29/800/600', 'https://picsum.photos/id/30/800/600'],
    videoUrls: []
  },
  {
    id: '3',
    title: 'Studio Moderno',
    type: 'Aluguel',
    price: 'R$ 1.800,00/mês',
    address: 'Vila Madalena',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: 'Ideal para solteiros ou casais, próximo ao metrô e com lazer completo.',
    imageUrl: 'https://picsum.photos/id/42/800/600',
    galleryImages: ['https://picsum.photos/id/43/800/600', 'https://picsum.photos/id/44/800/600'],
    videoUrls: []
  },
  {
    id: '4',
    title: 'Cobertura Duplex',
    type: 'Venda',
    price: 'R$ 1.200.000,00',
    address: 'Moema',
    bedrooms: 3,
    bathrooms: 4,
    area: 180,
    description: 'Cobertura exclusiva com churrasqueira e vista livre para o parque.',
    imageUrl: 'https://picsum.photos/id/52/800/600',
    galleryImages: ['https://picsum.photos/id/53/800/600', 'https://picsum.photos/id/54/800/600'],
    videoUrls: []
  },
  {
    id: '5',
    title: 'Sala Comercial',
    type: 'Aluguel',
    price: 'R$ 3.000,00/mês',
    address: 'Berrini, Zona Sul',
    bedrooms: 0,
    bathrooms: 1,
    area: 60,
    description: 'Sala comercial pronta para uso, com ar condicionado central e piso elevado.',
    imageUrl: 'https://picsum.photos/id/60/800/600',
    galleryImages: ['https://picsum.photos/id/61/800/600'],
    videoUrls: []
  },
  {
    id: '6',
    title: 'Sobrado Reformado',
    type: 'Venda',
    price: 'R$ 650.000,00',
    address: 'Ipiranga',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    description: 'Sobrado charmoso com quintal, vaga para 2 carros e ótima localização.',
    imageUrl: 'https://picsum.photos/id/70/800/600',
    galleryImages: ['https://picsum.photos/id/71/800/600'],
    videoUrls: []
  }
];
