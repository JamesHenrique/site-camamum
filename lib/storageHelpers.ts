import { supabase } from './supabaseClient';
import { logger } from './logger';

const BUCKET_NAME = 'property-media'; // Nome do bucket que vamos criar no Supabase

/**
 * Faz upload de um arquivo para o Supabase Storage
 * @param file - Arquivo a ser enviado
 * @param folder - Pasta dentro do bucket (ex: 'images' ou 'videos')
 * @returns URL pública do arquivo ou null em caso de erro
 */
export async function uploadFile(file: File, folder: 'images' | 'videos'): Promise<string | null> {
  try {
    // Gera um nome único para o arquivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Faz o upload
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      logger.error('Erro no upload:', error);
      return null;
    }

    // Retorna a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    logger.error('Erro ao fazer upload:', error);
    return null;
  }
}

/**
 * Faz upload de múltiplos arquivos
 * @param files - Array de arquivos
 * @param folder - Pasta de destino
 * @returns Array de URLs públicas
 */
export async function uploadMultipleFiles(files: File[], folder: 'images' | 'videos'): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file, folder));
  const results = await Promise.all(uploadPromises);
  return results.filter((url): url is string => url !== null);
}

/**
 * Deleta um arquivo do storage
 * @param fileUrl - URL pública do arquivo
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    // Extrai o caminho do arquivo da URL
    const urlParts = fileUrl.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      logger.error('Erro ao deletar arquivo:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Erro ao deletar arquivo:', error);
    return false;
  }
}

/**
 * Valida se o arquivo é uma imagem com verificações de segurança
 */
export function isValidImage(file: File): boolean {
  // 1. Validação de MIME type
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!validMimes.includes(file.type)) {
    logger.warn(`Tipo MIME inválido: ${file.type}`);
    return false;
  }
  
  // 2. Validação de extensão
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    logger.warn(`Extensão inválida: ${fileName}`);
    return false;
  }
  
  // 3. Validação de tamanho (5MB máximo)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    logger.warn(`Arquivo muito grande: ${formatFileSize(file.size)}`);
    return false;
  }
  
  // 4. Validação de tamanho mínimo (evita arquivos corrompidos/vazios)
  if (file.size < 100) {
    logger.warn('Arquivo muito pequeno ou vazio');
    return false;
  }
  
  return true;
}

/**
 * Valida se o arquivo é um vídeo com verificações de segurança
 */
export function isValidVideo(file: File): boolean {
  // 1. Validação de MIME type
  const validMimes = ['video/mp4', 'video/webm', 'video/ogg'];
  if (!validMimes.includes(file.type)) {
    logger.warn(`Tipo MIME de vídeo inválido: ${file.type}`);
    return false;
  }
  
  // 2. Validação de extensão
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.mp4', '.webm', '.ogg'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasValidExtension) {
    logger.warn(`Extensão de vídeo inválida: ${fileName}`);
    return false;
  }
  
  // 3. Validação de tamanho (50MB máximo para vídeos)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    logger.warn(`Vídeo muito grande: ${formatFileSize(file.size)}`);
    return false;
  }
  
  // 4. Validação de tamanho mínimo
  if (file.size < 1024) {
    logger.warn('Vídeo muito pequeno ou vazio');
    return false;
  }
  
  return true;
}

/**
 * Formata o tamanho do arquivo
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
