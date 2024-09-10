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

const ResidentesExtranjero = () => {
     const router = useRouter();
     const { id, nombre } = useLocalSearchParams();
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
                                   <TextStyled className="text-3xl font-bold text-blue-600 mb-6">{nombre}</TextStyled>
                                   <TextStyled className="text-lg text-gray-700 mt-6 mb-2">Tablas más consultadas</TextStyled>


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
                                        La Estadística del Padrón de españoles residentes en el extranjero se obtiene a partir de la explotación estadística del fichero central del Padrón de españoles residentes en el extranjero (PERE), que contiene las inscripciones de las personas que gozan de la nacionalidad española y viven habitualmente fuera de España, sea o no ésta su única nacionalidad. El PERE se forma con los datos existentes en el Registro de Matrícula de cada Oficina Consular de Carrera o Sección Consular de las Misiones Diplomáticas.

                                        Esta estadística permite obtener la distribución de las personas inscritas y de las nuevas inscripciones, a una fecha de referencia, según país de residencia, provincia y municipio de inscripción a efectos electorales, sexo, fecha y lugar de nacimiento.
                                   </TextStyled>

                              </>
                         )}
                    </ViewStyled>
               </ScrollViewStyled>
          </Plantilla>
     );
};

export default ResidentesExtranjero;
