import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import { Rarity, Condition } from '../types';
import { X, PlusCircle, Sparkles, AlertCircle, Info, Image as ImageIcon } from 'lucide-react';

export const CreateAuctionModal: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, createAuction } = useAuction();

  if (!isCreateModalOpen) return null;

  const [listingType, setListingType] = useState<'auction' | 'direct_sale'>('auction');
  const [player, setPlayer] = useState('');
  const [team, setTeam] = useState('Brasil');
  const [stickerNumber, setStickerNumber] = useState('BRA 10');
  const [position, setPosition] = useState('Atacante');
  const [rarity, setRarity] = useState<Rarity>('Extra Ouro');
  const [condition, setCondition] = useState<Condition>('Perfeita (Mint)');
  const [fixedPrice, setFixedPrice] = useState('45.00');
  const [startingBid, setStartingBid] = useState('50.00');
  const [minIncrement, setMinIncrement] = useState('5.00');
  const [buyoutPrice, setBuyoutPrice] = useState('');
  const [reservePrice, setReservePrice] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [description, setDescription] = useState(
    'Figurinha nova, retirada do pacote e armazenada com sleeve protetor. Sem marcas ou dobras.'
  );
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80'
  );
  const [error, setError] = useState<string | null>(null);

  const teamFlagMap: Record<string, string> = {
    Brasil: '🇧🇷',
    Argentina: '🇦🇷',
    França: '🇫🇷',
    Portugal: '🇵🇹',
    Inglaterra: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    Alemanha: '🇩🇪',
    Espanha: '🇪🇸',
    Itália: '🇮🇹',
    Uruguai: '🇺🇾',
  };

  const samplePhotos = [
    { label: 'Vinicius Jr.', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&auto=format&fit=crop&q=80' },
    { label: 'Lionel Messi', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80' },
    { label: 'Cristiano Ronaldo', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&auto=format&fit=crop&q=80' },
    { label: 'Kylian Mbappé', url: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80' },
    { label: 'Endrick', url: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&auto=format&fit=crop&q=80' },
    { label: 'Escudo CBF', url: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=600&auto=format&fit=crop&q=80' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!player.trim()) {
      setError('Informe o nome do jogador ou emblema da figurinha.');
      return;
    }

    if (!stickerNumber.trim()) {
      setError('Informe o código da figurinha (ex: BRA 10).');
      return;
    }

    const isDirect = listingType === 'direct_sale';

    if (isDirect) {
      const priceVal = parseFloat(fixedPrice);
      if (isNaN(priceVal) || priceVal <= 0) {
        setError('O preço fixo de venda deve ser maior que zero.');
        return;
      }

      const title = `${player} - ${rarity} (${stickerNumber})`;
      createAuction({
        listingType: 'direct_sale',
        title,
        stickerNumber: stickerNumber.toUpperCase(),
        team,
        teamFlag: teamFlagMap[team] || '⚽',
        player,
        position,
        rarity,
        condition,
        photoUrl,
        description,
        startingBid: priceVal,
        minIncrement: 0,
        fixedPrice: priceVal,
        durationHours: 168, // 7 days active
      });
      return;
    }

    const startVal = parseFloat(startingBid);
    const incVal = parseFloat(minIncrement);

    if (isNaN(startVal) || startVal <= 0) {
      setError('O lance inicial deve ser maior que zero.');
      return;
    }

    if (isNaN(incVal) || incVal <= 0) {
      setError('O incremento mínimo deve ser maior que zero.');
      return;
    }

    if (buyoutPrice && parseFloat(buyoutPrice) <= startVal) {
      setError('O valor do Arremate Imediato deve ser superior ao Lance Inicial.');
      return;
    }

    const title = `${player} - ${rarity} (${stickerNumber})`;

    createAuction({
      listingType: 'auction',
      title,
      stickerNumber: stickerNumber.toUpperCase(),
      team,
      teamFlag: teamFlagMap[team] || '⚽',
      player,
      position,
      rarity,
      condition,
      photoUrl,
      description,
      startingBid: startVal,
      minIncrement: incVal,
      buyoutPrice: buyoutPrice ? parseFloat(buyoutPrice) : undefined,
      reservePrice: reservePrice ? parseFloat(reservePrice) : undefined,
      durationHours: parseFloat(durationHours),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl my-6 glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-black/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E054]/20 border border-[#00E054]/40 text-[#00E054]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Anunciar Figurinha</h2>
              <p className="text-xs text-white/60">
                Escolha entre Leilão com lances ao vivo ou Venda Normal com preço fixo
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5">
          {/* Format Selector: Leilão vs Venda Normal */}
          <div className="p-1 rounded-2xl bg-zinc-900 border border-white/10 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setListingType('auction')}
              className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                listingType === 'auction'
                  ? 'bg-[#00E054] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🔨 Modo Leilão (Disputa de Lances)</span>
            </button>
            <button
              type="button"
              onClick={() => setListingType('direct_sale')}
              className={`py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                listingType === 'direct_sale'
                  ? 'bg-[#00E054] text-black shadow-md'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <span>🏷️ Venda Normal (Preço Fixo)</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Sticker Details */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00E054] tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>1. Dados da Figurinha</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Jogador / Emblema</label>
                <input
                  type="text"
                  required
                  value={player}
                  onChange={(e) => setPlayer(e.target.value)}
                  placeholder="Ex: Vinicius Jr., Escudo CBF"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Código / Número</label>
                <input
                  type="text"
                  required
                  value={stickerNumber}
                  onChange={(e) => setStickerNumber(e.target.value)}
                  placeholder="Ex: BRA 10"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Seleção</label>
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="Brasil" className="bg-slate-900">Brasil 🇧🇷</option>
                  <option value="Argentina" className="bg-slate-900">Argentina 🇦🇷</option>
                  <option value="França" className="bg-slate-900">França 🇫🇷</option>
                  <option value="Portugal" className="bg-slate-900">Portugal 🇵🇹</option>
                  <option value="Inglaterra" className="bg-slate-900">Inglaterra 🏴󠁧󠁢󠁥󠁮󠁧󠁿</option>
                  <option value="Alemanha" className="bg-slate-900">Alemanha 🇩🇪</option>
                  <option value="Espanha" className="bg-slate-900">Espanha 🇪🇸</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Posição</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="Atacante" className="bg-slate-900">Atacante</option>
                  <option value="Meio-campista" className="bg-slate-900">Meio-campista</option>
                  <option value="Zagueiro" className="bg-slate-900">Zagueiro</option>
                  <option value="Lateral" className="bg-slate-900">Lateral</option>
                  <option value="Goleiro" className="bg-slate-900">Goleiro</option>
                  <option value="Emblema Oficial" className="bg-slate-900">Emblema Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Raridade</label>
                <select
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value as Rarity)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="Extra Ouro" className="bg-slate-900">Extra Ouro (Super Rara)</option>
                  <option value="Lendária" className="bg-slate-900">Lendária (Holográfica Especial)</option>
                  <option value="Brilhante" className="bg-slate-900">Brilhante / Metalizada</option>
                  <option value="Especial" className="bg-slate-900">Especial</option>
                  <option value="Comum" className="bg-slate-900">Comum</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Condição da Figurinha</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                >
                  <option value="Perfeita (Mint)" className="bg-slate-900">Perfeita (Mint - Sem toques)</option>
                  <option value="Lacrada" className="bg-slate-900">Lacrada no Invólucro</option>
                  <option value="Excelente" className="bg-slate-900">Excelente (Cantos retos)</option>
                  <option value="Muito Boa" className="bg-slate-900">Muito Boa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preset Photo Choice */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5 flex items-center justify-between">
              <span>Foto da Figurinha</span>
              <span className="text-[11px] text-white/40">Selecione uma foto modelo ou cole uma URL</span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
              {samplePhotos.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setPhotoUrl(p.url)}
                  className={`p-1 rounded-xl border text-center transition-all cursor-pointer ${
                    photoUrl === p.url
                      ? 'border-[#00E054] bg-[#00E054]/20'
                      : 'border-white/10 hover:border-white/30 bg-black/40'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-12 object-cover rounded-lg" />
                  <span className="text-[9px] text-white/70 block truncate mt-1">{p.label}</span>
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="URL da foto"
                className="w-full pl-8 pr-3 py-2 rounded-xl glass-input text-xs text-white/80 font-mono"
              />
              <ImageIcon className="w-4 h-4 text-white/40 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Section 2: Financial Rules (Conditional based on format) */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00E054] tracking-wider mb-3">
              {listingType === 'direct_sale' ? '2. Preço de Venda Direta' : '2. Regras Financeiras do Leilão'}
            </h3>

            {listingType === 'direct_sale' ? (
              <div className="p-4 rounded-2xl bg-black/40 border border-[#00E054]/30 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-white/90 mb-1">
                    Preço Fixo de Venda (R$)
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={fixedPrice}
                    onChange={(e) => setFixedPrice(e.target.value)}
                    placeholder="Ex: 45.00"
                    className="w-full px-3.5 py-3 rounded-xl glass-input text-base font-mono font-bold text-[#00E054]"
                  />
                  <p className="text-[11px] text-white/50 mt-1">
                    Qualquer comprador poderá arrematar instantaneamente pelo preço estipulado, sem necessidade de aguardar lances.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Lance Inicial (R$)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={startingBid}
                      onChange={(e) => setStartingBid(e.target.value)}
                      placeholder="Ex: 50.00"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Incremento Mínimo (R$)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={minIncrement}
                      onChange={(e) => setMinIncrement(e.target.value)}
                      placeholder="Ex: 5.00"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono font-bold text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1 flex items-center justify-between">
                      <span>Arremate Imediato (Opcional)</span>
                      <span className="text-[10px] text-[#00E054]">Comprar Já</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={buyoutPrice}
                      onChange={(e) => setBuyoutPrice(e.target.value)}
                      placeholder="Ex: 150.00 (opcional)"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1 flex items-center justify-between">
                      <span>Preço de Reserva (Opcional)</span>
                      <span className="text-[10px] text-white/40">Mínimo sigiloso</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={reservePrice}
                      onChange={(e) => setReservePrice(e.target.value)}
                      placeholder="Ex: 80.00 (opcional)"
                      className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono text-white"
                    />
                  </div>
                </div>

                {/* Duration choice */}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-white/80 mb-1">Duração do Leilão</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs text-white"
                  >
                    <option value="0.05" className="bg-slate-900">
                      ⚡ 3 minutos (Modo Demonstração Rápida - teste anti-sniping e encerramento!)
                    </option>
                    <option value="1" className="bg-slate-900">1 hora (Finaliza hoje)</option>
                    <option value="12" className="bg-slate-900">12 horas</option>
                    <option value="24" className="bg-slate-900">24 horas (Recomendado)</option>
                    <option value="72" className="bg-slate-900">3 dias</option>
                    <option value="168" className="bg-slate-900">7 dias</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1">Descrição e Observações</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhes de conservação, sleeve ou história da figurinha..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* Guarantee note */}
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-white/60 text-[11px] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#00E054] shrink-0 mt-0.5" />
            <span>
              <strong>Garantia CopaBR:</strong> O comprador realiza o pagamento com proteção do marketplace, e o valor é
              repassado ao vendedor após o envio rastreado da figurinha.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,224,84,0.35)] active:scale-95 cursor-pointer"
            >
              {listingType === 'direct_sale' ? 'Publicar Venda Normal' : 'Publicar Leilão Agora'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
