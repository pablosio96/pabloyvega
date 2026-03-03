
import { useState } from 'react';
import './Home.css';

export const ACCENT = 'var(--color-primary)'; // Azul Home

function PanelLogin({ onAuth }: { onAuth: () => void }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Cambia estas credenciales por las que quieras
    if (user === 'admin' && pass === 'boda2026') {
      onAuth();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="tw-hero" style={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', display: 'flex', background: 'var(--color-primary)' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 40, borderRadius: 18, boxShadow: '0 4px 32px rgba(34,48,74,0.10)', minWidth: 320, maxWidth: 380, width: '100%' }}>
        <h2 style={{ color: 'var(--color-primary)', marginBottom: 28, fontFamily: 'Meow Script, MeowScript, cursive', fontSize: 38, textAlign: 'center', fontWeight: 400 }}>Panel de Control</h2>
        <div style={{ marginBottom: 20 }}>
          <input type="text" placeholder="Usuario" value={user} onChange={e => setUser(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #dbeafe', fontSize: 17, fontFamily: 'Cormorant Garamond, serif', color: '#22304a', background: '#f7faff' }} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <input type="password" placeholder="Contraseña" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #dbeafe', fontSize: 17, fontFamily: 'Cormorant Garamond, serif', color: '#22304a', background: '#f7faff' }} />
        </div>
        {error && <div style={{ color: '#b04a60', marginBottom: 16, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
        <button type="submit" className="tw-btn tw-btn--full" style={{ background: 'var(--color-primary)', borderColor: 'var(--color-primary)', color: '#fff', fontSize: 18, borderRadius: 25, marginTop: 8 }}>Entrar</button>
      </form>
    </div>
  );
}

export default PanelLogin;
