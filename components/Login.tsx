import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import Button from './Button';
import { ArrowLeft, House, Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginProps {
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Rate limiting states
  const [loginAttempts, setLoginAttempts] = useState(0);
  const lastAttemptTime = useRef<number>(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verifica se está bloqueado
    if (isLocked) {
      setError(`Muitas tentativas falhas. Aguarde ${Math.ceil(lockTimeRemaining / 60)} minuto(s).`);
      return;
    }
    
    // Rate limiting: mínimo 2 segundos entre tentativas
    const now = Date.now();
    const timeSinceLastAttempt = now - lastAttemptTime.current;
    
    if (timeSinceLastAttempt < 2000 && lastAttemptTime.current > 0) {
      setError('Aguarde alguns segundos antes de tentar novamente.');
      return;
    }
    
    // Bloqueia após 5 tentativas falhas
    if (loginAttempts >= 5) {
      setIsLocked(true);
      setLockTimeRemaining(300); // 5 minutos em segundos
      
      // Countdown timer
      const interval = setInterval(() => {
        setLockTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setError('Muitas tentativas falhas. Conta bloqueada por 5 minutos.');
      return;
    }
    
    lastAttemptTime.current = now;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginAttempts(prev => prev + 1);
        // Mensagem genérica para evitar enumeração de usuários
        throw new Error('Credenciais inválidas. Verifique seu email e senha.');
      }
      
      // Reset em caso de sucesso
      setLoginAttempts(0);
      // Auth state change will be picked up by AuthContext automatically
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-brand-black p-8 text-center relative">
           <button 
              onClick={onBack}
              className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Lock className="text-brand-orange" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">Área Administrativa</h2>
          <p className="text-gray-400 text-sm mt-2">Acesso restrito para colaboradores</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                  placeholder="admin@camamum.com.br"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-orange focus:border-brand-orange transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={loading || isLocked}
              className={`flex items-center justify-center gap-2 ${
                loading || isLocked ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading 
                ? 'Entrando...' 
                : isLocked 
                ? `Bloqueado (${Math.ceil(lockTimeRemaining / 60)}min)` 
                : 'Entrar no Sistema'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            {loginAttempts > 0 && loginAttempts < 5 && (
              <p className="text-xs text-orange-600 mb-2">
                ⚠️ Tentativa {loginAttempts} de 5. Mais {5 - loginAttempts} tentativa(s) antes do bloqueio.
              </p>
            )}
            <p className="text-xs text-gray-400">
              Esqueceu sua senha? Contate o suporte técnico.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 opacity-50">
        <House size={20} className="text-brand-black" />
        <span className="font-bold text-brand-black">CAMAMUM</span>
      </div>
    </div>
  );
};

export default Login;