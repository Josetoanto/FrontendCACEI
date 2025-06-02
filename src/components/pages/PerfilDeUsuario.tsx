import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Experiencias from "../organisms/Experiencias";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";
import ListaDeCursos from "../molecule/ListaDeCursos";
import EditarExperiencias from "../molecule/EditarExperiencias";
import EditarHabilidades from "../molecule/EditarHabilidades";
import EditarCursos from "../molecule/EditarCursos";

interface Experiencia {
  titulo: string;
  ubicacion: string;
  tiempo: string;
}

const PerfilDeUsuario: React.FC = () => {
    const { userId } = useParams<{ userId?: string }>();
    const [userData, setUserData] = useState({
      nombre: "Cargando...",
      fotoPerfil: profileIcon,
      profesion: "",
      ubicacion: "",
      descripcion: "Cargando..."
    });

    const [experienciasData, setExperienciasData] = useState<Experiencia[]>([]);
    const [educacionData, setEducacionData] = useState({
      institucion: "",
      fecha: ""
    });

    const [habilidadesData, setHabilidadesData] = useState<string[]>([]);

    const [cursosData, setCursosData] = useState<any[]>([]); // No hay fuente API para esto de momento
    const [linkedinUrl, setLinkedinUrl] = useState<string>('');

    const [isEditing, setIsEditing] = useState(false);
    const [showEditButton, setShowEditButton] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

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
            const userResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/users/${idToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (userResponse.ok) {
                tempUserData = await userResponse.json();
                console.log('Datos de usuario obtenidos:', tempUserData);
            } else {
                console.error(`Error fetching user data for ID ${idToFetch}:`, userResponse.status);
            }

            // Fetch professional profile data
            const profileResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/professional-profiles/user/${idToFetch}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (profileResponse.ok) {
                tempProfileData = await profileResponse.json();
                console.log('Datos de perfil profesional obtenidos:', tempProfileData);
            } else if (profileResponse.status === 404) {
                console.log(`No professional profile found for user ID ${idToFetch} in PerfilDeUsuario. Creating a new one.`);
                const defaultProfileData = {
                    user_id: idToFetch,
                    resumen: "Resumen profesional general del usuario.",
                    formacion: [
                        {
                            institucion: "Nombre de la Universidad/Instituto",
                            titulo: "Título de la Carrera",
                            anio_inicio: 0,
                            anio_fin: 0
                        }
                    ],
                    experiencias: [
                        {
                            empresa: "Nombre de la Empresa",
                            puesto: "Puesto de Trabajo",
                            anio_inicio: 0,
                            anio_fin: 0,
                            descripcion: "Breve descripción de las responsabilidades y logros."
                        }
                    ],
                    competencias: [
                        "Habilidad 1",
                        "Habilidad 2",
                        "Habilidad 3"
                    ],
                    linkedin_url: "https://www.linkedin.com/in/nombre-de-usuario"
                };

                const createProfileResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/professional-profiles`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(defaultProfileData),
                });

                if (createProfileResponse.ok) {
                    console.log(`Perfil profesional creado para el usuario ID: ${idToFetch} en PerfilDeUsuario.`);
                    // Re-fetch the newly created profile
                    const newProfileResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/professional-profiles/user/${idToFetch}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${userToken}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    if (newProfileResponse.ok) {
                        tempProfileData = await newProfileResponse.json();
                    } else {
                        console.error('Error re-fetching newly created professional profile in PerfilDeUsuario:', newProfileResponse.status);
                    }
                } else {
                    console.error('Error creating professional profile in PerfilDeUsuario:', createProfileResponse.status, await createProfileResponse.text());
                }
            } else {
                console.error(`Error fetching professional profile for user ID ${idToFetch}:`, profileResponse.status);
            }

            // Combine and set states
            setUserData(prevData => ({
                ...prevData,
                nombre: tempUserData.nombre || prevData.nombre,
                fotoPerfil: profileIcon,
                profesion: (Array.isArray(tempProfileData.experiencias) && tempProfileData.experiencias.length > 0) ? tempProfileData.experiencias[tempProfileData.experiencias.length - 1].puesto : tempUserData.profesion || prevData.profesion,
                ubicacion: tempUserData.telefono || prevData.ubicacion,
                descripcion: tempProfileData.resumen || prevData.descripcion
            }));

            // Experiences
            const fetchedExperiences = Array.isArray(tempProfileData.experiencias) ?
                tempProfileData.experiencias.map((exp: any) => ({
                    titulo: exp.puesto || '',
                    ubicacion: exp.empresa || '',
                    tiempo: `${exp.anio_inicio || ''} - ${exp.anio_fin || ''}`.trim()
                })) : [];
            setExperienciasData(fetchedExperiences);

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

            // Courses (no API source for this yet, keep existing dummy or empty)
            setCursosData([]);

            const fetchedLinkedinUrl = tempProfileData.linkedin_url || '';
            setLinkedinUrl(fetchedLinkedinUrl);

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
            setExperienciasData([]);
            setEducacionData({ institucion: "", fecha: "" });
            setHabilidadesData([]);
            setCursosData([]);
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

    const handleCancel = () => {
      setIsEditing(false);
    };

    const handleBasicInfoChange = (newData: { nombre: string; ubicacion: string; descripcion: string; }) => {
        setUserData(prevData => ({
            ...prevData,
            nombre: newData.nombre,
            ubicacion: newData.ubicacion,
            descripcion: newData.descripcion,
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

        // Prepare data for /users/:userId endpoint
        const userDataToUpdate = {
            nombre: userData.nombre, // Use latest state
            telefono: userData.ubicacion, // Use latest state, mapped from 'ubicacion' input
        };
        console.log('Datos de usuario a actualizar:', userDataToUpdate);

        // Prepare data for /professional-profiles/user/:userId endpoint
        const professionalProfileDataToUpdate: any = {
            resumen: userData.descripcion, // Use latest state
            linkedin_url: linkedinUrl, // Use latest state
        };
        console.log('Datos de perfil profesional a actualizar:', professionalProfileDataToUpdate);

        // Map experienciasData back to API format
        professionalProfileDataToUpdate.experiencias = experienciasData.map(exp => {
            const [anio_inicio_str, anio_fin_str] = exp.tiempo.split(' - ');
            return {
                puesto: exp.titulo,
                empresa: exp.ubicacion,
                anio_inicio: parseInt(anio_inicio_str, 10) || null,
                anio_fin: parseInt(anio_fin_str, 10) || null,
                descripcion: "", // As `descripcion` is not edited in EditarExperiencias, send empty or handle default.
            };
        });

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
            // Update /users/:userId
            const userUpdateResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/users/${idToUpdate}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDataToUpdate),
            });

            if (!userUpdateResponse.ok) {
                console.error('Error updating user data:', userUpdateResponse.status, await userUpdateResponse.text());
                throw new Error('Failed to update user data.');
            }

            // Update /professional-profiles/user/:userId
            const profileUpdateResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/professional-profiles/user/${idToUpdate}`, {
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

            console.log('Perfil actualizado exitosamente!');
            // Re-fetch data to update UI with latest changes from API
            fetchData(); // Call fetchData to refresh all data after save

        } catch (error) {
            console.error('Error durante el guardado del perfil:', error);
            alert('Error al guardar el perfil. Por favor, inténtalo de nuevo.');
        } finally {
            setIsEditing(false); // Exit editing mode
            setIsLoading(false); // End loading after save attempt
        }
    };

    if (isLoading) {
        return (
            <div>
                <Header />
                <div style={{ textAlign: 'center', marginTop: '50px' }}>Cargando perfil...</div>
            </div>
        );
    }

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
        
        {showEditButton && isEditing ? (
          <EditarExperiencias experiencias={experienciasData} setExperiencias={setExperienciasData} />
        ) : (
          <Experiencias experiencias={experienciasData} isEditing={isEditing} setExperiencias={setExperienciasData} />
        )}

        {showEditButton && <Educacion educacion={educacionData} isEditing={isEditing} setEducacion={setEducacionData} toggleEditing={toggleEditing} />}
        
        {showEditButton && isEditing ? (
          <EditarHabilidades habilidades={habilidadesData} setHabilidades={setHabilidadesData} />
        ) : (
          <ListaDeHabilidades habilidades={habilidadesData} isEditing={isEditing} setHabilidades={setHabilidadesData} />
        )}

        {showEditButton && isEditing ? (
          <EditarCursos linkedinUrl={linkedinUrl} setLinkedinUrl={setLinkedinUrl} />
        ) : (
          <ListaDeCursos cursos={cursosData} isEditing={isEditing} setCursos={setCursosData} linkedinUrl={linkedinUrl} />
        )}

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
  
  export default PerfilDeUsuario;
  