import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
                    <ViewStyled className="p-4 bg-gray-50">
                         {isLoading ? (
                              <ViewStyled className="flex-1 justify-center items-center mt-8">
                                   <Loading size={hp(6)} />
                                   <TextStyled className="text-lg text-teal-500 mt-4">Cargando...</TextStyled>
                              </ViewStyled>
                         ) : (
                              <>
                                   <TextStyled className="text-3xl font-bold text-teal-800 mb-6">Cifras Oficiales de Población</TextStyled>


                                   <TouchableOpacityStyled
                                        className="p-4 bg-teal-800 rounded-xl shadow-lg my-3 mx-5 hover:shadow-xl active:bg-teal-700"
                                        onPress={() => handlePress(operacionCifras[0].Id, operacionCifras[0].Nombre)}
                                        style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' }}
                                   >
                                        <TextStyled className="text-lg text-white font-semibold">
                                             Cifras oficiales de población de los municipios
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   <TextStyled className="text-xl font-bold text-gray-700 mb-4">Otras tablas de la operación:</TextStyled>

                                   {/* Segundo botón más sutil y elegante */}
                                   <TouchableOpacityStyled
                                        className="p-4 bg-white rounded-xl shadow-xl my-3 mx-5 hover:bg-gray-200 active:bg-gray-100"
                                        onPress={() => handlePressCifras(operacionCifras[0].Id, operacionCifras[0].Nombre)}
                                        style={{ borderWidth: 1, borderColor: '#4A7C77' }}
                                   >
                                        <TextStyled className="text-lg text-teal-700 font-semibold">
                                             Tablas de las Cifras oficiales de población
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   {/* Línea separadora */}
                                   <ViewStyled className="my-6">
                                        <View style={{ height: 2, backgroundColor: '#4A7C77', marginHorizontal: wp(2) }} />
                                   </ViewStyled>

                                   <TextStyled className="text-lg text-gray-700 mt-6 mb-2">¿Sabías que...?</TextStyled>
                                   <TextStyled className="text-base text-gray-600 leading-relaxed mb-6">
                                        El Padrón Municipal es un registro administrativo donde constan los vecinos del municipio. Su formación, mantenimiento, revisión y custodia corresponde a los respectivos Ayuntamientos, quienes deben remitir al INE las variaciones mensuales que se producen en los datos de sus padrones municipales.

                                        La Estadística del Padrón continuo se elabora a partir de la explotación exhaustiva de las variables básicas que contienen los ficheros padronales disponibles en el INE. Se ofrecen los datos de la población residente en España a 1 de enero de cada año, según lugar de residencia, sexo, edad, nacionalidad y lugar de nacimiento. Los datos de lugar de residencia se facilitan para distintos niveles de desagregación territorial: nacional, comunidades autónomas, provincias, municipios y secciones censales.                                   </TextStyled>
                              </>
                         )}
                    </ViewStyled>
               </ScrollViewStyled>
          </Plantilla>
     );
};

export default CifrasPadron;
