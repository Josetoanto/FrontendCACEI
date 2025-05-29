import React from "react";
import UserInfo from "../molecule/UserInfo";
import EditarPerfil from "../atoms/EditarPerfil";
import EditarInfoBasica from "../molecule/EditarInfoBasica";

interface PerfilCardProps {
  userData: {
    nombre: string;
    fotoPerfil: string;
    profesion: string;
    ubicacion: string;
    descripcion: string;
  };
  isEditing?: boolean;
  toggleEditing?: () => void;
  onSave?: (newData: {
    nombre: string;
    profesion: string;
    ubicacion: string;
    descripcion: string;
  }) => void;
  onCancel?: () => void;
}

const PerfilCard: React.FC<PerfilCardProps> = ({ userData, isEditing, toggleEditing, onSave, onCancel }) => {
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
        {
            isEditing ? (
                <EditarInfoBasica 
                    initialData={userData} 
                    onSave={onSave!}
                    onCancel={onCancel!}
                />
            ) : (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <UserInfo nombre={userData.nombre} fotoPerfil={userData.fotoPerfil} profesion={userData.profesion} ubicacion={userData.ubicacion} />
                    <EditarPerfil onClick={toggleEditing} />
                </div>
            )
        }
      {/* Espacio para más contenido de perfil */}
     
    </div>
  );
};

export default PerfilCard;
