import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerVisual } from './StickerVisual';
import {
  X,
  Clock,
  Flame,
  ShieldAlert,
  Zap,
  History,
  MessageSquare,
  AlertCircle,
  Share2,
  CheckCircle2,
  Bot,
  User,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react';

export const AuctionDetailModal: React.FC = () => {
  const {
    selectedAuction,
    setSelectedAuction,
    currentUser,
    placeBid,
    buyoutAuction,
    buyDirectly,
    createOrOpenChat,
    showToast,
    setIsLoginModalOpen,
  } = useAuction();

  if (!selectedAuction) return null;

  const auction = selectedAuction;
  const isDirectSale = auction.listingType === 'direct_sale';

  const now = Date.now();
  const timeLeftMs = Math.max(0, auction.endsAt - now);
  const totalSeconds = Math.floor(timeLeftMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isEnded = auction.status === 'ended' || (!isDirectSale && totalSeconds <= 0);
  const isEndingSoon = !isDirectSale && !isEnded && totalSeconds < 3600;
  const isAntiSnipZone = !isDirectSale && !isEnded && totalSeconds <= 120; // Last 2 minutes!

  const minBidAllowed = auction.currentBid + auction.minIncrement;

  const [bidAmount, setBidAmount] = useState<string>(minBidAllowed.toFixed(2));
  const [isAutoBid, setIsAutoBid] = useState<boolean>(false);
  const [autoBidMax, setAutoBidMax] = useState<string>((minBidAllowed * 1.5).toFixed(2));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const isOwnAuction = currentUser && currentUser.id === auction.sellerId;
  const isUserWinning = currentUser && currentUser.id === auction.highestBidderId;

  const handleQuickAdd = (increment: number) => {
    const current = parseFloat(bidAmount) || minBidAllowed;
    const next = Math.max(minBidAllowed, current + increment);
    setBidAmount(next.toFixed(2));
    setErrorMsg(null);
  };

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    const val = parseFloat(bidAmount);
    if (isNaN(val) || val < minBidAllowed) {
      setErrorMsg(
        `O lance deve ser de no mínimo ${formatCurrency(minBidAllowed)} (Lance atual + incremento de ${formatCurrency(
          auction.minIncrement
        )}).`
      );
      return;
    }

    if (isOwnAuction) {
      setErrorMsg('Regra CopaBR: Você não pode dar lances no seu próprio anúncio.');
      return;
    }

    const res = placeBid(auction.id, val, isAutoBid, isAutoBid ? parseFloat(autoBidMax) : undefined);
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setBidAmount((val + auction.minIncrement).toFixed(2));
    }
  };

  const handleBuyout = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    buyoutAuction(auction.id);
  };

  const handleDirectBuy = () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }
    buyDirectly(auction.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Link da figurinha copiado para a área de transferência!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl my-6 glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] bg-black/95">
        {/* Header Modal Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/60 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">{auction.teamFlag}</span>
            <div>
              <h2 className="text-lg font-black text-white font-display flex items-center gap-2">
                <span>{auction.player}</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white/70">
                  {auction.stickerNumber}
                </span>
                {isDirectSale && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#00E054]/20 border border-[#00E054]/40 text-[#00E054] font-bold">
                    Venda Normal
                  </span>
                )}
              </h2>
              <p className="text-xs text-white/60">
                Seleção de {auction.team} · {auction.rarity} · {auction.condition}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors cursor-pointer"
              title="Compartilhar Figurinha"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedAuction(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          {/* Top Banner: Anti-Sniping Alert or Finished Banner */}
          {isAntiSnipZone && (
            <div className="p-3.5 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-3 animate-pulse">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <div>
                <span className="font-bold uppercase tracking-wider block">Regra Anti-Sniping Ativa!</span>
                <span>
                  Qualquer lance nos últimos 2 minutos prorrogará o tempo deste leilão em mais 2 minutos automaticamente.
                </span>
              </div>
            </div>
          )}

          {isEnded && (
            <div className="p-4 rounded-2xl bg-zinc-900 border border-white/15 text-white text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#00E054]" />
                <div>
                  <p className="font-bold text-sm">
                    {isDirectSale ? 'Item Vendido' : 'Leilão Finalizado'}
                  </p>
                  <p className="text-white/60">
                    {isDirectSale
                      ? `Arrematado por preço fixo de ${formatCurrency(auction.fixedPrice || auction.currentBid)}`
                      : auction.reserveMet !== false && auction.highestBidderMaskedName
                      ? `Arrematado por ${auction.highestBidderMaskedName} pelo valor de ${formatCurrency(auction.currentBid)}`
                      : 'Encerrado sem atingir o preço de reserva do vendedor.'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 font-bold uppercase text-[10px]">
                Fechado
              </span>
            </div>
          )}

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Sticker Presentation */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative p-3 rounded-2xl bg-black/60 border border-white/10 shadow-inner flex justify-center w-full">
                <StickerVisual
                  player={auction.player}
                  team={auction.team}
                  teamFlag={auction.teamFlag}
                  stickerNumber={auction.stickerNumber}
                  position={auction.position}
                  rarity={auction.rarity}
                  condition={auction.condition}
                  photoUrl={auction.photoUrl}
                  size="xl"
                  className="shadow-2xl"
                />
              </div>

              {/* Seller mini card */}
              <div className="w-full mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={auction.sellerAvatar}
                    alt={auction.sellerName}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <p className="text-xs font-bold text-white flex items-center gap-1">
                      {auction.sellerName}
                      <span className="text-[10px] text-[#00E054]">★ {auction.sellerRating.toFixed(1)}</span>
                    </p>
                    <p className="text-[10px] text-white/50">Vendedor Verificado CopaBR</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => createOrOpenChat(auction.id, auction.sellerId)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00E054]" />
                  <span>Mensagem</span>
                </button>
              </div>

              {/* Description */}
              <div className="w-full mt-3 p-3 rounded-xl bg-black/40 text-xs text-white/70 leading-relaxed border border-white/5">
                <p className="font-semibold text-white/90 mb-1">Detalhes do Colecionador:</p>
                <p>{auction.description}</p>
              </div>
            </div>

            {/* Right Column: Interaction Arena */}
            <div className="md:col-span-7 space-y-4">
              {/* If Direct Sale (Venda Normal): Render Direct Purchase Arena */}
              {isDirectSale ? (
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl glass-panel border border-[#00E054]/40 bg-black/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00E054]">
                        <Tag className="w-4 h-4" /> Venda Normal (Preço Fixo)
                      </span>
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                        Disponível
                      </span>
                    </div>

                    <div className="pt-2">
                      <span className="text-xs uppercase text-white/50 block font-semibold">Valor da Figurinha</span>
                      <div className="text-4xl font-black text-[#00E054] font-mono tabular-nums">
                        {formatCurrency(auction.fixedPrice || auction.currentBid)}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-white/70">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#00E054]" />
                        <span>Envio imediato com seguro contra extravios ou dobras</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#00E054]" />
                        <span>Sem necessidade de lances ou contagem regressiva</span>
                      </div>
                    </div>
                  </div>

                  {!isEnded && (
                    <div className="space-y-2">
                      {isOwnAuction ? (
                        <div className="p-3 rounded-xl bg-zinc-900 border border-white/20 text-white/70 text-xs">
                          Este é seu próprio anúncio de venda normal.
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleDirectBuy}
                          className="w-full py-4 px-6 rounded-2xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,224,84,0.35)] active:scale-95 transition-all cursor-pointer"
                        >
                          <ShoppingBag className="w-5 h-5 text-black" />
                          <span>Comprar Agora por {formatCurrency(auction.fixedPrice || auction.currentBid)}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Auction Arena (Leilão) */
                <div className="space-y-4">
                  {/* Countdown clock box */}
                  <div className="p-4 rounded-2xl bg-black/60 border border-white/15 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-5 h-5 ${
                          isEnded ? 'text-slate-400' : 'text-[#00E054]'
                        }`}
                      />
                      <div>
                        <span className="text-[11px] uppercase font-bold tracking-wider text-white/50 block">
                          Tempo Restante
                        </span>
                        <span
                          className={`text-2xl font-black font-mono tracking-wider tabular-nums ${
                            isEnded
                              ? 'text-slate-400'
                              : isAntiSnipZone
                              ? 'text-red-400'
                              : 'text-white'
                          }`}
                        >
                          {isEnded
                            ? 'Leilão Encerrado'
                            : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
                                seconds
                              ).padStart(2, '0')}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-white/50 block">Total de lances</span>
                      <span className="text-base font-extrabold text-[#00E054] font-mono">
                        {auction.bidCount} {auction.bidCount === 1 ? 'lance' : 'lances'}
                      </span>
                    </div>
                  </div>

                  {/* Current Bid Display */}
                  <div className="p-5 rounded-2xl glass-panel border border-[#00E054]/30 space-y-3 bg-black/80">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs uppercase font-bold text-white/70 tracking-wider">Lance Atual</span>
                        <div className="text-3xl font-black text-[#00E054] font-mono tabular-nums">
                          {formatCurrency(auction.currentBid)}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-white/50 block">Maior Licitante:</span>
                        <span className="text-sm font-bold text-white font-mono bg-black/60 px-2.5 py-1 rounded-lg border border-white/10 inline-block mt-0.5">
                          {auction.highestBidderMaskedName || 'Nenhum lance'}
                        </span>
                      </div>
                    </div>

                    {isUserWinning && (
                      <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Você é o licitante com o maior lance no momento!</span>
                      </div>
                    )}

                    {/* Minimum Next Bid Info */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10 text-white/70">
                      <span>
                        Próximo lance mínimo:{' '}
                        <strong className="text-white font-mono">{formatCurrency(minBidAllowed)}</strong>
                      </span>
                      <span>
                        Incremento: <strong className="text-white">+{formatCurrency(auction.minIncrement)}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Buyout Section (if seller set it and auction is active) */}
                  {auction.buyoutPrice && !isEnded && (
                    <div className="p-3.5 rounded-2xl bg-zinc-900 border border-[#00E054]/30 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-[#00E054]" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase tracking-wide">
                            Arremate Imediato (Comprar Já)
                          </p>
                          <p className="text-[11px] text-white/60">
                            Pague o valor estipulado e garanta a figurinha agora mesmo sem esperar o fim do leilão.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleBuyout}
                        className="ml-3 px-4 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider whitespace-nowrap shadow-md active:scale-95 transition-all cursor-pointer"
                      >
                        Arrematar por {formatCurrency(auction.buyoutPrice)}
                      </button>
                    </div>
                  )}

                  {/* Bidding Form */}
                  {!isEnded ? (
                    <form onSubmit={handleBidSubmit} className="space-y-3 pt-1">
                      {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-shake">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      {isOwnAuction ? (
                        <div className="p-3 rounded-xl bg-zinc-900 border border-white/15 text-white/70 text-xs">
                          Este é o seu próprio leilão. Você pode acompanhar os lances recebidos e responder mensagens de compradores.
                        </div>
                      ) : (
                        <>
                          {/* Quick increment buttons */}
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-white/50 whitespace-nowrap">Aumentar:</span>
                            {[5, 10, 25, 50].map((inc) => (
                              <button
                                key={inc}
                                type="button"
                                onClick={() => handleQuickAdd(inc)}
                                className="flex-1 py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-mono font-bold text-xs transition-colors cursor-pointer"
                              >
                                +{inc}
                              </button>
                            ))}
                          </div>

                          {/* Manual Bid Input and CTA */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50 font-bold text-sm">
                                R$
                              </span>
                              <input
                                type="number"
                                step="any"
                                value={bidAmount}
                                onChange={(e) => {
                                  setBidAmount(e.target.value);
                                  setErrorMsg(null);
                                }}
                                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-base font-mono font-bold text-white"
                              />
                            </div>

                            <button
                              type="submit"
                              className="px-6 py-3 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(0,224,84,0.35)] active:scale-95 transition-all whitespace-nowrap cursor-pointer"
                            >
                              <Flame className="w-4 h-4 text-black" />
                              <span>Confirmar Lance</span>
                            </button>
                          </div>

                          {/* Auto-bid option simulator */}
                          <div className="pt-1">
                            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={isAutoBid}
                                onChange={(e) => setIsAutoBid(e.target.checked)}
                                className="rounded border-white/20 text-[#00E054] focus:ring-[#00E054]"
                              />
                              <span className="flex items-center gap-1">
                                <Bot className="w-3.5 h-3.5 text-[#00E054]" />
                                <span>Ativar Lance Automático (cobrir lances até um teto máximo)</span>
                              </span>
                            </label>

                            {isAutoBid && (
                              <div className="mt-2 p-2.5 rounded-xl bg-black/50 border border-white/10 flex items-center gap-3">
                                <span className="text-[11px] text-white/60">Limite Máximo:</span>
                                <input
                                  type="number"
                                  value={autoBidMax}
                                  onChange={(e) => setAutoBidMax(e.target.value)}
                                  className="px-2 py-1 rounded bg-black/70 text-white font-mono text-xs w-28 border border-white/20"
                                />
                                <span className="text-[10px] text-white/40">
                                  O sistema ofertará o menor incremento necessário até este teto.
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </form>
                  ) : null}

                  {/* Bid History Table */}
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <History className="w-4 h-4 text-[#00E054]" />
                        <span>Histórico de Lances</span>
                      </span>
                      <span className="text-[11px] text-white/40">{auction.bids.length} registros</span>
                    </div>

                    <div className="max-h-40 overflow-y-auto rounded-xl bg-black/40 border border-white/10 divide-y divide-white/5">
                      {auction.bids.length === 0 ? (
                        <div className="p-4 text-center text-xs text-white/40">
                          Nenhum lance ofertado ainda. Seja o primeiro a licitar!
                        </div>
                      ) : (
                        auction.bids.map((bid, i) => {
                          const dateStr = new Date(bid.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          });
                          const isTop = i === 0;

                          return (
                            <div
                              key={bid.id}
                              className={`flex items-center justify-between px-3 py-2 text-xs ${
                                isTop ? 'bg-[#00E054]/15 text-white font-bold' : 'text-white/70'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-white/40" />
                                <span className="font-mono">{bid.bidderMaskedName}</span>
                                {isTop && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#00E054] text-black font-black">
                                    Maior Lance
                                  </span>
                                )}
                                {bid.isAutoBid && (
                                  <span className="text-[9px] text-[#00E054] flex items-center gap-0.5">
                                    <Bot className="w-2.5 h-2.5" /> Auto
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-mono tabular-nums text-white">
                                  {formatCurrency(bid.amount)}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">{dateStr}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
