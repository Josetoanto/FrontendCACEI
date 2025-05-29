import { useState } from "react";
import HeaderEncuesta from "../organisms/HeaderEncuesta";
import CreacionDeEncuesta from "../organisms/CreacionDeEncuesta";
import RespuestaCard from "../molecule/RespuestaCard";
import ConfiguracionEncuesta from "../molecule/ConfiguracionEncuesta";

const CrearEncuesta: React.FC = () => {
  const [activo, setActivo] = useState("Preguntas");

  return (
    <div style={{ backgroundColor:"#f0ebf8", minHeight:"100vh", paddingBottom:"12px"
    }} >
      <HeaderEncuesta activo={activo} setActivo={setActivo} />
      {activo === "Preguntas" && <CreacionDeEncuesta />}
      {activo === "Respuestas" && <RespuestaCard></RespuestaCard>}
      {activo === "Configuración" && <ConfiguracionEncuesta />}
    </div>
  );
};

export default CrearEncuesta;
  