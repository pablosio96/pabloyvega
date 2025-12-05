import { Link } from 'react-router-dom';
import { House, Heart } from '@phosphor-icons/react';
import './NotFound.css';

function NotFound() {
  return (
    <main className="notfound-container">
      <div className="notfound-content">
        <Heart size={48} weight="light" className="notfound-icon" />
        <h1>404</h1>
        <p>Oops! Esta página no existe</p>
        <p className="notfound-subtitle">Parece que te has perdido camino a la boda...</p>
        <Link to="/" className="notfound-btn">
          <House size={18} weight="light" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
