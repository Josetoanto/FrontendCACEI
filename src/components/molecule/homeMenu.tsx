import React, { useState } from "react"; // Importa useState
import HomeMenuOption from "../atoms/homeMenuOption";

const options = ["Encuestas", "Activas", "Calendario", "Cerradas", "Proyectos"];

const HomeMenu: React.FC = () => {
  const [activeOption, setActiveOption] = useState("Encuestas"); // Usa useState para manejar el estado

  return (
    <nav style={{ display: "flex", gap: "15px", borderBottom: "3px solid #ddd", paddingBottom: "0px" }}>
      {options.map((option) => (
        <HomeMenuOption 
          key={option} 
          label={option} 
          isActive={option === activeOption} 
          onClick={() => setActiveOption(option)} // Cambia la opción activa al hacer clic
        />
      ))}
    </nav>
  );
};

export default HomeMenu;