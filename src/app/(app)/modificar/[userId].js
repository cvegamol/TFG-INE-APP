import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../context/authContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Loading from '../../../components/Loading';

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
               router.push('gestionUsuarios');
          } catch (error) {
               Alert.alert('Error', 'No se pudo actualizar el perfil.');
          } finally {
               setLoading(false);
          }
     };

     if (loading) {
          return (
               <ViewStyled className="flex-1 justify-center items-center">
                    <Loading size={50} />
                    <TextStyled className="text-lg text-teal-700 mt-2">Cargando...</TextStyled>
               </ViewStyled>
          );
     }

     return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
               <ViewStyled className="flex-1 justify-center items-center p-4">
                    <ViewStyled className="bg-teal-50 rounded-2xl p-6 mx-auto w-full max-w-md shadow-lg border-2 border-teal-600">
                         <ViewStyled className="flex-1 justify-center space-y-6">
                              <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                                   <TextStyled className="font-bold tracking-wider text-center text-teal-800 text-2xl">
                                        Editar Usuario
                                   </TextStyled>

                                   {/* Input de Nombre */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-teal-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user" size={20} color="#0c4a4e" />
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange('name', value)}
                                             value={user.name}
                                             style={{ flex: 1 }}
                                             className="font-medium text-teal-900"
                                             placeholder="Nombre"
                                             placeholderTextColor="#064e3b"
                                        />
                                   </ViewStyled>

                                   {/* Input de Apellido */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-teal-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user" size={20} color="#0c4a4e" />
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange('surname', value)}
                                             value={user.surname}
                                             style={{ flex: 1 }}
                                             className="font-medium text-teal-900"
                                             placeholder="Apellido"
                                             placeholderTextColor="#064e3b"
                                        />
                                   </ViewStyled>

                                   {/* Input de Correo Electrónico */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-teal-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="envelope" size={20} color="#0c4a4e" />
                                        <TextStyledInput
                                             value={user.email}
                                             style={{ flex: 1 }}
                                             className="font-medium text-teal-900"
                                             placeholder="Correo Electrónico"
                                             placeholderTextColor="#064e3b"
                                             editable={false}
                                        />
                                   </ViewStyled>

                                   {/* Selector de Rol */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-teal-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="user-shield" size={20} color="#0c4a4e" />
                                        <Picker
                                             selectedValue={user.rol}
                                             onValueChange={(value) => handleChange('rol', value)}
                                             style={{ flex: 1, color: '#0c4a4e' }}
                                        >
                                             <Picker.Item label="General" value="general" />
                                             <Picker.Item label="Admin" value="admin" />
                                        </Picker>
                                   </ViewStyled>

                                   {/* Botón para guardar cambios */}
                                   <ViewStyled>
                                        {loading ? (
                                             <ViewStyled className="flex-row justify-center">
                                                  <TextStyled className="text-teal-700">Cargando...</TextStyled>
                                             </ViewStyled>
                                        ) : (
                                             <StyledTouchableOpacity
                                                  onPress={handleUpdateUser}
                                                  className="bg-teal-700 rounded-xl justify-center items-center mx-auto w-full max-w-md p-3"
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
