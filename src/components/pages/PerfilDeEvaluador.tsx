import React, { useState, useEffect, useCallback } from "react";
import Header from "../organisms/Header";
import PerfilCard from "../organisms/PerfilCard";
import profileIcon from "../../assets/profileIcon.png";
import Educacion from "../molecule/Educacion";
import ListaDeHabilidades from "../molecule/ListaDeHabilidades";
import EditarHabilidades from "../molecule/EditarHabilidades";
import { useParams } from "react-router-dom";


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

                const createProfileResponse = await fetch(`https://gcl58kpp-8000.use2.devtunnels.ms/professional-profiles`, {
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
                        console.error('Error re-fetching newly created professional profile:', newProfileResponse.status);
                    }
                } else {
                    console.error('Error creating professional profile:', createProfileResponse.status, await createProfileResponse.text());
                }
            } else {
                console.error(`Error fetching professional profile for user ID ${idToFetch}:`, profileResponse.status);
            }

            // Combine and set states
            setUserData(prevData => ({
                ...prevData,
                nombre: tempUserData.nombre || prevData.nombre,
                fotoPerfil: profileIcon, // Always use default icon
                profesion: (Array.isArray(tempProfileData.experiencias) && tempProfileData.experiencias.length > 0) ? tempProfileData.experiencias[tempProfileData.experiencias.length - 1].puesto : tempUserData.profesion || prevData.profesion,
                ubicacion: tempUserData.telefono || prevData.ubicacion,
                descripcion: tempProfileData.resumen || prevData.descripcion
            }));

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

            console.log('Perfil de evaluador actualizado exitosamente!');
            fetchData(); // Call fetchData to refresh all data after save

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
  