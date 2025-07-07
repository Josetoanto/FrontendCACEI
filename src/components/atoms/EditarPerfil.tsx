import React from 'react';

interface EditarPerfilProps {
  onClick?: () => void;
}

const EditarPerfil: React.FC<EditarPerfilProps> = ({ onClick }) => {
    return (
      <button 
        style={{
          backgroundColor: "#f0f2f5",
          color: "#000",
          borderRadius: "12px",
          border: "0px solid #ddd",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          textAlign: "center",
          height:"50px",
          margin:"auto",
          marginRight:"0px"
        }}
        onClick={onClick}
      >
        Editar perfil
      </button>
    );
  };
  
  export default EditarPerfil;
  
