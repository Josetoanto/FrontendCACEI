import DescripcionProyecto from "../atoms/DescripcionProyecto";
import EnviarReporte from "../atoms/EnviarReporte";
import DetallesPresentacion from "../molecule/DetallesPresentacion";
import Header from "../organisms/Header";
import RubricaPresentacion from "../organisms/RubricaPresentacion";

const EvaluacionProyecto: React.FC = () => {
    return (
      <div style={{textAlign:"center", flex:"1"}}>
        <Header></Header>
        <div style={{maxWidth:"800px", margin: "0 auto"}}>
        <h3 style={{textAlign:"left", fontWeight:"lighter", color:"#61788A"}}>Evaluacion de proyecto</h3>
        <h1 style={{textAlign:"left"}}>Revision de proyecto "Titulo del proyecto"</h1>
        <DetallesPresentacion
      datos={[
        { etiqueta: "Presentador", valor: "Ava Turner" },
        { etiqueta: "Fecha de presentación", valor: "10 de mayo, 2025" },
        { etiqueta: "Estatus", valor: "Finalizado" },
        { etiqueta: "Evidencia", valor: "Video de presentación" }
      ]} />
      <DescripcionProyecto descripcion="Este proyecto tiene como objetivo mostrar ideas innovadoras de startups en la industria tecnológica. Los participantes presentarán sus conceptos, planes de negocios y análisis de mercado a un panel de jueces. La evaluación se centrará en la creatividad, la viabilidad y el impacto potencial dentro del sector tecnológico." />
      <RubricaPresentacion />    
      <h3 style={{fontSize:"16px", textAlign:"left"}}>Comentario</h3>
      <input style={{borderRadius:"6px", width:"100%", border:"1px solid #61788A", height:"25px"}} />
      <EnviarReporte></EnviarReporte>
        </div>
      </div>
    );
  };
  
export default EvaluacionProyecto;
  