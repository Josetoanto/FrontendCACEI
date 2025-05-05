import "@fortawesome/fontawesome-free/css/all.min.css";

interface ProjectCardProps {
  iconClass: string;
  title: string;
  value: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ iconClass, title, value }) => {
  return (
    <div style={{
      flex: 1,
      textAlign: "left",
      padding: "16px",
      borderRadius: "12px",
      backgroundColor: "#fff",
      boxShadow: "2px 2px 8px rgba(0,0,0,0.1)"
    }}>
      <i className={iconClass} style={{ fontSize: "22px", marginBottom: "2px", color: "black", marginTop: "10px",}}></i>
      <h3 style={{ fontSize: "16px" }}>{title}</h3>
      <p style={{ fontSize: "14px", color: "#61788A" }}>{value}</p>
    </div>
  );
};

export default ProjectCard;
