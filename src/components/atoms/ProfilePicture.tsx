import React, { useState } from 'react';
import defaultProfilePicture from '../../assets/profileIcon.png';

interface ProfilePictureProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, alt = "Perfil", onClick }) => {
  const [imageError, setImageError] = useState(false);
  
  // Función para manejar errores de carga de imagen
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Determinar qué imagen mostrar - mejorar la lógica para manejar valores nulos, undefined o vacíos
  const imageToShow = imageError || !src || src === null || src === undefined || src.trim() === '' 
    ? defaultProfilePicture 
    : src;
  
  return (
    <img
      src={imageToShow}
      alt={alt}
      style={{
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        cursor: onClick ? 'pointer' : 'default'
         }}
        onClick={onClick}
        onError={handleImageError}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
  );
};

export default ProfilePicture;
