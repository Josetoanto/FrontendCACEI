interface NotificacionItemProps {
    titulo: string;
    mensaje: string;
    encuestaId: number;
    onRevisar: () => void;
  }
  
  const NotificacionItem: React.FC<NotificacionItemProps> = ({ titulo, mensaje, onRevisar }) => {
    return (
      <div style={{
        padding: "12px",
        minWidth:"556px",
        borderRadius: "10px",
        marginBottom: "12px",
        textAlign: "left",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px"
      }}>
        <div style={{backgroundColor:"#f0f2f5",padding:"14px",borderRadius:"6px"}}>
        <i className="fas fa-file-alt" style={{ fontSize: '1.8em', color: 'black', marginTop: '2px' }}></i>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "bold" }}>{titulo}</h4>
          <p style={{ margin: "0", fontSize: "14px", color: "#555" }}>{mensaje}</p>
        </div>
        <button style={{
          backgroundColor: "#f0f2f5",
          border: "none",
          borderRadius: "6px",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: "14px",
          alignSelf: "center"
        }} onClick={onRevisar}>
          Revisar
        </button>
      </div>
    );
  };
  
  export default NotificacionItem;
  
