import { useEffect, useState } from 'react';
import './Confetti.css';

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
}

const COLORS = ['#f0d9b5', '#d4a574', '#c9b896', '#e8d5b7', '#f5e6d3', '#222'];
const CONFETTI_COUNT = 50;

function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setIsVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            backgroundColor: piece.color,
            width: piece.size,
            height: piece.size * 0.6,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
