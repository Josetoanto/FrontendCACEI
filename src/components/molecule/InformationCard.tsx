interface InformationCardProps {
    title: string;
    value: string;
  }
  
  const InformationCard: React.FC<InformationCardProps> = ({ title, value }) => {
    return (
      <div style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "12px",
        textAlign: "center",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
        backgroundColor:"#f0f2f5",
      }}>
        <h3 style={{textAlign:"left" ,fontSize: "18px", marginBottom: "5px" }}>{title}</h3>
        <p style={{textAlign:"left" , fontSize: "22px", fontWeight: "bold" }}>{value}</p>
      </div>
    );
  };
  
  export default InformationCard;
  