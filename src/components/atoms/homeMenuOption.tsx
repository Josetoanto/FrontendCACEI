interface HomeMenuOptionProps {
    label: string;
    isActive?: boolean;
    onClick: () => void; // Agrega la propiedad onClick
}

const HomeMenuOption: React.FC<HomeMenuOptionProps> = ({ label, isActive, onClick }) => {
    return (
      <button
        onClick={onClick} // Añade el evento onClick
        style={{
          padding: "10px 15px",
          fontWeight: isActive ? "bold" : "normal",
          color: isActive ? "#000" : "#888",
          border: "none",
          background: "none",
          cursor: "pointer",
          borderBottom: "3px solid #ddd", // Línea gris debajo
        }}
      >
        {label}
      </button>
    );
};

export default HomeMenuOption