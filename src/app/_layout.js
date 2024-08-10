import React, { useEffect } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';

import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
import { Slot, useRouter, useSegments } from 'expo-router'
import { AuthContextProvider, useAuth } from '../context/authContext';


const MainLayout=()=>{
    const {isAuthenticated} = useAuth()
    const segments = useSegments()
    const router = useRouter()
    useEffect(()=>{
        //check if user is authenticated or not
        if(typeof isAuthenticated =='undefined')return;
        const inApp =segments[0]=='(app)';

        if(isAuthenticated && !inApp){
            //redirect to Home
            router.replace('home')
        }else{
            // redirect to sign IN
            router.replace('./welcome')
        }

    },[isAuthenticated])

    return <Slot />
}

const _layout=() => {
  return (
   <AuthContextProvider>
    <MainLayout />
   </AuthContextProvider>
  )
}

export default withExpoSnack(_layout);
