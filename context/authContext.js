import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{
    const [user,setUser] = useState(null);
    const[isAuthenticated,setIsAuthenticated] = useState(undefined);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(user)=>{
            if(user){
                setIsAuthenticated(true);
                setUser(user);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        })
        return unsub;
    },[])

    const login = async(email,password)=>{
        try{
            const response = await signInWithEmailAndPassword(auth,email,password);
            return {success:true}
        }catch(e){
            let msg = e.message
            if(msg.includes('(auth/invalid-email')) msg='Invalid email'
            if(msg.includes('invalid-credential')) msg='Credenciales Invalidas'
            if(msg.includes('email-already')) msg='Email already in use'
            return {success:false, msg:e.message}
        }
    }

    const logout = async(email,password)=>{
        try{
            await signOut(auth);
            return {success:true}
        }catch(e){
            return {success:false, msg:e.message,error:e}
        }
    }

    const register = async(email,password,name,surname)=>{
        try{
            const response = await createUserWithEmailAndPassword(auth,email,password);

            console.log("response.user",response?.user)

            // setUser(response?.user)
            // setIsAuthenticated(true)

            await setDoc(doc(db,"users",response.user?.uid),{
                
                name,
                surname,
                userId:response.user?.uid

            })
            return {success:true, data:response?.user}

        }catch(e){
            let msg = e.message
            if(msg.includes('(auth/invalid-email')) msg='Invalid email'
            if(msg.includes('Password should be at least 6')) msg='Invalid Password is neccesary 6 characteres'
            if(msg.includes('email-already')) msg='Email already in use'
            return {success:false, msg:e.message}
        }
    }
    return(
        <AuthContext.Provider value={{user,isAuthenticated,login,logout,register}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=>{
    const value = useContext(AuthContext)
    if(!value){
        throw new Error('useAuth must be wrapped inside AuthContextProvider')
    }
    return value;
}   