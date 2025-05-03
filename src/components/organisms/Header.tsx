import HeaderTittle from "../atoms/HeaderTittle";
import Notifications from "../atoms/Notifications";
import ProfilePicture from "../atoms/ProfilePicture";

const Header: React.FC = () => {
  return (
    <>
      <header style={{  height: "50px" ,display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "#ffffff" }}>
        <HeaderTittle />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingRight:"10px" }}>
          <Notifications />
          <ProfilePicture src= '' />
        </div>
      </header>
      <div style={{ height: "2px", backgroundColor: "#e5e8eb", margin: "0" }}></div>
    </>
  );
};

export default Header;
