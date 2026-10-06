import React, { useState, useMemo, useEffect } from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerCard } from './StickerCard';
import { Rarity } from '../types';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, X, Flame } from 'lucide-react';

export const AuctionsExplorer: React.FC = () => {
  const { auctions, setIsCreateModalOpen, activeTab } = useAuction();

  const [search, setSearch] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'auction' | 'direct_sale'>(
    activeTab === 'direct_sales' ? 'direct_sale' : 'all'
  );

  useEffect(() => {
    if (activeTab === 'direct_sales') {
      setSelectedFormat('direct_sale');
    } else if (activeTab === 'auctions') {
      // Keep user choice or default to all if not direct sale
      if (selectedFormat === 'direct_sale') {
        setSelectedFormat('all');
      }
    }
  }, [activeTab]);
  const [selectedTeam, setSelectedTeam] = useState('Todos');
  const [selectedRarity, setSelectedRarity] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('active'); // 'active', 'all', 'ending_soon', 'ended'
  const [sortBy, setSortBy] = useState<'ending' | 'high_bid' | 'low_bid' | 'most_bids'>('ending');

  const teams = ['Todos', 'Brasil', 'Argentina', 'França', 'Portugal', 'Inglaterra'];
  const rarities = ['Todas', 'Extra Ouro', 'Lendária', 'Brilhante', 'Especial', 'Comum'];

  const filteredAuctions = useMemo(() => {
    return auctions
      .filter((auc) => {
        // Format filter (Auction vs Direct Sale)
        if (selectedFormat === 'auction' && auc.listingType === 'direct_sale') return false;
        if (selectedFormat === 'direct_sale' && auc.listingType !== 'direct_sale') return false;

        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matches =
            auc.player.toLowerCase().includes(q) ||
            auc.stickerNumber.toLowerCase().includes(q) ||
            auc.team.toLowerCase().includes(q) ||
            auc.title.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Team filter
        if (selectedTeam !== 'Todos' && auc.team !== selectedTeam) {
          return false;
        }

        // Rarity filter
        if (selectedRarity !== 'Todas' && auc.rarity !== selectedRarity) {
          return false;
        }

        // Status filter
        if (selectedStatus === 'active') {
          return auc.status !== 'ended';
        }
        if (selectedStatus === 'ending_soon') {
          return auc.status === 'ending_soon';
        }
        if (selectedStatus === 'ended') {
          return auc.status === 'ended';
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ending') {
          // Put active first, sorted by remaining time
          if (a.status === 'ended' && b.status !== 'ended') return 1;
          if (a.status !== 'ended' && b.status === 'ended') return -1;
          return a.endsAt - b.endsAt;
        }
        if (sortBy === 'high_bid') return b.currentBid - a.currentBid;
        if (sortBy === 'low_bid') return a.currentBid - b.currentBid;
        if (sortBy === 'most_bids') return b.bidCount - a.bidCount;
        return 0;
      });
  }, [auctions, search, selectedFormat, selectedTeam, selectedRarity, selectedStatus, sortBy]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            {selectedFormat === 'direct_sale' ? 'Vendas Normais (Preço Fixo)' : 'Explorar Figurinhas da Copa'}
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            {selectedFormat === 'direct_sale'
              ? 'Compre agora pelo valor fixo sem disputar lances.'
              : 'Encontre a peça que falta para o seu álbum da Copa em leilão ou venda normal.'}
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,224,84,0.3)] active:scale-95 cursor-pointer"
        >
          + Anunciar Figurinha
        </button>
      </div>

      {/* Format Selector Pills Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-white/10 w-fit">
        {[
          { id: 'all', label: 'Todos os Formatos' },
          { id: 'auction', label: '🔨 Leilões ao Vivo' },
          { id: 'direct_sale', label: '🏷️ Vendas Normais (Preço Fixo)' },
        ].map((fmt) => (
          <button
            key={fmt.id}
            onClick={() => setSelectedFormat(fmt.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFormat === fmt.id
                ? 'bg-[#00E054] text-black shadow-md'
                : 'text-white/70 hover:text-white'
            }`}
          >
            {fmt.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3 bg-black/60">
        {/* Row 1: Search input + Sort dropdown */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por jogador, código (ex: BRA 10) ou seleção..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input text-xs text-white placeholder-white/30"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white/70 w-full sm:w-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00E054]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer w-full"
              >
                <option value="ending" className="bg-slate-900">Encerrando Primeiro</option>
                <option value="high_bid" className="bg-slate-900">Maior Valor</option>
                <option value="low_bid" className="bg-slate-900">Menor Valor</option>
                <option value="most_bids" className="bg-slate-900">Mais Disputados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Status buttons */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
          <span className="text-[11px] text-white/40 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {[
            { id: 'active', label: 'Ativos' },
            { id: 'ending_soon', label: 'Encerrando em Breve' },
            { id: 'all', label: 'Todos' },
            { id: 'ended', label: 'Encerrados' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedStatus === st.id
                  ? 'bg-[#00E054] text-black shadow-sm font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Row 3: Team chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-white/40 mr-1">Seleção:</span>
          {teams.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTeam(t)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedTeam === t
                  ? 'bg-[#00E054]/20 text-[#00E054] font-bold border border-[#00E054]/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Row 4: Rarity chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-white/40 mr-1">Raridade:</span>
          {rarities.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRarity(r)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedRarity === r
                  ? 'bg-[#00E054]/20 text-[#00E054] font-bold border border-[#00E054]/40'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-white/60 px-1">
        <span>
          Exibindo <strong>{filteredAuctions.length}</strong> {filteredAuctions.length === 1 ? 'anúncio' : 'anúncios'}
        </span>
        {(selectedTeam !== 'Todos' || selectedRarity !== 'Todas' || search || selectedFormat !== 'all') && (
          <button
            onClick={() => {
              setSelectedFormat('all');
              setSelectedTeam('Todos');
              setSelectedRarity('Todas');
              setSearch('');
            }}
            className="text-[#00E054] hover:underline cursor-pointer"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Cards Grid */}
      {filteredAuctions.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center border border-white/10 space-y-3 bg-black/40">
          <p className="text-white/60 text-sm">Nenhum anúncio encontrado com os filtros selecionados.</p>
          <button
            onClick={() => {
              setSelectedFormat('all');
              setSelectedTeam('Todos');
              setSelectedRarity('Todas');
              setSelectedStatus('active');
              setSearch('');
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
          >
            Redefinir Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <StickerCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};
