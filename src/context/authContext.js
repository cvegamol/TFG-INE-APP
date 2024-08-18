import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,

  signOut,
  checkIfEmailExists,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unsub;
  }, []);

  const updateUser = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        name: data.name,
        surname: data.surname,
        userId: data.userId,
      });
    }
  };

  const forgotPassword = async (Email) => {
    firebase.auth().sendPasswordResetEmail(Email)
      .then(function (user) {
        alert('Please check your email...')
      }).catch(function (e) {
        console.log(e)
      })
  }

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Invalid email";
      if (msg.includes("invalid-credential")) msg = "Credenciales Invalidas";
      if (msg.includes("email-already")) msg = "Email already in use";
      return { success: false, msg: e.message };
    }
  };

  const logout = async (email, password) => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, name, surname) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("response.user", response?.user);

      // setUser(response?.user)
      // setIsAuthenticated(true)

      await setDoc(doc(db, "users", response.user?.uid), {
        name,
        surname,
        userId: response.user?.uid,
      });
      return { success: true, data: response?.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Invalid email";
      if (msg.includes("Password should be at least 6"))
        msg = "Invalid Password is neccesary 6 characteres";
      if (msg.includes("email-already")) msg = "Email already in use";
      return { success: false, msg: e.message };
    }
  };

const resetPassword = async (email) => {
    try {
        if (email.trim() === "") {
            return { success: false, msg: "Debe introducir un correo electrónico." };
        }
        console.log(email)
        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { success: false, msg: "El formato del correo electrónico no es válido." };
        }

        // Normalizar el correo electrónico (por si se usan mayúsculas)
        const normalizedEmail = email.toLowerCase().trim();
        console.log("Correo normalizado:", normalizedEmail);

        await sendPasswordResetEmail(auth,email);
       
       
        return { success: true, msg: "Se ha enviado un correo para restablecer tu contraseña." };
    } catch (e) {
        let msg = e.message;
        if (msg.includes("(auth/invalid-email")) msg = "Correo electrónico inválido.";
        return { success: false, msg: msg };
    }
};



  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, register, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};