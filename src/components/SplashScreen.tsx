import { useEffect, useState } from 'react';
import logo from '../assets/logo-black.svg';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 600);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isExiting ? 'splash-exit' : ''}`}>
      <div className="splash-content">
        <img src={logo} alt="P&V" className="splash-logo" />
        <div className="splash-line" />
        <p className="splash-date">22.08.26</p>
      </div>
    </div>
  );
}

export default SplashScreen;
