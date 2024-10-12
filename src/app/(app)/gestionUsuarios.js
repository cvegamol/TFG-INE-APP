import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { Table, Row } from 'react-native-table-component';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const UserList = () => {
     const { db } = useAuth();
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);
     const router = useRouter();

     // Cabecera de la tabla
     const tableHead = ['Correo', 'Rol', 'Ver más', 'Modificar', 'Eliminar'];

     // Anchos para cada columna
     const widthArr = [Dimensions.get('window').width * 0.55, Dimensions.get('window').width * 0.2, Dimensions.get('window').width * 0.3, Dimensions.get('window').width * 0.25, Dimensions.get('window').width * 0.2];

     // Función para obtener usuarios desde Firebase
     const fetchUsers = async () => {
          setLoading(true);
          try {
               const querySnapshot = await getDocs(collection(db, 'users'));
               const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
               setUsers(usersData);
          } catch (error) {
               Alert.alert('Error', 'No se pudieron cargar los usuarios.');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchUsers();
     }, []);

     // Función para confirmar la eliminación de un usuario
     const confirmDeleteUser = (userId) => {
          Alert.alert(
               'Eliminar usuario',
               '¿Estás seguro de que deseas eliminar este usuario?',
               [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                         text: 'Eliminar',
                         style: 'destructive',
                         onPress: () => handleDeleteUser(userId),
                    },
               ],
               { cancelable: true }
          );
     };

     // Función para eliminar un usuario
     const handleDeleteUser = async (userId) => {
          try {
               await deleteDoc(doc(db, 'users', userId));
               Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado correctamente.');
               fetchUsers(); // Recargar la lista después de eliminar
          } catch (error) {
               Alert.alert('Error', 'No se pudo eliminar el usuario.');
          }
     };

     if (loading) {
          return <TextStyled>Cargando usuarios...</TextStyled>;
     }

     return (
          <ScrollView>
               <ViewStyled className="p-4">
                    <TextStyled className="text-2xl font-bold text-center mb-4">Listado de Usuarios</TextStyled>

                    <ScrollView horizontal={true}>
                         {/* Añade un Scroll horizontal para que las columnas no se corten */}
                         <ViewStyled className="bg-gray-100 p-4 rounded-xl shadow-md">
                              <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                                   {/* Cabecera de la tabla */}
                                   <Row
                                        data={tableHead}
                                        widthArr={widthArr}
                                        style={{ height: 50, backgroundColor: '#f1f8ff' }}
                                        textStyle={{ fontWeight: 'bold', textAlign: 'center' }}
                                   />

                                   {/* Listado de usuarios */}
                                   {users.map((user, index) => {
                                        console.log(user);
                                        return (
                                             <Row
                                                  key={user.id}
                                                  data={[
                                                       user.email,
                                                       user.rol || 'Sin rol', // Mostramos el rol del usuario o 'Sin rol' si no está definido
                                                       <StyledTouchableOpacity
                                                            onPress={() => router.push(`verMas/${user.id}`)}
                                                            className="bg-blue-600 p-2 rounded-xl mx-auto"
                                                            style={{ width: 80, alignSelf: 'center' }}
                                                       >
                                                            <TextStyled className="text-white text-center">Ver más</TextStyled>
                                                       </StyledTouchableOpacity>,
                                                       <StyledTouchableOpacity
                                                            onPress={() => router.push(`modificar/${user.id}`)}
                                                            className="bg-green-600 p-2 rounded-xl mx-auto"
                                                            style={{ width: 50, alignSelf: 'center' }}
                                                       >
                                                            <FontAwesome6 name="edit" size={20} color="white" style={{ alignSelf: 'center' }} />
                                                       </StyledTouchableOpacity>,
                                                       <StyledTouchableOpacity
                                                            onPress={() => confirmDeleteUser(user.id)}
                                                            className="bg-red-600 p-2 rounded-xl mx-auto"
                                                            style={{ width: 50, alignSelf: 'center' }}
                                                       >
                                                            <FontAwesome6 name="trash" size={20} color="white" style={{ alignSelf: 'center' }} />
                                                       </StyledTouchableOpacity>,
                                                  ]}
                                                  widthArr={widthArr}
                                                  style={{ height: 50, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                                                  textStyle={{ textAlign: 'center' }}
                                             />
                                        );
                                   })}
                              </Table>
                         </ViewStyled>
                    </ScrollView>
               </ViewStyled>
          </ScrollView>
     );
};

export default UserList;
