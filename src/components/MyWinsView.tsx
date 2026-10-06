import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { Trophy, Truck, CheckCircle2, Clock, Copy, ArrowRight } from 'lucide-react';

export const MyWinsView: React.FC = () => {
  const { orders, currentUser, setSelectedOrder, showToast, setActiveTab } = useAuction();

  if (!currentUser) return null;

  const myOrders = orders.filter((o) => o.winnerId === currentUser.id);

  const handleCopyTracking = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Código de rastreamento ${code} copiado!`, 'success');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display">Minhas Compras & Vitórias</h1>
          <p className="text-xs sm:text-sm text-white/60">
            Figurinhas arrematadas em leilões ou compradas por venda normal no CopaBR.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('album')}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
        >
          Ver Álbum Virtual
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-white/10 space-y-3 bg-black/60">
          <Trophy className="w-10 h-10 text-white/40 mx-auto" />
          <h3 className="font-bold text-white text-base">Você ainda não arrematou figurinhas.</h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            Participe dos leilões ou compre diretamente nas vendas normais para enriquecer seu álbum!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('auctions')}
              className="px-6 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase cursor-pointer"
            >
              Explorar Leilões
            </button>
            <button
              onClick={() => setActiveTab('direct_sales')}
              className="px-6 py-2.5 rounded-xl bg-zinc-900 border border-[#00E054]/50 text-[#00E054] font-bold text-xs uppercase cursor-pointer"
            >
              Vendas Normais
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myOrders.map((order) => {
            const isPaid = order.status === 'paid' || order.status === 'shipped';

            return (
              <div
                key={order.id}
                className="glass-panel p-5 rounded-2xl border border-white/15 space-y-4 flex flex-col justify-between bg-black/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={order.photoUrl}
                      alt={order.stickerTitle}
                      className="w-14 h-18 object-cover rounded-xl border border-white/20 shadow-md"
                    />
                    <div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#00E054] font-bold">
                        {order.stickerNumber}
                      </span>
                      <h3 className="font-bold text-white text-sm mt-1">{order.stickerTitle}</h3>
                      <p className="text-xs text-white/50">Vendedor: {order.sellerName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isPaid
                        ? 'bg-[#00E054]/20 text-[#00E054] border border-[#00E054]/40'
                        : 'bg-zinc-800 text-zinc-300 border border-white/20'
                    }`}
                  >
                    {isPaid ? 'Pago & Em Envio' : 'Aguardando Pagamento'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Valor:</span>
                    <span className="font-bold font-mono text-[#00E054]">
                      R$ {order.amount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Método de Envio:</span>
                    <span className="text-white/80">{order.shippingMethod}</span>
                  </div>

                  {order.trackingCode && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-white/60 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-[#00E054]" /> Rastreamento:
                      </span>
                      <button
                        onClick={() => handleCopyTracking(order.trackingCode!)}
                        className="font-mono text-[#00E054] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>{order.trackingCode}</span>
                        <Copy className="w-3 h-3 text-white/40" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  {!isPaid ? (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow active:scale-95 transition-all cursor-pointer"
                    >
                      <span>Finalizar Pagamento e Endereço</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs text-white/70 px-1">
                      <span className="flex items-center gap-1 text-[#00E054] font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Figurinha a caminho do seu endereço
                      </span>
                      <span className="text-[11px] text-white/40">Entrega garantida</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
