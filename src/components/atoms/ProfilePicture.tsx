import defaultProfilePicture from '../../assets/profileIcon.png';

interface ProfilePictureProps {
  src: string;
  alt?: string;
  onClick?: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ src, alt = "Perfil", onClick }) => {
  return (
    <img
      src={src || defaultProfilePicture}
      alt={alt}
      style={{
        borderRadius: "50%",
        width: "35px",
        height: "35px",
        cursor: onClick ? 'pointer' : 'default'
         }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'} 
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    />
  );
};

export default ProfilePicture;
