import React from 'react';

export const BackgroundBlobs: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Background base: pure black */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Subtle pitch radial vignetting on pure black */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#000000]/80 to-[#000000]" />

      {/* Atmospheric glowing blobs on black field */}
      {/* Top right Electric green glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 md:w-[600px] md:h-[600px] rounded-full opacity-15 blur-[140px]"
        style={{ background: 'radial-gradient(circle, #00E054 0%, #009C3B 70%, transparent 100%)' }}
      />

      {/* Center Left Deep Emerald glow */}
      <div
        className="absolute top-1/3 -left-40 w-80 h-80 md:w-[500px] md:h-[500px] rounded-full opacity-20 blur-[150px]"
        style={{ background: 'radial-gradient(circle, #009C3B 0%, #012210 80%, transparent 100%)' }}
      />

      {/* Deep Forest accent glow bottom right */}
      <div
        className="absolute -bottom-40 right-1/4 w-96 h-96 md:w-[550px] md:h-[550px] rounded-full opacity-15 blur-[160px]"
        style={{ background: 'radial-gradient(circle, #00E054 0%, #011a0c 70%, transparent 100%)' }}
      />

      {/* Subtle micro dot grid on black for premium collectible finish */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
};
