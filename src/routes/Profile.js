import { useNavigate } from "react-router-dom";
import { authService } from "fbase";

const Profile = () => {
    const navigate = useNavigate();
    const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
    }
};

export default Profile;