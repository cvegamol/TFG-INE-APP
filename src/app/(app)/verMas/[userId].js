// Archivo: verMas/[userId].js

import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter, useSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/authContext';
import Loading from '../../../components/Loading';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const UserDetail = () => {
     const { db } = useAuth();
     const { userId } = useLocalSearchParams();
     const [user, setUser] = useState(null);
     const [loading, setLoading] = useState(true);
     const router = useRouter();

     const fetchUserDetails = async () => {
          setLoading(true);
          try {
               const userDoc = await getDoc(doc(db, 'users', userId));
               if (userDoc.exists()) {
                    setUser(userDoc.data());
               } else {
                    Alert.alert('Error', 'Usuario no encontrado.');
                    router.push('gestionUsuarios');
               }
          } catch (error) {
               Alert.alert('Error', 'No se pudo cargar la información del usuario.');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (userId) {
               fetchUserDetails();
          }
     }, [userId]);

     if (loading) {
          return (
               <ViewStyled className="flex-1 justify-center items-center">
                    <Loading size={50} />
                    <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
               </ViewStyled>
          );
     }

     if (!user) {
          return null;
     }

     return (
          <ScrollView className="bg-gray-100">
               <ViewStyled className="p-6 bg-white shadow-md rounded-lg m-4">
                    <TextStyled className="text-3xl font-extrabold text-teal-800 mb-6">Detalles del Usuario</TextStyled>
                    <ViewStyled className="mb-4">
                         <TextStyled className="text-lg font-semibold text-gray-700">Correo:</TextStyled>
                         <TextStyled className="text-base text-gray-600">{user.email}</TextStyled>
                    </ViewStyled>
                    <ViewStyled className="mb-4">
                         <TextStyled className="text-lg font-semibold text-gray-700">Nombre:</TextStyled>
                         <TextStyled className="text-base text-gray-600">{user.name || 'No especificado'}</TextStyled>
                    </ViewStyled>
                    <ViewStyled className="mb-4">
                         <TextStyled className="text-lg font-semibold text-gray-700">Apellido:</TextStyled>
                         <TextStyled className="text-base text-gray-600">{user.surname || 'No especificado'}</TextStyled>
                    </ViewStyled>
                    <ViewStyled className="mb-4">
                         <TextStyled className="text-lg font-semibold text-gray-700">Rol:</TextStyled>
                         <TextStyled className="text-base text-gray-600">{user.rol || 'Sin rol'}</TextStyled>
                    </ViewStyled>
               </ViewStyled>
          </ScrollView>
     );
};

export default UserDetail;