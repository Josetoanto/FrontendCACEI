import { useState, useEffect } from "react";
import NotificacionItem from "./NotificacionItem";
import { useNavigate } from "react-router-dom";

interface Notificacion {
  id: number;
  usuario_id: number;
  encuesta_id: number;
  mensaje: string;
  leida: number;
  enviada_en: string;
  respondida: number;
}

interface NotificacionConEncuesta extends Notificacion {
  encuestaNombre: string;
}

const Notifications: React.FC = () => {
  const [mostrar, setMostrar] = useState(false);
  const [notificaciones, setNotificaciones] = useState<NotificacionConEncuesta[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Obtener tipo de usuario logeado
  const userData = localStorage.getItem('userData');
  const tipoUsuario = userData ? JSON.parse(userData).tipo?.toLowerCase() : null;
  const token = localStorage.getItem('userToken');

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    if (!token || !tipoUsuario) return;
    setLoading(true);
    fetch('https://egresados.it2id.cc/api/notifications/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(async (data: Notificacion[]) => {
        // Filtrar notificaciones de los últimos 3 días
        const tresDiasAtras = new Date();
        tresDiasAtras.setDate(tresDiasAtras.getDate() - 3);

        const recientes = data.filter(noti => {
          const fecha = new Date(noti.enviada_en);
          return fecha >= tresDiasAtras;
        });

        // Obtener encuestas en paralelo
        const encuestas = await Promise.all(recientes.map(async (noti) => {
          try {
            const res = await fetch(`https://egresados.it2id.cc/api/surveys/${noti.encuesta_id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const encuesta = await res.json();
            if (encuesta.tipo?.toLowerCase() === tipoUsuario) {
              return { ...noti, encuestaNombre: encuesta.titulo || 'Encuesta' };
            }
          } catch (e) {
            // Si falla, no agregar
          }
          return null;
        }));

        // Filtrar nulos
        setNotificaciones(encuestas.filter(Boolean) as NotificacionConEncuesta[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, tipoUsuario]);

  // Contador de notificaciones no leídas y no respondidas
  const notificacionesNoRespondidas = notificaciones.filter(n => n.respondida === 0);
  const pendientes = notificacionesNoRespondidas.filter(n => n.leida === 0).length;

  return (
    <div style={{ position: "relative" }}>
      <button 
        aria-label="Notificaciones" 
        style={{ 
          backgroundColor: 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          outline: 'none',
          position: 'relative'
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onClick={() => setMostrar(!mostrar)}
      >
        <i className="fas fa-bell" style={{ fontSize: '2em' }}></i>
        {pendientes > 0 && (
          <span style={{
            position: 'absolute',
            top: '18px',
            right: '-12px',
            background: '#ff3b3b',
            color: 'white',
            borderRadius: '95%',
            padding: '2px 7px',
            fontSize: '0.85em',
            fontWeight: 'bold',
            minWidth: '5px',
            textAlign: 'center',
            border: '2px solid #fff',
            boxShadow: '0 0 2px #aaa'
          }}>{pendientes}</span>
        )}
      </button>
      {mostrar && (
        <div style={{
          position: "absolute",
          top: "45px",
          right: 0,
          backgroundColor: "#fff",
          borderRadius: "12px",
          padding: "18px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 10
        }}>
          <h3 style={{ margin: "0 0 15px", fontSize: "18px", textIndent:"14px" }}>Notificaciones</h3>
          {loading ? (
            <p style={{textAlign:'center'}}>Cargando...</p>
          ) : notificacionesNoRespondidas.length === 0 ? (
            <p style={{textAlign:'center'}}>No hay notificaciones</p>
          ) : (
            notificacionesNoRespondidas.map((noti) => (
              <NotificacionItem 
                key={noti.id} 
                titulo={noti.encuestaNombre} 
                mensaje={noti.mensaje} 
                encuestaId={noti.encuesta_id}
                onRevisar={() => navigate(`/responderEncuesta/${noti.encuesta_id}`)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
