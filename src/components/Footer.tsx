import React from 'react';
import { Trophy, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 glass-panel bg-black/60 text-white/70 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#009C3B] to-[#00E054] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Trophy className="w-4 h-4 text-[#00E054]" />
              </div>
            </div>
            <span className="text-xl font-black text-white font-display">
              Copa<span className="text-[#00E054]">BR</span>
            </span>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            O marketplace brasileiro de figurinhas da Copa do Mundo. Leilões disputados em tempo real e vendas normais a preço fixo.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Mercado Oficial</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li>Leilões ao Vivo</li>
            <li>Vendas Normais (Preço Fixo)</li>
            <li>Figurinhas Extra Ouro & Lendárias</li>
            <li>Emblemas e Holográficas</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Regras & Proteção</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li>Regra Anti-Sniping (+2 min)</li>
            <li>Preço de Reserva Sigiloso</li>
            <li>Arremate Imediato (Buyout)</li>
            <li>Garantia de Envio Rastreado</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Comunidade</h4>
          <p className="text-xs text-white/50 mb-3 leading-relaxed">
            Mais de 14.000 colecionadores disputando e completando álbuns em todo o território nacional.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Ambiente 100% Protegido</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 gap-4">
        <p>© 2026 CopaBR Marketplace. Todos os direitos reservados.</p>
        <p className="flex items-center gap-1">
          Feito com <Heart className="w-3.5 h-3.5 text-red-400 inline" /> para apaixonados pelo futebol e colecionismo.
        </p>
      </div>
    </footer>
  );
};
