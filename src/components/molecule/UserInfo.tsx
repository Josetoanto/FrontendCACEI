import React, { useState } from "react";
import profileIcon from "../../assets/profileIcon.png";

interface UserInfoProps {
    nombre: string;
    fotoPerfil: string;
    profesion: string;
    ubicacion: string;
  }
  
  const UserInfo: React.FC<UserInfoProps> = ({ nombre, fotoPerfil, profesion, ubicacion }) => {
    const [imageError, setImageError] = useState(false);
    
    // Función para manejar errores de carga de imagen
    const handleImageError = () => {
      setImageError(true);
    };
    
    // Determinar qué imagen mostrar
    const imageToShow = imageError || !fotoPerfil || fotoPerfil === '' ? profileIcon : fotoPerfil;
    
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
      }}>
        {/* Foto de perfil */}
        <img 
          src={imageToShow} 
          alt="Foto de perfil" 
          style={{ width: "80px", height: "80px", borderRadius: "50%", marginRight: "16px" }}
          onError={handleImageError}
        />
        
        {/* Información básica */}
        <div>
          <h2 style={{ margin: "0", fontSize: "18px" }}>{nombre}</h2>
        <p style={{ margin: "5px 0", color: "#555" }}>{profesion}</p>
          <p style={{ margin: "5px 0", color: "#555" }}>{ubicacion}</p>
        </div>
      </div>
    );
  };
  
  export default UserInfo;
  
