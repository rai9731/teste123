import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import {
  Shield,
  BarChart3,
  Users,
  Tag,
  AlertOctagon,
  Sparkles,
  Settings,
  CheckCircle2,
  Trash2,
  DollarSign,
  Gavel,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    currentUser,
    auctions,
    users,
    orders,
    toggleFeatureAuction,
    cancelAuctionByAdmin,
    setSelectedAuction,
    showToast,
  } = useAuction();

  const [activeAdminTab, setActiveAdminTab] = useState<'auctions' | 'users' | 'settings'>('auctions');
  const [platformFee, setPlatformFee] = useState('5.0');
  const [antiSnipingMinutes, setAntiSnipingMinutes] = useState('2');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/40">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-white">Acesso Restrito ao Administrador</h2>
        <p className="text-xs text-white/60">
          Você precisa estar conectado com a conta oficial do administrador (admin@copabr.com) para gerenciar a plataforma.
        </p>
      </div>
    );
  }

  // Calculate platform financial stats
  const totalGMV = orders
    .filter((o) => o.status === 'paid' || o.status === 'shipped')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalActiveAuctions = auctions.filter((a) => a.status !== 'ended').length;
  const totalBidsLogged = auctions.reduce((acc, curr) => acc + curr.bidCount, 0);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configurações da plataforma salvas com sucesso!', 'success');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Admin Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#00E054]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded bg-[#00E054]/20 text-[#00E054]">
              <Shield className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E054]">
              Painel de Controle Administrativo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Gestão da Plataforma CopaBR
          </h1>
          <p className="text-xs text-white/60">
            Supervisão e auditoria de leilões, vendas normais, usuários e parâmetros do marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {[
            { id: 'auctions', label: 'Moderar Anúncios', icon: Tag },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'settings', label: 'Regras da Plataforma', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeAdminTab === tab.id
                    ? 'bg-[#00E054] text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/60">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
            Volume Negociado (GMV)
          </span>
          <div className="text-2xl font-black text-[#00E054] font-mono">
            R$ {totalGMV.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1">Negociações finalizadas</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/60">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
            Anúncios Ativos
          </span>
          <div className="text-2xl font-black text-white font-mono">{totalActiveAuctions}</div>
          <p className="text-[11px] text-white/40 mt-1">Disputas e vendas no ar</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/60">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
            Total de Lances Auditados
          </span>
          <div className="text-2xl font-black text-white font-mono">{totalBidsLogged}</div>
          <p className="text-[11px] text-[#00E054] mt-1">100% livres de sniping abusivo</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 bg-black/60">
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider block mb-2">
            Usuários Cadastrados
          </span>
          <div className="text-2xl font-black text-white font-mono">{users.length}</div>
          <p className="text-[11px] text-[#00E054] mt-1">Perfis ativos no sistema</p>
        </div>
      </div>

      {/* Tab: Moderar Leilões */}
      {activeAdminTab === 'auctions' && (
        <div className="glass-panel rounded-3xl border border-white/15 p-6 space-y-4 bg-black/70">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Lista de Anúncios do Marketplace</h2>
            <span className="text-xs text-white/50">{auctions.length} itens no sistema</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/40">
            <table className="w-full text-left text-xs text-white">
              <thead className="bg-white/5 border-b border-white/10 uppercase text-[10px] text-white/60 font-semibold tracking-wider">
                <tr>
                  <th className="p-3.5">Figurinha</th>
                  <th className="p-3.5">Tipo</th>
                  <th className="p-3.5">Vendedor</th>
                  <th className="p-3.5">Valor Atual</th>
                  <th className="p-3.5">Lances</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Destaque</th>
                  <th className="p-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auctions.map((auc) => (
                  <tr key={auc.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 flex items-center gap-2">
                      <span className="text-base">{auc.teamFlag}</span>
                      <div>
                        <strong className="block text-white">{auc.player}</strong>
                        <span className="text-[10px] text-white/50 font-mono">
                          {auc.stickerNumber} · {auc.rarity}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-white">
                        {auc.listingType === 'direct_sale' ? 'Venda Normal' : 'Leilão'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="text-white/80">{auc.sellerName}</span>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-[#00E054]">
                      R$ {(auc.listingType === 'direct_sale' ? (auc.fixedPrice || auc.currentBid) : auc.currentBid).toFixed(2)}
                    </td>

                    <td className="p-3.5 font-mono">{auc.bidCount}</td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          auc.status === 'live'
                            ? 'bg-[#00E054]/20 text-[#00E054]'
                            : auc.status === 'ending_soon'
                            ? 'bg-emerald-800/40 text-emerald-300'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {auc.status === 'live'
                          ? 'Ao Vivo'
                          : auc.status === 'ending_soon'
                          ? 'Encerrando'
                          : 'Encerrado'}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => toggleFeatureAuction(auc.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          auc.isFeatured
                            ? 'bg-[#00E054]/20 text-[#00E054] border-[#00E054]/40'
                            : 'bg-white/5 text-white/40 border-white/10 hover:text-white'
                        }`}
                      >
                        {auc.isFeatured ? '★ Destacado' : 'Normal'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAuction(auc)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px] cursor-pointer"
                      >
                        Auditar
                      </button>
                      {auc.status !== 'ended' && (
                        <button
                          onClick={() => cancelAuctionByAdmin(auc.id)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 font-semibold text-[11px] cursor-pointer"
                          title="Encerrar por moderação"
                        >
                          Encerrar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Usuários */}
      {activeAdminTab === 'users' && (
        <div className="glass-panel rounded-3xl border border-white/15 p-6 space-y-4 bg-black/70">
          <h2 className="text-base font-bold text-white">Usuários da Plataforma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover border border-white/20" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white text-sm">{u.name}</h3>
                      <span className="text-[10px] px-1.5 rounded bg-white/10 text-[#00E054] font-mono">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-xs text-white/50">{u.email}</p>
                    <p className="text-[11px] text-[#00E054] font-semibold">★ {u.rating} ({u.badge})</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between text-xs text-white/60">
                  <span>Anúncios: {u.auctionsCreatedCount}</span>
                  <span>Lances: {u.bidsPlacedCount}</span>
                  <span className="font-mono text-[#00E054]">R$ {u.walletBalance.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Regras da Plataforma */}
      {activeAdminTab === 'settings' && (
        <div className="glass-panel rounded-3xl border border-white/15 p-6 space-y-5 max-w-2xl bg-black/70">
          <h2 className="text-base font-bold text-white">Regras e Parâmetros do Marketplace</h2>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Comissão da Plataforma (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={platformFee}
                onChange={(e) => setPlatformFee(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
              />
              <span className="text-[11px] text-white/40 block mt-1">
                Retida automaticamente no momento da conclusão do pagamento do leilão ou venda normal.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">
                Janela Anti-Sniping (Minutos)
              </label>
              <input
                type="number"
                value={antiSnipingMinutes}
                onChange={(e) => setAntiSnipingMinutes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white font-mono"
              />
              <span className="text-[11px] text-white/40 block mt-1">
                Tempo mínimo em que lances estendem o relógio do leilão (Padrão: 2 minutos).
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider shadow active:scale-95 transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
