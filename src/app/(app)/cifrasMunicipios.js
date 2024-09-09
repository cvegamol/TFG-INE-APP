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
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);

const CifrasPadron = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
     const [operacionCifras, setOperacionCifras] = useState(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const obtenerDatos = async () => {
               try {
                    const cifrasPoblacionMunicipios = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/22`);
                    const datosCifras = await cifrasPoblacionMunicipios.json();

                    setOperacionCifras(datosCifras);
               } catch (error) {
                    console.error('Error al obtener las variables:', error.message);
               } finally {
                    setIsLoading(false);
               }
          };

          obtenerDatos();
     }, [id]);

     const handlePress = (id, nombre) => {
          router.push({
               pathname: 'municipios',
               params: { id, nombre },
          });
     };

     const handlePressCifras = (id, nombre) => {
          router.push({
               pathname: 'operacionesPadron',
               params: { id, nombre },
          });
     };

     return (
          <Plantilla>
               <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                    <ViewStyled className="p-4 bg-gray-100">

                         {isLoading ? (
                              <ViewStyled className="flex-1 justify-center items-center mt-8">
                                   <Loading size={hp(6)} />
                                   <TextStyled className="text-lg text-gray-500 mt-4">Cargando...</TextStyled>
                              </ViewStyled>
                         ) : (
                              <>
                                   <TextStyled className="text-3xl font-bold text-blue-600 mb-6">Cifras Oficiales de Población</TextStyled>

                                   <TouchableOpacityStyled
                                        className="p-4 bg-blue-500 rounded-xl shadow-lg my-3 mx-5 hover:bg-blue-600 active:bg-blue-400"
                                        onPress={() => handlePress(operacionCifras[0].Id, operacionCifras[0].Nombre)}
                                   >
                                        <TextStyled className="text-lg text-white font-semibold">Cifras oficiales de población de los municipios</TextStyled>
                                   </TouchableOpacityStyled>

                                   <TextStyled className="text-xl font-bold text-gray-700 mb-4">Otras tablas de la operación:</TextStyled>

                                   <TouchableOpacityStyled
                                        className="p-4 bg-green-500 rounded-xl shadow-lg my-3 mx-5 hover:bg-green-600 active:bg-green-400"
                                        onPress={() => handlePressCifras(operacionCifras[0].Id, operacionCifras[0].Nombre)}
                                   >
                                        <TextStyled className="text-lg text-white font-semibold">Tablas de las Cifras oficiales de población</TextStyled>
                                   </TouchableOpacityStyled>

                                   {/* Línea separadora */}
                                   <ViewStyled className="my-6">
                                        <View style={{ height: 2, backgroundColor: '#4A7C77', marginHorizontal: wp(2) }} />
                                   </ViewStyled>

                                   <TextStyled className="text-lg text-gray-700 mt-6 mb-2">¿Sabías que...?</TextStyled>
                                   <TextStyled className="text-base text-gray-600 leading-relaxed mb-6">
                                        El Padrón Municipal es un registro administrativo donde constan los vecinos del municipio. Su formación, mantenimiento, revisión y custodia corresponde a los respectivos Ayuntamientos, quienes deben remitir al INE las variaciones mensuales que se producen en los datos de sus padrones municipales. El INE, en cumplimiento de sus competencias, realiza las comprobaciones oportunas con el fin de subsanar posibles errores y duplicidades y obtiene para cada municipio la cifra de población. La Presidencia del INE, con el informe favorable del Consejo de Empadronamiento, eleva al Gobierno la propuesta de cifras oficiales de población de los municipios españoles referidas a 1 de enero de cada año, para su aprobación mediante real decreto, declarando así como oficiales las cifras de población resultantes de la revisión del Padrón municipal y procediendo a su publicación en el Boletín Oficial del Estado.

                                        La operación Cifras oficiales de población de los municipios españoles: Revisión del Padrón Municipal publica con referencia a 1 de enero de cada año, la población por sexo a nivel municipal, capitales de provincia, islas,.. Las series comienzan en el año 1996, punto de arranque del actual sistema de gestión padronal y cuyas cifras van referidas al 1 de mayo siendo la Revisión a 1 de enero de 1998 la primera actualización en llevarse a cabo de acuerdo a este sistema
                                   </TextStyled>

                              </>
                         )}
                    </ViewStyled>
               </ScrollViewStyled>
          </Plantilla>
     );
};

export default CifrasPadron;
