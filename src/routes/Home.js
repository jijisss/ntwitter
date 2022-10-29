import Ntweet from "components/Ntweet";
import { dbService } from "fbase";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj  }) => {
    const [ntweet, setNtweet] = useState("");
    const [ntweets, setNtweets] = useState([]);
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

    const onSubmit = async (event) => {
    event.preventDefault();
    try {
    const docRef = await addDoc(collection(dbService, "ntweets"), {
    text: ntweet,
    createdAt: Date.now(),
    creatorId: userObj.uid,
    });
    } catch (e) {
    console.error("Error adding document: ", e);
    }
    setNtweet("");
    };
                   
    const onChange = (event) => {
        const { 
            target: { value },
     } = event;
     setNtweet(value);
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
                <input type="submit" value="Ntweet" />
            </form>
            <div>
            {ntweets.map((ntweet) => (
                <Ntweet 
                key={ntweet.id} 
                ntweetObj={ntweet} 
                isOwner={ntweet.creatorId === userObj.uid} />
            ))}
            </div>
        </div>
    );
};
export default Home;