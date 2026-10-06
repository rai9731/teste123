/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { UserDashboard } from './components/UserDashboard';
import { AuctionsExplorer } from './components/AuctionsExplorer';
import { MyBidsView } from './components/MyBidsView';
import { MyAuctionsView } from './components/MyAuctionsView';
import { MyWinsView } from './components/MyWinsView';
import { MyAlbumView } from './components/MyAlbumView';
import { MessagesView } from './components/MessagesView';
import { AdminPanel } from './components/AdminPanel';
import { LoginView } from './components/LoginView';
import { AuctionDetailModal } from './components/AuctionDetailModal';
import { CreateAuctionModal } from './components/CreateAuctionModal';
import { CheckoutModal } from './components/CheckoutModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastBanner: React.FC = () => {
  const { toast } = useAuction();
  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#00E054]/90 border-emerald-400 text-black font-semibold',
    error: 'bg-red-600/90 border-red-400 text-white',
    warning: 'bg-zinc-800/90 border-[#00E054]/50 text-white',
    info: 'bg-zinc-900/95 border-[#00E054]/40 text-white',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-black shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-white shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#00E054] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#00E054] shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slideUp">
      <div
        className={`px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center gap-3 ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
      </div>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { activeTab, currentUser, isLoginModalOpen, setIsLoginModalOpen } = useAuction();
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // Router dispatcher
  const renderScreen = () => {
    // If not logged in and user requested logged in areas, show Login screen or Landing
    if (!currentUser && activeTab !== 'landing' && activeTab !== 'auctions' && activeTab !== 'direct_sales') {
      return (
        <div className="py-12">
          <LoginView />
        </div>
      );
    }

    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <UserDashboard />;
      case 'auctions':
        return <AuctionsExplorer />;
      case 'direct_sales':
        return <AuctionsExplorer />;
      case 'my_bids':
        return <MyBidsView />;
      case 'my_auctions':
        return <MyAuctionsView />;
      case 'my_wins':
        return <MyWinsView />;
      case 'album':
        return <MyAlbumView />;
      case 'messages':
        return <MessagesView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return currentUser ? <UserDashboard /> : <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between relative text-slate-100 selection:bg-[#00E054] selection:text-black">
      {/* Dynamic Glowing Ambient Blobs */}
      <BackgroundBlobs />

      {/* Fixed Glassmorphism Top Navigation */}
      <Navbar onOpenNotifications={() => setIsNotifsOpen(true)} />

      {/* Active Page View */}
      <main className="flex-1 relative z-10">{renderScreen()}</main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <AuctionDetailModal />
      <CreateAuctionModal />
      <CheckoutModal />
      <NotificationsDrawer isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} />

      {/* Login Modal */}
      {isLoginModalOpen && (
        <LoginView isModal onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Floating System Toasts */}
      <ToastBanner />
    </div>
  );
};

export default function App() {
  return (
    <AuctionProvider>
      <MainContent />
    </AuctionProvider>
  );
}
