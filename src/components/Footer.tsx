import { WEDDING_CONFIG } from '../config';
import './Footer.css';

function Footer() {
  const { date, couple } = WEDDING_CONFIG;

  return (
    <footer className="global-footer">
      <div className="footer-content">
        <div className="footer-names">{couple.footerNames}</div>
        <div className="footer-date">{date.short}</div>
      </div>
    </footer>
  );
}

export default Footer;
