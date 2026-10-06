import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerVisual } from './StickerVisual';
import { BookOpen, Search, PlusCircle, CheckCircle2, Sparkles, Filter } from 'lucide-react';

export const MyAlbumView: React.FC = () => {
  const { albumStickers, toggleStickerStatus, setIsCreateModalOpen, setActiveTab } = useAuction();

  const [selectedTeam, setSelectedTeam] = useState('Brasil');
  const [filterStatus, setFilterStatus] = useState<'all' | 'collected' | 'missing' | 'repeated'>('all');

  const teams = ['Brasil', 'Argentina', 'França', 'Portugal'];

  const filteredStickers = albumStickers.filter((s) => {
    if (s.team !== selectedTeam) return false;
    if (filterStatus === 'all') return true;
    return s.status === filterStatus;
  });

  const totalCollected = albumStickers.filter((s) => s.status !== 'missing').length;
  const totalStickers = albumStickers.length;
  const progressPercent = Math.round((totalCollected / totalStickers) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Album Cover & Progress Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#00E054]/30 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-black/80">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00E054]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E054]">
              Álbum Oficial Virtual CopaBR
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Coleção Copa do Mundo 2026
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-xl">
            Marque as figurinhas que você possui. Use as faltantes para buscar leilões ou anuncie as repetidas com um clique.
          </p>
        </div>

        {/* Progress circular / bar metric */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 z-10 w-full md:w-64 space-y-2">
          <div className="flex items-baseline justify-between text-xs">
            <span className="text-white/60">Progresso Geral:</span>
            <span className="font-bold text-[#00E054] font-mono text-base">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#009C3B] to-[#00E054] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/40">
            <span>{totalCollected} coladas</span>
            <span>{totalStickers - totalCollected} faltantes</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Nations */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {teams.map((team) => {
            const flag = team === 'Brasil' ? '🇧🇷' : team === 'Argentina' ? '🇦🇷' : team === 'França' ? '🇫🇷' : '🇵🇹';
            const countInTeam = albumStickers.filter((s) => s.team === team && s.status !== 'missing').length;
            const totalInTeam = albumStickers.filter((s) => s.team === team).length;

            return (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTeam === team
                    ? 'bg-[#00E054] text-black shadow-[0_0_15px_rgba(0,224,84,0.3)]'
                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                }`}
              >
                <span>{flag}</span>
                <span>{team}</span>
                <span className="text-[10px] opacity-70 font-mono">
                  ({countInTeam}/{totalInTeam})
                </span>
              </button>
            );
          })}
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'collected', label: 'Coladas' },
            { id: 'missing', label: 'Faltantes' },
            { id: 'repeated', label: 'Repetidas' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of stickers in album page */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredStickers.map((sticker) => {
          const isCollected = sticker.status === 'collected';
          const isRepeated = sticker.status === 'repeated';
          const isMissing = sticker.status === 'missing';

          return (
            <div
              key={sticker.id}
              className={`glass-panel rounded-2xl p-3 border transition-all flex flex-col justify-between relative group bg-black/60 ${
                isCollected
                  ? 'border-emerald-500/30 hover:border-emerald-400'
                  : isRepeated
                  ? 'border-[#00E054]/50 hover:border-[#00E054]'
                  : 'border-dashed border-white/20 hover:border-white/40 bg-black/40'
              }`}
            >
              {/* Badge top */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-white/90">{sticker.number}</span>
                {isRepeated && (
                  <span className="px-1.5 py-0.5 rounded bg-[#00E054] text-black text-[10px] font-black">
                    x{sticker.count} Repetida
                  </span>
                )}
                {isCollected && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Colada
                  </span>
                )}
                {isMissing && (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/40 text-[10px]">
                    Falta
                  </span>
                )}
              </div>

              {/* Card visual / Silhouette */}
              <div className="flex justify-center my-1 relative">
                {isMissing ? (
                  <div
                    onClick={() => toggleStickerStatus(sticker.id)}
                    className="w-28 h-36 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center p-2 text-center bg-black/50 cursor-pointer hover:bg-black/70 transition-colors"
                    title="Clique para marcar como colada"
                  >
                    <span className="text-2xl opacity-40">{sticker.teamFlag}</span>
                    <span className="text-xs font-bold text-white/40 mt-1">{sticker.player}</span>
                    <span className="text-[10px] text-white/30">{sticker.position}</span>
                    <span className="text-[9px] text-[#00E054] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      + Marcar que tenho
                    </span>
                  </div>
                ) : (
                  <div
                    onClick={() => toggleStickerStatus(sticker.id)}
                    className="cursor-pointer"
                    title="Clique para alternar status (colada/repetida/falta)"
                  >
                    <StickerVisual
                      player={sticker.player}
                      team={sticker.team}
                      teamFlag={sticker.teamFlag}
                      stickerNumber={sticker.number}
                      rarity={sticker.rarity}
                      photoUrl={sticker.photoUrl}
                      size="sm"
                    />
                  </div>
                )}
              </div>

              {/* Title & Actions */}
              <div className="mt-2 pt-2 border-t border-white/10 text-center space-y-1.5">
                <p className="font-bold text-xs text-white truncate">{sticker.player}</p>

                {isMissing ? (
                  <button
                    onClick={() => setActiveTab('auctions')}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#00E054]/15 hover:bg-[#00E054]/25 border border-[#00E054]/30 text-[#00E054] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                    <span>Buscar no Mercado</span>
                  </button>
                ) : isRepeated ? (
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#00E054] hover:bg-[#00c94b] text-black text-[11px] font-black flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Anunciar Repetida</span>
                  </button>
                ) : (
                  <button
                    onClick={() => toggleStickerStatus(sticker.id)}
                    className="w-full py-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-[10px] transition-colors cursor-pointer"
                  >
                    Alterar status
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
