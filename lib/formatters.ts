/**
 * Formata um valor para formato monetário brasileiro
 * @param value - Valor numérico ou string
 * @returns Valor formatado como "R$ 1.000,00"
 */
export function formatPrice(value: string | number): string {
  // Remove tudo que não é número
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.'))
    : value;

  // Se não for um número válido, retorna o valor original com R$
  if (isNaN(numericValue)) {
    // Se já tem R$, retorna como está
    if (typeof value === 'string' && value.includes('R$')) {
      return value;
    }
    return `R$ ${value}`;
  }

  // Formata como moeda brasileira
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numericValue);
}

/**
 * Formata um número com separadores de milhares
 * @param value - Valor numérico
 * @returns Valor formatado como "1.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
