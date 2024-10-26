import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { Table, Row } from 'react-native-table-component';
import Loading from '../../components/Loading';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const GestionUsuarios = () => {
     const { db } = useAuth();
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);
     const router = useRouter();

     const tableHead = ['Correo', 'Rol', 'Ver más', 'Modificar', 'Eliminar'];
     const widthArr = [Dimensions.get('window').width * 0.55, Dimensions.get('window').width * 0.2, Dimensions.get('window').width * 0.3, Dimensions.get('window').width * 0.25, Dimensions.get('window').width * 0.2];

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

     const handleDeleteUser = async (userId) => {
          try {
               await deleteDoc(doc(db, 'users', userId));
               Alert.alert('Usuario eliminado', 'El usuario ha sido eliminado correctamente.');
               fetchUsers();
          } catch (error) {
               Alert.alert('Error', 'No se pudo eliminar el usuario.');
          }
     };

     if (loading) {
          return (
               <ViewStyled className="flex-1 justify-center items-center">
                    <Loading size={50} />
                    <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
               </ViewStyled>
          );
     }

     return (
          <ScrollView>
               <ViewStyled className="p-4">
                    <TextStyled className="text-2xl font-bold text-center mb-4 text-teal-700">Listado de Usuarios</TextStyled>
                    <TextStyled className="text-center text-black-600 mb-4">
                         Aquí se encuentra un listado de usuarios que se han registrado en la aplicación.
                    </TextStyled>
                    <ScrollView horizontal={true}>
                         <ViewStyled className="bg-gray-100 p-4 rounded-xl shadow-md">
                              <Table borderStyle={{ borderWidth: 1, borderColor: '#0c4a4e' }}>
                                   <Row
                                        data={tableHead}
                                        widthArr={widthArr}
                                        style={{ height: 50, backgroundColor: '#0c4a4e' }}
                                        textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#ffffff' }}
                                   />

                                   {users.map((user, index) => (
                                        <Row
                                             key={user.id}
                                             data={[
                                                  user.email,
                                                  user.rol || 'Sin rol',
                                                  <StyledTouchableOpacity
                                                       onPress={() => router.push(`verMas/${user.id}`)}
                                                       className="bg-teal-700 p-2 rounded-xl mx-auto"
                                                       style={{ width: 80, alignSelf: 'center' }}
                                                  >
                                                       <TextStyled className="text-white text-center">Ver más</TextStyled>
                                                  </StyledTouchableOpacity>,
                                                  <StyledTouchableOpacity
                                                       onPress={() => router.push(`modificar/${user.id}`)}
                                                       className="bg-teal-600 p-2 rounded-xl mx-auto"
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
                                             style={{ height: 50, backgroundColor: index % 2 === 0 ? '#f0f9fa' : '#e0f7f7' }}
                                             textStyle={{ textAlign: 'center', color: 'black' }}
                                        />
                                   ))}
                              </Table>
                         </ViewStyled>
                    </ScrollView>

                    <StyledTouchableOpacity
                         onPress={() => router.push('addUsuario')}
                         className="bg-teal-700 flex-row items-center justify-center p-3 rounded-lg mt-6 mx-auto w-48"
                    >
                         <FontAwesome6 name="user-plus" size={18} color="white" style={{ marginRight: 8 }} />
                         <TextStyled className="text-white font-bold text-sm">Añadir Usuario</TextStyled>
                    </StyledTouchableOpacity>

                    <StyledTouchableOpacity
                         onPress={() => router.push('informesUsuarios')}
                         className="bg-teal-600 flex-row items-center justify-center p-3 rounded-lg mt-4 mx-auto w-48"
                    >
                         <FontAwesome6 name="file-alt" size={18} color="white" style={{ marginRight: 8 }} />
                         <TextStyled className="text-white font-bold text-sm">Obtener Informes</TextStyled>
                    </StyledTouchableOpacity>
               </ViewStyled>
          </ScrollView>
     );
};

export default GestionUsuarios;
