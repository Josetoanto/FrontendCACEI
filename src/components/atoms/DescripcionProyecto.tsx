import React from 'react';

interface DescripcionProyectoProps {
  descripcion: string; // Prop para la descripción
}

const DescripcionProyecto: React.FC<DescripcionProyectoProps> = ({ descripcion }) => {
  return (
    <div>
      <h2 style={{ textAlign: "left", marginBottom: "20px", fontSize: "16px", fontWeight: "bold"}}>Descripción</h2>
      <p style={{textAlign:"left"}}>{descripcion}</p> {/* Se utiliza la prop para mostrar la descripción */}
    </div>
  );
};

export default DescripcionProyecto;
