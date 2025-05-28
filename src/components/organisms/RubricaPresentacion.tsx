import RubricaItem from "../atoms/RubricaItem";

const rubricas = [
  { titulo: "Diseño", descripcion: "Se evalúa la coherencia y estética visual del proyecto." },
  { titulo: "Impacto en la comunidad", descripcion: "Cómo afecta positiva o negativamente a su entorno." },
  { titulo: "Implementación y ejecución", descripcion: "La viabilidad y correcta aplicación del proyecto." },
  { titulo: "Sustentabilidad", descripcion: "Capacidad de perdurar en el tiempo sin afectar recursos." },
  { titulo: "Innovación y originalidad", descripcion: "Uso creativo y novedoso de tecnologías o ideas." }
];

const RubricaPresentacion: React.FC = () => {
  return (
    <div style={{
      margin: "auto",
      borderRadius: "10px",
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "16px" }}>Rúbrica de Evaluación</h2>
      
      {rubricas.map((item, index) => (
        <RubricaItem key={index} titulo={item.titulo} descripcion={item.descripcion} />
      ))}
    </div>
  );
};

export default RubricaPresentacion;
