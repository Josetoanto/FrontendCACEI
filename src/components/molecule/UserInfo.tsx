interface UserInfoProps {
    nombre: string;
    fotoPerfil: string;
    profesion: string;
    ubicacion: string;
  }
  
  const UserInfo: React.FC<UserInfoProps> = ({ nombre, fotoPerfil, profesion, ubicacion }) => {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "16px",
      }}>
        {/* Foto de perfil */}
        <img src={fotoPerfil} alt="Foto de perfil" style={{ width: "80px", height: "80px", borderRadius: "50%", marginRight: "16px" }} />
        
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
  