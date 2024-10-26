import React, { useState } from 'react';
import { ScrollView, View, Text, Alert, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, getAuth, updateCurrentUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FontAwesome6 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/authContext';
import Loading from '../../components/Loading';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const TextStyledInput = styled(TextInput);

const AddUser = () => {
     const { db, auth } = useAuth();
     const [user, setUser] = useState({ name: '', surname: '', email: '', password: '', rol: 'general' });
     const [loading, setLoading] = useState(false);
     const router = useRouter();

     const handleChange = (field, value) => {
          setUser({ ...user, [field]: value });
     };

     const handleAddUser = async () => {
          setLoading(true);
          const currentUser = auth.currentUser;

          try {
               if (!user.name || !user.surname || !user.email || !user.password) {
                    Alert.alert('Error', 'Todos los campos son obligatorios.');
                    setLoading(false);
                    return;
               }

               const response = await createUserWithEmailAndPassword(getAuth(), user.email, user.password);

               const timestamp = new Date();

               await setDoc(doc(db, 'users', response.user.uid), {
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    rol: user.rol,
                    userId: response.user.uid,
                    isOnline: false,
                    lastActive: timestamp,
                    createdAt: timestamp,
               });

               await updateCurrentUser(auth, currentUser);

               Alert.alert('Éxito', 'El usuario ha sido añadido correctamente.');
               router.push('gestionUsuarios');
          } catch (error) {
               console.log('Error al añadir el usuario:', error);
               Alert.alert('Error', `No se pudo añadir el usuario: ${error.message}`);
          } finally {
               setLoading(false);
          }
     };

     return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
               <ViewStyled className="flex-1 justify-center items-center p-4">
                    <ViewStyled className="bg-teal-50 rounded-2xl p-6 mx-auto w-full max-w-md shadow-lg border-2 border-teal-600">
                         <ViewStyled className="flex-1 justify-center space-y-6">
                              <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                                   <TextStyled className="font-bold tracking-wider text-center text-teal-800 text-2xl">
                                        Añadir Nuevo Usuario
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
                                             onChangeText={(value) => handleChange('email', value)}
                                             value={user.email}
                                             style={{ flex: 1 }}
                                             className="font-medium text-teal-900"
                                             placeholder="Correo Electrónico"
                                             placeholderTextColor="#064e3b"
                                        />
                                   </ViewStyled>

                                   {/* Input de Contraseña */}
                                   <ViewStyled className="flex-row gap-3 px-4 bg-teal-200 items-center rounded-2xl mx-auto w-full max-w-md">
                                        <FontAwesome6 name="lock" size={20} color="#0c4a4e" />
                                        <TextStyledInput
                                             onChangeText={(value) => handleChange('password', value)}
                                             value={user.password}
                                             style={{ flex: 1 }}
                                             className="font-medium text-teal-900"
                                             placeholder="Contraseña"
                                             secureTextEntry
                                             placeholderTextColor="#064e3b"
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

                                   {/* Botón para añadir usuario */}
                                   <ViewStyled>
                                        {loading ? (
                                             <ViewStyled className="flex-row justify-center">
                                                  <Loading size={50} />
                                                  <TextStyled className="text-teal-700">Cargando...</TextStyled>
                                             </ViewStyled>
                                        ) : (
                                             <StyledTouchableOpacity
                                                  onPress={handleAddUser}
                                                  className="bg-teal-700 rounded-xl justify-center items-center mx-auto w-full max-w-md p-3"
                                             >
                                                  <TextStyled className="text-white font-bold tracking-wider">Añadir Usuario</TextStyled>
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

export default AddUser;
