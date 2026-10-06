import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Auction,
  Bid,
  NotificationItem,
  AlbumSticker,
  MessageThread,
  Order,
  Rarity,
  Condition,
} from '../types';
import {
  MOCK_USERS,
  INITIAL_AUCTIONS,
  MOCK_ALBUM_STICKERS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_THREADS,
} from '../data/mockData';

interface AuctionContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  auctions: Auction[];
  selectedAuction: Auction | null;
  setSelectedAuction: (auction: Auction | null) => void;
  placeBid: (
    auctionId: string,
    amount: number,
    isAutoBid?: boolean,
    autoBidMax?: number
  ) => { success: boolean; message: string; extended?: boolean };
  buyoutAuction: (auctionId: string) => { success: boolean; message: string };
  buyDirectly: (auctionId: string) => { success: boolean; message: string };
  createAuction: (data: {
    listingType?: 'auction' | 'direct_sale';
    title: string;
    stickerNumber: string;
    team: string;
    teamFlag: string;
    player: string;
    position: string;
    rarity: Rarity;
    condition: Condition;
    photoUrl: string;
    description: string;
    startingBid: number;
    minIncrement: number;
    fixedPrice?: number;
    buyoutPrice?: number;
    reservePrice?: number;
    durationHours: number;
  }) => { success: boolean; auctionId: string };
  cancelAuctionByAdmin: (auctionId: string) => void;
  toggleFeatureAuction: (auctionId: string) => void;
  orders: Order[];
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  payOrder: (
    orderId: string,
    paymentMethod: string,
    address: { street: string; number: string; city: string; state: string; zipCode: string }
  ) => { success: boolean };
  albumStickers: AlbumSticker[];
  toggleStickerStatus: (stickerId: string) => void;
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotifAsRead: (id: string) => void;
  markAllNotifsAsRead: () => void;
  messageThreads: MessageThread[];
  sendMessage: (threadId: string, text: string) => void;
  createOrOpenChat: (auctionId: string, sellerId: string) => string;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | 'warning' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user defaults to Ana Silva for immediate preview, or null if landing page preferred
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[1]); // Default to Ana Silva
  const [users] = useState<User[]>(MOCK_USERS);
  const [auctions, setAuctions] = useState<Auction[]>(INITIAL_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [albumStickers, setAlbumStickers] = useState<AlbumSticker[]>(MOCK_ALBUM_STICKERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('dashboard'); // 'landing', 'dashboard', 'auctions', 'my_bids', 'my_auctions', 'my_wins', 'album', 'messages', 'admin'
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keep selected auction in sync with state updates
  useEffect(() => {
    if (selectedAuction) {
      const updated = auctions.find((a) => a.id === selectedAuction.id);
      if (updated) setSelectedAuction(updated);
    }
  }, [auctions]);

  // Master Clock: updates every second to handle countdowns, ending status, and anti-sniping timers
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setAuctions((prev) =>
        prev.map((auc) => {
          if (auc.status === 'ended') return auc;

          const timeLeft = auc.endsAt - now;

          // Check if ended
          if (timeLeft <= 0) {
            const hasReserve = (auc.reservePrice || 0) > 0;
            const reserveMet = !hasReserve || auc.currentBid >= (auc.reservePrice || 0);
            const winnerId = reserveMet && auc.highestBidderId ? auc.highestBidderId : undefined;

            // Trigger end-of-auction order and notifications if there is a winner
            if (winnerId) {
              // Create pending order
              const newOrder: Order = {
                id: `ord_${Date.now()}_${auc.id}`,
                auctionId: auc.id,
                stickerTitle: auc.title,
                stickerNumber: auc.stickerNumber,
                team: auc.team,
                rarity: auc.rarity,
                photoUrl: auc.photoUrl,
                winnerId: winnerId,
                sellerId: auc.sellerId,
                sellerName: auc.sellerName,
                amount: auc.currentBid,
                shippingFee: 14.0,
                shippingMethod: 'Carta Registrada c/ Seguro Colecionador',
                status: 'awaiting_payment',
                address: {
                  street: 'Rua das Laranjeiras',
                  number: '450',
                  city: 'São Paulo',
                  state: 'SP',
                  zipCode: '01000-000',
                },
                createdAt: now,
              };

              setOrders((ords) => [newOrder, ...ords]);

              // Notify winner
              setNotifications((prevNotifs) => [
                {
                  id: `notif_won_${Date.now()}`,
                  userId: winnerId,
                  type: 'won',
                  title: '🏆 Parabéns! Você arrematou um leilão!',
                  message: `Você arrematou "${auc.title}" por R$ ${auc.currentBid.toFixed(2)}. Conclua o pagamento para receber a figurinha.`,
                  auctionId: auc.id,
                  timestamp: now,
                  read: false,
                },
                ...prevNotifs,
              ]);

              // Notify seller
              setNotifications((prevNotifs) => [
                {
                  id: `notif_sold_${Date.now()}`,
                  userId: auc.sellerId,
                  type: 'won',
                  title: '🎉 Seu leilão foi encerrado com sucesso!',
                  message: `Seu leilão "${auc.title}" foi arrematado por R$ ${auc.currentBid.toFixed(2)}. O comprador já foi notificado para o pagamento.`,
                  auctionId: auc.id,
                  timestamp: now,
                  read: false,
                },
                ...prevNotifs,
              ]);
            } else if (!reserveMet && auc.highestBidderId) {
              // Reserve not met
              setNotifications((prevNotifs) => [
                {
                  id: `notif_res_fail_${Date.now()}`,
                  userId: auc.sellerId,
                  type: 'system',
                  title: '⚠️ Leilão encerrado sem atingir reserva',
                  message: `O leilão "${auc.title}" encerrou em R$ ${auc.currentBid.toFixed(2)}, abaixo do preço de reserva de R$ ${(auc.reservePrice || 0).toFixed(2)}. Não houve vencedor.`,
                  auctionId: auc.id,
                  timestamp: now,
                  read: false,
                },
                ...prevNotifs,
              ]);
            }

            return {
              ...auc,
              status: 'ended',
              winnerId,
              finalPrice: auc.currentBid,
              reserveMet,
            };
          }

          // Check if ending soon (< 1 hour = 3600 seconds)
          if (timeLeft <= 3600 * 1000 && auc.status !== 'ending_soon') {
            return {
              ...auc,
              status: 'ending_soon',
            };
          }

          return auc;
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Login handler
  const login = (email: string, pass: string): { success: boolean; error?: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!user) {
      return { success: false, error: 'Usuário não encontrado. Use um dos atalhos de demonstração.' };
    }

    if (pass !== '123456') {
      return { success: false, error: 'Senha incorreta. A senha para todos os usuários de teste é 123456.' };
    }

    setCurrentUser(user);
    setIsLoginModalOpen(false);

    if (user.role === 'admin') {
      setActiveTab('admin');
      showToast(`Bem-vindo, Administrador ${user.name}! Painel carregado.`, 'success');
    } else {
      setActiveTab('dashboard');
      showToast(`Olá, ${user.name}! Login efetuado com sucesso.`, 'success');
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('landing');
    showToast('Você saiu da sua conta CopaBR.', 'info');
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Perfil alterado para ${user.name} (${user.badge})`, 'success');
    }
  };

  // Place Bid handler with anti-sniping and validations
  const placeBid = (
    auctionId: string,
    amount: number,
    isAutoBid = false,
    _autoBidMax?: number
  ): { success: boolean; message: string; extended?: boolean } => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return { success: false, message: 'Você precisa entrar na sua conta para dar lances.' };
    }

    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) {
      return { success: false, message: 'Leilão não encontrado.' };
    }

    if (auction.status === 'ended' || auction.endsAt <= Date.now()) {
      return { success: false, message: 'Este leilão já foi finalizado.' };
    }

    if (auction.sellerId === currentUser.id) {
      return { success: false, message: 'Você não pode dar lances no seu próprio leilão.' };
    }

    const minAllowed = auction.currentBid + auction.minIncrement;
    if (amount < minAllowed) {
      return {
        success: false,
        message: `Lance inválido! O valor mínimo para este leilão é R$ ${minAllowed.toFixed(2)} (Lance atual + R$ ${auction.minIncrement.toFixed(2)}).`,
      };
    }

    const now = Date.now();
    const remainingTimeMs = auction.endsAt - now;
    let extended = false;
    let newEndsAt = auction.endsAt;

    // ANTI-SNIPING RULE: If bid placed in last 2 minutes (120,000 ms), extend by 2 minutes
    if (remainingTimeMs > 0 && remainingTimeMs <= 120 * 1000) {
      newEndsAt = auction.endsAt + 120 * 1000;
      extended = true;
    }

    // Previous highest bidder notification
    const prevBidderId = auction.highestBidderId;
    if (prevBidderId && prevBidderId !== currentUser.id) {
      setNotifications((prev) => [
        {
          id: `notif_outbid_${Date.now()}`,
          userId: prevBidderId,
          type: 'outbid',
          title: '⚡ Seu lance foi superado!',
          message: `Um novo lance de R$ ${amount.toFixed(2)} superou o seu no leilão "${auction.title}". Volte para cobrir o lance!`,
          auctionId: auction.id,
          timestamp: now,
          read: false,
        },
        ...prev,
      ]);
    }

    // Seller notification
    setNotifications((prev) => [
      {
        id: `notif_bid_rec_${Date.now()}`,
        userId: auction.sellerId,
        type: 'bid_received',
        title: '💰 Novo lance recebido!',
        message: `${currentUser.name} deu um lance de R$ ${amount.toFixed(2)} no seu leilão "${auction.title}".`,
        auctionId: auction.id,
        timestamp: now,
        read: false,
      },
      ...prev,
    ]);

    // Anti-sniping notification
    if (extended) {
      setNotifications((prev) => [
        {
          id: `notif_ext_${Date.now()}`,
          userId: currentUser.id,
          type: 'auction_extended',
          title: '🛡️ Anti-sniping ativado!',
          message: `Lance realizado nos últimos 2 minutos. O leilão "${auction.title}" foi estendido em +2 minutos para garantir disputa justa.`,
          auctionId: auction.id,
          timestamp: now,
          read: false,
        },
        ...prev,
      ]);
    }

    // Helper to mask name (e.g., "Ana Silva" -> "a***a")
    const masked = `${currentUser.name.charAt(0).toLowerCase()}***${currentUser.name.slice(-1).toLowerCase()}`;

    const newBid: Bid = {
      id: `bid_${Date.now()}`,
      auctionId: auction.id,
      bidderId: currentUser.id,
      bidderMaskedName: masked,
      bidderAvatar: currentUser.avatar,
      amount,
      timestamp: now,
      isAutoBid,
    };

    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== auction.id) return auc;

        const reserveMet = auc.reservePrice ? amount >= auc.reservePrice : true;

        return {
          ...auc,
          currentBid: amount,
          highestBidderId: currentUser.id,
          highestBidderMaskedName: masked,
          bidCount: auc.bidCount + 1,
          bids: [newBid, ...auc.bids],
          endsAt: newEndsAt,
          extendedCount: (auc.extendedCount || 0) + (extended ? 1 : 0),
          reserveMet,
        };
      })
    );

    const successMsg = extended
      ? `Lance de R$ ${amount.toFixed(2)} confirmado! 🛡️ Regra Anti-sniping ativada: prazo prorrogado em +2 min.`
      : `Lance de R$ ${amount.toFixed(2)} registrado com sucesso!`;

    showToast(successMsg, 'success');
    return { success: true, message: successMsg, extended };
  };

  // Immediate Buyout
  const buyoutAuction = (auctionId: string): { success: boolean; message: string } => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return { success: false, message: 'Faça login para arrematar.' };
    }

    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return { success: false, message: 'Leilão inexistente.' };

    if (!auction.buyoutPrice) {
      return { success: false, message: 'Este leilão não possui a opção de Arremate Imediato.' };
    }

    const buyoutValue = auction.buyoutPrice;

    if (auction.sellerId === currentUser.id) {
      return { success: false, message: 'Você não pode arrematar o seu próprio leilão.' };
    }

    const now = Date.now();
    const masked = `${currentUser.name.charAt(0).toLowerCase()}***${currentUser.name.slice(-1).toLowerCase()}`;

    const finalBid: Bid = {
      id: `bid_buyout_${now}`,
      auctionId: auction.id,
      bidderId: currentUser.id,
      bidderMaskedName: masked,
      bidderAvatar: currentUser.avatar,
      amount: buyoutValue,
      timestamp: now,
    };

    // Create Order
    const newOrder: Order = {
      id: `ord_buyout_${now}`,
      auctionId: auction.id,
      stickerTitle: auction.title,
      stickerNumber: auction.stickerNumber,
      team: auction.team,
      rarity: auction.rarity,
      photoUrl: auction.photoUrl,
      winnerId: currentUser.id,
      sellerId: auction.sellerId,
      sellerName: auction.sellerName,
      amount: buyoutValue,
      shippingFee: 14.0,
      shippingMethod: 'Sedex Rápido Especial Colecionador',
      status: 'awaiting_payment',
      address: {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
      },
      createdAt: now,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // End auction
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== auction.id) return auc;
        return {
          ...auc,
          status: 'ended',
          currentBid: buyoutValue,
          highestBidderId: currentUser.id,
          highestBidderMaskedName: masked,
          winnerId: currentUser.id,
          finalPrice: buyoutValue,
          reserveMet: true,
          endsAt: now,
          bids: [finalBid, ...auc.bids],
          bidCount: auc.bidCount + 1,
        };
      })
    );

    // Notifications
    setNotifications((prev) => [
      {
        id: `notif_buyout_won_${now}`,
        userId: currentUser.id,
        type: 'won',
        title: '⚡ Arremate Imediato Realizado!',
        message: `Você arrematou "${auction.title}" pelo valor de compra imediata de R$ ${buyoutValue.toFixed(2)}.`,
        auctionId: auction.id,
        timestamp: now,
        read: false,
      },
      {
        id: `notif_buyout_sold_${now}`,
        userId: auction.sellerId,
        type: 'won',
        title: '🎉 Arremate Imediato no seu leilão!',
        message: `${currentUser.name} acionou o Arremate Imediato de R$ ${buyoutValue.toFixed(2)} em "${auction.title}".`,
        auctionId: auction.id,
        timestamp: now,
        read: false,
      },
      ...prev,
    ]);

    setSelectedOrder(newOrder);
    showToast(`Arremate Imediato de R$ ${buyoutValue.toFixed(2)} confirmado! Siga para o pagamento.`, 'success');

    return { success: true, message: 'Arrematado com sucesso!' };
  };

  // Direct Normal Sale (Venda Normal / Preço Fixo)
  const buyDirectly = (auctionId: string): { success: boolean; message: string } => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return { success: false, message: 'Faça login para comprar.' };
    }

    const listing = auctions.find((a) => a.id === auctionId);
    if (!listing) return { success: false, message: 'Anúncio não encontrado.' };

    if (listing.sellerId === currentUser.id) {
      return { success: false, message: 'Você não pode comprar sua própria figurinha.' };
    }

    const now = Date.now();
    const price = listing.fixedPrice || listing.currentBid;
    const masked = `${currentUser.name.charAt(0).toLowerCase()}***${currentUser.name.slice(-1).toLowerCase()}`;

    // Create Order
    const newOrder: Order = {
      id: `ord_direct_${now}`,
      auctionId: listing.id,
      stickerTitle: listing.title,
      stickerNumber: listing.stickerNumber,
      team: listing.team,
      rarity: listing.rarity,
      photoUrl: listing.photoUrl,
      winnerId: currentUser.id,
      sellerId: listing.sellerId,
      sellerName: listing.sellerName,
      amount: price,
      shippingFee: 14.0,
      shippingMethod: 'Carta Registrada com Seguro Colecionador',
      status: 'awaiting_payment',
      address: {
        street: 'Av. Paulista',
        number: '1000',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01310-100',
      },
      createdAt: now,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // End listing
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== listing.id) return auc;
        return {
          ...auc,
          status: 'ended',
          winnerId: currentUser.id,
          finalPrice: price,
          endsAt: now,
        };
      })
    );

    // Notifications
    setNotifications((prev) => [
      {
        id: `notif_direct_buy_${now}`,
        userId: currentUser.id,
        type: 'won',
        title: '🛍️ Figurinha Comprada!',
        message: `Você comprou "${listing.title}" por R$ ${price.toFixed(2)}. Prossiga com o pagamento do frete.`,
        auctionId: listing.id,
        timestamp: now,
        read: false,
      },
      {
        id: `notif_direct_sold_${now}`,
        userId: listing.sellerId,
        type: 'won',
        title: '🎉 Venda Realizada!',
        message: `${currentUser.name} comprou "${listing.title}" por R$ ${price.toFixed(2)}.`,
        auctionId: listing.id,
        timestamp: now,
        read: false,
      },
      ...prev,
    ]);

    setSelectedOrder(newOrder);
    showToast(`Compra de R$ ${price.toFixed(2)} efetuada! Conclua o endereço de entrega.`, 'success');
    return { success: true, message: 'Compra realizada!' };
  };

  // Create Auction or Direct Sale
  const createAuction = (data: {
    listingType?: 'auction' | 'direct_sale';
    title: string;
    stickerNumber: string;
    team: string;
    teamFlag: string;
    player: string;
    position: string;
    rarity: Rarity;
    condition: Condition;
    photoUrl: string;
    description: string;
    startingBid: number;
    minIncrement: number;
    fixedPrice?: number;
    buyoutPrice?: number;
    reservePrice?: number;
    durationHours: number;
  }) => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return { success: false, auctionId: '' };
    }

    const now = Date.now();
    const durationMs = data.durationHours * 3600 * 1000;
    const endsAt = now + durationMs;
    const isDirect = data.listingType === 'direct_sale';

    const price = isDirect && data.fixedPrice ? Number(data.fixedPrice) : data.startingBid;

    const newAuctionId = `${isDirect ? 'sale' : 'auc'}_${Date.now()}`;
    const newAuction: Auction = {
      id: newAuctionId,
      listingType: data.listingType || 'auction',
      title: data.title,
      stickerNumber: data.stickerNumber,
      team: data.team,
      teamFlag: data.teamFlag,
      player: data.player,
      position: data.position,
      rarity: data.rarity,
      condition: data.condition,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80',
      description: data.description,
      sellerId: currentUser.id,
      sellerName: currentUser.name,
      sellerAvatar: currentUser.avatar,
      sellerRating: currentUser.rating,
      startingBid: price,
      minIncrement: isDirect ? 0 : data.minIncrement,
      currentBid: price,
      fixedPrice: isDirect ? price : undefined,
      buyoutPrice: !isDirect && data.buyoutPrice ? Number(data.buyoutPrice) : undefined,
      reservePrice: !isDirect && data.reservePrice ? Number(data.reservePrice) : undefined,
      bidCount: 0,
      bids: [],
      createdAt: now,
      endsAt,
      status: 'live',
      reserveMet: true,
      viewsCount: 1,
      extendedCount: 0,
    };

    setAuctions((prev) => [newAuction, ...prev]);
    setIsCreateModalOpen(false);
    showToast(
      isDirect
        ? `Figurinha "${data.title}" colocada à venda por R$ ${price.toFixed(2)}!`
        : `Leilão para "${data.title}" publicado com sucesso!`,
      'success'
    );
    return { success: true, auctionId: newAuctionId };
  };

  const cancelAuctionByAdmin = (auctionId: string) => {
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== auctionId) return auc;
        return { ...auc, status: 'ended', winnerId: undefined };
      })
    );
    showToast('Leilão cancelado pela moderação administrativa.', 'warning');
  };

  const toggleFeatureAuction = (auctionId: string) => {
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id !== auctionId) return auc;
        return { ...auc, isFeatured: !auc.isFeatured };
      })
    );
    showToast('Status de destaque do leilão atualizado.', 'info');
  };

  // Payment Checkout handler
  const payOrder = (
    orderId: string,
    _paymentMethod: string,
    address: { street: string; number: string; city: string; state: string; zipCode: string }
  ) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return { success: false };

    const tracking = `BR${Math.floor(100000000 + Math.random() * 900000000)}CP`;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: 'paid',
          trackingCode: tracking,
          address,
          paidAt: Date.now(),
        };
      })
    );

    // Notify seller
    setNotifications((prev) => [
      {
        id: `notif_paid_${Date.now()}`,
        userId: order.sellerId,
        type: 'system',
        title: '📦 Pagamento confirmado! Envie a figurinha',
        message: `O comprador efetuou o pagamento para "${order.stickerTitle}". Envie para ${address.street}, ${address.number} - ${address.city}/${address.state}. Código gerado: ${tracking}.`,
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);

    showToast('Pagamento confirmado com sucesso! Código de rastreio gerado.', 'success');
    return { success: true };
  };

  // Virtual album toggles
  const toggleStickerStatus = (stickerId: string) => {
    setAlbumStickers((prev) =>
      prev.map((stk) => {
        if (stk.id !== stickerId) return stk;
        const nextStatus =
          stk.status === 'collected' ? 'repeated' : stk.status === 'repeated' ? 'missing' : 'collected';
        const nextCount = nextStatus === 'missing' ? 0 : nextStatus === 'collected' ? 1 : 2;
        return { ...stk, status: nextStatus, count: nextCount };
      })
    );
  };

  // Notifications
  const unreadNotifsCount = notifications.filter((n) => !n.read && (!currentUser || n.userId === currentUser.id)).length;

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAllNotifsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (!currentUser || n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  // Messages
  const sendMessage = (threadId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessageThreads((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        return {
          ...t,
          lastMessage: text.trim(),
          lastMessageTime: Date.now(),
          messages: [...t.messages, newMsg],
        };
      })
    );
  };

  const createOrOpenChat = (auctionId: string, sellerId: string): string => {
    const existing = messageThreads.find(
      (t) => t.auctionId === auctionId && (t.otherUserId === sellerId || (currentUser && t.otherUserId === currentUser.id))
    );

    if (existing) {
      setActiveTab('messages');
      return existing.id;
    }

    const auc = auctions.find((a) => a.id === auctionId);
    const seller = users.find((u) => u.id === sellerId);

    const newThreadId = `thread_${Date.now()}`;
    const newThread: MessageThread = {
      id: newThreadId,
      auctionId,
      auctionTitle: auc?.title || 'Figurinha CopaBR',
      stickerNumber: auc?.stickerNumber || 'COPA',
      otherUserId: sellerId,
      otherUserName: seller?.name || 'Vendedor',
      otherUserAvatar: seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      lastMessage: 'Conversa iniciada',
      lastMessageTime: Date.now(),
      unreadCount: 0,
      messages: [
        {
          id: `m_init_${Date.now()}`,
          senderId: currentUser?.id || 'guest',
          senderName: currentUser?.name || 'Comprador',
          text: `Olá! Tenho interesse na figurinha ${auc?.title}. Gostaria de mais detalhes sobre o envio.`,
          timestamp: Date.now(),
        },
      ],
    };

    setMessageThreads((prev) => [newThread, ...prev]);
    setActiveTab('messages');
    return newThreadId;
  };

  return (
    <AuctionContext.Provider
      value={{
        currentUser,
        users,
        login,
        logout,
        switchUser,
        auctions,
        selectedAuction,
        setSelectedAuction,
        placeBid,
        buyoutAuction,
        buyDirectly,
        createAuction,
        cancelAuctionByAdmin,
        toggleFeatureAuction,
        orders,
        selectedOrder,
        setSelectedOrder,
        payOrder,
        albumStickers,
        toggleStickerStatus,
        notifications,
        unreadNotifsCount,
        markNotifAsRead,
        markAllNotifsAsRead: markAllAllNotifsAsRead,
        messageThreads,
        sendMessage,
        createOrOpenChat,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeTab,
        setActiveTab,
        toast,
        showToast,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};
