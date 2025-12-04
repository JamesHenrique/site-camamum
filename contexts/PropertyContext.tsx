import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Property } from '../types';
import { supabase } from '../lib/supabaseClient';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, 'id'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        return;
      }

      if (data) {
        // Map database snake_case columns to application camelCase types
        const mappedProperties: Property[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          type: item.type,
          price: item.price,
          address: item.address,
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          area: item.area,
          description: item.description,
          imageUrl: item.image_url, // map snake_case to camelCase
          galleryImages: item.gallery_images || [],
          videoUrls: item.video_urls || []
        }));
        setProperties(mappedProperties);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (property: Omit<Property, 'id'>) => {
    try {
      // Convert camelCase to snake_case for DB insertion
      const dbProperty = {
        title: property.title,
        type: property.type,
        price: property.price,
        address: property.address,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        description: property.description,
        image_url: property.imageUrl,
        gallery_images: property.galleryImages,
        video_urls: property.videoUrls
      };

      const { error } = await supabase
        .from('properties')
        .insert([dbProperty]);

      if (error) throw error;
      
      await fetchProperties();
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update or refetch
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  return (
    <PropertyContext.Provider value={{ properties, loading, addProperty, deleteProperty, refreshProperties: fetchProperties }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};