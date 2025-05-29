import Curso from "../atoms/Curso";

const cursos = [
  { nombre: "Animación UI Básica", fecha: "2020", url: "https://coursera.org/curso-animacion-ui" },
  { nombre: "Diseño con extracción de datos", fecha: "2019", url: "https://udemy.com/curso-diseno-datos" }
];

const ListaDeCursos: React.FC = () => {
  return (
    <div style={{
      margin: "auto",
      padding: "20px",
      borderRadius: "10px",
      paddingBottom: "0px",
      paddingTop: "0px"
    }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Cursos</h2>

      <div style={{
        display: "flex",
        flexDirection: "column",
      }}>
        {cursos.map((item, index) => (
          <Curso key={index} nombre={item.nombre} fecha={item.fecha} url={item.url} />
        ))}
      </div>
    </div>
  );
};

export default ListaDeCursos;
