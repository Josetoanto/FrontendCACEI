import { useState, useEffect } from "react";

interface Survey {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: 'egresado' | 'empleador' | 'autoevaluacion';
  anonima: 0 | 1; // 0 para no anónima, 1 para anónima
  inicio: string;
  fin: string;
}

interface ConfiguracionEncuestaProps {
  surveyData: Survey | null;
}

const ConfiguracionEncuesta: React.FC<ConfiguracionEncuestaProps> = ({ surveyData }) => {
  const [tipoUsuario, setTipoUsuario] = useState(surveyData?.tipo || "Egresado");
  const [fechaInicio, setFechaInicio] = useState(surveyData?.inicio ? new Date(surveyData.inicio).toISOString().split('T')[0] : "");
  const [fechaFin, setFechaFin] = useState(surveyData?.fin ? new Date(surveyData.fin).toISOString().split('T')[0] : "");
  const [activa, setActiva] = useState(surveyData?.anonima === 1);

  useEffect(() => {
    if (surveyData) {
      setTipoUsuario(surveyData.tipo);
      setFechaInicio(new Date(surveyData.inicio).toISOString().split('T')[0]);
      setFechaFin(new Date(surveyData.fin).toISOString().split('T')[0]);
      setActiva(surveyData.anonima === 1);
    }
  }, [surveyData]);

  return (
    <div style={{
      background: "#ffffff",
      padding: "32px",
      paddingBottom:"32px",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      maxWidth: "800px",
      margin: "32px auto",
      boxShadow: "0 4px 16px 0 #ece6f6",
      marginBottom: "64px"
    }}>
      <h2 style={{ fontWeight: "bold", fontSize: "22px", marginBottom: "32px" }}>Configuración</h2>
      <hr style={{ border: "none", borderTop: "1px solid #ece6f6", margin: "32px 0" }} />


      {/* Tipo de usuario */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "17px" }}>Tipo de usuario</div>
          <div style={{ color: "#888", fontSize: "14px", marginBottom: "0", width:"250px", paddingTop:"16px" }}>
            Selecciona si la encuesta seria enviada a egresados, evaluadores o sera anonima
          </div>
        </div>
        <select
          value={tipoUsuario}
          onChange={e => setTipoUsuario(e.target.value)}
          style={{
            width: "260px",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            fontSize: "16px",
            background: "#fff",
            boxShadow: "0 2px 8px 0 #ece6f6"
          }}
        >
          <option value="Egresado">Egresado</option>
          <option value="Empleador">Empleador</option>
          <option value="Anonima">Anónima</option>
        </select>
      </div>
      {tipoUsuario === "Anonima" && (
        <div style={{
          marginTop: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end"
        }}>
          <span style={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "#6c63ff",
            background: "#f3f0fa",
            borderRadius: "8px",
            padding: "10px 24px",
            letterSpacing: "4px",
            boxShadow: "0 2px 8px 0 #ece6f6"
          }}>
            {Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join("")}
          </span>
          <span style={{ fontSize: "13px", color: "#888", marginTop: "16px" }}>
            Código de acceso anónimo
          </span>
        </div>
      )}
      <hr style={{ border: "none", borderTop: "1px solid #ece6f6", margin: "32px 0" }} />

      {/* Calendario */}
      <div style={{ marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: "bold", fontSize: "17px" }}>Calendario</div>
          <div style={{ color: "#888", fontSize: "14px", marginBottom: "0" , width:"250px", paddingTop:"16px"}}>
            Tiempo para responder la encuesta
          </div>
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
                background: "#fff",
                width: "180px"
              }}
            />
            <span style={{ fontSize: "13px", color: "#888", marginTop: "4px", textAlign: "left" }}>Inicio</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                fontSize: "16px",
                background: "#fff",
                width: "180px"
              }}
            />
            <span style={{ fontSize: "13px", color: "#888", marginTop: "4px", textAlign: "left" }}>Fin</span>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #ece6f6", margin: "32px 0" }} />

      {/* Encuesta activa */}
    </div>
  );
};

export default ConfiguracionEncuesta;
