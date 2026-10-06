import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { StickerCard } from './StickerCard';
import {
  Gavel,
  ShieldCheck,
  Sparkles,
  Zap,
  ChevronDown,
  ArrowRight,
  Flame,
  Search,
  BookOpen,
  Lock,
  Tag,
  PlusCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { auctions, setActiveTab, setIsLoginModalOpen, setIsCreateModalOpen, currentUser } = useAuction();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [featuredTab, setFeaturedTab] = useState<'all' | 'auction' | 'direct_sale'>('all');

  const filteredFeatured = auctions
    .filter((a) => {
      if (a.status === 'ended') return false;
      if (featuredTab === 'auction') return a.listingType !== 'direct_sale';
      if (featuredTab === 'direct_sale') return a.listingType === 'direct_sale';
      return a.isFeatured || a.listingType === 'direct_sale';
    })
    .slice(0, 3);

  const heroAuction = auctions.find((a) => a.id === 'auc_1') || auctions[0];

  const faqs = [
    {
      q: 'Como funcionam os leilões e as vendas normais no CopaBR?',
      a: 'Você escolhe o formato ideal para negociar: no LEILÃO, o vendedor define o lance inicial e o incremento mínimo, com lances disputados em tempo real até a contagem regressiva zerar. Na VENDA NORMAL (Preço Fixo), o item tem valor fechado para compra imediata com 1 clique, sem disputa de lances!',
    },
    {
      q: 'O que é a regra Anti-Sniping nos leilões?',
      a: 'Para garantir justiça e evitar robôs de última hora, se um novo lance for dado nos últimos 2 minutos do leilão, o tempo restante é estendido automaticamente em mais 2 minutos. Isso permite que outros colecionadores tenham tempo hábil para cobrir o lance.',
    },
    {
      q: 'Posso vender e comprar na mesma conta?',
      a: 'Sim! Qualquer usuário cadastrado no CopaBR é comprador e vendedor ao mesmo tempo. Você pode anunciar figurinhas repetidas e usar o saldo obtido para arrematar as raras que faltam no seu álbum.',
    },
    {
      q: 'Como funciona a Venda Normal (Preço Fixo)?',
      a: 'Basta navegar pela aba "Vendas Normais", escolher a figurinha desejada e clicar em "Comprar Agora". O pedido vai direto para o checkout com frete seguro, sem precisar esperar o encerramento de um leilão.',
    },
    {
      q: 'Como funciona o Arremate Imediato em leilões?',
      a: 'É um valor opcional estipulado pelo vendedor no leilão. Se você não quiser aguardar o final da contagem regressiva, pode clicar em "Arrematar Já", pagar o valor estipulado e vencer o leilão imediatamente.',
    },
    {
      q: 'E se o preço de reserva não for atingido no leilão?',
      a: 'O vendedor pode definir um preço de reserva sigiloso. Se o leilão encerrar com o maior lance abaixo desse patamar mínimo, o leilão fecha sem vencedor e ninguém é cobrado.',
    },
  ];

  return (
    <div className="space-y-24 py-6 md:py-12">
      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E054]/15 border border-[#00E054]/40 text-[#00E054] text-xs font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#00E054] animate-ping" />
              <span>Marketplace Oficial de Colecionadores da Copa</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.1]">
              Arremate a Glória.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E054] via-emerald-400 to-teal-300">
                Complete seu Álbum
              </span>{' '}
              com Figurinhas Raras.
            </h1>

            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Dispute leilões emocionantes em tempo real ou compre na hora com vendas normais a preço fixo.
              Negocie de colecionador para colecionador com proteção anti-sniping e frete rastreado.
            </p>

            {/* Action Buttons: Includes explicit normal sales button alongside auction button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => setActiveTab('auctions')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(0,224,84,0.35)] hover:shadow-[0_0_35px_rgba(0,224,84,0.5)] active:scale-95 transition-all cursor-pointer"
              >
                <Flame className="w-5 h-5 text-black" />
                <span>Ver Leilões ao Vivo</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('direct_sales')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-[#00E054]/50 hover:border-[#00E054] text-[#00E054] font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Tag className="w-4 h-4 text-[#00E054]" />
                <span>Vendas Normais (Preço Fixo)</span>
              </button>

              <button
                onClick={() => {
                  if (currentUser) {
                    setIsCreateModalOpen(true);
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-panel text-white hover:bg-white/10 font-bold text-sm flex items-center justify-center gap-2 border border-white/20 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <span>Anunciar Figurinha</span>
              </button>
            </div>

            {/* Micro proof stats */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-white font-mono tabular-nums">+14.200</p>
                <p className="text-xs text-white/50">Lances Computados</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#00E054] font-mono tabular-nums">Leilão + Fixo</p>
                <p className="text-xs text-white/50">2 Modos de Negociação</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-400 font-mono tabular-nums">4.9/5</p>
                <p className="text-xs text-white/50">Satisfação Comprovada</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Interactive Floating Card Mockup */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Ambient green glow backplate */}
            <div className="absolute inset-0 bg-[#00E054]/15 rounded-3xl blur-3xl transform rotate-3" />

            <div className="relative w-full max-w-sm">
              <div className="absolute -top-4 -left-4 z-20 px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 animate-bounce">
                <Flame className="w-3.5 h-3.5 text-white" />
                <span>Disputa Ao Vivo!</span>
              </div>

              {/* Real interactive sticker card from active dataset */}
              <StickerCard auction={heroAuction} />
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO DESTACADA COM TABS: LEILÕES E VENDAS NORMAIS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E054]">Mercado em Tempo Real</span>
            <h2 className="text-3xl font-black text-white font-display mt-1">Destaques da Rodada</h2>
          </div>

          {/* Filter Switcher: Leilões vs Vendas Normais */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900 border border-white/10">
            <button
              onClick={() => setFeaturedTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                featuredTab === 'all'
                  ? 'bg-[#00E054] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFeaturedTab('auction')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                featuredTab === 'auction'
                  ? 'bg-[#00E054] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🔨 Leilões ao Vivo
            </button>
            <button
              onClick={() => setFeaturedTab('direct_sale')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                featuredTab === 'direct_sale'
                  ? 'bg-[#00E054] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              🏷️ Vendas Normais
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatured.map((auction) => (
            <StickerCard key={auction.id} auction={auction} />
          ))}
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => setActiveTab(featuredTab === 'direct_sale' ? 'direct_sales' : 'auctions')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#00E054] hover:text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Explorar Todas as Figurinhas ({featuredTab === 'direct_sale' ? 'Vendas Normais' : 'Leilões & Vendas'})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* COMO FUNCIONA (4 PASSOS) */}
      <section id="como-funciona" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00E054]">Simples e Transparente</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-display mt-1">Como Funciona o CopaBR</h2>
          <p className="text-sm text-white/60 mt-2">
            Quatro passos diretos para negociar suas figurinhas com adrenalina e segurança.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              num: '01',
              title: 'Cadastre-se Grátis',
              desc: 'Crie sua conta em segundos. Você ganha acesso simultâneo como comprador e vendedor na plataforma.',
              icon: Sparkles,
            },
            {
              num: '02',
              title: 'Escolha o Formato',
              desc: 'Anuncie ou compre através de Leilões disputados em tempo real ou Vendas Normais com preço fixo imediato.',
              icon: Search,
            },
            {
              num: '03',
              title: 'Dê Lances ou Compre Já',
              desc: 'No leilão, dispute com anti-sniping e lance automático. Na venda normal, compre instantaneamente em 1 clique.',
              icon: Gavel,
            },
            {
              num: '04',
              title: 'Receba com Proteção',
              desc: 'O pagamento fica protegido no CopaBR (PIX ou Cartão) até o vendedor enviar com embalagem blindada e rastreio.',
              icon: ShieldCheck,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-[#00E054]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-[#00E054] opacity-80 group-hover:opacity-100">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#00E054] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section id="beneficios" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel-emerald rounded-3xl p-8 sm:p-12 border border-[#00E054]/30 relative overflow-hidden bg-black/80">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#00E054]">Segurança & Paixão</span>
            <h2 className="text-3xl font-black text-white font-display mt-1">Por que Colecionar no CopaBR?</h2>
            <p className="text-sm text-white/70 mt-2">
              Diferente de redes sociais ou grupos informais, aqui cada negociação segue regras claras com proteção total ao colecionador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Dois Modos de Negociação',
                desc: 'Adrenalina de leilão com anti-sniping ou agilidade de vendas normais com preço fixo à sua escolha.',
                icon: Tag,
              },
              {
                title: 'Lances Transparentes',
                desc: 'Histórico auditável com horário exato e pseudônimo. Sem lances fantasmas ou manipulação.',
                icon: Gavel,
              },
              {
                title: 'Complete Seu Álbum',
                desc: 'Visualizador de álbum integrado: marque as que já tem e encontre com 1 clique as que faltam.',
                icon: BookOpen,
              },
              {
                title: 'Pagamento Seguro',
                desc: 'O vendedor só recebe o repasse quando o envio é comprovado com código de rastreamento oficial.',
                icon: Lock,
              },
            ].map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                  <div className="p-2 w-fit rounded-xl bg-[#00E054]/15 border border-[#00E054]/30 text-[#00E054]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-sm">{b.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Comunidade Apaixonada</span>
          <h2 className="text-3xl font-black text-white font-display mt-1">O que Dizem os Colecionadores</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Guilherme Sampaio',
              city: 'Belo Horizonte, MG',
              text: 'Consegui arrematar a figurinha Extra Ouro do Vini Jr. nos últimos segundos com o anti-sniping! A embalagem chegou impecável.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
              role: 'Colecionador desde 2014',
            },
            {
              name: 'Beatriz Vasconcelos',
              city: 'São Paulo, SP',
              text: 'Vendi figurinhas repetidas tanto em leilão quanto em venda normal direta. Usei o saldo para arrematar o escudo dourado do Brasil!',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
              role: 'Completou 3 álbuns',
            },
            {
              name: 'Marcos Vinicius',
              city: 'Curitiba, PR',
              text: 'O visual preto e verde é muito elegante e rápido. Poder comprar direto por preço fixo quando estou com pressa facilitou demais.',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
              role: 'Caçador de Lendárias',
            },
          ].map((dep, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between bg-black/60">
              <p className="text-xs text-white/80 italic leading-relaxed mb-6">"{dep.text}"</p>
              <div className="flex items-center gap-3">
                <img src={dep.avatar} alt={dep.name} className="w-10 h-10 rounded-full object-cover border border-[#00E054]/40" />
                <div>
                  <p className="font-bold text-white text-xs">{dep.name}</p>
                  <p className="text-[10px] text-white/50">{dep.city} · {dep.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00E054]">Tire Suas Dúvidas</span>
          <h2 className="text-3xl font-black text-white font-display mt-1">Perguntas Frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all bg-black/60">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-[#00E054] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#00E054] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-white/70 leading-relaxed border-t border-white/5 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
