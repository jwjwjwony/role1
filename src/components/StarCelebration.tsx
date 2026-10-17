import React, { useEffect, useState } from 'react';
import { Star, Sparkles, Heart } from 'lucide-react';

interface StarCelebrationProps {
  studentName: string;
  points: number;
  reason: string;
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  icon: 'star' | 'heart' | 'sparkle';
  delay: number;
  duration: number;
  rotate: number;
}

export const playCelebrationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.4);
    });
  } catch {
    // Ignore audio failures if browser blocks autoplay
  }
};

export const StarCelebration: React.FC<StarCelebrationProps> = ({
  studentName,
  points,
  reason,
  onClose,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    playCelebrationSound();

    // Pink, Rose, Coral, and Gold Sparkles
    const colors = ['#EC4899', '#F43F5E', '#FB7185', '#F472B6', '#FBBF24', '#D946EF'];
    const icons: ('star' | 'heart' | 'sparkle')[] = ['star', 'sparkle', 'heart'];

    const newParticles: Particle[] = Array.from({ length: 26 }).map((_, i) => ({
      id: i,
      x: 35 + Math.random() * 30,
      y: 40 + Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 14 + Math.floor(Math.random() * 16),
      icon: icons[Math.floor(Math.random() * icons.length)],
      delay: Math.random() * 0.2,
      duration: 1.2 + Math.random() * 0.8,
      rotate: Math.floor(Math.random() * 360),
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      onClose();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center p-4">
      {/* Pink Glow Overlay */}
      <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[1px] animate-pulse transition-opacity duration-300" />

      {/* Floating Sparkle Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p) => {
          const xOffset = (Math.random() - 0.5) * 350;
          const yOffset = -120 - Math.random() * 160;

          return (
            <div
              key={p.id}
              className="absolute transition-all ease-out"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${p.rotate}deg)`,
                transitionDuration: `${p.duration}s`,
                transitionDelay: `${p.delay}s`,
                opacity: 0,
                animation: `sparkle-float ${p.duration}s ease-out forwards`,
              }}
            >
              {p.icon === 'star' && <Star size={p.size} fill={p.color} color={p.color} />}
              {p.icon === 'heart' && <Heart size={p.size} fill={p.color} color={p.color} />}
              {p.icon === 'sparkle' && <Sparkles size={p.size} color={p.color} />}
            </div>
          );
        })}
      </div>

      {/* Celebration Notification Card (Pink Aesthetic) */}
      <div className="relative pointer-events-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-pink-300 text-center transform scale-100 transition-all duration-300 animate-gentle-bounce">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-pink-500 shadow-inner">
          <Heart size={34} className="fill-pink-400 stroke-pink-500 animate-bounce" />
        </div>

        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-pink-100 text-pink-800 mb-2 border border-pink-200">
          핑크빛 칭찬 포인트 선물 완료! 💖
        </span>

        <h3 className="text-2xl font-bold text-slate-800 mb-1">
          <span className="text-pink-600 font-extrabold">{studentName}</span> 학생에게
        </h3>

        <div className="my-3 py-2 px-4 bg-pink-50 rounded-2xl border border-pink-200 text-pink-900 font-semibold text-lg flex items-center justify-center gap-2">
          <span>{reason}</span>
          <span className="bg-pink-500 text-white text-sm font-black px-2.5 py-0.5 rounded-full shadow-sm">
            +{points}P
          </span>
        </div>

        <p className="text-slate-600 text-sm font-medium mb-4">
          따뜻한 칭찬으로 우리 아이의 예쁜 꽃나무가 한 뼘 더 자라났어요! 🌸
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-6 bg-pink-500 hover:bg-pink-600 active:scale-95 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
};
