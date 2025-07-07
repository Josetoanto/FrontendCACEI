import React, { useState, useEffect, useCallback } from "react";
import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";
import EditarHabilidades from "../molecule/EditarHabilidades";
import { useParams } from "react-router-dom";
import CambiarContrasenaModal from "../atoms/CambiarContrasenaModal";


const PerfilDeEvaluador: React.FC = () => {
    const { userId } = useParams<{ userId?: string }>();
    const [userData, setUserData] = useState({
      nombre: "Cargando...",
      fotoPerfil: profileIcon,
      profesion: "",
      ubicacion: "",
      descripcion: "Cargando..."
    });

    const [educacionData, setEducacionData] = useState({
      institucion: "",
      fecha: ""
    });

    const [habilidadesData, setHabilidadesData] = useState<string[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [showEditButton, setShowEditButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [showCambiarContrasena, setShowCambiarContrasena] = useState(false);

    const [originalUserData, setOriginalUserData] = useState<any>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            console.log('No user token found.');
            setIsLoading(false);
            return;
        }

        let currentUserId = null;
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                const parsedUserData = JSON.parse(storedUserData);
                currentUserId = parsedUserData.id;
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }

        const idToFetch = userId || currentUserId;

        if (!idToFetch) {
            console.log('No user ID to fetch data.');
            setIsLoading(false);
            return;
        }

        let tempUserData: any = {};
        let tempProfileData: any = {};

        try {
            // Fetch user basic data
            const userResponse = await fetch(`https://188.68.59.176:8000/users/${idToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (userResponse.ok) {
                tempUserData = await userResponse.json();
                setOriginalUserData(tempUserData);
                console.log('Respuesta GET /users/:id:', tempUserData);
            } else {
                console.error(`Error fetching user data for ID ${idToFetch}:`, userResponse.status);
            }

            // Fetch professional profile data
            const profileResponse = await fetch(`https://188.68.59.176:8000/professional-profiles/user/${idToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (profileResponse.ok) {
                tempProfileData = await profileResponse.json();
            } else if (profileResponse.status === 404) {
                console.log(`No professional profile found for user ID ${idToFetch}. Creating a new one.`);
                const defaultProfileData = {
                    user_id: idToFetch,
                    resumen: "Ingeniero en Sistemas con experiencia en desarrollo web.",
                    formacion: [
                        {
                            institucion: "Universidad Nacional",
                            titulo: "Ingeniería en Sistemas",
                            anio_inicio: 2018,
                            anio_fin: 2022
                        }
                    ],
                    experiencias: [
                        {
                            empresa: "Tech Solutions",
                            puesto: "Desarrollador Full Stack",
                            anio_inicio: 2022,
                            anio_fin: 2024,
                            descripcion: "Desarrollo de aplicaciones web y móviles."
                        }
                    ],
                    competencias: [
                        "Trabajo en equipo",
                        "Comunicación",
                        "Resolución de problemas"
                    ],
                    linkedin_url: "https://www.linkedin.com/in/usuario"
                };

                const createProfileResponse = await fetch(`https://188.68.59.176:8000/professional-profiles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(defaultProfileData),
                });

                if (createProfileResponse.ok) {
                    console.log(`Perfil profesional creado para el usuario ID: ${idToFetch}`);
                    console.log('Professional profile created successfully.');
                    // Re-fetch the newly created profile
                    const newProfileResponse = await fetch(`https://188.68.59.176:8000/professional-profiles/user/${idToFetch}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (newProfileResponse.ok) {
                        tempProfileData = await newProfileResponse.json();
                    } else {
                        console.error('Error re-fetching newly created professional profile:', newProfileResponse.status);
                    }
                } else {
                    console.error('Error creating professional profile:', createProfileResponse.status, await createProfileResponse.text());
                }
            } else {
                console.error(`Error fetching professional profile for user ID ${idToFetch}:`, profileResponse.status);
            }

            // Combine and set states
            setUserData(prevData => {
                const urlFoto = tempUserData.profile_picture || profileIcon;
                console.log('Valor de profile_picture recibido del backend:', tempUserData.profile_picture);
                console.log('URL de foto que se usará:', urlFoto);
                return {
                    ...prevData,
                    nombre: tempUserData.nombre || prevData.nombre,
                    fotoPerfil: urlFoto,
                    profesion: (Array.isArray(tempProfileData.experiencias) && tempProfileData.experiencias.length > 0) ? tempProfileData.experiencias[tempProfileData.experiencias.length - 1].puesto : tempUserData.profesion || prevData.profesion,
                    ubicacion: tempUserData.telefono || prevData.ubicacion,
                    descripcion: tempProfileData.resumen || prevData.descripcion
                };
            });

            // Education
            const fetchedEducation = Array.isArray(tempProfileData.formacion) && tempProfileData.formacion.length > 0 ?
                {
                    institucion: tempProfileData.formacion[0].institucion || '',
                    fecha: `${tempProfileData.formacion[0].anio_inicio || ''} - ${tempProfileData.formacion[0].anio_fin || ''}`.trim()
                } : { institucion: '', fecha: '' };
            setEducacionData(fetchedEducation);

            // Skills
            let fetchedSkills: string[] = [];
            if (Array.isArray(tempProfileData.competencias)) {
                fetchedSkills = tempProfileData.competencias;
            } else if (typeof tempUserData.habilidades === 'string' && tempUserData.habilidades.trim() !== '') {
                fetchedSkills = tempUserData.habilidades.split(', ').filter(Boolean);
            }
            setHabilidadesData(fetchedSkills);

            // Set showEditButton logic
            if (userId && userId.toString() !== currentUserId?.toString()) {
                setShowEditButton(false);
            } else {
                setShowEditButton(true);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setUserData({
                nombre: "Error al cargar",
                fotoPerfil: profileIcon,
                profesion: "",
                ubicacion: "",
                descripcion: "Error al cargar datos del perfil."
            });
            setEducacionData({ institucion: "", fecha: "" });
            setHabilidadesData([]);
            setShowEditButton(false);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };

    const handleBasicInfoChange = (newData: { nombre: string; ubicacion: string; descripcion: string; fotoPerfil: string; }) => {
        console.log('Nueva URL de foto de perfil:', newData.fotoPerfil);
        setUserData(prevData => ({
            ...prevData,
            nombre: newData.nombre,
            ubicacion: newData.ubicacion,
            descripcion: newData.descripcion,
            fotoPerfil: newData.fotoPerfil
        }));
    };

    const handleSave = async () => {
        setIsLoading(true); // Start loading when saving
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            console.error('No user token found for saving.');
            setIsEditing(false);
            setIsLoading(false);
            return;
        }

        const currentUserIdFromStorage = localStorage.getItem('userData');
        let parsedCurrentUserId = null;
        if (currentUserIdFromStorage) {
            try {
                const parsedData = JSON.parse(currentUserIdFromStorage);
                parsedCurrentUserId = parsedData.id;
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }

        const idToUpdate = userId || parsedCurrentUserId;

        if (!idToUpdate) {
            console.error('No user ID to update.');
            setIsEditing(false);
            setIsLoading(false);
            return;
        }

        if (!originalUserData) {
            console.error('No original user data available for update.');
            setIsEditing(false);
            setIsLoading(false);
            return;
        }

        const userDataToUpdate = {
            tipo: originalUserData.tipo || "Empleador",
            nombre: userData.nombre, // editable
            telefono: userData.ubicacion, // editable
            fecha_nacimiento: originalUserData.fecha_nacimiento
                ? originalUserData.fecha_nacimiento.split('T')[0]
                : "",
            is_active: typeof originalUserData.is_active === 'boolean' ? originalUserData.is_active : Boolean(originalUserData.is_active),
            habilidades: originalUserData.habilidades,
            experiencia: originalUserData.experiencia,
            profile_picture: userData.fotoPerfil // editable
        };
        // Elimina campos innecesarios si existen
        // delete userDataToUpdate.id;
        // delete userDataToUpdate.creado_en;
        // delete userDataToUpdate.actualizado_en;
        console.log('Objeto FINAL a enviar en PUT:', userDataToUpdate);

        // Update /users/:userId
        const userUpdateResponse = await fetch(`https://188.68.59.176:8000/users/${idToUpdate}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDataToUpdate),
        });
        const responseData = await userUpdateResponse.clone().json().catch(() => null);
        console.log('Respuesta del backend al actualizar usuario:', responseData);

        if (!userUpdateResponse.ok) {
            console.error('Error updating user data:', userUpdateResponse.status, await userUpdateResponse.text());
            throw new Error('Failed to update user data.');
        }

        // Prepare data for /professional-profiles/user/:userId endpoint
        const professionalProfileDataToUpdate: any = {
            resumen: userData.descripcion, // Use latest state
        };

        // Map educacionData back to API format
        if (educacionData.institucion && educacionData.fecha) {
            const [anio_inicio_edu_str, anio_fin_edu_str] = educacionData.fecha.split(' - ');
            professionalProfileDataToUpdate.formacion = [{
                institucion: educacionData.institucion,
                titulo: "Educación", // Default title as it's not edited
                anio_inicio: parseInt(anio_inicio_edu_str, 10) || null,
                anio_fin: parseInt(anio_fin_edu_str, 10) || null,
            }];
        } else {
            professionalProfileDataToUpdate.formacion = [];
        }

        // Map habilidadesData back to API format
        professionalProfileDataToUpdate.competencias = habilidadesData;

        try {
            // Update /professional-profiles/user/:userId
            const profileUpdateResponse = await fetch(`https://188.68.59.176:8000/professional-profiles/user/${idToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(professionalProfileDataToUpdate),
            });

            if (!profileUpdateResponse.ok) {
                console.error('Error updating professional profile:', profileUpdateResponse.status, await profileUpdateResponse.text());
                throw new Error('Failed to update professional profile.');
            }

            console.log('Perfil de evaluador actualizado exitosamente!');
            console.log('Refrescando datos...');
            fetchData(); // Call fetchData to refresh all data after save
            console.log('Datos de usuario después de refrescar:', userData);

        } catch (error) {
            console.error('Error durante el guardado del perfil del evaluador:', error);
            alert('Error al guardar el perfil del evaluador. Por favor, inténtalo de nuevo.');
        } finally {
            setIsEditing(false); // Exit editing mode
            setIsLoading(false); // End loading after save attempt
        }
    };

    const handleCancel = () => {
      setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div>
                <Header />
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil del evaluador...</div>
            </div>
        );
    }

    console.log('Renderizando PerfilDeEvaluador, fotoPerfil:', userData.fotoPerfil);

    return (
      <div style={{paddingBottom:"15px"}}>
        <Header></Header>
        <div style={{
            width: "1000px",
            margin: "auto",
            backgroundColor: "#fff",
            borderRadius: "10px",
        }}>
          <PerfilCard 
            userData={userData}
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            onCancel={handleCancel}
            showEditButton={showEditButton}
            onBasicInfoChange={handleBasicInfoChange}
          />
        {isEditing ? null : <p style={{padding:"15px"}}>{userData.descripcion}</p>}
        
        {showEditButton && <Educacion educacion={educacionData} isEditing={isEditing} setEducacion={setEducacionData} toggleEditing={toggleEditing} />}
        
        {showEditButton && isEditing ? (
          <EditarHabilidades habilidades={habilidadesData} setHabilidades={setHabilidadesData} />
        ) : (
          <ListaDeHabilidades habilidades={habilidadesData} isEditing={isEditing} setHabilidades={setHabilidadesData} />
        )}

        {showEditButton && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px 0 0' }}>
            <button
              onClick={() => setShowCambiarContrasena(true)}
              style={{
                backgroundColor: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 18px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cambiar contraseña
            </button>
          </div>
        )}
        <CambiarContrasenaModal show={showCambiarContrasena} onClose={() => setShowCambiarContrasena(false)} />

        {showEditButton && isEditing && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", padding: "20px" }}>
                <button type="button" onClick={handleCancel} style={{
                    backgroundColor: "#ccc",
                    color: "#000",
                    borderRadius: "5px",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer"
                }}>
                  Cancelar
                </button>
                <button type="button" onClick={handleSave} style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                    border: "none",
                    padding: "10px 20px",
                    cursor: "pointer"
                }}>
                  Guardar Cambios
                </button>
            </div>
        )}

        </div>
      </div>
    );
  };
  
  export default PerfilDeEvaluador;
  
