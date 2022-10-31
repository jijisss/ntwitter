import Ntweet from "components/Ntweet";
import { v4 } from "uuid";
import { dbService, storageService } from "fbase";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";

const Home = ({ userObj }) => {
    const [ntweet, setNtweet] = useState("");
    const [ntweets, setNtweets] = useState([]);
    const [attachment, setAttachment] = useState("");
    useEffect(() => {
        const q = query(
        collection(dbService, "ntweets"),
        orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
        const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        }));
        setNtweets(nweetArr);
        });
        }, []);

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
        <div>
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
            <div>
            {ntweets.map((ntweet) => (
                <Ntweet 
                    key={ntweet.id} 
                    ntweetObj={ntweet} 
                    isOwner={ntweet.creatorId === userObj.uid} 
                />
            ))}
            </div>
        </div>
    );
};
export default Home;