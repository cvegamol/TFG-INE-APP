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

const CifrasPoblacion = () => {
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
                    const estadisticaContinuaPoblacion = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/450`);
                    const proyeccionesPoblacion = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/326`);
                    const proyeccionHogares = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/70`);
                    const censosPoblacion = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/8`);
                    const cifrasPoblacion = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/72`);

                    const datosEstContinuaPoblacion = await estadisticaContinuaPoblacion.json();
                    const datosProyecciones = await proyeccionesPoblacion.json();
                    const datosProyeccionHogares = await proyeccionHogares.json();
                    const datosCensosPoblacion = await censosPoblacion.json();
                    const datosCifrasPoblacion = await cifrasPoblacion.json();

                    const nuevosDatos = [
                         { Nombre: datosCifrasPoblacion[0].Nombre, Id: datosCifrasPoblacion[0].Id, Url: 'cifrasP' },
                    ];

                    const datosPeriodicos = [
                         { Nombre: datosEstContinuaPoblacion[0].Nombre, Id: datosEstContinuaPoblacion[0].Id, Url: 'estadisticasContinuaPoblacion' },
                         { Nombre: datosProyecciones[0].Nombre, Id: datosProyecciones[0].Id, Url: 'proyeccionesPoblacion' },
                         { Nombre: datosProyeccionHogares[0].Nombre, Id: datosProyeccionHogares[0].Id, Url: 'proyeccionesHogares' },
                         { Nombre: datosCensosPoblacion[0].Nombre, Id: datosCensosPoblacion[0].Id, Url: 'censosPoblacionViviendas' }
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

          if (url === 'cifrasP') {
               router.push({
                    pathname: 'cifrasP',
                    params: { id, nombre },
               });
          } else if (url === 'estadisticasContinuaPoblacion') {
               router.push({
                    pathname: 'estadisticasContinuaPoblacion',
                    params: { id, nombre },
               });
          } else if (url === 'proyeccionesPoblacion') {
               router.push({
                    pathname: 'proyeccionesPoblacion',
                    params: { id, nombre },
               });
          } else if (url === 'proyeccionesHogares') {
               router.push({
                    pathname: 'proyeccionesHogares',
                    params: { id, nombre },
               });
          } else {
               router.push({
                    pathname: 'censosPoblacionViviendas',
                    params: { id, nombre },
               });
          }

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

export default CifrasPoblacion;
