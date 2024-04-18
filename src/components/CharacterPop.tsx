import { useEffect, useState } from 'react';
import Link from 'next/link';

type Position = 'top-0 left-0' | 'top-0 right-0' | 'bottom-0 right-0' | 'bottom-0 left-0';

const positions: Position[] = [
  // 'top-0 left-0',     // Top left
  // 'top-0 right-0',    // Top right
  'bottom-0 right-0', // Bottom right
  'bottom-0 left-0'   // Bottom left
];

const CharacterPop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>('bottom-0 right-0');

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(true);
      setPosition(positions[Math.floor(Math.random() * positions.length)]);
      setTimeout(() => setIsVisible(false), 5000); // Visible for 5 seconds
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed ${position} p-2 animate-bounce z-10`}>
      <Link href="/listing-resources">
        <img src="/assets/img/character-pop.png" alt="Mysterious Character" className="w-32 h-32" />
      </Link>
    </div>
  );
};

export default CharacterPop;
