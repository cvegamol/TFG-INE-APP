import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Image, Animated, ImageBackground } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);
const ImageStyled = styled(Image);
const ImageBackgroundStyled = styled(ImageBackground);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacityStyled);

const CifrasPadron = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
     const [operacionCifras, setOperacionCifras] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [scrollEnabled, setScrollEnabled] = useState(true); // Controla el scroll global

     // Estado y animación para la tarjeta volteable
     const [flipAnim] = useState(new Animated.Value(0));
     const [isFlipped, setIsFlipped] = useState(false);

     useEffect(() => {
          let isMounted = true;
          const obtenerDatos = async () => {
               try {
                    const cifrasPoblacionMunicipios = await fetch(
                         `https://deploy-app-production-5893.up.railway.app/operaciones/getOperationById/${id}`
                         //`http://192.168.128.97:3000/operaciones/getOperationById/${id}`
                    );
                    const datosCifras = await cifrasPoblacionMunicipios.json();
                    if (isMounted) {
                         setOperacionCifras(datosCifras[0]);
                    }
               } catch (error) {
                    console.error('Error al obtener las variables:', error.message);
               } finally {
                    if (isMounted) {
                         setIsLoading(false);
                    }
               }
          };

          obtenerDatos();

          return () => {
               isMounted = false;
          };
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

     // Función para voltear la tarjeta
     const flipCard = () => {
          if (isFlipped) {
               // Voltear de regreso
               Animated.timing(flipAnim, {
                    toValue: 0,
                    duration: 800,
                    useNativeDriver: true,
               }).start(() => setIsFlipped(false));
          } else {
               // Voltear para mostrar el reverso
               Animated.timing(flipAnim, {
                    toValue: 180,
                    duration: 800,
                    useNativeDriver: true,
               }).start(() => setIsFlipped(true));
          }
     };

     // Interpolaciones para la rotación
     const frontInterpolate = flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['0deg', '180deg'],
     });

     const backInterpolate = flipAnim.interpolate({
          inputRange: [0, 180],
          outputRange: ['180deg', '360deg'],
     });

     const frontAnimatedStyle = {
          transform: [{ rotateY: frontInterpolate }],
     };

     const backAnimatedStyle = {
          transform: [{ rotateY: backInterpolate }],
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
     };

     // Funciones para deshabilitar/habilitar el scroll global
     const handleTouchStart = () => {
          setScrollEnabled(false);
     };

     const handleTouchEnd = () => {
          setScrollEnabled(true);
     };

     return (
          <Plantilla>
               {/* ScrollView global */}
               <ScrollViewStyled
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEnabled={scrollEnabled} // Controla si se permite el scroll
               >
                    <ViewStyled className="p-4 bg-white">
                         {isLoading ? (
                              <ViewStyled className="flex-1 justify-center items-center mt-8">
                                   <Loading size={hp(6)} />
                                   <TextStyled className="text-lg text-teal-500 mt-4">
                                        Cargando...
                                   </TextStyled>
                              </ViewStyled>
                         ) : (
                              <>
                                   {/* Imagen de encabezado que ocupa todo el View */}
                                   <ViewStyled className="mb-6">
                                        <ImageStyled
                                             source={require('../../assets/images/login/imagen-padron.png')}
                                             style={{
                                                  width: '100%',
                                                  height: hp('25%'),
                                                  borderRadius: 12,
                                             }}
                                        />
                                   </ViewStyled>

                                   <TextStyled className="text-3xl font-bold text-teal-800 mb-6 text-center">
                                        Cifras Oficiales de Población
                                   </TextStyled>

                                   {operacionCifras && operacionCifras.length > 0 && (
                                        <>
                                             {/* Primer botón */}
                                             <TouchableOpacityStyled
                                                  className="flex-row items-center p-4 bg-teal-600 rounded-xl shadow-lg my-3 mx-5"
                                                  onPress={() =>
                                                       handlePress(
                                                            operacionCifras[0].Id,
                                                            operacionCifras[0].Nombre
                                                       )
                                                  }
                                             >
                                                  <Ionicons name="people-circle-outline" size={24} color="white" />
                                                  <TextStyled className="text-lg text-white font-semibold ml-2">
                                                       Cifras oficiales de población de los municipios
                                                  </TextStyled>
                                             </TouchableOpacityStyled>

                                             <TextStyled className="text-xl font-bold text-gray-700 mt-6 mb-4 text-center">
                                                  Otras tablas de la operación
                                             </TextStyled>

                                             {/* Segundo botón */}
                                             <TouchableOpacityStyled
                                                  className="flex-row items-center p-4 bg-white rounded-xl shadow-lg my-3 mx-5 border-[1]"
                                                  style={{
                                                       borderColor: '#065f5b', // Color teal-600
                                                  }}
                                                  onPress={() =>
                                                       handlePressCifras(
                                                            operacionCifras[0].Id,
                                                            operacionCifras[0].Nombre
                                                       )
                                                  }
                                             >
                                                  <Ionicons name="stats-chart-outline" size={24} color="#065f5b" />
                                                  <TextStyled className="text-lg font-semibold ml-2" style={{ color: '#065f5b' }}>
                                                       Tablas de las Cifras oficiales de población
                                                  </TextStyled>
                                             </TouchableOpacityStyled>
                                        </>
                                   )}
                                   <ViewStyled
                                        style={{
                                             borderBottomWidth: 2, // Ancho del borde
                                             borderColor: '#065f5b', // Color del borde
                                             marginVertical: 16, // Margen vertical para separar el contenido
                                             width: '90%', // Ajuste de ancho (puedes modificar según tus necesidades)
                                             alignSelf: 'center', // Centra el View
                                        }}
                                   />
                                   {/* Tarjeta Volteable */}
                                   <ViewStyled className="my-6 mx-5" style={{ flex: 1 }}>
                                        <AnimatedTouchableOpacity activeOpacity={1} onPress={flipCard}>
                                             <Animated.View
                                                  style={[
                                                       frontAnimatedStyle,
                                                       {
                                                            width: '100%',
                                                            height: 400,
                                                            borderRadius: 12,
                                                            borderWidth: 1,
                                                            borderColor: '#065f5b',
                                                            overflow: 'hidden',
                                                            backfaceVisibility: 'hidden',
                                                            pointerEvents: isFlipped ? 'none' : 'auto',
                                                       },
                                                  ]}
                                             >
                                                  {/* Lado frontal de la tarjeta */}
                                                  <ImageBackgroundStyled
                                                       source={require('../../assets/images/login/imagen-spain.png')}

                                                       style={{ flex: 1 }}
                                                  >
                                                       <ViewStyled
                                                            style={{
                                                                 flex: 1,
                                                                 backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                                 padding: 16,
                                                            }}
                                                       >
                                                            <ViewStyled className="flex-row items-center mb-4">
                                                                 <Ionicons name="information-circle-outline" size={28} color="#ffffff" />
                                                                 <TextStyled className="text-lg font-semibold ml-2" style={{ color: '#ffffff' }}>
                                                                      ¿Sabías que...?
                                                                 </TextStyled>
                                                            </ViewStyled>
                                                       </ViewStyled>
                                                  </ImageBackgroundStyled>
                                             </Animated.View>

                                             {/* Lado posterior de la tarjeta */}
                                             <Animated.View
                                                  style={[
                                                       backAnimatedStyle,
                                                       {
                                                            flex: 1,
                                                            width: '100%',
                                                            height: 400,
                                                            borderRadius: 12,
                                                            borderWidth: 1,
                                                            borderColor: '#065f5b',
                                                            backgroundColor: '#E6FFFA',
                                                            overflow: 'visible',
                                                            backfaceVisibility: 'hidden',
                                                       },
                                                  ]}
                                             >
                                                  <ScrollView
                                                       contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                                                       style={{ flexGrow: 1 }}
                                                       nestedScrollEnabled={true} // Habilita scroll anidado
                                                       showsVerticalScrollIndicator={true}
                                                       onTouchStart={handleTouchStart} // Deshabilita scroll global al tocar
                                                       onTouchEnd={handleTouchEnd} // Habilita scroll global al soltar
                                                  >
                                                       <TextStyled className="text-base text-gray-800 leading-relaxed">
                                                            <TextStyled className="font-semibold">El Padrón Municipal</TextStyled> es un registro administrativo que recoge a todos los residentes de un municipio. Los Ayuntamientos son responsables de su creación, mantenimiento, actualización y custodia, y cada mes deben informar al Instituto Nacional de Estadística (INE) sobre cualquier cambio en los datos del padrón.
                                                            {'\n\n'}
                                                            Una vez comprobada la información, la Presidencia del INE, con la aprobación del Consejo de Empadronamiento, propone al Gobierno las cifras oficiales de población a fecha 1 de enero de cada año. Esta propuesta se aprueba mediante un real decreto y se publica en el Boletín Oficial del Estado.
                                                            {'\n\n'}
                                                       </TextStyled>
                                                  </ScrollView>
                                             </Animated.View>
                                        </AnimatedTouchableOpacity>
                                   </ViewStyled>
                              </>
                         )}
                    </ViewStyled>
               </ScrollViewStyled>
          </Plantilla>
     );
};

export default CifrasPadron;
