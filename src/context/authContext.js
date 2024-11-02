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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Asegúrate de importar tu enrutador aquí

// Crear el AuthContext
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rol, setRol] = useState(null); // Variable para el rol del usuario
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isLoggedOut = await AsyncStorage.getItem("isLoggedOut");

      if (isLoggedOut !== "true") {
        const unsub = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setIsAuthenticated(true);
            setUser(user);

            // Obtener el rol del usuario desde Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              setRol(userDoc.data().rol);
            }
          } else {
            setIsAuthenticated(false);
            setUser(null);
            setRol(null);
          }
        });
        return unsub;
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      await AsyncStorage.removeItem("isLoggedOut"); // Elimina la marca de logout si el usuario inicia sesión

      const userDoc = await getDoc(doc(db, "users", response.user.uid));
      if (userDoc.exists()) {
        setRol(userDoc.data().rol); // Establece el rol del usuario
      }

      // Espera a que onAuthStateChanged confirme el cambio de estado
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) resolve({ success: true });
        });
      });
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Correo inválido";
      if (msg.includes("auth/invalid-credential")) msg = "Correo electrónico o contraseña incorrectos";

      return { success: false, msg: msg };
    }
  };

  const register = async (email, password, name, surname) => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const timestamp = new Date();

      await setDoc(doc(db, "users", response.user.uid), {
        name: name,
        surname: surname,
        email: email,
        rol: 'general', // Asignar rol por defecto al registrar
        userId: response.user.uid,
        isOnline: true, // Usuario en línea después de registrarse
        lastActive: timestamp,
        createdAt: timestamp // Fecha de creación
      });

      setRol('general'); // Guardar el rol recién registrado

      // Espera a que onAuthStateChanged confirme el cambio de estado
      return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
          if (user) resolve({ success: true });
        });
      });
    } catch (e) {
      let msg = e.message;
      if (msg.includes("(auth/invalid-email")) msg = "Correo inválido";
      if (msg.includes("Password should be at least 6"))
        msg = "La contraseña debe tener al menos 6 caracteres";
      if (msg.includes("auth/email-already")) msg = "El correo electrónico ya está en uso";
      return { success: false, msg: msg };
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, "users", user.uid), {
          isOnline: false,
          lastActive: new Date(),
        });
      }
      await signOut(auth);
      await AsyncStorage.setItem("isLoggedOut", "true"); // Marca la sesión como cerrada
      setRol(null);
      return { success: true };
    } catch (e) {
      return { success: false, msg: e.message, error: e };
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

  const updateUserPassword = async (oldPassword, newPassword) => {
    try {
      if (!auth.currentUser) {
        return { success: false, msg: "No hay un usuario autenticado." };
      }

      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

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

  const updateUser = async (userId, updatedData) => {
    try {
      const docRef = doc(db, "users", userId);

      await updateDoc(docRef, {
        name: updatedData.name,
        surname: updatedData.surname,
        email: updatedData.email,
      });

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

  useEffect(() => {
    if (isAuthenticated) {
      router.push("home"); // Redirige automáticamente al "home" cuando el usuario está autenticado
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        rol,
        login,
        logout,
        register,
        resetPassword,
        updateUser,
        updateUserPassword,
        forgotPassword,
        db,
        auth,
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
