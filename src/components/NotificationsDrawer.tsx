import React from 'react';
import { useAuction } from '../context/AuctionContext';
import { X, Bell, CheckCheck, Trophy, Flame, ShieldAlert, DollarSign } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    currentUser,
    markNotifAsRead,
    markAllNotifsAsRead,
    setSelectedAuction,
    auctions,
  } = useAuction();

  if (!isOpen) return null;

  const userNotifs = notifications.filter(
    (n) => !currentUser || n.userId === currentUser.id
  );

  const handleOpenAuction = (notifId: string, auctionId?: string) => {
    markNotifAsRead(notifId);
    if (auctionId) {
      const auc = auctions.find((a) => a.id === auctionId);
      if (auc) setSelectedAuction(auc);
    }
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'won':
        return <Trophy className="w-4 h-4 text-[#00E054]" />;
      case 'outbid':
        return <Flame className="w-4 h-4 text-red-400" />;
      case 'auction_extended':
        return <ShieldAlert className="w-4 h-4 text-[#00E054]" />;
      case 'bid_received':
        return <DollarSign className="w-4 h-4 text-[#00E054]" />;
      default:
        return <Bell className="w-4 h-4 text-[#00E054]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/15 shadow-2xl flex flex-col justify-between animate-slideIn bg-black/95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#00E054]" />
            <h2 className="text-base font-bold text-white font-display">Notificações</h2>
          </div>

          <div className="flex items-center gap-2">
            {userNotifs.some((n) => !n.read) && (
              <button
                onClick={markAllNotifsAsRead}
                className="text-[11px] text-[#00E054] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Marcar todas lidas</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 divide-y divide-white/5 p-3 space-y-1">
          {userNotifs.length === 0 ? (
            <div className="p-10 text-center text-xs text-white/40 space-y-2">
              <Bell className="w-8 h-8 mx-auto opacity-30 text-[#00E054]" />
              <p>Nenhuma notificação por enquanto.</p>
            </div>
          ) : (
            userNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => handleOpenAuction(n.id, n.auctionId)}
                className={`p-3.5 rounded-2xl flex items-start gap-3 transition-colors cursor-pointer ${
                  n.read ? 'bg-black/30 hover:bg-white/5' : 'bg-[#00E054]/10 hover:bg-[#00E054]/15 border border-[#00E054]/25'
                }`}
              >
                <div className="p-2 rounded-xl bg-black/60 border border-white/10 shrink-0 mt-0.5">
                  {getIcon(n.type)}
                </div>

                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-white truncate">{n.title}</p>
                    <span className="text-[10px] text-white/40 font-mono">
                      {new Date(n.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 text-center text-[11px] text-white/40 bg-black/40">
          Notificações automáticas de lances, arremates e segurança
        </div>
      </div>
    </div>
  );
};
