import Habilidad from "../atoms/Habilidad";

const habilidades = ["Diseñador", "Programador", "React", "Java", "Python", "AWS"];

const ListaDeHabilidades: React.FC = () => {
  return (
    <div style={{
      padding: "20px",
      paddingTop: "1px",
      paddingBottom: "4px"
    }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Habilidades</h2>
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        justifyContent: "left",
        paddingLeft: "15px"
      }}>
        {habilidades.map((item, index) => (
          <Habilidad key={index} habilidad={item} />
        ))}
      </div>    
    </div>
  );
};

export default ListaDeHabilidades;
