import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import {
  Trophy,
  Bell,
  PlusCircle,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Layers,
  Gavel,
  History,
  Tag,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    logout,
    setIsLoginModalOpen,
    setIsCreateModalOpen,
    unreadNotifsCount,
    activeTab,
    setActiveTab,
    users,
    switchUser,
  } = useAuction();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDemoPickerOpen, setIsDemoPickerOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'auctions', label: 'Leilões', icon: Gavel },
    { id: 'direct_sales', label: 'Vendas Normais', icon: Tag },
    { id: 'my_bids', label: 'Meus Lances', icon: History },
    { id: 'my_auctions', label: 'Meus Anúncios', icon: Tag },
    { id: 'my_wins', label: 'Minhas Compras', icon: Trophy },
    { id: 'album', label: 'Meu Álbum', icon: BookOpen },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 backdrop-blur-xl bg-black/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(currentUser ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#009C3B] to-[#00E054] p-0.5 shadow-[0_0_20px_rgba(0,224,84,0.3)] flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-[#00E054] group-hover:rotate-6 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white font-display">
                Copa<span className="text-[#00E054]">BR</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#00E054] -mt-1">
                Leilões & Venda Direta
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links (when logged in) */}
        {currentUser ? (
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#00E054] text-black shadow-[0_0_15px_rgba(0,224,84,0.3)]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/80">
            <button onClick={() => setActiveTab('landing')} className="hover:text-white transition-colors cursor-pointer">
              Início
            </button>
            <button onClick={() => setActiveTab('auctions')} className="hover:text-[#00E054] transition-colors cursor-pointer">
              Leilões
            </button>
            <button onClick={() => setActiveTab('direct_sales')} className="hover:text-[#00E054] transition-colors cursor-pointer">
              Vendas Normais
            </button>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Como Funciona
            </a>
            <a href="#beneficios" className="hover:text-white transition-colors">
              Benefícios
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              Dúvidas
            </a>
          </nav>
        )}

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentUser ? (
            <>
              {/* Quick Demo Profile Switcher pill */}
              <div className="relative hidden xl:block">
                <button
                  onClick={() => setIsDemoPickerOpen(!isDemoPickerOpen)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Mudar perfil para teste rápido"
                >
                  <span className="w-2 h-2 rounded-full bg-[#00E054]" />
                  <span className="truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-white/60" />
                </button>

                {isDemoPickerOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-white/20 space-y-1 bg-black/90">
                    <p className="text-[10px] uppercase font-bold text-white/50 px-2 py-1">Trocar Usuário (Demo)</p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsDemoPickerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                          u.id === currentUser.id ? 'bg-[#00E054]/20 text-[#00E054]' : 'hover:bg-white/10 text-white'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="truncate flex-1">
                          <p className="font-semibold leading-tight">{u.name}</p>
                          <span className="text-[10px] text-white/50">{u.role === 'admin' ? 'Administrador' : u.badge}</span>
                        </div>
                        {u.id === currentUser.id && <CheckCircle2 className="w-4 h-4 text-[#00E054]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Botão Novo Anúncio (Leilão ou Venda) */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(0,224,84,0.3)] active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Anunciar Figurinha</span>
              </button>

              {/* Notification Bell */}
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white transition-all active:scale-95 cursor-pointer"
                aria-label="Notificações"
              >
                <Bell className="w-4 h-4 text-[#00E054]" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00E054] text-black text-[10px] font-black flex items-center justify-center shadow">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* SOMENTE para o usuário Administrador: Botão "Painel Admin" ao lado do avatar */}
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all duration-200 shadow-md cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#00E054] text-black border-[#00E054]'
                      : 'bg-[#00E054]/15 text-[#00E054] border-[#00E054]/40 hover:bg-[#00E054]/25'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painel Admin</span>
                </button>
              )}

              {/* User Avatar Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#00E054]/60"
                  />
                  <ChevronDown className="w-3 h-3 text-white/60 hidden sm:block" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel p-2 z-50 shadow-2xl border border-white/20 divide-y divide-white/10 bg-black/95">
                    <div className="p-3">
                      <p className="font-bold text-white text-sm">{currentUser.name}</p>
                      <p className="text-xs text-white/60 truncate">{currentUser.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#00E054] bg-black/60 p-2 rounded-xl border border-white/10">
                        <span>Saldo da Carteira:</span>
                        <span className="font-mono font-bold">R$ {currentUser.walletBalance.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          setActiveTab('dashboard');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#00E054]" />
                        <span>Meu Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('album');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 text-left transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-[#00E054]" />
                        <span>Meu Álbum Virtual</span>
                      </button>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-red-300 hover:text-red-200 hover:bg-red-500/20 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sair da Conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(0,224,84,0.35)] active:scale-95 cursor-pointer"
            >
              Login
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white cursor-pointer"
            aria-label="Abrir menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t border-white/10 pb-4 space-y-2 animate-fadeIn">
          {currentUser ? (
            <>
              <div className="p-2 mb-2 bg-black/60 rounded-xl flex items-center gap-3 border border-white/10">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-white text-sm">{currentUser.name}</p>
                  <p className="text-xs text-white/60">{currentUser.badge}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCreateModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#00E054] text-black font-black text-xs uppercase flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Anunciar Figurinha</span>
              </button>

              {currentUser.role === 'admin' && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 border border-[#00E054] text-[#00E054] font-bold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Painel do Administrador</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-1.5 pt-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => {
                        setActiveTab(link.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left ${
                        activeTab === link.id ? 'bg-[#00E054] text-black font-bold' : 'bg-white/5 text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{link.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full mt-3 py-2 px-4 rounded-xl bg-red-500/20 text-red-300 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sair</span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('landing');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left px-3 text-white font-medium"
              >
                Início
              </button>
              <button
                onClick={() => {
                  setActiveTab('auctions');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left px-3 text-white font-medium"
              >
                Leilões
              </button>
              <button
                onClick={() => {
                  setActiveTab('direct_sales');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 text-left px-3 text-white font-medium"
              >
                Vendas Normais
              </button>
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-[#00E054] text-black font-black text-xs uppercase"
              >
                Fazer Login
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
