import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const OperacionesPadron = () => {
     const router = useRouter();
     const { id, nombre } = useLocalSearchParams();
     const [series, setSeries] = useState([]);
     const [tablas, setTablas] = useState([]);
     const [isLoading, setIsLoading] = useState(true);

     const handlePress = (id, nombre) => {
          router.push({
               pathname: 'seriesPadron',
               params: { id, nombre },
          });
     };

     useEffect(() => {
          const obtenerDatos = async () => {
               try {
                    const seriesJson = await fetch(`http://192.168.1.13:3000/series/getSerieByFkOperation/${id}`);
                    const series = await seriesJson.json();
                    console.log('Id', id);
                    const tablasJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/TABLAS_OPERACION/${id}`);
                    const tablas = await tablasJson.json();
                    setTablas(tablas);

                    if (tablas && tablas.length > 0) {
                         const id_t = tablas[0].Id;
                         const variableTabla = await fetch(`https://servicios.ine.es/wstempus/js/ES/GRUPOS_TABLA/${id_t}`);
                         const variables = await variableTabla.json();
                         console.log("Variables", variables);
                    } else {
                         console.log('No hay tablas disponibles.');
                    }

                    setSeries(series);
               } catch (error) {
                    console.error('Error al obtener las series:', error);
               } finally {
                    setIsLoading(false);
               }
          };

          obtenerDatos();
     }, [id]);

     return (
          <Plantilla>
               <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <ViewStyled className="p-4">
                         <TextStyled className="text-3xl font-bold text-center text-gray-800 mb-4">
                              Detalle de la Operación
                         </TextStyled>
                         <TextStyled className="text-lg text-gray-600">ID: {id}</TextStyled>
                         <TextStyled className="text-lg text-gray-600 mb-4">Nombre: {nombre}</TextStyled>

                         <TextStyled className="text-2xl font-semibold text-gray-800 mt-4 mb-2">
                              Series:
                         </TextStyled>

                         {isLoading ? (
                              <ViewStyled className="flex-1 justify-center items-center">
                                   <Loading size={hp(6)} />
                                   <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
                              </ViewStyled>
                         ) : (
                              tablas.length > 0 ? (
                                   tablas.map((serie, index) => (
                                        <TouchableOpacityStyled
                                             key={index}
                                             className="p-4 bg-white rounded-md shadow-md my-2"
                                             onPress={() => handlePress(serie.Id, serie.Nombre)}
                                        >
                                             <TextStyled className="text-lg text-gray-700">
                                                  {serie.Nombre} - {serie.Id}
                                             </TextStyled>
                                        </TouchableOpacityStyled>
                                   ))
                              ) : (
                                   <TextStyled className="text-lg text-gray-600">
                                        No hay series disponibles.
                                   </TextStyled>
                              )
                         )}
                    </ViewStyled>
               </ScrollView>
          </Plantilla>
     );
};

export default OperacionesPadron;
