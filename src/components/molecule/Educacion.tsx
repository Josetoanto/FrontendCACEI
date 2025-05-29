import React from 'react';
import EditarEducacion from "./EditarEducacion";

interface EducacionProps {
    // Props directas para vista no editable
    institucion?: string;
    fecha?: string;
    // Props para vista editable
    educacion?: { // Make educacion object optional
      institucion: string;
      fecha: string;
    };
    isEditing?: boolean; // Make optional
    setEducacion?: React.Dispatch<React.SetStateAction<{ institucion: string; fecha: string; }>>; // Make optional
    toggleEditing?: () => void; // Make optional
  }
  
  // Update component to use props flexibly
  const Educacion: React.FC<EducacionProps> = ({ educacion, isEditing, setEducacion, toggleEditing }) => {

    // Determine which data to use based on isEditing and availability of props
    const displayInstitucion = educacion?.institucion;
    const displayFecha = educacion?.fecha;

    // Only define handleSave if editing props are provided
    const handleSave = (newData: { institucion: string; fecha: string }) => {
      if(setEducacion && toggleEditing) {
        setEducacion(newData);
        toggleEditing(); // Exit editing mode after saving
      }
    };
  
    // Only render EditarEducacion if in editing mode and editing props are available
    if (isEditing && educacion && setEducacion && toggleEditing) {
      return (
         <div style={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            padding: "16px",
            textAlign: "left",
            paddingBottom: "0px",
            paddingTop: "0px"
          }}>
          <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Educación</h2>
          <EditarEducacion 
            initialData={educacion} 
            onSave={handleSave} 
            onCancel={toggleEditing}
          />
         </div>
      );
    }

    // Default view
    return (
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "16px",
        textAlign: "left",
        paddingBottom: "0px",
        paddingTop: "0px"
      }}>
        <h2 style={{ textAlign: "left", marginBottom: "15px", fontSize: "18px", paddingLeft: "15px" }}>Educación</h2>
          <>
            <p style={{ fontSize: "16px", paddingLeft: "15px"}}>{displayInstitucion}</p>
            <p style={{ fontSize: "16px", color: "#555" , paddingLeft: "15px"}}>{displayFecha}</p>
          </>
      </div>
    );
  };
  
  export default Educacion;
  