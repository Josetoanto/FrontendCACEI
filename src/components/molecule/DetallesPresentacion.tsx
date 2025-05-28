import DatoPresentacion from "../atoms/DatoPresentacion";

interface DetallesProps {
  datos: { etiqueta: string; valor: string }[];
}

const DetallesPresentacion: React.FC<DetallesProps> = ({ datos }) => {
  return (
    <div style={{
      width: "100%",
      margin: "auto",
      borderRadius: "10px",
      backgroundColor: "#fff"
    }}>
      <h3 style={{ textAlign: "left", marginBottom: "20px", fontSize: "16px", fontWeight: "bold" }}>
        General
      </h3>

      {/* Lista de datos dinámicos */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {datos.map((item, index) => (
          <DatoPresentacion key={index} etiqueta={item.etiqueta} valor={item.valor} />
        ))}
      </div>
    </div>
  );
};

export default DetallesPresentacion;
