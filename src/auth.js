import React, { useState, useEffect, createContext } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase, ref, onValue } from "firebase/database";
import defaultUserImage from "./images/default-user-image.jpg";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_USER } from "./graphql/mutations";

const provider = new firebase.auth.GoogleAuthProvider();
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
const authDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const databaseUrl = process.env.REACT_APP_FIREBASE_DATABASE_URL;
const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const storageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const messageSenderId = process.env.REACT_APP_FIREBASE_MESSAGING_CENTER_ID;
const appId = process.env.REACT_APP_FIREBASE_APP_ID;
const measurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

firebase.initializeApp({
    apiKey: `${apiKey}`,
    authDomain: `${authDomain}`,
    databaseURL: `${databaseUrl}`,
    projectId: `${projectId}`,
    storageBucket: `${storageBucket}`,
    messagingSenderId: `${messageSenderId}`,
    appId: `${appId}`,
    measurementId: `${measurementId}`
});

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: "loading" });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const database = getDatabase();
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        
        const hasuraClaim = idTokenResult.claims["https://hasura.io/jwt/claims"];

        if (hasuraClaim) {
          setAuthState({ status: "in", user, token });
        } else {
          const userRef = ref(database, `metadata/${user.uid}/refreshTime`);

          onValue(userRef, data => {
              if(!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = user.getIdToken(true);
            setAuthState({ status: "in", user, token });
          })
        }
      } else {
        setAuthState({ status: "out" });
      }
    });
  }, []);

  const logInWithGoogle = async () => {
    try {
      const data = await firebase.auth().signInWithPopup(provider);

      if (data.additionalUserInfo.isNewUser) {
        const {uid, displayName, email, photoURL } = data.user;
        const username = `${displayName.replace(/\s+/g, "")}${uid.slice(-5)}`;
        const variables = {
          userId: uid,
          name: displayName,
          username,
          email,
          bio: "",
          website: "",
          phoneNumber: "",
          profileImage: photoURL
        }
        await createUser({ variables });
      }

    } catch (error) {
      console.error(error);
    }
  };

  const logInWithEmailAndPassword = async (email, password) => {
    const data = await firebase.auth().signInWithEmailAndPassword(email, password);

    return data;
  }

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
      console.error(error);
    }
  };

  const updateEmail = async email => {
    await authState.user.updateEmail(email);
  }

  if (authState.status === "loading") {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
            authState,
            logInWithGoogle,
            signOut, 
            signUpWithEmailAndPassword,
            logInWithEmailAndPassword,
            updateEmail
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;