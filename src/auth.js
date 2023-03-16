import React, { useState, useEffect, createContext } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/database";
import defaultUserImage from "./images/default-user-image.jpg";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_USER } from "./graphql/mutations";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
    apiKey: "AIzaSyCZ88qckRbCdYqzajpzIXDXK2aJjlPNxTg",
    authDomain: "instagram-clone-6db6e.firebaseapp.com",
    projectId: "instagram-clone-6db6e",
    storageBucket: "instagram-clone-6db6e.appspot.com",
    messagingSenderId: "869245921781",
    appId: "1:869245921781:web:7adb2b68af3c3fd09a98bc",
    measurementId: "G-ESRXHMT0PL"
});

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim = idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase.database().ref(`metadata/${user.uid}/refreshTime`);

          metadataRef.on("value", async (data) => {
            if(!data.exists) return
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          });
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.log(error);
    }
  };

  const signUpWithEmailAndPassword = async formData => {
    const data = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password);

    if (data.additionalUserInfo.isNewUser) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: data.user.email,
        bio: "",
        website: "",
        phoneNumber: "",
        profileImage: defaultUserImage
      }
      await createUser({ variables });
    }
  }

  const signOut = async () => {
    try {
      setAuthState({ status: "loading" });
      await firebase.auth().signOut();
      setAuthState({ status: "out" });
    } catch (error) {
      console.log(error);
    }
  };

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
            authState,
            signInWithGoogle,
            signOut, 
            signUpWithEmailAndPassword
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;