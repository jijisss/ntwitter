import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";


const NtweetFactory = ({ userObj }) => {
    const [ntweet, setNtweet] = useState("");
    const [attachment, setAttachment] = useState("");
    const onSubmit = async (e) => {
        e.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(response.ref);
            }
            const ntweetObj = {
                ntweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl, 
                };
                await addDoc(collection(dbService, "ntweets"), ntweetObj);
                setNtweet("");
                setAttachment("");
                };      
    const onChange = (event) => {
        const { 
            target: { value },
     } = event;
     setNtweet(value);
    };
    const onFileChange = (event) => {
        const {target: { files },
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result }
            } = finishedEvent;
            setAttachment(result)
        };
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => { 
        setAttachment("") 
    };
    return (
        <form onSubmit={onSubmit}>
                <input 
                    value={ntweet} 
                    onChange={onChange} 
                    type="text" 
                    placeholder="What's on your mind?" 
                    maxLength={120}
                />
                <input type="file" accept="image/*"  onChange={onFileChange} />
                <input type="submit" value="Ntweet" />
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div> 
                )}
            </form>
    );
}

export default NtweetFactory;