import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerVisual } from './StickerVisual';
import { Gavel, CheckCircle2, AlertTriangle, ArrowRight, Clock } from 'lucide-react';

export const MyBidsView: React.FC = () => {
  const { auctions, currentUser, setSelectedAuction, setActiveTab } = useAuction();

  if (!currentUser) return null;

  // Auctions where current user placed at least one bid
  const myBidAuctions = auctions.filter((a) => a.bids.some((b) => b.bidderId === currentUser.id));

  const winning = myBidAuctions.filter((a) => a.status !== 'ended' && a.highestBidderId === currentUser.id);
  const outbid = myBidAuctions.filter((a) => a.status !== 'ended' && a.highestBidderId !== currentUser.id);
  const ended = myBidAuctions.filter((a) => a.status === 'ended');

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">Meus Lances</h1>
          <p className="text-xs sm:text-sm text-white/60">
            Acompanhe suas disputas em andamento e cubra ofertas superadas.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('auctions')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
        >
          Explorar Mais Leilões
        </button>
      </div>

      {/* Outbid alerts section */}
      {outbid.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Lances Superados ({outbid.length}) - Ação Recomendada</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outbid.map((auction) => (
              <div
                key={auction.id}
                className="glass-panel p-4 rounded-2xl border border-red-500/30 flex items-center justify-between gap-4 bg-black/60"
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
                    <h3 className="font-bold text-white text-sm">{auction.player}</h3>
                    <p className="text-xs text-white/50">{auction.stickerNumber} · {auction.team}</p>
                    <div className="mt-2 text-xs">
                      <span className="text-white/60">Lance Atual: </span>
                      <strong className="text-[#00E054] font-mono">
                        R$ {auction.currentBid.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAuction(auction)}
                  className="px-4 py-2 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider shadow active:scale-95 whitespace-nowrap cursor-pointer"
                >
                  Cobrir Lance
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winning section */}
      {winning.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#00E054] font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>Você Está Vencendo ({winning.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {winning.map((auction) => (
              <div
                key={auction.id}
                className="glass-panel p-4 rounded-2xl border border-[#00E054]/30 flex items-center justify-between gap-4 bg-black/60"
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
                    <h3 className="font-bold text-white text-sm">{auction.player}</h3>
                    <p className="text-xs text-white/50">{auction.stickerNumber} · {auction.team}</p>
                    <div className="mt-2 text-xs">
                      <span className="text-white/60">Seu Lance: </span>
                      <strong className="text-[#00E054] font-mono">
                        R$ {auction.currentBid.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAuction(auction)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold whitespace-nowrap cursor-pointer"
                >
                  Ver Leilão
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ended bids section */}
      {ended.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-white/10">
          <h2 className="text-sm font-bold text-white/70">Leilões Anteriores Finalizados ({ended.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ended.map((auction) => {
              const won = auction.winnerId === currentUser.id;
              return (
                <div
                  key={auction.id}
                  onClick={() => setSelectedAuction(auction)}
                  className="glass-panel p-3 rounded-xl border border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 bg-black/40"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{auction.teamFlag}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{auction.player}</p>
                      <p className="text-[11px] text-white/50">{auction.stickerNumber}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        won ? 'bg-[#00E054]/20 text-[#00E054]' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {won ? 'Arrematado por você!' : 'Arrematado por outro'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {myBidAuctions.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 space-y-3 bg-black/60">
          <Gavel className="w-8 h-8 text-[#00E054] mx-auto" />
          <h3 className="font-bold text-white text-base">Você ainda não deu lances em nenhum leilão.</h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Explore os leilões ao vivo e comece a disputar as figurinhas para completar o seu álbum da Copa!
          </p>
          <button
            onClick={() => setActiveTab('auctions')}
            className="px-6 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase cursor-pointer"
          >
            Explorar Leilões
          </button>
        </div>
      )}
    </div>
  );
};
