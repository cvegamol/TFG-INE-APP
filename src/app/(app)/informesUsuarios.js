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

     const tableHead = ['Nombre', 'Apellido', 'Rol', 'Correo', 'Fecha de Creación', 'Última Conexión'];
     const widthArr = [
          Dimensions.get('window').width * 0.25,
          Dimensions.get('window').width * 0.25,
          Dimensions.get('window').width * 0.25,
          Dimensions.get('window').width * 0.4,
          Dimensions.get('window').width * 0.4,
          Dimensions.get('window').width * 0.44
     ];

     const fetchUsers = async () => {
          setLoading(true);
          try {
               const querySnapshot = await getDocs(collection(db, 'users'));
               const usersData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
                    <TextStyled className="text-lg text-teal-700 mt-2">Cargando...</TextStyled>
               </ViewStyled>
          );
     }

     return (
          <ScrollView>
               <ViewStyled style={{ padding: 16 }}>
                    <TextStyled style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#065f46' }}>
                         Informes de Usuarios
                    </TextStyled>

                    <ViewStyled style={{ backgroundColor: '#E6FFFA', padding: 16, borderRadius: 12, marginBottom: 16, borderColor: '#B2F5EA', borderWidth: 1 }}>
                         <TextStyled style={{ fontSize: 18, fontWeight: 'bold', color: '#319795' }}>
                              Usuarios en Línea: {onlineUsers}
                         </TextStyled>
                    </ViewStyled>

                    <ViewStyled style={{ backgroundColor: '#E6FFFA', padding: 16, borderRadius: 12, marginBottom: 16, borderColor: '#B2F5EA', borderWidth: 1 }}>
                         <TextStyled style={{ fontSize: 18, fontWeight: 'bold', color: '#319795' }}>
                              Usuarios Activos por Vida: {lifetimeUsers}
                         </TextStyled>
                    </ViewStyled>

                    <ScrollView horizontal={true}>
                         <ViewStyled style={{ backgroundColor: '#E6FFFA', padding: 16, borderRadius: 12, borderColor: '#B2F5EA', borderWidth: 1 }}>
                              <Table borderStyle={{ borderWidth: 1, borderColor: '#0c4a4e' }}>
                                   <Row
                                        data={tableHead}
                                        widthArr={widthArr}
                                        style={{ height: 50, backgroundColor: '#0c4a4e' }}
                                        textStyle={{ fontWeight: 'bold', textAlign: 'center', color: '#fff' }}
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
                                             style={{ height: 50, backgroundColor: index % 2 === 0 ? '#e0f2f1' : '#f0fdfa' }}
                                             textStyle={{ textAlign: 'center', color: '#0c4a4e' }}
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
