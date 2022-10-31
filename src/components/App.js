import React, { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setNewName(user.displayName);
  };
  return (
    <>
      {init ? (
      <AppRouter 
      refreshUser={refreshUser}
      isLoggedIn={isLoggedIn} 
      userObj={userObj} 
      />
      ) : (
        "Initializing..."
        )}
    </>
  );
}
export default App;