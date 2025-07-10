import { useState, useEffect, Dispatch, SetStateAction } from "react";

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
  setSurveyData: Dispatch<SetStateAction<Survey | null>>;
}

const ConfiguracionEncuesta: React.FC<ConfiguracionEncuestaProps> = ({ surveyData, setSurveyData }) => {
  const [tipoUsuario, setTipoUsuario] = useState<Survey['tipo'] | "Anonima">(surveyData?.anonima === 1 ? "Anonima" : (surveyData?.tipo || "egresado"));
  const [fechaInicio, setFechaInicio] = useState(surveyData?.inicio ? surveyData.inicio.split(' ')[0] : "");
  const [fechaFin, setFechaFin] = useState(surveyData?.fin ? surveyData.fin.split(' ')[0] : "");

  useEffect(() => {
    if (surveyData) {
      setTipoUsuario(surveyData.anonima === 1 ? "Anonima" : surveyData.tipo);
      // Tomar solo la parte de la fecha (YYYY-MM-DD) para los inputs
      setFechaInicio(surveyData.inicio ? surveyData.inicio.split(' ')[0] : "");
      setFechaFin(surveyData.fin ? surveyData.fin.split(' ')[0] : "");
    }
  }, [surveyData]);

  const handleTipoUsuarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as 'egresado' | 'empleador' | 'autoevaluacion' | 'Anonima';
    setTipoUsuario(selectedValue);
    if (setSurveyData) {
      setSurveyData(prev => prev ? { ...prev, tipo: selectedValue === 'Anonima' ? 'autoevaluacion' : selectedValue, anonima: selectedValue === 'Anonima' ? 1 : 0 } : null);
    }
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFechaInicio(newDate);
    if (setSurveyData) {
      setSurveyData(prev => prev ? { ...prev, inicio: `${newDate} 00:00:01` } : null);
    }
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFechaFin(newDate);
    if (setSurveyData) {
      setSurveyData(prev => prev ? { ...prev, fin: `${newDate} 23:59:59` } : null);
    }
  };

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
          onChange={handleTipoUsuarioChange}
          disabled={!!surveyData?.id}
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
          <option value="egresado">Egresado</option>
          <option value="empleador">Empleador</option>
          <option value="Anonima">Anónima</option>
        </select>
      </div>

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
              onChange={handleFechaInicioChange}
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
              onChange={handleFechaFinChange}
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
