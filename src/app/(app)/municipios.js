import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Ionicons } from '@expo/vector-icons';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);

const CifrasOficialesPoblacionMunicipios = () => {
     const router = useRouter();
     const { id, nombre } = useLocalSearchParams();

     const [isLoading, setIsLoading] = useState(true);
     const [tablas, setTablas] = useState([]);
     const [fadeAnim] = useState(new Animated.Value(0)); // Estado para la animación de fade-in

     useEffect(() => {
          const obtenerDatos = async () => {
               try {
                    const tablasMunicipios = await fetch(`http://192.168.1.13:3000/tablas/getTableByCodeAndFkPublication/PROV-MUN/29`);
                    const data = await tablasMunicipios.json();
                    setTablas(data);

                    // Iniciar la animación de fade-in
                    Animated.timing(fadeAnim, {
                         toValue: 1,
                         duration: 800,
                         easing: Easing.ease,
                         useNativeDriver: true,
                    }).start();
               } catch (error) {
                    console.error('Error al obtener las variables:', error.message);
               } finally {
                    setIsLoading(false);
               }
          };

          obtenerDatos();
     }, [id]);

     const handlePress = (table) => {
          router.push({
               pathname: 'seriesPadron',
               params: { tabla: JSON.stringify(table) },
          });
     };

     return (
          <Plantilla>
               <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                         <ViewStyled className="p-4 bg-gradient-to-b from-indigo-200 via-purple-200 to-indigo-100 min-h-full">
                              {isLoading ? (
                                   <ViewStyled className="flex-1 justify-center items-center mt-8">
                                        <Loading size={hp(6)} />
                                        <TextStyled className="text-lg text-gray-500 mt-4">Cargando...</TextStyled>
                                   </ViewStyled>
                              ) : (
                                   tablas.length > 0 ? (
                                        tablas.map((table, index) => (
                                             <TouchableOpacityStyled
                                                  key={index}
                                                  className="p-4 bg-white rounded-lg shadow-lg my-3 flex-row items-center"
                                                  onPress={() => handlePress(table)}
                                                  activeOpacity={0.7}
                                             >
                                                  <Ionicons name="stats-chart" size={32} color="purple" />
                                                  <ViewStyled className="ml-4">
                                                       <TextStyled className="text-lg font-semibold text-gray-800">
                                                            {table.Nombre}
                                                       </TextStyled>
                                                       <TextStyled className="text-sm text-gray-600">
                                                            ID: {table.Id} - {table.Anyo_Periodo_ini} - {table.FechaRef_fin}
                                                       </TextStyled>
                                                  </ViewStyled>
                                             </TouchableOpacityStyled>
                                        ))
                                   ) : (
                                        <TextStyled className="text-lg text-gray-600">
                                             No hay tablas disponibles.
                                        </TextStyled>
                                   )
                              )}
                         </ViewStyled>
                    </Animated.View>
               </ScrollViewStyled>
          </Plantilla>
     );
};

export default CifrasOficialesPoblacionMunicipios;
