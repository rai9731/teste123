export type Rarity = 'Comum' | 'Especial' | 'Brilhante' | 'Extra Ouro' | 'Lendária';

export type Condition = 'Perfeita (Mint)' | 'Lacrada' | 'Excelente' | 'Muito Boa';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  badge: string;
  rating: number;
  auctionsCreatedCount: number;
  bidsPlacedCount: number;
  walletBalance: number;
  city: string;
  state: string;
  phone?: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderMaskedName: string;
  bidderAvatar: string;
  amount: number;
  timestamp: number;
  isAutoBid?: boolean;
}

export type AuctionStatus = 'live' | 'ending_soon' | 'ended';

export type ListingType = 'auction' | 'direct_sale';

export interface Auction {
  id: string;
  listingType?: ListingType; // 'auction' (leilão) or 'direct_sale' (venda normal / preço fixo)
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
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  startingBid: number;
  minIncrement: number;
  currentBid: number;
  fixedPrice?: number; // Preço fixo para venda normal direta
  buyoutPrice?: number;
  reservePrice?: number;
  highestBidderId?: string;
  highestBidderMaskedName?: string;
  bidCount: number;
  bids: Bid[];
  createdAt: number;
  endsAt: number;
  status: AuctionStatus;
  winnerId?: string;
  finalPrice?: number;
  reserveMet?: boolean;
  viewsCount: number;
  isFeatured?: boolean;
  extendedCount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'outbid' | 'won' | 'bid_received' | 'auction_extended' | 'reserve_met' | 'system';
  title: string;
  message: string;
  auctionId?: string;
  timestamp: number;
  read: boolean;
}

export interface AlbumSticker {
  id: string;
  number: string;
  player: string;
  team: string;
  teamFlag: string;
  position: string;
  rarity: Rarity;
  status: 'collected' | 'missing' | 'repeated';
  count: number;
  photoUrl: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface MessageThread {
  id: string;
  auctionId: string;
  auctionTitle: string;
  stickerNumber: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Order {
  id: string;
  auctionId: string;
  stickerTitle: string;
  stickerNumber: string;
  team: string;
  rarity: Rarity;
  photoUrl: string;
  winnerId: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  shippingFee: number;
  shippingMethod: string;
  trackingCode?: string;
  status: 'awaiting_payment' | 'paid' | 'shipped' | 'delivered';
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paidAt?: number;
  createdAt: number;
}
