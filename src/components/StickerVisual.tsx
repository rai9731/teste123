import React from 'react';
import { Rarity, Condition } from '../types';
import { Award, Sparkles, ShieldCheck } from 'lucide-react';

interface StickerVisualProps {
  player: string;
  team: string;
  teamFlag: string;
  stickerNumber: string;
  position?: string;
  rarity: Rarity;
  condition?: Condition;
  photoUrl: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const StickerVisual: React.FC<StickerVisualProps> = ({
  player,
  team,
  teamFlag,
  stickerNumber,
  position,
  rarity,
  condition,
  photoUrl,
  size = 'md',
  className = '',
}) => {
  const isHolo = rarity === 'Lendária' || rarity === 'Extra Ouro' || rarity === 'Brilhante';

  const sizeClasses = {
    sm: 'w-28 h-36 text-[10px]',
    md: 'w-48 h-64 text-xs',
    lg: 'w-64 h-84 text-sm',
    xl: 'w-72 h-96 text-base',
  };

  const getBorderGradient = () => {
    switch (rarity) {
      case 'Extra Ouro':
        return 'from-[#00E054] via-[#10B981] to-[#047857] shadow-[0_0_24px_rgba(0,224,84,0.35)]';
      case 'Lendária':
        return 'from-[#00E054] via-emerald-400 to-teal-300 shadow-[0_0_28px_rgba(0,224,84,0.4)]';
      case 'Brilhante':
        return 'from-[#34D399] via-white/80 to-[#059669] shadow-[0_0_20px_rgba(52,211,153,0.3)]';
      case 'Especial':
        return 'from-[#10B981] via-[#059669] to-[#064E3B] shadow-[0_0_15px_rgba(16,185,129,0.25)]';
      default:
        return 'from-white/20 via-white/10 to-white/5';
    }
  };

  return (
    <div
      className={`relative rounded-xl p-[2px] bg-gradient-to-br ${getBorderGradient()} transition-all duration-300 group select-none ${sizeClasses[size]} ${className}`}
    >
      {/* Outer Card Body */}
      <div
        className={`w-full h-full rounded-[10px] overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#09150d] via-[#050b07] to-[#000000] relative ${
          isHolo ? 'holo-shimmer' : ''
        }`}
      >
        {/* Top Header of the Sticker: Flag + Sticker Code */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-black/60 backdrop-blur-md border-b border-white/10 z-10">
          <div className="flex items-center gap-1.5 font-bold tracking-wider">
            <span className="text-sm drop-shadow">{teamFlag}</span>
            <span className="font-mono text-white/90 drop-shadow">{stickerNumber}</span>
          </div>

          <div className="flex items-center gap-1">
            {rarity === 'Extra Ouro' && (
              <span className="flex items-center gap-0.5 text-[#00E054] font-semibold text-[9px] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded border border-[#00E054]/30">
                <Sparkles className="w-2.5 h-2.5" /> Rara
              </span>
            )}
            {rarity === 'Lendária' && (
              <span className="flex items-center gap-0.5 text-emerald-300 font-semibold text-[9px] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded border border-emerald-400/30">
                <Award className="w-2.5 h-2.5" /> Lenda
              </span>
            )}
            {rarity === 'Brilhante' && (
              <span className="flex items-center gap-0.5 text-emerald-400 font-semibold text-[9px] uppercase tracking-wider bg-black/70 px-1.5 py-0.5 rounded border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5" /> Holo
              </span>
            )}
          </div>
        </div>

        {/* Player Photo Centerpiece */}
        <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-black/40">
          <img
            src={photoUrl}
            alt={player}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback styled avatar if link is blocked
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Vignette / bottom gradient shadow to ensure text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

          {/* Condition seal watermark */}
          {condition && (
            <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/80 backdrop-blur-md border border-white/20 text-white/90 text-[9px] px-1.5 py-0.5 rounded font-mono">
              <ShieldCheck className="w-2.5 h-2.5 text-[#00E054]" />
              <span>{condition.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Sticker Footer Details */}
        <div className="p-2.5 bg-black/80 backdrop-blur-md border-t border-white/10 z-10">
          <p className="font-extrabold text-white truncate text-center drop-shadow-sm leading-tight">
            {player}
          </p>
          <div className="flex items-center justify-between text-white/60 text-[10px] mt-0.5">
            <span className="truncate">{team}</span>
            {position && <span className="font-medium text-white/80">{position}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
