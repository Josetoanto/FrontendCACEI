const Notifications: React.FC = () => {
    return (
      <button 
        aria-label="Notificaciones" 
        style={{ 
          backgroundColor: 'transparent', 
          border: 'none', 
          cursor: 'pointer', 
          outline: 'none' 
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className="fas fa-bell" style={{ fontSize: '2em' }}></i> {/* Icono de campana de Font Awesome */}
      </button>
    );
  };
  
  export default Notifications;
  