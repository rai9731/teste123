import React from 'react';
import { Auction } from '../types';
import { StickerVisual } from './StickerVisual';
import { useAuction } from '../context/AuctionContext';
import { Clock, Flame, Zap, User, ArrowUpRight, ShoppingBag, Tag } from 'lucide-react';

interface StickerCardProps {
  auction: Auction;
}

export const StickerCard: React.FC<StickerCardProps> = ({ auction }) => {
  const { setSelectedAuction, currentUser, buyDirectly } = useAuction();

  const isDirectSale = auction.listingType === 'direct_sale';

  const now = Date.now();
  const timeLeftMs = Math.max(0, auction.endsAt - now);
  const totalSeconds = Math.floor(timeLeftMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isEnded = auction.status === 'ended' || (!isDirectSale && totalSeconds <= 0);
  const isEndingSoon = !isDirectSale && !isEnded && totalSeconds < 3600; // < 1 hour
  const isCriticalAntiSnip = !isDirectSale && !isEnded && totalSeconds <= 120; // < 2 minutes

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isUserHighestBidder = currentUser && auction.highestBidderId === currentUser.id;
  const isUserSeller = currentUser && auction.sellerId === currentUser.id;

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDirectSale && !isEnded) {
      if (isUserSeller) {
        setSelectedAuction(auction);
      } else {
        buyDirectly(auction.id);
      }
    } else {
      setSelectedAuction(auction);
    }
  };

  return (
    <div
      onClick={() => setSelectedAuction(auction)}
      className="glass-panel group relative rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#00E054]/50 hover:shadow-[0_12px_40px_rgba(0,224,84,0.15)] flex flex-col justify-between cursor-pointer border border-white/10"
    >
      {/* Top badges bar */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        {/* Format / Status indicator badge */}
        {isDirectSale ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E054]/15 border border-[#00E054]/40 text-[#00E054] text-xs font-bold">
            <Tag className="w-3.5 h-3.5" />
            Venda Normal
          </span>
        ) : isEnded ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 text-slate-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            Encerrado
          </span>
        ) : isCriticalAntiSnip ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 border border-red-400 text-white text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Flame className="w-3.5 h-3.5 text-white" />
            Últimos 2 min! (+Anti-Snip)
          </span>
        ) : isEndingSoon ? (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-[#00E054]/60 text-emerald-300 text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-[#00E054] animate-spin" style={{ animationDuration: '6s' }} />
            Encerrando em breve
          </span>
        ) : (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00E054]/15 border border-[#00E054]/40 text-[#00E054] text-xs font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E054] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E054]" />
            </span>
            Leilão Ao Vivo
          </span>
        )}

        {/* Live Timer or Instant Badge */}
        {isDirectSale ? (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/50 text-white/80 border border-white/10 text-xs font-mono">
            <Zap className="w-3 h-3 text-[#00E054]" />
            <span>Pronta Entrega</span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono font-bold text-xs tracking-wider tabular-nums ${
              isEnded
                ? 'bg-black/50 text-slate-500'
                : isCriticalAntiSnip
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-black/50 text-white border border-white/10'
            }`}
          >
            <Clock className="w-3 h-3 text-[#00E054]" />
            {isEnded ? (
              <span>00:00:00</span>
            ) : (
              <span>
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Center card visual preview */}
      <div className="flex justify-center my-2 relative">
        <StickerVisual
          player={auction.player}
          team={auction.team}
          teamFlag={auction.teamFlag}
          stickerNumber={auction.stickerNumber}
          rarity={auction.rarity}
          condition={auction.condition}
          photoUrl={auction.photoUrl}
          size="md"
        />

        {/* User relation badge */}
        {isUserHighestBidder && !isEnded && !isDirectSale && (
          <div className="absolute -bottom-2 bg-[#00E054] text-black text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
            Você está vencendo!
          </div>
        )}
        {isUserSeller && (
          <div className="absolute -bottom-2 bg-zinc-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20 shadow">
            Seu Anúncio
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-2.5">
        <div>
          <h3 className="font-bold text-base text-white truncate group-hover:text-[#00E054] transition-colors flex items-center justify-between">
            <span>{auction.player}</span>
            <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-[#00E054] transition-colors" />
          </h3>
          <p className="text-xs text-white/60 truncate">
            {auction.stickerNumber} · {auction.team} · {auction.rarity}
          </p>
        </div>

        {/* Pricing / Bids stats */}
        <div className="bg-black/60 rounded-xl p-2.5 border border-white/10 space-y-1">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-white/60">
              {isDirectSale ? 'Preço Fixo:' : 'Lance Atual:'}
            </span>
            <span className="text-base font-extrabold text-[#00E054] font-mono tabular-nums">
              {formatCurrency(isDirectSale ? auction.fixedPrice || auction.currentBid : auction.currentBid)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-white/50">
            {isDirectSale ? (
              <span>Envio imediato com seguro</span>
            ) : (
              <>
                <span>
                  {auction.bidCount} {auction.bidCount === 1 ? 'lance' : 'lances'}
                </span>
                <span>Mínimo: +{formatCurrency(auction.minIncrement)}</span>
              </>
            )}
          </div>
        </div>

        {/* Buyout option if available in auction */}
        {!isDirectSale && auction.buyoutPrice && !isEnded && (
          <div className="flex items-center justify-between text-xs px-2 py-1 rounded bg-[#00E054]/10 border border-[#00E054]/30 text-emerald-300">
            <span className="flex items-center gap-1 text-[11px]">
              <Zap className="w-3 h-3 text-[#00E054]" /> Arremate Já:
            </span>
            <span className="font-bold font-mono text-[12px]">{formatCurrency(auction.buyoutPrice)}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleActionClick}
          className={`w-full py-2.5 px-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
            isEnded
              ? 'bg-zinc-800 text-white/60 hover:bg-zinc-700'
              : 'bg-[#00E054] hover:bg-[#00c94b] text-black hover:shadow-[0_0_20px_rgba(0,224,84,0.4)] active:scale-[0.98]'
          }`}
        >
          {isEnded ? (
            <span>Ver Resultado</span>
          ) : isDirectSale ? (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar Agora</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Dar Lance</span>
            </>
          )}
        </button>

        {/* Seller snippet */}
        <div className="flex items-center justify-between text-[11px] text-white/40 pt-1">
          <span className="flex items-center gap-1 truncate max-w-[150px]">
            <User className="w-3 h-3" /> {auction.sellerName}
          </span>
          <span>★ {auction.sellerRating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};
