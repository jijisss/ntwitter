import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "@firebase/firestore";
import { updateProfile } from "@firebase/auth";
import { async } from "@firebase/util";


const Profile = ({ refreshUser, userObj }) => {
    const navigate = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
    }
    const onChange = (e) => {
        const {
            target : { value },
        } = e;
        setNewDisplayName(value);
    }
    const getMyNtweets = async () => {
        const q = query(
        collection(dbService, "ntweets"),
        where("creatorId", "==", userObj.uid),
        orderBy("createdAt")
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        });
        };
    useEffect(() => {
        getMyNtweets();
    }, []);
    const onSubmit = async (e) => {
        e.preventDefault();
        if (newName !== userObj.displayName) {
            await updateProfile(userObj, { displayName: newName });
            refreshUser();
        }
    };
    return (
        <>
            <form onSubmit={onSubmit}>
                <input 
                onChange={onChange}
                type="text" 
                placeholder="Display name" 
                value={newDisplayName}
                />
                <input type="submit" value="update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};




export default Profile;