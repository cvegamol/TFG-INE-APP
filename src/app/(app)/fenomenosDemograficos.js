import React, { useEffect, useState } from 'react';
import { Animated, SectionList, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const FenomenosDemograficos = () => {
     const [dataPeriodica, setDataPeriodica] = useState([]);
     const [data, setData] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const router = useRouter();
     const [fadeAnim] = useState(new Animated.Value(0));

     useEffect(() => {
          Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true
          }).start();

          const obtenerDatosOperaciones = async () => {
               try {
                    const estadisticasMigracionesCambiosResidencia = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/455`);
                    const estadisticasMatrimonios = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/305`);
                    const estadisticasNacimientos = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/307`);
                    const estadisticasDefunciones = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/309`);
                    const estadisticasAdquisiciones = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/336`);
                    const indicadoresDemograficos = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/33`);
                    const tablasMortalidad = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/197`);
                    const estimacionDefunciones = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/406`);
                    const estimacionNacimientos = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/424`);
                    const estadisticaMigraciones = await fetch(`https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/71`);

                    // const estadisticasMigracionesCambiosResidencia = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/455`);
                    // const estadisticasMatrimonios = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/305`);
                    // const estadisticasNacimientos = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/307`);
                    // const estadisticasDefunciones = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/309`);
                    // const estadisticasAdquisiciones = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/336`);
                    // const indicadoresDemograficos = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/33`);
                    // const tablasMortalidad = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/197`);
                    // const estimacionDefunciones = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/406`);
                    // const estimacionNacimientos = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/424`);
                    // const estadisticaMigraciones = await fetch(`http://192.168.128.97:3000/operaciones/getOperationById/71`);



                    const datosMigracionesCambiosResidencia = await estadisticasMigracionesCambiosResidencia.json();
                    const datosMatrimonios = await estadisticasMatrimonios.json();
                    const datosNacimientos = await estadisticasNacimientos.json();
                    const datosDefunciones = await estadisticasDefunciones.json();
                    const datosAdquisiciones = await estadisticasAdquisiciones.json();
                    const datosIndicadores = await indicadoresDemograficos.json();
                    const datosTablasMortalidad = await tablasMortalidad.json();
                    const datosEstimacionDefunciones = await estimacionDefunciones.json();
                    const datosEstimacionNacimientos = await estimacionNacimientos.json();
                    const datosMigraciones = await estadisticaMigraciones.json();


                    const nuevosDatos = [
                         { Nombre: datosMigraciones[0][0].Nombre, Id: datosMigraciones[0][0].Id, Url: 'estadisticasMigraciones' },

                    ];

                    const datosPeriodicos = [
                         { Nombre: datosMigracionesCambiosResidencia[0][0].Nombre, Id: datosMigracionesCambiosResidencia[0][0].Id, Url: 'estadisticasMigracionesCambiosResidencia' },
                         { Nombre: datosMatrimonios[0][0].Nombre, Id: datosMatrimonios[0][0].Id, Url: 'estadisticasMatrimonios' },
                         { Nombre: datosNacimientos[0][0].Nombre, Id: datosNacimientos[0][0].Id, Url: 'estadisticasNacimientos' },
                         { Nombre: datosDefunciones[0][0].Nombre, Id: datosDefunciones[0][0].Id, Url: 'estadisticasDefunciones' },
                         { Nombre: datosAdquisiciones[0][0].Nombre, Id: datosAdquisiciones[0][0].Id, Url: 'estadisticasAdquisiciones' },
                         { Nombre: datosIndicadores[0][0].Nombre, Id: datosIndicadores[0][0].Id, Url: 'indicadoresDemograficos' },
                         { Nombre: datosTablasMortalidad[0][0].Nombre, Id: datosTablasMortalidad[0][0].Id, Url: 'tablasMortalidad' },
                         { Nombre: datosEstimacionDefunciones[0][0].Nombre, Id: datosEstimacionDefunciones[0][0].Id, Url: 'estimacionDefunciones' },
                         { Nombre: datosEstimacionNacimientos[0][0].Nombre, Id: datosEstimacionNacimientos[0][0].Id, Url: 'estimacionNacimientos' },
                    ];

                    setDataPeriodica(datosPeriodicos);
                    setData(nuevosDatos);
               } catch (error) {
                    console.error(error.message);
               } finally {
                    setIsLoading(false);
               }
          };

          obtenerDatosOperaciones();
     }, []);

     const handlePress = (id, nombre, url) => {

          router.push({
               pathname: url,
               params: { id, nombre },
          });
     };

     return (
          <Plantilla>
               <TextStyled className="text-3xl font-bold text-center text-teal-800 mb-6">
                    Operaciones de Cifras de Población y Censos Demográficos
               </TextStyled>
               {isLoading ? (
                    <ViewStyled className="flex-1 justify-center items-center">
                         <Loading size={hp(6)} />
                         <TextStyled className="text-lg text-teal-600 mt-2">Cargando datos, por favor espera...</TextStyled>
                    </ViewStyled>
               ) : (
                    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                         <SectionList
                              sections={[
                                   { title: 'Operaciones Estadísticas Periódicas', data: dataPeriodica },
                                   { title: 'Operaciones Estadísticas No Periódicas', data: data }
                              ]}
                              renderItem={({ item }) => (
                                   <TouchableOpacityStyled
                                        className="p-4 bg-teal-100 rounded-lg shadow-md mb-4 mx-4 hover:bg-teal-300 hover:shadow-lg transition duration-300 ease-in-out"
                                        onPress={() => handlePress(item.Id, item.Nombre, item.Url)}
                                        activeOpacity={0.7}
                                   >
                                        <TextStyled className="text-lg font-medium text-teal-900">{item.Nombre}</TextStyled>
                                   </TouchableOpacityStyled>
                              )}
                              renderSectionHeader={({ section }) => (
                                   <ViewStyled className="bg-teal-600 p-4 mb-2 rounded-t-lg">
                                        <TextStyled className="text-xl font-semibold text-white">
                                             {section.title}
                                        </TextStyled>
                                   </ViewStyled>
                              )}
                              keyExtractor={item => `basicListEntry-${item.Id}`}
                         />
                    </Animated.View>
               )}
          </Plantilla>
     );
};

export default FenomenosDemograficos;
