import FormularioAgregarProyecto from "../organisms/FormularioAgregarProyecto";
import Header from "../organisms/Header";

const AgregarProyecto: React.FC = () => {
    return (
      <div style={{ textAlign: "left" }}>
        <Header></Header>
        <FormularioAgregarProyecto></FormularioAgregarProyecto>
      </div>
    );
  };
  
  export default AgregarProyecto;
  