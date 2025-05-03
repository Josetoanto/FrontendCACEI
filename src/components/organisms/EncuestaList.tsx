import EncuestaCard from "../molecule/EncuestaCard";
import encuestImage1 from "../../assets/encuestImage1.jpg";
import encuestImage2 from "../../assets/encuestImage2.jpg";
import encuestImage3 from "../../assets/encuestImage3.jpg";

interface EncuestaListProps {
  title: string;
  encuestas: {
    title: string;
    createdAt: string;
  }[];
}

const images = [encuestImage1, encuestImage2, encuestImage3];

const EncuestaList: React.FC<EncuestaListProps> = ({ title, encuestas }) => {
  return (
    <div style={{ width: "100%",  margin: "auto" }}>
      <h3 style={{paddingLeft:"15px" ,fontSize: "16px", textAlign: "left", marginBottom: "10px" }}>{title}</h3>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
        {encuestas.map((encuesta, index) => (
          <EncuestaCard 
            key={index}
            title={encuesta.title}
            createdAt={encuesta.createdAt}
            imageSrc={images[index % images.length]}
          />
        ))}
      </div>
    </div>
  );
};

export default EncuestaList;
