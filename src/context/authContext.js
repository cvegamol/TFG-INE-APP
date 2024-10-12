import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

// Crear el AuthContext
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [rol, setRol] = useState(null); // Nueva variable para el rol

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);

        // Obtener el rol del usuario desde Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setRol(userDoc.data().rol); // Guardar el rol en el estado
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRol(null); // Limpiar el rol si no hay usuario
      }
    });
    return unsub;
  }, []);

  const updateUser = async (userId, updatedData) => {
    try {
      const docRef = doc(db, "users", userId);

      // Actualizar los datos en Firestore
      await updateDoc(docRef, {
        name: updatedData.name,
        surname: updatedData.surname,
        email: updatedData.email,
      });

      // Actualizar el usuario en el estado
      setUser((prevUser) => ({
        ...prevUser,
        name: updatedData.name,
        surname: updatedData.surname,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      return { success: false, msg: "No se pudo actualizar el perfil. Inténtalo nuevamente." };
    }
  };

  const updateUserPassword = async (oldPassword, newPassword) => {
    try {
      if (!auth.currentUser) {
        return { success: false, msg: "No hay un usuario autenticado." };
      }

      const user = auth.currentUser;

      // Reautenticar al usuario con la contraseña actual
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // Actualizar la contraseña del usuario
      await updatePassword(user, newPassword);

      return { success: true, msg: "Contraseña actualizada correctamente." };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("wrong-password")) {
        msg = "La contraseña actual es incorrecta.";
      } else if (msg.includes("weak-password")) {
        msg = "La nueva contraseña es demasiado débil.";
      }
      return { success: false, msg: msg };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, msg: "Se ha enviado un correo para restablecer tu contraseña." };
    } catch (error) {
      let msg = error.message;
      if (msg.includes("(auth/invalid-email")) {
        msg = "Correo electrónico inválido.";
      }
      return { success: false, msg: msg };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", response.user.uid));

      if (userDoc.exists()) {
        setRol(userDoc.data().rol); // Guardar el rol cuando el usuario inicie sesión
      }

      return { success: true };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Correo inválido";
      if (msg.includes("invalid-credential")) msg = "Credenciales inválidas";
      return { success: false, msg: e.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setRol(null); // Limpiar el rol cuando el usuario cierre sesión
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
    }
  };

  const register = async (email, password, name, surname) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", response.user.uid), {
        name: name,
        surname: surname,
        rol: 'general', // Asignar rol por defecto al registrar
        userId: response.user.uid,
      });

      setRol('general'); // Guardar el rol recién registrado en el estado

      return { success: true, data: response.user };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Correo inválido";
      if (msg.includes("Password should be at least 6"))
        msg = "La contraseña debe tener al menos 6 caracteres";
      if (msg.includes("email-already")) msg = "El correo ya está en uso";
      return { success: false, msg: e.message };
    }
  };

  const resetPassword = async (email) => {
    try {
      if (email.trim() === "") {
        return { success: false, msg: "Debe introducir un correo electrónico." };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, msg: "El formato del correo electrónico no es válido." };
      }

      const normalizedEmail = email.toLowerCase().trim();
      await sendPasswordResetEmail(auth, normalizedEmail);

      return { success: true, msg: "Se ha enviado un correo para restablecer tu contraseña." };
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Correo electrónico inválido.";
      return { success: false, msg: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        rol, // Exponer el rol en el contexto
        login,
        logout,
        register,
        resetPassword,
        updateUser,
        updateUserPassword,
        forgotPassword,
        db
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthContextProvider");
  }
  return context;
};
