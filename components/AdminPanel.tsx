import React, { useState } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types';
import Button from './Button';
import { Trash2, Plus, ArrowLeft, Image as ImageIcon, LogOut, Loader2 } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { properties, addProperty, deleteProperty, loading: propertiesLoading } = useProperties();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Property>>({
    type: 'Venda',
    galleryImages: [],
    videoUrls: []
  });
  const [galleryInput, setGalleryInput] = useState('');
  const [videoInput, setVideoInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const newProperty: Omit<Property, 'id'> = {
        title: formData.title || 'Sem título',
        type: formData.type as 'Venda' | 'Aluguel',
        price: formData.price || 'R$ 0,00',
        address: formData.address || '',
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        description: formData.description || '',
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/800x600',
        galleryImages: galleryInput.split('\n').filter(url => url.trim().length > 0),
        videoUrls: videoInput.split('\n').filter(url => url.trim().length > 0)
      };

      await addProperty(newProperty);
      alert('Imóvel cadastrado com sucesso!');
      
      // Reset form
      setFormData({ type: 'Venda', galleryImages: [], videoUrls: [] });
      setGalleryInput('');
      setVideoInput('');
      setActiveTab('list');
    } catch (error) {
      alert('Erro ao cadastrar imóvel. Verifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await deleteProperty(id);
      } catch (error) {
        alert('Erro ao excluir imóvel.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={onBack}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600"
              title="Voltar ao site"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-brand-black">Painel Administrativo</h1>
              <p className="text-sm text-gray-500">Logado como: {user?.email}</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto justify-end">
             <Button 
               variant="outline" 
               onClick={handleSignOut}
               className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
             >
               <LogOut size={18} /> Sair
             </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
            <Button 
              variant={activeTab === 'list' ? 'primary' : 'secondary'} 
              onClick={() => setActiveTab('list')}
            >
              Lista de Imóveis
            </Button>
            <Button 
              variant={activeTab === 'add' ? 'primary' : 'secondary'} 
              onClick={() => setActiveTab('add')}
              className="flex items-center gap-2"
            >
              <Plus size={18} /> Novo Imóvel
            </Button>
        </div>

        {activeTab === 'list' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              {propertiesLoading ? (
                 <div className="p-8 text-center text-gray-500 flex justify-center items-center gap-2">
                   <Loader2 className="animate-spin" /> Carregando imóveis...
                 </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold text-gray-600">Imagem</th>
                      <th className="p-4 font-semibold text-gray-600">Título</th>
                      <th className="p-4 font-semibold text-gray-600">Tipo</th>
                      <th className="p-4 font-semibold text-gray-600">Preço</th>
                      <th className="p-4 font-semibold text-gray-600">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map(property => (
                      <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4">
                          <img src={property.imageUrl} alt={property.title} className="w-16 h-12 object-cover rounded" />
                        </td>
                        <td className="p-4 font-medium text-gray-900">{property.title}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${property.type === 'Venda' ? 'bg-black text-white' : 'bg-brand-orange text-white'}`}>
                            {property.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{property.price}</td>
                        <td className="p-4">
                          <button 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                            title="Excluir"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {properties.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          Nenhum imóvel cadastrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 animate-fadeIn">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b">Cadastrar Novo Imóvel</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título do Imóvel</label>
                <input 
                  type="text" name="title" required 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.title || ''}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select 
                  name="type" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.type}
                >
                  <option value="Venda">Venda</option>
                  <option value="Aluguel">Aluguel</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço (ex: R$ 500.000,00)</label>
                <input 
                  type="text" name="price" required 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.price || ''}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input 
                  type="text" name="address" required 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.address || ''}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 col-span-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quartos</label>
                  <input type="number" name="bedrooms" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} value={formData.bedrooms || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banheiros</label>
                  <input type="number" name="bathrooms" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} value={formData.bathrooms || ''} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Área (m²)</label>
                  <input type="number" name="area" className="w-full p-2 border border-gray-300 rounded" onChange={handleInputChange} value={formData.area || ''} />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea 
                  name="description" rows={4} required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.description || ''}
                ></textarea>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem Principal</label>
                <div className="flex gap-2">
                  <div className="p-2 bg-gray-100 rounded border border-gray-300 text-gray-500">
                    <ImageIcon size={20} />
                  </div>
                  <input 
                    type="url" name="imageUrl" placeholder="https://..." required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                    onChange={handleInputChange}
                    value={formData.imageUrl || ''}
                  />
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">URLs da Galeria (uma por linha)</label>
                <textarea 
                  rows={4} 
                  placeholder="https://imagem1.jpg&#10;https://imagem2.jpg"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                ></textarea>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">URLs de Vídeos (um por linha)</label>
                <textarea 
                  rows={4} 
                  placeholder="https://video1.mp4&#10;https://video2.mp4"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                ></textarea>
              </div>

              <div className="col-span-2 pt-4 flex justify-end">
                <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                   {isSubmitting ? (
                     <span className="flex items-center gap-2">
                       <Loader2 className="animate-spin" size={18} /> Salvando...
                     </span>
                   ) : 'Cadastrar Imóvel'}
                </Button>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;