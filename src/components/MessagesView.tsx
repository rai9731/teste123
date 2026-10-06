import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { MessageSquare, Send, User, ExternalLink } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const { messageThreads, sendMessage, currentUser, setSelectedAuction, auctions } = useAuction();

  const [activeThreadId, setActiveThreadId] = useState<string>(
    messageThreads[0]?.id || ''
  );
  const [inputText, setInputText] = useState('');

  if (!currentUser) return null;

  const activeThread = messageThreads.find((t) => t.id === activeThreadId) || messageThreads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    sendMessage(activeThread.id, inputText);
    setInputText('');
  };

  const handleInspectAuction = (auctionId: string) => {
    const auc = auctions.find((a) => a.id === auctionId);
    if (auc) setSelectedAuction(auc);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">Mensagens</h1>
        <p className="text-xs sm:text-sm text-white/60">
          Tire dúvidas com vendedores e combine detalhes sobre figurinhas arrematadas.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/15 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] shadow-2xl">
        {/* Left conversations list */}
        <div className="md:col-span-4 border-r border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xs uppercase font-bold text-white/70 tracking-wider">Conversas Recentes</h2>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-white/5">
            {messageThreads.length === 0 ? (
              <div className="p-6 text-center text-xs text-white/40">
                Nenhuma conversa aberta no momento.
              </div>
            ) : (
              messageThreads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                      isActive ? 'bg-white/15' : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={thread.otherUserAvatar}
                      alt={thread.otherUserName}
                      className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-white truncate">{thread.otherUserName}</span>
                        <span className="text-[10px] text-white/40 font-mono">
                          {new Date(thread.lastMessageTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#00E054] truncate font-semibold">
                        {thread.stickerNumber} · {thread.auctionTitle}
                      </p>
                      <p className="text-xs text-white/60 truncate mt-0.5">{thread.lastMessage}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right chat panel */}
        <div className="md:col-span-8 flex flex-col justify-between bg-black/10">
          {activeThread ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={activeThread.otherUserAvatar}
                    alt={activeThread.otherUserName}
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white">{activeThread.otherUserName}</h3>
                    <p className="text-xs text-white/60">
                      Assunto: {activeThread.stickerNumber} - {activeThread.auctionTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleInspectAuction(activeThread.auctionId)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#00E054]" />
                  <span>Ver Anúncio</span>
                </button>
              </div>

              {/* Chat Messages stream */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 max-h-[400px]">
                {activeThread.messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-white/40">
                        <span>{msg.senderName}</span>
                        <span>·</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          isMine
                            ? 'bg-[#00E054] text-black font-semibold rounded-br-sm shadow'
                            : 'glass-panel text-white/90 rounded-bl-sm border border-white/10 bg-black/40'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-black/20 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva sua mensagem sobre a figurinha..."
                  className="flex-1 px-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-white/30"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase flex items-center gap-1.5 transition-all shadow active:scale-95 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>Enviar</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-white/40 text-xs">
              Selecione uma conversa para visualizar o histórico de mensagens.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
