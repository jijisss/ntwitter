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
import NtweetFactory from "components/NtweetFactory";

const Home = ({ userObj }) => {
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
    return (
        <div>
            <NtweetFactory userObj={userObj} />
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