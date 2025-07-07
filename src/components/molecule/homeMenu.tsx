import React from "react"; // Importa useState
import HomeMenuOption from "../atoms/homeMenuOption";

interface HomeMenuProps {
  activeOption: string;
  setActiveOption: (option: string) => void;
  options: string[]; // Agregado para recibir opciones como prop
}

const HomeMenu: React.FC<HomeMenuProps> = ({ activeOption, setActiveOption, options }) => {
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
