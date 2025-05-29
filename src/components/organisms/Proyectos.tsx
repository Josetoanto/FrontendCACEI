import InformationCard from "../molecule/InformationCard";
import TrendChart from "../molecule/TrendChart";
import EvaluacionProyectosTabla from "./EvaluacionProyectosTabla";
import DescargarCSV from "../atoms/DescargarCSV";
import { useNavigate } from 'react-router-dom';

const Proyectos: React.FC = () => {
  const data = [
    { title: "Evaluaciones totales", value: "245" },
    { title: "Puntuación promedio", value: "82" + "/100" },
    { title: "Proyectos evaluados", value: "50" }
  ];

  const navigate = useNavigate();

  const handleModifyRubricaClick = () => {
    navigate('/modificar-rubrica');
  };

  return (
    <div style={{ width: "100%", margin: "auto", textAlign: "center" }}>
      {/* Título principal */}
      <h1 style={{textAlign:"left", fontSize: "24px", marginBottom: "10px" }}>Resumen de las evaluaciones</h1>
      <p style={{textAlign:"left", fontSize: "14px", color: "#666", marginBottom: "20px" }}>
        Explore los resultados de la evaluación integral de los proyectos de desarrollo de software.
      </p>

      {/* Tarjetas de información */}
      <div style={{marginLeft:"10px",maxWidth:"99%", display: "flex", flexDirection: "row", gap: "15px", justifyContent: "center" }}>
        {data.map((item, index) => (
          <div style={{ flex: "0 0 33%" }} key={index}>
            <InformationCard title={item.title} value={item.value} />
          </div>
        ))}
      </div>
      <div style={{borderRadius:"12px",border:"2px solid #dbe0e5",height:"420px", marginTop:"20px",padding:"20px"}}>
      <TrendChart></TrendChart>
      </div>
      <EvaluacionProyectosTabla></EvaluacionProyectosTabla>
      <DescargarCSV></DescargarCSV>
      {/* Nuevo botón para modificar rúbrica */}
      <button
        style={{
          backgroundColor: "#f0f2f5", 
          color: "#000", 
          border: "none",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "12px", 
          width:"100%",
          marginTop: "10px" 
        }}
        onClick={handleModifyRubricaClick}
      >
        Modificar Rúbrica
      </button>
    </div>
  );
};

export default Proyectos;
