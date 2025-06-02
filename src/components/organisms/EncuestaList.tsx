import EncuestaCard from "../molecule/EncuestaCard";
import encuestImage1 from "../../assets/encuestImage1.jpg";
import encuestImage2 from "../../assets/encuestImage2.jpg";
import encuestImage3 from "../../assets/encuestImage3.jpg";
import { useState } from "react";
import Search from "../molecule/Search";

interface EncuestaListProps {
  title: string;
  encuestas: {
    title: string;
    createdAt: string;
    id: number;
    isFuture?: boolean;
    inicio?: Date;
  }[];
  onRefreshEncuestas: () => void;
  userType?: string;
}

const images = [encuestImage1, encuestImage2, encuestImage3];

const EncuestaList: React.FC<EncuestaListProps> = ({ title, encuestas, onRefreshEncuestas, userType }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredEncuestas = encuestas.filter(encuesta =>
    encuesta.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
    <Search onSearch={handleSearch}></Search>
    <div style={{ width: "100%",  margin: "auto" }}>
      <h3 style={{paddingLeft:"15px" ,fontSize: "16px", textAlign: "left", marginBottom: "10px" }}>{title}</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
        {filteredEncuestas.map((encuesta, index) => (
          <EncuestaCard 
            key={index}
            title={encuesta.title}
            createdAt={encuesta.createdAt}
            imageSrc={images[index % images.length]}
            id={encuesta.id}
            onDeleteSuccess={onRefreshEncuestas}
            isFuture={encuesta.isFuture}
            inicio={encuesta.inicio}
            userType={userType}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default EncuestaList;
