export interface Property {
  id: string;
  title: string;
  type: 'Venda' | 'Aluguel';
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // in m²
  description: string;
  imageUrl: string;
  galleryImages: string[];
  videoUrls?: string[];
}

export interface NavItem {
  label: string;
  href: string;
}
