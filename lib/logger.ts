/**
 * Sistema de logging seguro
 * Em produção, logs sensíveis não são exibidos no console
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log de informação (apenas em desenvolvimento)
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Log de erro
   * Em produção, exibe mensagem genérica
   */
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    } else {
      // Em produção, log genérico
      console.error('An error occurred');
      // Aqui você pode integrar com serviços como Sentry, LogRocket, etc
      // Exemplo: Sentry.captureException(args[0]);
    }
  },

  /**
   * Log de aviso (apenas em desenvolvimento)
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log de debug (apenas em desenvolvimento)
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log de info que sempre aparece (para mensagens importantes)
   */
  info: (...args: any[]) => {
    console.info(...args);
  }
};
