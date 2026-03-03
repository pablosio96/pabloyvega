
import { useState, useEffect } from 'react';
import PanelLogin from './PanelLogin';
import { ACCENT } from './PanelLogin';
import { useCallback } from 'react';



// ACCENT ya está declarado en PanelLogin, así que no lo redeclaramos aquí


type Asistente = {
  id: number;
  nombre: string;
  apellidos: string;
  acompanantes: string;
  telefono: string;
  email: string;
  bus: string;
  parada: string;
  talla: string;
  preferencias: string;
  created_at?: string;
};

type Cancion = {
  id: number;
  nombre: string;
  cancion: string;
  artista: string;
  created_at?: string;
};


function sortBy<T>(arr: T[], key: keyof T, asc = true) {
  return [...arr].sort((a, b) => {
    if (a[key] === b[key]) return 0;
    if (a[key] == null) return 1;
    if (b[key] == null) return -1;
    return asc
      ? String(a[key]).localeCompare(String(b[key]))
      : String(b[key]).localeCompare(String(a[key]));
  });
}

function Panel() {
  const [auth, setAuth] = useState(false);
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [loading, setLoading] = useState(true);
  const [asistSort, setAsistSort] = useState<{ key: keyof Asistente; asc: boolean }>({ key: 'nombre', asc: true });
  const [cancionSort, setCancionSort] = useState<{ key: keyof Cancion; asc: boolean }>({ key: 'cancion', asc: true });
  const [tab, setTab] = useState<'asistencia' | 'musica'>('asistencia');

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    Promise.all([
      fetch('/api/panel-asistencia').then(r => r.json()),
      fetch('/api/panel-canciones').then(r => r.json()),
    ]).then(([asist, songs]) => {
      setAsistentes(asist.data || []);
      setCanciones(songs.data || []);
      setLoading(false);
    });
  }, [auth]);

  if (!auth) {
    return <PanelLogin onAuth={() => setAuth(true)} />;
  }

  return (
    <div className="test-wedding" style={{ background: 'var(--color-primary)', minHeight: '100vh', padding: 0 }}>
      <section className="tw-hero" style={{ minHeight: 120, background: 'var(--color-primary)', color: '#fff', borderRadius: 0, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="tw-hero__names" style={{ fontFamily: 'Meow Script, MeowScript, cursive', fontSize: 54, color: '#fff', fontWeight: 400, margin: 0 }}>Panel de Control</h1>
      </section>
      <section className="tw-schedule" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
          <button
            className="tw-btn"
            style={{ background: tab === 'asistencia' ? '#fff' : 'rgba(255,255,255,0.2)', color: tab === 'asistencia' ? 'var(--color-primary)' : '#fff', borderColor: 'transparent', fontWeight: 600, fontSize: 18, borderRadius: 18, padding: '10px 28px', boxShadow: tab === 'asistencia' ? '0 2px 8px rgba(34,48,74,0.10)' : 'none', transition: 'all 0.2s' }}
            onClick={() => setTab('asistencia')}
          >Asistencia</button>
          <button
            className="tw-btn"
            style={{ background: tab === 'musica' ? '#fff' : 'rgba(255,255,255,0.2)', color: tab === 'musica' ? 'var(--color-primary)' : '#fff', borderColor: 'transparent', fontWeight: 600, fontSize: 18, borderRadius: 18, padding: '10px 28px', boxShadow: tab === 'musica' ? '0 2px 8px rgba(34,48,74,0.10)' : 'none', transition: 'all 0.2s' }}
            onClick={() => setTab('musica')}
          >Música</button>
        </div>
        {tab === 'asistencia' && (
          <>
            <h2 className="tw-section-title tw-script" style={{ color: '#fff', fontSize: 38, marginBottom: 18 }}>Asistentes</h2>
            {loading ? <p style={{ color: '#fff' }}>Cargando...</p> : (
              <div style={{ overflowX: 'auto', borderRadius: 12, background: '#fff', boxShadow: '0 2px 12px rgba(34,48,74,0.08)', marginBottom: 32 }}>
                <table style={{ width: '100%', minWidth: 700, color: 'var(--color-primary)', borderRadius: 12, fontFamily: 'Cormorant Garamond, serif', fontSize: 18, background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#e6f7ff', color: 'var(--color-primary)', cursor: 'pointer' }}>
                      <th style={{ minWidth: 40 }}>#</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'nombre', asc: s.key === 'nombre' ? !s.asc : true }))}>Nombre</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'apellidos', asc: s.key === 'apellidos' ? !s.asc : true }))}>Apellidos</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'acompanantes', asc: s.key === 'acompanantes' ? !s.asc : true }))}>Acompañantes</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'telefono', asc: s.key === 'telefono' ? !s.asc : true }))}>Teléfono</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'email', asc: s.key === 'email' ? !s.asc : true }))}>Email</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'bus', asc: s.key === 'bus' ? !s.asc : true }))}>Bus</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'parada', asc: s.key === 'parada' ? !s.asc : true }))}>Parada</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'talla', asc: s.key === 'talla' ? !s.asc : true }))}>Talla</th>
                      <th onClick={() => setAsistSort(s => ({ key: 'preferencias', asc: s.key === 'preferencias' ? !s.asc : true }))}>Preferencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortBy(asistentes, asistSort.key, asistSort.asc).map((a, idx, arr) => (
                      <tr key={a.id}>
                        <td style={{ fontWeight: 600 }}>{idx + 1}</td>
                        <td>{a.nombre || '-'}</td>
                        <td>{a.apellidos || '-'}</td>
                        <td>{a.acompanantes || '-'}</td>
                        <td>{a.telefono || '-'}</td>
                        <td>{a.email || '-'}</td>
                        <td>{a.bus || '-'}</td>
                        <td>{a.parada || '-'}</td>
                        <td>{a.talla || '-'}</td>
                        <td>{a.preferencias || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {tab === 'musica' && (
          <>
            <h2 className="tw-section-title tw-script" style={{ color: '#fff', fontSize: 38, margin: '32px 0 18px' }}>Canciones</h2>
            {loading ? <p style={{ color: '#fff' }}>Cargando...</p> : (
              <div style={{ overflowX: 'auto', borderRadius: 12, background: '#fff', boxShadow: '0 2px 12px rgba(34,48,74,0.08)' }}>
                <table style={{ width: '100%', minWidth: 500, color: 'var(--color-primary)', borderRadius: 12, fontFamily: 'Cormorant Garamond, serif', fontSize: 18, background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#e6f7ff', color: 'var(--color-primary)', cursor: 'pointer' }}>
                      <th style={{ minWidth: 40 }}>#</th>
                      <th onClick={() => setCancionSort(s => ({ key: 'nombre', asc: s.key === 'nombre' ? !s.asc : true }))}>Nombre</th>
                      <th onClick={() => setCancionSort(s => ({ key: 'cancion', asc: s.key === 'cancion' ? !s.asc : true }))}>Canción</th>
                      <th onClick={() => setCancionSort(s => ({ key: 'artista', asc: s.key === 'artista' ? !s.asc : true }))}>Artista</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortBy(canciones, cancionSort.key, cancionSort.asc).map((c, idx, arr) => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{idx + 1}</td>
                        <td>{c.nombre || '-'}</td>
                        <td>{c.cancion || '-'}</td>
                        <td>{c.artista || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default Panel;
