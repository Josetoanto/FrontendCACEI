import AgregarProyectoBoton from "../atoms/AgregarProyectoBoton";
import Proyecto from "../molecule/Proyecto";

interface ListaDeProyectosProps {
  titulo: string;
  proyectos: { nombre: string; fecha: string }[];
}

const ListaDeProyectos: React.FC<ListaDeProyectosProps> = ({ titulo, proyectos }) => {
  return (
    <div style={{
      margin: "auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px" }}>{titulo}</h2>
      
      {/* Lista de proyectos */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {proyectos.map((proyecto, index) => (
          <Proyecto key={index} nombre={proyecto.nombre} fecha={proyecto.fecha} />
        ))}
      </div>
      <AgregarProyectoBoton></AgregarProyectoBoton>
    </div>
  );
};

export default ListaDeProyectos;
