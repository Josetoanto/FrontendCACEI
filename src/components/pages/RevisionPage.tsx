import InformationCard from "../molecule/InformationCard";
import DetallesDelProyecto from "../organisms/DetallesDelProyecto";
import EstadoDeProyecto from "../organisms/EstadoDeProyecto";
import Header from "../organisms/Header";
import Rubrica from "../organisms/Rubrica";

const Revision: React.FC = () => {
    return (
        <div>
        <Header></Header>
      <div style={{ display: "flex", width: "100%", height: "100vh", padding: "18px", boxSizing: "border-box" }}>
        {/* Columna izquierda (70%) */}
        <div style={{ flex: "70%", padding: "20px", backgroundColor: "transparent", borderRadius: "8px" }}>
          <h2 style={{fontSize:"24px"}}>Revisión de la presentación de proyectos</h2>
          <p style={{fontSize:"16px"}}>Revise la presentación del proyecto y la puntuación en función de la rúbrica proporcionada.</p>
          <DetallesDelProyecto 
      titulo="Proyecto de Github" 
      descripcion="Descripción del proyecto"
      evidencia={[
        "https://documento1.com",
        "https://imagen2.com",
        "https://video3.com"
      ]}
      ultimoComentario="Este proyecto es un poco aburrido" />
      <EstadoDeProyecto />
      <h3 style={{fontSize:"14px", color:"#61788A"}}>Subido por Jose Antonio el 16 de Mayo, 2025</h3>
        </div>
  
        {/* Columna derecha (30%) */}
        <div style={{ flex: "30%", padding: "20px", backgroundColor: "transparent", borderRadius: "8px" }}>
          <h3>Puntuacion general</h3>
          <InformationCard title={"Puntos totales"} value={"85/100"} ></InformationCard>
          <Rubrica></Rubrica>
        </div>

      </div>
      </div>
    );
  };
  
  export default Revision;
  