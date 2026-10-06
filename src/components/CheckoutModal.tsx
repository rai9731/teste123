import React, { useState } from 'react';
import { useAuction } from '../context/AuctionContext';
import {
  X,
  CreditCard,
  QrCode,
  Wallet,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, payOrder, showToast, currentUser } = useAuction();

  if (!selectedOrder) return null;

  const order = selectedOrder;

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card' | 'wallet'>('pix');
  const [shippingMethod, setShippingMethod] = useState<'carta' | 'sedex'>('carta');
  const [shippingFee, setShippingFee] = useState<number>(14.0);

  const [street, setStreet] = useState(order.address?.street || 'Av. das Nações');
  const [number, setNumber] = useState(order.address?.number || '520');
  const [city, setCity] = useState(order.address?.city || 'São Paulo');
  const [state, setState] = useState(order.address?.state || 'SP');
  const [zipCode, setZipCode] = useState(order.address?.zipCode || '01311-000');

  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardName, setCardName] = useState(currentUser?.name || 'Ana Silva');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  const total = order.amount + shippingFee;

  const handleShippingChange = (type: 'carta' | 'sedex') => {
    setShippingMethod(type);
    setShippingFee(type === 'carta' ? 14.0 : 28.0);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    payOrder(order.id, paymentMethod, {
      street,
      number,
      city,
      state,
      zipCode,
    });
    setSelectedOrder(null);
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(
      '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865406' +
        total.toFixed(2)
    );
    showToast('Código PIX Copia e Cola copiado com sucesso!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl my-6 glass-panel rounded-3xl border border-white/15 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] bg-black/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00E054]/20 border border-[#00E054]/40 text-[#00E054]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-display">Checkout Seguro</h2>
              <p className="text-xs text-white/60">Finalize o pagamento com a Proteção de Entrega CopaBR</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedOrder(null)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handlePay} className="overflow-y-auto p-6 space-y-5">
          {/* Item summary */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={order.photoUrl}
                alt={order.stickerTitle}
                className="w-12 h-16 object-cover rounded-lg border border-white/20"
              />
              <div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#00E054]">
                  {order.stickerNumber}
                </span>
                <p className="font-bold text-white text-sm mt-0.5">{order.stickerTitle}</p>
                <p className="text-xs text-white/50">Vendedor: {order.sellerName}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-white/50 block">Valor arrematado:</span>
              <span className="text-base font-black text-[#00E054] font-mono">
                R$ {order.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00E054] tracking-wider mb-2.5 flex items-center gap-1.5">
              <Truck className="w-4 h-4" />
              <span>1. Endereço de Envio</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-white/70 mb-1">Rua / Avenida</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Número / Complemento</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">CEP</label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1">Estado</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white uppercase"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div>
            <label className="block text-xs font-semibold text-white/80 mb-2">Opção de Envio Seguro</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleShippingChange('carta')}
                className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                  shippingMethod === 'carta'
                    ? 'border-[#00E054] bg-[#00E054]/15'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-white">Carta Registrada com Seguro</p>
                  <p className="text-[11px] text-white/60">Embalagem protetora rígida anti-dobra (5-8 dias)</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#00E054]">R$ 14,00</span>
              </button>

              <button
                type="button"
                onClick={() => handleShippingChange('sedex')}
                className={`p-3 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                  shippingMethod === 'sedex'
                    ? 'border-[#00E054] bg-[#00E054]/15'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="font-bold text-xs text-white">Sedex Colecionador Blindado</p>
                  <p className="text-[11px] text-white/60">Sleeve magnético e entrega expressa (2-3 dias)</p>
                </div>
                <span className="font-mono font-bold text-xs text-[#00E054]">R$ 28,00</span>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-xs uppercase font-bold text-[#00E054] tracking-wider mb-2.5 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" />
              <span>2. Forma de Pagamento</span>
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#00E054] bg-[#00E054]/20 text-[#00E054]'
                    : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">PIX Dinâmico</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#00E054] bg-[#00E054]/20 text-[#00E054]'
                    : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                  paymentMethod === 'wallet'
                    ? 'border-[#00E054] bg-[#00E054]/20 text-[#00E054]'
                    : 'border-white/10 bg-black/40 text-white/70 hover:border-white/20'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="text-xs font-bold">Saldo Carteira</span>
              </button>
            </div>

            {/* Sub-form according to payment method */}
            {paymentMethod === 'pix' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">QR Code PIX Instantâneo</span>
                  <span className="text-[11px] text-[#00E054] font-semibold">Liberação Imediata</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="w-24 h-24 bg-white rounded-lg p-2 flex items-center justify-center shrink-0">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <p className="text-[11px] text-white/70">
                      Escaneie com o app do seu banco ou copie a chave abaixo:
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="px-3 py-1.5 rounded-lg bg-[#00E054]/20 hover:bg-[#00E054]/30 border border-[#00E054]/40 text-[#00E054] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Chave Pix Copia e Cola</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                <div>
                  <label className="block text-[11px] text-white/70 mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] text-white/70 mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/70 mb-1">Validade</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Saldo em Conta CopaBR:</p>
                  <p className="text-sm font-mono font-bold text-[#00E054]">
                    R$ {(currentUser?.walletBalance || 0).toFixed(2)}
                  </p>
                </div>
                <span className="text-xs text-[#00E054] font-semibold">Saldo Suficiente</span>
              </div>
            )}
          </div>

          {/* Total & Action */}
          <div className="pt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-white/50 block">Total a Pagar (Figurinha + Frete):</span>
              <span className="text-2xl font-black text-[#00E054] font-mono">
                R$ {total.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex-1 sm:flex-none cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#00E054] hover:bg-[#00c94b] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,224,84,0.4)] active:scale-95 transition-all flex-1 sm:flex-none cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Pagamento</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
