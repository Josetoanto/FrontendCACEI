import React, { useState } from "react";
import UserInfo from "../molecule/UserInfo";
import EditarPerfil from "../atoms/EditarPerfil";

interface PerfilCardProps {
  userData: {
    nombre: string;
    fotoPerfil: string;
    profesion: string;
    ubicacion: string;
  };
}

const PerfilCard: React.FC<PerfilCardProps> = ({ userData }) => {
  const [mostrarEditar] = useState(true);

  return (
    <div style={{
      maxWidth: "1000px",
      marginTop: "15px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      paddingBottom: "0px",
       borderBottom: "2px solid #ddd"
    }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
      <UserInfo nombre={userData.nombre} fotoPerfil={userData.fotoPerfil} profesion={userData.profesion} ubicacion={userData.ubicacion} />
      {mostrarEditar && <EditarPerfil />}
    </div>
      {/* Espacio para más contenido de perfil */}
     
    </div>
  );
};

export default PerfilCard;
