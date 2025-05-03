import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "8px 15px",
      width: "97.2%",
      marginTop:"1.5%",
      backgroundColor: "#f0f2f5"
    }}>
      {/* Icono de búsqueda */}
      <i className="fas fa-search" style={{ marginRight: "10px", color: "#888" }}></i>
      
      {/* Campo de búsqueda */}
      <input 
        type="text" 
        placeholder="Buscar..." 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          width: "100%",
          fontSize: "16px",
          backgroundColor: "#f0f2f5"
        }}
      />
    </div>
  );
};

export default Search;
