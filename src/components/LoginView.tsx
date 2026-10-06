import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Eye, EyeOff, LogIn, AlertCircle, Sparkles, Shield, User as UserIcon, X, Check } from 'lucide-react';

interface LoginViewProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({ onClose, isModal = false }) => {
  const { login, users, showToast } = useAuction();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    if (!password) {
      setError('Por favor, digite sua senha.');
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      setError(res.error || 'Credenciais inválidas. Utilize um dos atalhos abaixo.');
    } else {
      if (onClose) onClose();
    }
  };

  const handleQuickAccess = (userEmail: string, index: number) => {
    setEmail(userEmail);
    setPassword('123456');
    setError(null);
    setSelectedDemoIndex(index);
    showToast(`Credenciais preenchidas para ${userEmail}. Clique em 'Entrar'.`, 'info');
  };

  const content = (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Primary Login Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/15 shadow-2xl bg-black/90">
        {/* Glow corner */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#00E054]/15 rounded-full blur-2xl pointer-events-none" />

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#009C3B] to-[#00E054] p-0.5 mb-3 shadow-[0_0_20px_rgba(0,224,84,0.3)]">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <LogIn className="w-6 h-6 text-[#00E054]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white font-display tracking-tight">
            Entrar no <span className="text-[#00E054]">CopaBR</span>
          </h2>
          <p className="text-xs text-white/60 mt-1">
            Seu marketplace de leilões e vendas normais de figurinhas da Copa
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              E-mail de Acesso
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@copabr.com"
              className="w-full px-4 py-3 rounded-xl glass-input text-sm text-white placeholder-white/30"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-white/80">Senha</label>
              <button
                type="button"
                onClick={() => showToast('Dica: Use um dos atalhos da demonstração abaixo com a senha 123456.', 'info')}
                className="text-[11px] text-[#00E054] hover:underline cursor-pointer"
              >
                Esqueci minha senha
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-4 py-3 pr-10 rounded-xl glass-input text-sm text-white placeholder-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-[0_0_25px_rgba(0,224,84,0.35)] active:scale-98 cursor-pointer mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar na Plataforma</span>
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => showToast('Para criar conta de teste, selecione qualquer usuário de demonstração abaixo.', 'info')}
              className="text-xs text-white/60 hover:text-white cursor-pointer"
            >
              Não tem conta? <span className="text-[#00E054] font-semibold underline">Criar conta</span>
            </button>
          </div>
        </form>
      </div>

      {/* Demonstration Quick Access Card */}
      <div className="glass-panel rounded-3xl p-5 border border-[#00E054]/30 shadow-xl space-y-3 bg-black/90">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#00E054] uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Acesso rápido (demonstração)</span>
          </div>
          <span className="text-[11px] text-white/60 font-mono">Senha: 123456</span>
        </div>
        <p className="text-xs text-white/70">
          Clique em qualquer perfil abaixo para preencher automaticamente as credenciais oficiais do teste:
        </p>

        <div className="space-y-2 pt-1">
          {users.map((u, idx) => {
            const isSelected = selectedDemoIndex === idx || email.toLowerCase() === u.email.toLowerCase();
            const isAdmin = u.role === 'admin';

            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickAccess(u.email, idx)}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-[#00E054]/20 border-[#00E054] shadow-[0_0_15px_rgba(0,224,84,0.25)]'
                    : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-white/20"
                    />
                    {isAdmin ? (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-zinc-800 text-[#00E054] border border-[#00E054] flex items-center justify-center text-[9px] font-bold shadow">
                        <Shield className="w-2.5 h-2.5" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00E054] text-black flex items-center justify-center text-[9px] font-bold shadow">
                        <UserIcon className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-white text-xs truncate">{u.name}</p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          isAdmin
                            ? 'bg-[#00E054]/20 text-[#00E054] border border-[#00E054]/40'
                            : 'bg-white/10 text-white/70'
                        }`}
                      >
                        {isAdmin ? 'Admin' : 'Usuário'}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/50 font-mono truncate">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pl-2">
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-[#00E054]">
                      <Check className="w-3.5 h-3.5" /> Preenchido
                    </span>
                  ) : (
                    <span className="text-[11px] text-white/40 hover:text-white">Usar</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
        <div className="relative my-8">{content}</div>
      </div>
    );
  }

  return <div className="py-12 px-4">{content}</div>;
};
