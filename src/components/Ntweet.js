import { async } from "@firebase/util";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { deleteObject, ref } from "@firebase/storage";
import { storageService } from "../fbase";

const Ntweet = ({ ntweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [newNtweet, setNewNtweet] = useState(ntweetObj.text);
    const NweetTextRef =doc(dbService, "nweets", `${ntweetObj.id}`);
    const desertRef = ref(storageService, ntweetObj.attachmentUrl);
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delet this ntweet?");
        if (ok) {
            try {
                await deleteDoc(NweetTextRef);
                if (ntweetObj.attachmentUrl !== "") {
                    await deleteObject(desertRef);
                }
            } catch (error) {
                window.alert("트윗을 삭제하는 데 실패했습니다!");
            }
        }
    };
    const toggleEditing = () => setEditing(prev => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(
            NweetTextRef, 
            { 
                text: newNtweet
            }
        );
        setEditing(false);
    };
    const onChange =(event) => {
        const {
            target: { value },
        } = event;
        setNewNtweet(value);
    };
    return (
        <div>
        {editing ? (
            <>
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        placeholder="Edit your tweet" 
                        value={newNtweet} 
                        required 
                        onChange={onChange}
                    /> 
                    <input type="submit" value="Update Ntweet" />
                </form>
                <button onClick={toggleEditing}>Cancel</button>
            </>
                ) : (
                <>
                    <h4>{ntweetObj.text}</h4>
                    {ntweetObj.attachmentUrl && (
                        <img src={ntweetObj.attachmentUrl} width="50px" height="50px" />
                    )}
                    {isOwner && 
                        (
                        <>
                            <button onClick={onDeleteClick}>Delete Ntweet</button>
                            <button onClick={toggleEditing}>Edit Ntweet</button>
                        </>
                    )}
                </>
                )}
    </div>
    );
};

export default Ntweet;