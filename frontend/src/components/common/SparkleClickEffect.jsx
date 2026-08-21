import React, { useState, useEffect } from 'react';

export const SparkleClickEffect = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const emojis = ['🌸', '✨', '🎀', '🌷', '💖', '🌼'];

    const handleClick = (e) => {
      // Don't spawn if clicking input, textarea or select
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const id = Date.now() + Math.random();
      const newParticle = {
        id,
        x: e.clientX,
        y: e.clientY,
        emoji: randomEmoji,
        offsetY: -(20 + Math.random() * 30),
        offsetX: (Math.random() - 0.5) * 40
      };

      setParticles((prev) => [...prev.slice(-10), newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== id));
      }, 750);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-lg sm:text-xl transition-all duration-700 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            transform: `translate(${p.offsetX}px, ${p.offsetY}px) scale(1.25)`,
            opacity: 0,
            animation: 'sparkleFade 0.75s ease-out forwards'
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`
        @keyframes sparkleFade {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6) rotate(0deg);
          }
          60% {
            opacity: 0.9;
            transform: translate(-50%, -120%) scale(1.3) rotate(15deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -200%) scale(1.1) rotate(30deg);
          }
        }
      `}</style>
    </div>
  );
};
