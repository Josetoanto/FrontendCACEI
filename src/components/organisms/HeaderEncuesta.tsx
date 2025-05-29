import { Dispatch, SetStateAction } from "react";
import upLogo from "../../assets/upLogo.png";
import ProfilePicture from "../atoms/ProfilePicture";

interface HeaderEncuestaProps {
  activo: string;
  setActivo: Dispatch<SetStateAction<string>>;
}

const HeaderEncuesta: React.FC<HeaderEncuestaProps> = ({ activo, setActivo }) => {
  return (
    <div style={{
      padding: "16px",
      paddingBottom:"0px",
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column"
    }}>
      
      {/* Sección superior */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Izquierda: Imagen + Nombre Encuesta */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={upLogo} alt="Encuesta" style={{  marginRight: "12px", height: "auto", width: "36px" }} />
          <h2 style={{ margin: 0, fontSize:"18px" }}>Encuesta de satisfacción</h2>
        </div>

        {/* Derecha: Botón Publicar + Imagen Perfil */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}>Publicar</button>
    <ProfilePicture src={""} ></ProfilePicture>
        </div>
      </div>

      {/* Menú de navegación */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "12px",
        borderBottom: "2px solid #ddd"
      }}>
        {["Preguntas", "Respuestas", "Configuración"].map((item) => (
          <div 
            key={item} 
            onClick={() => setActivo(item)}
            style={{
                fontSize:"14px",
              padding: "10px 20px",
              cursor: "pointer",
              color: activo === item ? "#007bff" : "#333",
              fontWeight: activo === item ? "bold" : "normal",
              borderBottom: activo === item ? "2px solid #007bff" : "none"
            }}
          >
            {item}
          </div>
        ))}
      </div>

    </div>
  );
};

export default HeaderEncuesta;
