// Utilidad para envolver fetch y manejar errores 401 globalmente
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = '/login'; // Redirige al login
    // Retorna una promesa rechazada para evitar que el código continúe
    return Promise.reject(new Error('No autorizado (401)'));
  }
  return response;
} 
