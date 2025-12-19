import * as XLSX from 'xlsx';
import { Property } from '../types';

export interface ImportedPropertyData {
  title: string;
  type: 'Venda' | 'Aluguel';
  price: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
}

/**
 * Sanitiza input de Excel para prevenir Formula Injection
 * Remove caracteres que podem iniciar fórmulas maliciosas
 */
function sanitizeExcelInput(value: any): string {
  if (!value) return '';
  
  const str = String(value).trim();
  
  // Caracteres perigosos que iniciam fórmulas no Excel
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r', '\n'];
  
  // Se começa com caractere perigoso, adiciona apóstrofo para escapar
  if (dangerousChars.some(char => str.startsWith(char))) {
    return `'${str}`;
  }
  
  // Remove caracteres de controle (ASCII 0-31 e 127)
  const sanitized = str.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Limita tamanho para evitar buffer overflow
  return sanitized.substring(0, 1000);
}

/**
 * Lê um arquivo Excel/CSV e retorna array de imóveis
 */
export async function importPropertiesFromFile(file: File): Promise<ImportedPropertyData[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Pega a primeira planilha
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converte para JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Valida e mapeia os dados com sanitização
        const properties: ImportedPropertyData[] = jsonData.map((row: any) => {
          return {
            title: sanitizeExcelInput(row['Título'] || row['titulo'] || row['Title'] || ''),
            type: (row['Tipo'] || row['tipo'] || row['Type'] || 'Venda') === 'Aluguel' ? 'Aluguel' : 'Venda',
            price: sanitizeExcelInput(row['Preço'] || row['preco'] || row['Price'] || '0'),
            address: sanitizeExcelInput(row['Endereço'] || row['endereco'] || row['Address'] || ''),
            bedrooms: Math.max(0, Math.min(99, Number(row['Quartos'] || row['quartos'] || row['Bedrooms'] || 0))),
            bathrooms: Math.max(0, Math.min(99, Number(row['Banheiros'] || row['banheiros'] || row['Bathrooms'] || 0))),
            area: Math.max(0, Math.min(999999, Number(row['Área'] || row['area'] || row['Area'] || 0))),
            description: sanitizeExcelInput(row['Descrição'] || row['descricao'] || row['Description'] || '')
          };
        });
        
        // Filtra propriedades válidas (que tenham pelo menos título)
        const validProperties = properties.filter(p => p.title.length > 0 && p.title.length <= 200);
        
        resolve(validProperties);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo. Verifique se o formato está correto.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsBinaryString(file);
  });
}

/**
 * Gera e baixa um arquivo Excel modelo
 */
export function downloadTemplateFile() {
  // Dados de exemplo para o modelo
  const templateData = [
    {
      'Título': 'Apartamento 3 Quartos - Centro',
      'Tipo': 'Venda',
      'Preço': '500000',
      'Endereço': 'Rua das Flores, 123 - Centro',
      'Quartos': 3,
      'Banheiros': 2,
      'Área': 85,
      'Descrição': 'Apartamento amplo e bem localizado, próximo a comércios e serviços.'
    },
    {
      'Título': 'Casa 2 Quartos - Jardim América',
      'Tipo': 'Aluguel',
      'Preço': '2500',
      'Endereço': 'Av. Principal, 456 - Jardim América',
      'Quartos': 2,
      'Banheiros': 1,
      'Área': 120,
      'Descrição': 'Casa aconchegante com quintal e garagem.'
    }
  ];
  
  // Cria a planilha
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  
  // Define largura das colunas
  const columnWidths = [
    { wch: 40 }, // Título
    { wch: 10 }, // Tipo
    { wch: 12 }, // Preço
    { wch: 40 }, // Endereço
    { wch: 10 }, // Quartos
    { wch: 12 }, // Banheiros
    { wch: 10 }, // Área
    { wch: 60 }, // Descrição
  ];
  worksheet['!cols'] = columnWidths;
  
  // Cria o workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Imóveis');
  
  // Gera e baixa o arquivo
  XLSX.writeFile(workbook, 'modelo_imoveis_camamum.xlsx');
}

/**
 * Valida um arquivo de importação
 */
export function validateImportFile(file: File): { valid: boolean; error?: string } {
  // Verifica extensão
  const validExtensions = ['.xlsx', '.xls', '.csv'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  
  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Formato de arquivo inválido. Use .xlsx, .xls ou .csv'
    };
  }
  
  // Verifica tamanho (máx 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Arquivo muito grande. Tamanho máximo: 5MB'
    };
  }
  
  return { valid: true };
}
