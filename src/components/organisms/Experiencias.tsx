import ExperienciaCard from "../molecule/ExperienciaCard";
import experienciaImage1 from "../../assets/encuestImage1.jpg";
import experienciaImage2 from "../../assets/encuestImage2.jpg";
import React from 'react';

interface Experiencia {
  titulo: string;
  ubicacion: string;
  tiempo: string;
}

interface ExperienciasProps {
  experiencias: Experiencia[];
  isEditing: boolean;
  setExperiencias: React.Dispatch<React.SetStateAction<Experiencia[]>>;
}

const images = [experienciaImage1, experienciaImage2];

const Experiencias: React.FC<ExperienciasProps> = ({ experiencias, isEditing }) => {
  return (
    <div style={{
      maxWidth: "1000px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      paddingBottom: "0px",
      paddingTop: "0px"
    }}>
      <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Experiencias</h2>

      {!isEditing && experiencias.map((item, index) => (
        <ExperienciaCard 
          key={index} 
          titulo={item.titulo} 
          ubicacion={item.ubicacion} 
          tiempo={item.tiempo} 
          imagen={images[Math.floor(Math.random() * images.length)]}
        />
      ))}

    </div>
  );
};

export default Experiencias;
