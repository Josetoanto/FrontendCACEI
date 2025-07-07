import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Función para verificar si un token JWT ha expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true; // Si no se puede decodificar, considerarlo expirado
  }
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    
    if (token && token.trim() !== '') {
      // Verificar si el token ha expirado
      if (isTokenExpired(token)) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
    
    // Escucha cambios en el almacenamiento local
    const handleStorage = () => {
      const updatedToken = localStorage.getItem('userToken');
      if (updatedToken && updatedToken.trim() !== '') {
        if (isTokenExpired(updatedToken)) {
          localStorage.removeItem('userToken');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (isAuthenticated === null) {
    // Mientras se verifica el token, no mostrar nada o un loader
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
