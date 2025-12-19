import React, { useState } from 'react';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { Property } from '../types';
import Button from './Button';
import { Trash2, Plus, ArrowLeft, Image as ImageIcon, LogOut, Loader2, Upload, X, Video, Download, FileSpreadsheet, Pencil } from 'lucide-react';
import { uploadFile, uploadMultipleFiles, isValidImage, isValidVideo, formatFileSize } from '../lib/storageHelpers';
import { formatPrice } from '../lib/formatters';
import { importPropertiesFromFile, downloadTemplateFile, validateImportFile, ImportedPropertyData } from '../lib/importHelpers';
import { PLACEHOLDER_IMAGE } from '../constants';
import { logger } from '../lib/logger';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const { properties, addProperty, updateProperty, deleteProperty, loading: propertiesLoading } = useProperties();
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Property>>({
    type: 'Venda',
    galleryImages: [],
    videoUrls: []
  });
  const [galleryInput, setGalleryInput] = useState('');
  const [videoInput, setVideoInput] = useState('');
  
  // Upload States
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  
  // Import States
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<ImportedPropertyData[]>([]);
  const [showImportPreview, setShowImportPreview] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      setMainImageFile(file);
      setMainImagePreview(URL.createObjectURL(file));
    } else {
      alert('Por favor, selecione uma imagem válida (JPG, PNG, WEBP ou GIF)');
    }
  };

  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file): file is File => {
      if (!isValidImage(file)) {
        alert(`${file.name} não é uma imagem válida`);
        return false;
      }
      return true;
    });
    
    setGalleryFiles(prev => [...prev, ...validFiles]);
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleVideoFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file): file is File => {
      if (!isValidVideo(file)) {
        alert(`${file.name} não é um vídeo válido (MP4, WEBM ou OGG)`);
        return false;
      }
      return true;
    });
    
    setVideoFiles(prev => [...prev, ...validFiles]);
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideoFile = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview('');
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImportFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsImporting(true);
    setUploadProgress('Lendo arquivo...');

    try {
      const data = await importPropertiesFromFile(file);
      
      if (data.length === 0) {
        alert('Nenhum imóvel válido encontrado no arquivo.');
        return;
      }

      setImportedData(data);
      setShowImportPreview(true);
      setUploadProgress(`${data.length} imóvel(is) encontrado(s). Revise os dados antes de importar.`);
    } catch (error) {
      alert(`Erro ao importar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      logger.error('Erro na importação:', error);
    } finally {
      setIsImporting(false);
      // Limpa o input para permitir reimportar o mesmo arquivo
      e.target.value = '';
    }
  };

  const handleConfirmImport = async () => {
    if (importedData.length === 0) return;

    setIsImporting(true);
    setUploadProgress('Importando imóveis...');

    let successCount = 0;
    let errorCount = 0;

    for (const item of importedData) {
      try {
        const newProperty: Omit<Property, 'id'> = {
          ...item,
          imageUrl: PLACEHOLDER_IMAGE,
          galleryImages: [],
          videoUrls: []
        };

        await addProperty(newProperty);
        successCount++;
        setUploadProgress(`Importando... ${successCount}/${importedData.length}`);
      } catch (error) {
        errorCount++;
        logger.error('Erro ao importar imóvel:', item.title, error);
      }
    }

    alert(`Importação concluída!\n✅ Sucesso: ${successCount}\n❌ Erros: ${errorCount}`);
    
    setImportedData([]);
    setShowImportPreview(false);
    setUploadProgress('');
    setIsImporting(false);
    setActiveTab('list');
  };

  const handleCancelImport = () => {
    setImportedData([]);
    setShowImportPreview(false);
    setUploadProgress('');
  };

  const handleDownloadTemplate = () => {
    downloadTemplateFile();
  };

  const handleEdit = (property: Property) => {
    setEditingPropertyId(property.id);
    setFormData({
      title: property.title,
      type: property.type,
      price: property.price,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      description: property.description,
      imageUrl: property.imageUrl,
      galleryImages: property.galleryImages,
      videoUrls: property.videoUrls
    });
    
    // Define a imagem principal atual como preview
    setMainImagePreview(property.imageUrl);
    
    // Define URLs da galeria como texto
    setGalleryInput((property.galleryImages || []).join('\n'));
    
    // Define URLs de vídeo como texto
    setVideoInput((property.videoUrls || []).join('\n'));
    
    setActiveTab('add');
  };

  const handleCancelEdit = () => {
    setEditingPropertyId(null);
    setFormData({ type: 'Venda', galleryImages: [], videoUrls: [] });
    setGalleryInput('');
    setVideoInput('');
    setMainImageFile(null);
    setMainImagePreview('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setVideoFiles([]);
    setUploadProgress('');
  };

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUploadProgress('Iniciando...');
    
    try {
      let mainImageUrl = formData.imageUrl || '';
      
      // Upload da imagem principal
      if (mainImageFile) {
        setUploadProgress('Fazendo upload da imagem principal...');
        const uploadedUrl = await uploadFile(mainImageFile, 'images');
        if (uploadedUrl) {
          mainImageUrl = uploadedUrl;
        } else {
          throw new Error('Falha no upload da imagem principal');
        }
      }

      // Upload das imagens da galeria
      setUploadProgress('Fazendo upload das imagens da galeria...');
      const uploadedGalleryUrls = await uploadMultipleFiles(galleryFiles, 'images');
      
      // Combina URLs de upload com URLs manuais (se houver)
      const manualGalleryUrls = galleryInput.split('\n').filter(url => url.trim().length > 0);
      const allGalleryUrls = [...uploadedGalleryUrls, ...manualGalleryUrls];

      // Upload dos vídeos
      setUploadProgress('Fazendo upload dos vídeos...');
      const uploadedVideoUrls = await uploadMultipleFiles(videoFiles, 'videos');
      
      // Combina URLs de vídeo
      const manualVideoUrls = videoInput.split('\n').filter(url => url.trim().length > 0);
      const allVideoUrls = [...uploadedVideoUrls, ...manualVideoUrls];

      if (!mainImageUrl) {
        throw new Error('É necessário fornecer uma imagem principal');
      }

      setUploadProgress('Salvando imóvel...');
      const newProperty: Omit<Property, 'id'> = {
        title: formData.title || 'Sem título',
        type: formData.type as 'Venda' | 'Aluguel',
        price: formData.price || 'R$ 0,00',
        address: formData.address || '',
        bedrooms: Number(formData.bedrooms) || 0,
        bathrooms: Number(formData.bathrooms) || 0,
        area: Number(formData.area) || 0,
        description: formData.description || '',
        imageUrl: mainImageUrl,
        galleryImages: allGalleryUrls,
        videoUrls: allVideoUrls
      };

      logger.log('Dados do imóvel a serem salvos:', newProperty);

      if (editingPropertyId) {
        // Atualizar imóvel existente
        await updateProperty(editingPropertyId, newProperty);
        alert('Imóvel atualizado com sucesso!');
        setEditingPropertyId(null);
      } else {
        // Criar novo imóvel
        await addProperty(newProperty);
        alert('Imóvel cadastrado com sucesso!');
      }
      
      // Reset form
      setFormData({ type: 'Venda', galleryImages: [], videoUrls: [] });
      setGalleryInput('');
      setVideoInput('');
      setMainImageFile(null);
      setMainImagePreview('');
      setGalleryFiles([]);
      setGalleryPreviews([]);
      setVideoFiles([]);
      setUploadProgress('');
      setActiveTab('list');
    } catch (error: any) {
      logger.error('Erro completo:', error);
      
      let errorMessage = 'Erro desconhecido';
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      if (error?.details) {
        errorMessage += `\nDetalhes: ${error.details}`;
      }
      
      if (error?.hint) {
        errorMessage += `\nDica: ${error.hint}`;
      }
      
      alert(`Erro ao cadastrar imóvel:\n${errorMessage}\n\nVerifique o console para mais detalhes.`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
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
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full md:w-auto">
            <button 
              onClick={onBack}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-600 flex-shrink-0"
              title="Voltar ao site"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-black">Painel Administrativo</h1>
              <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">Logado como: {user?.email}</p>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-3 w-full md:w-auto justify-end">
             <Button 
               variant="outline" 
               onClick={handleSignOut}
               className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-900 text-sm px-3 py-2"
             >
               <LogOut size={16} className="sm:w-[18px] sm:h-[18px]" /> 
               <span className="hidden sm:inline">Sair</span>
             </Button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Button 
                variant={activeTab === 'list' ? 'primary' : 'secondary'} 
                onClick={() => setActiveTab('list')}
                className="text-sm sm:text-base px-4 py-2"
              >
                Lista de Imóveis
              </Button>
              <Button 
                variant={activeTab === 'add' ? 'primary' : 'secondary'} 
                onClick={() => setActiveTab('add')}
                className="flex items-center gap-2 text-sm sm:text-base px-4 py-2"
              >
                <Plus size={16} className="sm:w-[18px] sm:h-[18px]" /> Novo Imóvel
              </Button>
            </div>
            
            {/* Botões de Importação */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-2"
                title="Baixar modelo de planilha"
              >
                <Download size={14} className="sm:w-4 sm:h-4" /> 
                <span className="hidden xs:inline">Baixar </span>Modelo
              </Button>
              
              <label className="cursor-pointer">
                <Button 
                  variant="outline"
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm border-green-300 text-green-600 hover:bg-green-50 px-3 py-2"
                  disabled={isImporting}
                  as="span"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="animate-spin w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Processando...</span>
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Importar Planilha</span>
                      <span className="sm:hidden">Importar</span>
                    </>
                  )}
                </Button>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleImportFile}
                  disabled={isImporting}
                />
              </label>
            </div>
        </div>
        
        {/* Preview de Importação */}
        {showImportPreview && importedData.length > 0 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6 animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-1">
                  Preview da Importação
                </h3>
                <p className="text-sm text-blue-700">
                  {importedData.length} imóvel(is) pronto(s) para importar
                </p>
              </div>
              <button
                onClick={handleCancelImport}
                className="text-blue-600 hover:text-blue-800"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-white rounded border border-blue-200 max-h-64 overflow-y-auto mb-4">
              <table className="w-full text-sm">
                <thead className="bg-blue-100 sticky top-0">
                  <tr>
                    <th className="p-2 text-left">Título</th>
                    <th className="p-2 text-left">Tipo</th>
                    <th className="p-2 text-left">Preço</th>
                    <th className="p-2 text-left">Endereço</th>
                  </tr>
                </thead>
                <tbody>
                  {importedData.map((item, idx) => (
                    <tr key={idx} className="border-b border-blue-100">
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.type}</td>
                      <td className="p-2">{formatPrice(item.price)}</td>
                      <td className="p-2 text-xs">{item.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={handleCancelImport}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmImport}
                disabled={isImporting}
                className="flex items-center gap-2"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    Confirmar Importação
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'list' ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fadeIn">
            <div className="overflow-x-auto">
              {propertiesLoading ? (
                 <div className="p-8 text-center text-gray-500 flex justify-center items-center gap-2">
                   <Loader2 className="animate-spin" /> Carregando imóveis...
                 </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <table className="hidden md:table w-full text-left border-collapse">
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
                          <td className="p-4 text-gray-600">{formatPrice(property.price)}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEdit(property)}
                                className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50"
                                title="Editar"
                              >
                                <Pencil size={20} />
                              </button>
                              <button 
                                onClick={() => handleDelete(property.id)}
                                className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                                title="Excluir"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {properties.map(property => (
                      <div key={property.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex gap-3 mb-3">
                          <img 
                            src={property.imageUrl} 
                            alt={property.title} 
                            className="w-20 h-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate mb-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${property.type === 'Venda' ? 'bg-black text-white' : 'bg-brand-orange text-white'}`}>
                                {property.type}
                              </span>
                            </div>
                            <p className="text-brand-orange font-semibold text-sm">
                              {formatPrice(property.price)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => handleEdit(property)}
                            className="flex-1 flex items-center justify-center gap-2 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium"
                          >
                            <Pencil size={16} /> Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(property.id)}
                            className="flex-1 flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded text-sm font-medium"
                          >
                            <Trash2 size={16} /> Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                    {properties.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        Nenhum imóvel cadastrado.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 animate-fadeIn">
            <div className="flex justify-between items-center mb-6 pb-2 border-b">
              <h2 className="text-xl font-bold">
                {editingPropertyId ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
              </h2>
              {editingPropertyId && (
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="text-sm"
                >
                  Cancelar Edição
                </Button>
              )}
            </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço</label>
                <input 
                  type="number" 
                  name="price" 
                  required 
                  placeholder="Ex: 500000"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                  onChange={handleInputChange}
                  value={formData.price || ''}
                />
                <p className="text-xs text-gray-500 mt-1">Digite apenas números (ex: 500000 para R$ 500.000,00)</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem Principal</label>
                
                {mainImagePreview ? (
                  <div className="relative inline-block">
                    <img src={mainImagePreview} alt="Preview" className="w-full max-w-md h-48 object-cover rounded border-2 border-brand-orange" />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 px-4 py-3 bg-brand-orange text-white rounded cursor-pointer hover:bg-opacity-90 transition w-full md:w-auto justify-center">
                      <Upload size={20} />
                      <span>Escolher Imagem</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleMainImageChange}
                      />
                    </label>
                    <div className="text-sm text-gray-500">
                      Ou insira uma URL:
                      <input 
                        type="url" 
                        name="imageUrl" 
                        placeholder="https://..."
                        className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-brand-orange focus:border-brand-orange"
                        onChange={handleInputChange}
                        value={formData.imageUrl || ''}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Galeria de Imagens</label>
                
                <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition justify-center">
                  <ImageIcon size={20} className="text-gray-600" />
                  <span className="text-gray-700">Adicionar Imagens</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    multiple
                    className="hidden"
                    onChange={handleGalleryFilesChange}
                  />
                </label>
                
                {galleryPreviews.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {galleryPreviews.map((preview, idx) => (
                      <div key={idx} className="relative">
                        <img src={preview} alt={`Gallery ${idx}`} className="w-full h-20 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeGalleryFile(idx)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Ou insira URLs (uma por linha):</p>
                  <textarea 
                    rows={3} 
                    placeholder="https://imagem1.jpg&#10;https://imagem2.jpg"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={galleryInput}
                    onChange={(e) => setGalleryInput(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Vídeos</label>
                
                <label className="flex items-center gap-2 px-4 py-3 bg-gray-100 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition justify-center">
                  <Video size={20} className="text-gray-600" />
                  <span className="text-gray-700">Adicionar Vídeos</span>
                  <input 
                    type="file" 
                    accept="video/*" 
                    multiple
                    className="hidden"
                    onChange={handleVideoFilesChange}
                  />
                </label>
                
                {videoFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {videoFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Video size={16} className="text-gray-500 flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0">({formatFileSize(file.size)})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVideoFile(idx)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Ou insira URLs (uma por linha):</p>
                  <textarea 
                    rows={3} 
                    placeholder="https://video1.mp4&#10;https://video2.mp4"
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className="col-span-2 pt-4">
                {uploadProgress && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm">
                    {uploadProgress}
                  </div>
                )}
                <div className="flex justify-end">
                  <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                     {isSubmitting ? (
                       <span className="flex items-center gap-2">
                         <Loader2 className="animate-spin" size={18} /> Salvando...
                       </span>
                     ) : (editingPropertyId ? 'Atualizar Imóvel' : 'Cadastrar Imóvel')}
                  </Button>
                </div>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;