import { Heart } from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Footer.css';

function Footer() {
  const { couple, date } = WEDDING_CONFIG;

  return (
    <footer className="global-footer">
      <div className="footer-content">
        <div className="footer-initials">
          <span>P</span>
          <Heart size={14} weight="fill" className="footer-heart" />
          <span>V</span>
        </div>
        <div className="footer-date">{date.short}</div>
      </div>
    </footer>
  );
}

export default Footer;
