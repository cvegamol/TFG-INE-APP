import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter, useSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/authContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const TextStyledInput = styled(TextInput);

const ModifyUser = () => {
     const { db } = useAuth();
     const { userId } = useLocalSearchParams();
     const [user, setUser] = useState({ name: '', surname: '', email: '', rol: 'general' });
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
                    router.back();
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

     const handleChange = (field, value) => {
          setUser({ ...user, [field]: value });
     };

     const handleUpdateUser = async () => {
          setLoading(true);
          try {
               await updateDoc(doc(db, 'users', userId), user);
               Alert.alert('Éxito', 'El perfil ha sido actualizado correctamente.');
               router.back();
          } catch (error) {
               Alert.alert('Error', 'No se pudo actualizar el perfil.');
          } finally {
               setLoading(false);
          }
     };

     if (loading) {
          return <TextStyled>Cargando información del usuario...</TextStyled>;
     }

     return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
               <ViewStyled className="flex-1 justify-center items-center p-4">
                    <ViewStyled className="bg-white/40 rounded-2xl p-6 mx-auto w-full max-w-md backdrop-blur-xl border-2 border-white">
                         <ViewStyled className="flex-1 justify-center space-y-6">
                              <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                                   <TextStyled className="font-bold tracking-wider text-center text-neutral-800 text-2xl">
                                        Editar Perfil del Usuario
                                   </TextStyled>

                                   {/* Input de Nombre */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user" size={20} color="gray" />
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange('name', value)}
                                             value={user.name}
                                             style={{ flex: 1 }}
                                             className="font-medium text-neutral-800"
                                             placeholder="Nombre"
                                             placeholderTextColor="#172554"
                                        />
                                   </ViewStyled>

                                   {/* Input de Apellido */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user" size={20} color="gray" />
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange('surname', value)}
                                             value={user.surname}
                                             style={{ flex: 1 }}
                                             className="font-medium text-neutral-800"
                                             placeholder="Apellido"
                                             placeholderTextColor="#172554"
                                        />
                                   </ViewStyled>

                                   {/* Input de Correo Electrónico */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="envelope" size={20} color="gray" />
                                        <TextStyledInput
                                             value={user.email}
                                             style={{ flex: 1 }}
                                             className="font-medium text-neutral-800"
                                             placeholder="Correo Electrónico"
                                             placeholderTextColor="#172554"
                                             editable={false}
                                        />
                                   </ViewStyled>

                                   {/* Selector de Rol */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user-shield" size={20} color="gray" />
                                        <Picker
                                             selectedValue={user.rol}
                                             onValueChange={(value) => handleChange('rol', value)}
                                             style={{ flex: 1 }}
                                        >
                                             <Picker.Item label="General" value="general" />
                                             <Picker.Item label="Admin" value="admin" />
                                        </Picker>
                                   </ViewStyled>

                                   {/* Botón para guardar cambios */}
                                   <ViewStyled>
                                        {loading ? (
                                             <ViewStyled className="flex-row justify-center">
                                                  <TextStyled>Cargando...</TextStyled>
                                             </ViewStyled>
                                        ) : (
                                             <StyledTouchableOpacity
                                                  onPress={handleUpdateUser}
                                                  className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md p-3"
                                             >
                                                  <TextStyled className="text-white font-bold tracking-wider">
                                                       Guardar Cambios
                                                  </TextStyled>
                                             </StyledTouchableOpacity>
                                        )}
                                   </ViewStyled>
                              </ViewStyled>
                         </ViewStyled>
                    </ViewStyled>
               </ViewStyled>
          </ScrollView>
     );
};

export default ModifyUser;