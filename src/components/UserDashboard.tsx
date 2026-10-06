import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerCard } from './StickerCard';
import {
  Gavel,
  Tag,
  Trophy,
  Wallet,
  PlusCircle,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShoppingBag,
} from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    auctions,
    orders,
    setActiveTab,
    setIsCreateModalOpen,
    setSelectedAuction,
    setSelectedOrder,
  } = useAuction();

  if (!currentUser) return null;

  // Compute user metrics
  const userBidsAuctions = auctions.filter((a) =>
    a.bids.some((b) => b.bidderId === currentUser.id) && a.status !== 'ended'
  );

  const winningBidsCount = userBidsAuctions.filter((a) => a.highestBidderId === currentUser.id).length;
  const outbidCount = userBidsAuctions.filter((a) => a.highestBidderId !== currentUser.id).length;

  const myActiveAuctions = auctions.filter((a) => a.sellerId === currentUser.id && a.status !== 'ended');
  const myAuctionsTotalBids = myActiveAuctions.reduce((acc, curr) => acc + curr.bidCount, 0);

  const myOrders = orders.filter((o) => o.winnerId === currentUser.id);
  const pendingPaymentOrders = myOrders.filter((o) => o.status === 'awaiting_payment');

  const endingSoonAuctions = auctions
    .filter((a) => a.status === 'ending_soon')
    .slice(0, 3);

  const outbidAuctions = userBidsAuctions.filter((a) => a.highestBidderId !== currentUser.id);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-black/80">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E054]">Painel do Colecionador</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00E054]/15 border border-[#00E054]/30 text-[#00E054] font-semibold">
              {currentUser.badge}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
            Olá, <span className="text-[#00E054]">{currentUser.name}</span>!
          </h1>
          <p className="text-xs sm:text-sm text-white/60">
            Acompanhe seus lances ao vivo, suas compras e gerencie sua coleção de figurinhas da Copa.
          </p>
        </div>

        {/* Action Buttons: Including normal sales button */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('direct_sales')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-900 border border-[#00E054]/50 hover:border-[#00E054] text-[#00E054] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-[#00E054]" />
            <span>Vendas Normais</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,224,84,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Anunciar</span>
          </button>

          <button
            onClick={() => setActiveTab('album')}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl glass-panel text-white hover:bg-white/15 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#00E054]" />
            <span>Meu Álbum</span>
          </button>
        </div>

        {/* Ambient background glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#00E054]/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Actionable Warning: Outbid Alerts */}
      {outbidCount > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900 border border-[#00E054]/40 text-white text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#00E054] shrink-0" />
            <div>
              <strong className="block text-white font-bold">
                Você foi superado em {outbidCount} {outbidCount === 1 ? 'leilão' : 'leilões'}!
              </strong>
              <span className="text-white/70">Outros colecionadores cobriram seu lance. Volte para cobrir antes que termine.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {outbidAuctions.slice(0, 2).map((auc) => (
              <button
                key={auc.id}
                onClick={() => setSelectedAuction(auc)}
                className="px-3 py-1.5 rounded-lg bg-[#00E054] text-black font-black text-xs whitespace-nowrap active:scale-95 cursor-pointer"
              >
                Cobrir {auc.player.split(' ')[0]}
              </button>
            ))}
            <button
              onClick={() => setActiveTab('my_bids')}
              className="text-xs underline text-[#00E054] ml-2 whitespace-nowrap cursor-pointer"
            >
              Ver todos
            </button>
          </div>
        </div>
      )}

      {/* Pending Checkout Alert */}
      {pendingPaymentOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#00E054] shrink-0" />
            <div>
              <strong className="block text-white font-bold">
                Você venceu {pendingPaymentOrders.length} {pendingPaymentOrders.length === 1 ? 'leilão' : 'leilões'} aguardando pagamento!
              </strong>
              <span className="text-white/70">Finalize o endereço e o frete para o envio da figurinha.</span>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(pendingPaymentOrders[0])}
            className="px-4 py-2 rounded-xl bg-[#00E054] text-black font-black text-xs uppercase tracking-wider shadow active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Pagar Agora
          </button>
        </div>
      )}

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Lances Ativos */}
        <div
          onClick={() => setActiveTab('my_bids')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#00E054]/50 transition-all cursor-pointer group bg-black/60"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Meus Lances</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00E054]">
              <Gavel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {userBidsAuctions.length}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px]">
            <span className="text-[#00E054] font-semibold">{winningBidsCount} vencendo</span>
            <span className="text-white/30">·</span>
            <span className="text-white/50">{outbidCount} superados</span>
          </div>
        </div>

        {/* Card 2: Meus Anúncios */}
        <div
          onClick={() => setActiveTab('my_auctions')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#00E054]/50 transition-all cursor-pointer group bg-black/60"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Meus Anúncios</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00E054]">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {myActiveAuctions.length}
          </div>
          <div className="text-[11px] text-white/50 mt-2">
            {myAuctionsTotalBids} lances e propostas recebidas
          </div>
        </div>

        {/* Card 3: Minhas Vitórias / Compras */}
        <div
          onClick={() => setActiveTab('my_wins')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#00E054]/50 transition-all cursor-pointer group bg-black/60"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">Figurinhas Compradas</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00E054]">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono tabular-nums">
            {myOrders.length}
          </div>
          <div className="text-[11px] text-white/50 mt-2">
            {pendingPaymentOrders.length > 0
              ? `${pendingPaymentOrders.length} aguardando envio`
              : 'Coleção crescendo!'}
          </div>
        </div>

        {/* Card 4: Saldo da Carteira */}
        <div className="glass-panel p-5 rounded-2xl border border-[#00E054]/30 transition-all bg-black/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E054]">Saldo em Carteira</span>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#00E054]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#00E054] font-mono tabular-nums">
            R$ {currentUser.walletBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-white/60 mt-2">
            Disponível para lances e compras imediatas
          </div>
        </div>
      </div>

      {/* Leilões Encerrando em Breve */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E054]" />
            <h2 className="text-lg font-bold text-white font-display">Encerrando em Breve (&lt; 1 hora)</h2>
          </div>
          <button
            onClick={() => setActiveTab('auctions')}
            className="text-xs font-bold text-[#00E054] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {endingSoonAuctions.map((auction) => (
            <StickerCard key={auction.id} auction={auction} />
          ))}
        </div>
      </div>
    </div>
  );
};
