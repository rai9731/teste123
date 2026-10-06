import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerVisual } from './StickerVisual';
import { Tag, PlusCircle, Clock, Eye, Gavel, CheckCircle2 } from 'lucide-react';

export const MyAuctionsView: React.FC = () => {
  const { auctions, currentUser, setIsCreateModalOpen, setSelectedAuction } = useAuction();

  if (!currentUser) return null;

  const myAuctions = auctions.filter((a) => a.sellerId === currentUser.id);
  const active = myAuctions.filter((a) => a.status !== 'ended');
  const finished = myAuctions.filter((a) => a.status === 'ended');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">Meus Anúncios</h1>
          <p className="text-xs sm:text-sm text-white/60">
            Gerencie as figurinhas que você anunciou em leilão ou venda normal na plataforma CopaBR.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,224,84,0.35)] active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Anunciar Figurinha</span>
        </button>
      </div>

      {/* Active auctions */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white/80 uppercase tracking-wider">
          Anúncios Ativos ({active.length})
        </h2>

        {active.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl text-center border border-white/10 space-y-2 bg-black/60">
            <p className="text-xs text-white/60">Você não tem nenhum anúncio ativo no momento.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="text-xs text-[#00E054] font-bold hover:underline cursor-pointer"
            >
              Comece anunciando uma figurinha repetida
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {active.map((auction) => {
              const isDirect = auction.listingType === 'direct_sale';
              const now = Date.now();
              const timeLeftMs = Math.max(0, auction.endsAt - now);
              const totalSec = Math.floor(timeLeftMs / 1000);
              const m = Math.floor(totalSec / 60);
              const s = totalSec % 60;

              return (
                <div
                  key={auction.id}
                  onClick={() => setSelectedAuction(auction)}
                  className="glass-panel p-4 rounded-2xl border border-white/15 hover:border-[#00E054]/50 transition-all flex items-center justify-between gap-4 cursor-pointer group bg-black/60"
                >
                  <div className="flex items-center gap-3">
                    <StickerVisual
                      player={auction.player}
                      team={auction.team}
                      teamFlag={auction.teamFlag}
                      stickerNumber={auction.stickerNumber}
                      rarity={auction.rarity}
                      photoUrl={auction.photoUrl}
                      size="sm"
                    />
                    <div>
                      <h3 className="font-bold text-white text-sm group-hover:text-[#00E054] transition-colors">
                        {auction.player}
                      </h3>
                      <p className="text-xs text-white/50">{auction.stickerNumber} · {auction.team}</p>

                      <div className="mt-2 space-y-0.5 text-xs">
                        <div>
                          <span className="text-white/60">{isDirect ? 'Preço Fixo: ' : 'Lance Atual: '}</span>
                          <strong className="text-[#00E054] font-mono">
                            R$ {(isDirect ? (auction.fixedPrice || auction.currentBid) : auction.currentBid).toFixed(2)}
                          </strong>
                        </div>
                        <div className="text-[11px] text-white/40 flex items-center gap-2">
                          {isDirect ? (
                            <span className="text-[#00E054] font-bold">Venda Normal Direta</span>
                          ) : (
                            <>
                              <span>{auction.bidCount} lances</span>
                              <span>·</span>
                              <span className="flex items-center gap-1 font-mono text-[#00E054]">
                                <Clock className="w-3 h-3" />
                                {m}m {s}s
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#00E054]/15 border border-[#00E054]/30 text-[#00E054] text-[10px] font-bold">
                      {isDirect ? 'Preço Fixo' : 'Ao Vivo'}
                    </span>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Finished auctions */}
      {finished.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider">
            Anúncios Finalizados ({finished.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {finished.map((auc) => (
              <div
                key={auc.id}
                onClick={() => setSelectedAuction(auc)}
                className="glass-panel p-3.5 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 bg-black/40"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{auc.teamFlag}</span>
                  <div>
                    <p className="text-xs font-bold text-white">{auc.player}</p>
                    <p className="text-[11px] text-white/50">
                      Finalizado por R$ {auc.currentBid.toFixed(2)} ({auc.bidCount} lances)
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E054]/20 text-[#00E054] font-bold">
                    Vendido
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
