import React, { useEffect, useState, useCallback } from 'react';
import { Heart } from 'lucide-react';

export const CherryBlossoms: React.FC = () => {
  const [petals, setPetals] = useState<{ id: number; left: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    const createPetals = () => {
      const newPetals = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        duration: 5 + Math.random() * 10,
        delay: Math.random() * 5,
      }));
      setPetals(newPetals);
    };
    createPetals();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute top-[-20px] w-3 h-3 bg-pink-300 opacity-60 rounded-full"
          style={{
            left: `${petal.left}%`,
            animation: `fall ${petal.duration}s linear ${petal.delay}s infinite`,
          }}
        >
          <style>{`
            @keyframes fall {
              0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
              20% { opacity: 0.8; }
              100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

interface FloatingHeartsProps {
  active: boolean;
  onComplete: () => void;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({ active, onComplete }) => {
  const [hearts, setHearts] = useState<{ id: number; left: number; color: string }[]>([]);

  useEffect(() => {
    if (active) {
      const colors = ['text-red-500', 'text-pink-500', 'text-rose-400', 'text-purple-400'];
      const newHearts = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        left: Math.random() * 90 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setHearts(newHearts);
      
      const timer = setTimeout(() => {
        setHearts([]);
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {hearts.map((h) => (
        <div
          key={h.id}
          className={`absolute bottom-0 ${h.color}`}
          style={{
            left: `${h.left}%`,
            animation: `floatUp 3s ease-out forwards ${Math.random()}s`,
          }}
        >
          <Heart fill="currentColor" size={24 + Math.random() * 24} />
          <style>{`
            @keyframes floatUp {
              0% { transform: translateY(0) scale(0.5); opacity: 0; }
              20% { opacity: 1; }
              100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};