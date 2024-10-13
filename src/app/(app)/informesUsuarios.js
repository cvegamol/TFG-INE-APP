import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { Table, Row } from 'react-native-table-component';
import Loading from '../../components/Loading';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const UserReports = () => {
     const { db } = useAuth();
     const [users, setUsers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [onlineUsers, setOnlineUsers] = useState(0);
     const [lifetimeUsers, setLifetimeUsers] = useState(0);

     // Cabecera de la tabla
     const tableHead = ['Nombre', 'Apellido', 'Rol', 'Correo', 'Creado', 'Última Conexión'];
     const widthArr = [Dimensions.get('window').width * 0.25, Dimensions.get('window').width * 0.25, Dimensions.get('window').width * 0.25, Dimensions.get('window').width * 0.4, Dimensions.get('window').width * 0.4, Dimensions.get('window').width * 0.44];

     // Función para obtener los datos de usuarios desde Firestore
     const fetchUsers = async () => {
          setLoading(true);
          try {
               const querySnapshot = await getDocs(collection(db, 'users'));
               console.log("Usuarios:", querySnapshot.docs)
               const usersData = querySnapshot.docs.map(doc => {
                    const userData = { ...doc.data(), id: doc.id };
                    console.log('Usuario:', userData); // Aquí haces el console.log de cada usuario
                    return userData;
               });
               // Contar usuarios en línea y usuarios totales
               const onlineUsersCount = usersData.filter(user => user.isOnline).length;
               const totalUsersCount = usersData.length;

               setOnlineUsers(onlineUsersCount);
               setLifetimeUsers(totalUsersCount);
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
                    <TextStyled className="text-2xl font-bold text-center mb-4">Informes de Usuarios</TextStyled>

                    <ViewStyled className="bg-gray-100 p-6 rounded-xl shadow-md mb-4">
                         <TextStyled className="text-lg font-bold">Usuarios en Línea: {onlineUsers}</TextStyled>
                    </ViewStyled>

                    <ViewStyled className="bg-gray-100 p-6 rounded-xl shadow-md mb-4">
                         <TextStyled className="text-lg font-bold">Usuarios Activos por Vida: {lifetimeUsers}</TextStyled>
                    </ViewStyled>

                    <ScrollView horizontal={true}>
                         <ViewStyled className="bg-gray-100 p-4 rounded-xl shadow-md">
                              <Table borderStyle={{ borderWidth: 1, borderColor: '#ccc' }}>
                                   <Row
                                        data={tableHead}
                                        widthArr={widthArr}
                                        style={{ height: 50, backgroundColor: '#f1f8ff' }}
                                        textStyle={{ fontWeight: 'bold', textAlign: 'center' }}
                                   />
                                   {users.map((user, index) => (
                                        <Row
                                             key={user.id}
                                             data={[
                                                  user.name || 'Sin nombre',
                                                  user.surname || 'Sin apellido',
                                                  user.rol || 'Sin rol',
                                                  user.email,
                                                  user.createdAt?.toDate().toLocaleDateString() || 'Desconocido',
                                                  user.lastActive?.toDate().toLocaleString() || 'Nunca'
                                             ]}
                                             widthArr={widthArr}
                                             style={{ height: 50, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                                             textStyle={{ textAlign: 'center' }}
                                        />
                                   ))}
                              </Table>
                         </ViewStyled>
                    </ScrollView>
               </ViewStyled>
          </ScrollView>
     );
};

export default UserReports;
