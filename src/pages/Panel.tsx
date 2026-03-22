
import { useState, useEffect } from 'react';
import PanelLogin from './PanelLogin';
import './Panel.css';

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

function AsistenteCard({ a }: { a: Asistente }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="panel__card">
      <div className="panel__card-header" onClick={() => setOpen(o => !o)}>
        <span className="panel__card-name">{a.nombre} {a.apellidos}</span>
        <span className="panel__card-meta">{a.bus === 'sí' ? `🚌 ${a.parada}` : ''}</span>
        <span className={`panel__card-chevron${open ? ' open' : ''}`}>▼</span>
      </div>
      {open && (
        <div className="panel__card-body">
          <div className="panel__field">
            <span className="panel__field-label">Teléfono</span>
            <span className="panel__field-value"><a href={`tel:${a.telefono}`}>{a.telefono || '-'}</a></span>
          </div>
          <div className="panel__field">
            <span className="panel__field-label">Email</span>
            <span className="panel__field-value"><a href={`mailto:${a.email}`}>{a.email || '-'}</a></span>
          </div>
          <div className="panel__field">
            <span className="panel__field-label">Acompañantes</span>
            <span className="panel__field-value">{a.acompanantes || '-'}</span>
          </div>
          <div className="panel__field">
            <span className="panel__field-label">Autobús</span>
            <span className="panel__field-value">
              <span className={`panel__badge ${a.bus === 'sí' ? 'panel__badge--yes' : 'panel__badge--no'}`}>
                {a.bus === 'sí' ? `Sí · ${a.parada}` : 'No'}
              </span>
            </span>
          </div>
          {a.talla && (
            <div className="panel__field">
              <span className="panel__field-label">Talla</span>
              <span className="panel__field-value">{a.talla}</span>
            </div>
          )}
          {a.preferencias && (
            <div className="panel__field">
              <span className="panel__field-label">Preferencias</span>
              <span className="panel__field-value">{a.preferencias}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CancionCard({ c }: { c: Cancion }) {
  return (
    <div className="panel__card">
      <div className="panel__card-header" style={{ cursor: 'default' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="panel__card-name">🎵 {c.cancion}</div>
          {c.artista && <div className="panel__card-meta" style={{ maxWidth: '100%', marginTop: 2 }}>{c.artista}</div>}
        </div>
      </div>
      {c.nombre && (
        <div className="panel__card-body">
          <div className="panel__field">
            <span className="panel__field-label">Enviada por</span>
            <span className="panel__field-value">{c.nombre}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Panel() {
  const [auth, setAuth] = useState(false);
  const [asistentes, setAsistentes] = useState<Asistente[]>([]);
  const [canciones, setCanciones] = useState<Cancion[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [asistSort, setAsistSort] = useState<{ key: keyof Asistente; asc: boolean }>({ key: 'nombre', asc: true });
  const [cancionSort, setCancionSort] = useState<{ key: keyof Cancion; asc: boolean }>({ key: 'cancion', asc: true });
  const [tab, setTab] = useState<'asistencia' | 'musica'>('asistencia');

  useEffect(() => {
    if (!auth) return;
    setLoading(true);
    setFetchError('');
    Promise.all([
      fetch('/api/panel-asistencia').then(r => r.json()),
      fetch('/api/panel-canciones').then(r => r.json()),
    ]).then(([asist, songs]) => {
      setAsistentes(asist.data || []);
      setCanciones(songs.data || []);
      setLoading(false);
    }).catch((err) => {
      setFetchError(String(err));
      setLoading(false);
    });
  }, [auth]);

  if (!auth) return <PanelLogin onAuth={() => setAuth(true)} />;

  const sortedAsistentes = sortBy(asistentes, asistSort.key, asistSort.asc);
  const sortedCanciones = sortBy(canciones, cancionSort.key, cancionSort.asc);
  const conBus = asistentes.filter(a => a.bus === 'sí').length;

  const thSort = (key: keyof Asistente, label: string) => (
    <th onClick={() => setAsistSort(s => ({ key, asc: s.key === key ? !s.asc : true }))}>
      {label} {asistSort.key === key ? (asistSort.asc ? '↑' : '↓') : ''}
    </th>
  );

  const thSortC = (key: keyof Cancion, label: string) => (
    <th onClick={() => setCancionSort(s => ({ key, asc: s.key === key ? !s.asc : true }))}>
      {label} {cancionSort.key === key ? (cancionSort.asc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div className="panel">
      <div className="panel__header">
        <h1 className="panel__title">Panel de Control</h1>
        <p className="panel__subtitle">Pablo &amp; Vega · 22 Agosto 2026</p>
      </div>

      <div className="panel__stats">
        <div className="panel__stat">
          <div className="panel__stat-number">{asistentes.length}</div>
          <div className="panel__stat-label">Confirmados</div>
        </div>
        <div className="panel__stat">
          <div className="panel__stat-number">{conBus}</div>
          <div className="panel__stat-label">Con autobús</div>
        </div>
        <div className="panel__stat">
          <div className="panel__stat-number">{canciones.length}</div>
          <div className="panel__stat-label">Canciones</div>
        </div>
      </div>

      <div className="panel__tabs">
        <button className={`panel__tab${tab === 'asistencia' ? ' active' : ''}`} onClick={() => setTab('asistencia')}>
          Asistencia
        </button>
        <button className={`panel__tab${tab === 'musica' ? ' active' : ''}`} onClick={() => setTab('musica')}>
          Música
        </button>
      </div>

      <div className="panel__content">
        {fetchError && (
          <p className="panel__loading" style={{ color: '#ffb3b3' }}>Error al cargar datos: {fetchError}</p>
        )}
        {tab === 'asistencia' && (
          <>
            <p className="panel__section-title">{asistentes.length} asistentes</p>
            {loading ? <p className="panel__loading">Cargando...</p> : (
              <>
                {/* Mobile: cards */}
                <div className="panel__cards">
                  {sortedAsistentes.map(a => <AsistenteCard key={a.id} a={a} />)}
                </div>
                {/* Desktop: table */}
                <div className="panel__table-wrap">
                  <table className="panel__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        {thSort('nombre', 'Nombre')}
                        {thSort('apellidos', 'Apellidos')}
                        {thSort('acompanantes', 'Acompañantes')}
                        {thSort('telefono', 'Teléfono')}
                        {thSort('email', 'Email')}
                        {thSort('bus', 'Bus')}
                        {thSort('parada', 'Parada')}
                        {thSort('talla', 'Talla')}
                        {thSort('preferencias', 'Preferencias')}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAsistentes.map((a, idx) => (
                        <tr key={a.id}>
                          <td>{idx + 1}</td>
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
              </>
            )}
          </>
        )}

        {tab === 'musica' && (
          <>
            <p className="panel__section-title">{canciones.length} canciones</p>
            {loading ? <p className="panel__loading">Cargando...</p> : (
              <>
                {/* Mobile: cards */}
                <div className="panel__cards">
                  {sortedCanciones.map(c => <CancionCard key={c.id} c={c} />)}
                </div>
                {/* Desktop: table */}
                <div className="panel__table-wrap">
                  <table className="panel__table">
                    <thead>
                      <tr>
                        <th>#</th>
                        {thSortC('nombre', 'Enviada por')}
                        {thSortC('cancion', 'Canción')}
                        {thSortC('artista', 'Artista')}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedCanciones.map((c, idx) => (
                        <tr key={c.id}>
                          <td>{idx + 1}</td>
                          <td>{c.nombre || '-'}</td>
                          <td>{c.cancion || '-'}</td>
                          <td>{c.artista || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Panel;
