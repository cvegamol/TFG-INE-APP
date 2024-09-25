import React, { useEffect, useState } from 'react';
import { ScrollView, Animated, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons'; // Importar íconos
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AnimatedViewStyled = styled(Animated.View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);
const TextInputStyled = styled(TextInput);

const OperacionesPadron = () => {
     const router = useRouter();
     const { id, nombre } = useLocalSearchParams();
     const [series, setSeries] = useState([]);
     const [tablas, setTablas] = useState([]);
     const [filteredTablas, setFilteredTablas] = useState([]); // Nueva lista de tablas filtradas
     const [isLoading, setIsLoading] = useState(true);
     const [fadeAnim] = useState(new Animated.Value(0)); // Valor inicial para la animación de fade-in
     const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda

     const handlePress = (tabla) => {
          console.log('Tabla String', JSON.stringify(tabla))
          router.push({
               pathname: 'seriesPadron',
               params: { tabla: JSON.stringify(tabla) },
          });
     };

     // Filtrar tablas basadas en el texto de búsqueda
     const handleSearch = (text) => {
          setSearchText(text);
          if (text === '') {
               setFilteredTablas(tablas); // Mostrar todas las tablas si el texto de búsqueda está vacío
          } else {
               const filtered = tablas.filter((table) =>
                    table.Nombre.toLowerCase().includes(text.toLowerCase())
               );
               setFilteredTablas(filtered);
          }
     };

     const clearSearch = () => {
          setSearchText('');
          setFilteredTablas(tablas); // Restaurar todas las tablas
     };

     useEffect(() => {
          const obtenerDatos = async () => {
               try {
                    const seriesJson = await fetch(`http://192.168.1.13:3000/series/getSerieByFkOperation/${id}`);
                    const series = await seriesJson.json();

                    const tablasJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/TABLAS_OPERACION/${id}`);
                    const tablas = await tablasJson.json();
                    setTablas(tablas);
                    setFilteredTablas(tablas); // Inicializar filteredTablas con todas las tablas

                    if (tablas && tablas.length > 0) {
                         const id_t = tablas[0].Id;
                         const variableTabla = await fetch(`https://servicios.ine.es/wstempus/js/ES/GRUPOS_TABLA/${id_t}`);
                         const variables = await variableTabla.json();

                    } else {
                         console.log('No hay tablas disponibles.');
                    }

                    setSeries(series);
               } catch (error) {
                    console.error('Error al obtener las series:', error);
               } finally {
                    setIsLoading(false);
                    // Iniciar la animación de fade-in cuando los datos están listos
                    Animated.timing(fadeAnim, {
                         toValue: 1,
                         duration: 1000,
                         useNativeDriver: true,
                    }).start();
               }
          };

          obtenerDatos();
     }, [id]);

     return (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-primary">
               <Plantilla>

                    <TextStyled
                         className="text-xl font-extrabold text-center text-teal-800 mb-4"
                         style={{
                              textShadowColor: 'rgba(0, 0, 0, 0.1)', // Sombra muy sutil
                              textShadowOffset: { width: 1, height: 1 },
                              textShadowRadius: 2,
                              paddingVertical: 6, // Espacio adicional
                              paddingHorizontal: 10,
                              borderRadius: 6, // Bordes suaves
                         }}
                    >
                         Operación: {nombre}
                    </TextStyled>

                    <AnimatedViewStyled style={{ opacity: fadeAnim }} className="p-4 rounded-lg mx-2 ">
                         <View
                              style={{
                                   borderBottomColor: '#2d3748', // Gris claro acorde con tu estilo
                                   borderBottomWidth: 3,
                                   marginVertical: 0, // Espacio entre el separador y los textos
                              }}
                         />

                         <TextStyled
                              className="text-base text-gray-700 mt-2 mb-4 px-3"
                              style={{
                                   textAlign: 'justify',
                              }}
                         >
                              En esta sección, tienes acceso a las tablas relacionadas con la operación seleccionada. Cada tabla contiene datos específicos que podrás explorar para profundizar en la información disponible.
                         </TextStyled>

                         <TextStyled
                              className="text-base text-gray-700 mb-4 px-3"
                              style={{
                                   textAlign: 'justify',
                              }}
                         >
                              Para comenzar, selecciona una tabla de la lista. Al hacer clic en una de ellas, se redirigirá a una vista que muestra las variables y los valores asociados a dicha tabla. Esto te permitirá visualizar los datos detalladamente y realizar una selección más precisa.
                         </TextStyled>

                         <TextStyled
                              className="text-base text-gray-700 mb-4 px-3"
                              style={{
                                   textAlign: 'justify',
                              }}
                         >
                              Si deseas buscar una tabla en particular, puedes utilizar el buscador que se encuentra encima de la lista de tablas. A medida que escribes, las tablas se filtrarán en función de tu búsqueda, lo que facilita encontrar la que necesites.
                         </TextStyled>



                         {/* Separador con una línea sutil */}
                         <View
                              style={{
                                   borderBottomColor: '#2d3748', // Gris claro acorde con tu estilo
                                   borderBottomWidth: 3,
                                   marginVertical: 0, // Espacio entre el separador y los textos
                              }}
                         />

                         {/* Texto de tablas disponibles */}
                         <TextStyled
                              className="text-lg font-semibold text-gray-800 mt-4 mb-3"
                              style={{
                                   color: '#2d3748', // Gris oscuro como contraste
                                   fontWeight: '600',
                              }}
                         >
                              Tablas Disponibles:
                         </TextStyled>

                         {/* Input de búsqueda con ícono */}
                         <View className="relative">
                              <TextInputStyled
                                   className="flex-1 p-2 pr-10 bg-gray-200 rounded-lg mb-4"
                                   placeholder="Buscar tabla..."
                                   value={searchText}
                                   onChangeText={handleSearch}
                                   keyboardType="default" // Asegúrate que los props son correctos para Android
                                   style={{ paddingRight: searchText !== '' ? 40 : 20 }}
                              />

                              {/* Mostrar el ícono de búsqueda solo si no hay texto */}
                              {searchText === '' && (
                                   <Icon
                                        name="search"
                                        size={24}
                                        color="gray"
                                        style={{ position: 'absolute', right: 10, top: 10 }}
                                   />
                              )}

                              {/* Mostrar el ícono de cancelar solo cuando haya texto */}
                              {searchText !== '' && (
                                   <TouchableOpacityStyled onPress={clearSearch} style={{ position: 'absolute', right: 10, top: 10 }}>
                                        <Icon name="close-circle" size={24} color="gray" />
                                   </TouchableOpacityStyled>
                              )}
                         </View>

                         {/* Botón para limpiar búsqueda */}
                         {isLoading ? (
                              <AnimatedViewStyled className="flex-1 justify-center items-center">
                                   <Loading size={hp(6)} />
                                   <TextStyled className="text-lg text-teal-500 mt-2">Cargando...</TextStyled>
                              </AnimatedViewStyled>
                         ) : (
                              filteredTablas.length > 0 ? (
                                   filteredTablas.map((table, index) => (
                                        <TouchableOpacityStyled
                                             key={index}
                                             className="p-3 my-3 rounded-lg"
                                             onPress={() => handlePress(table)}
                                             style={{
                                                  backgroundColor: '#38b2ac', // Tono teal atractivo
                                                  shadowColor: '#000',
                                                  shadowOffset: { width: 0, height: 2 },
                                                  shadowOpacity: 0.25,
                                                  shadowRadius: 3.84,
                                                  elevation: 5, // Sombra para Android
                                                  flexDirection: 'row',
                                                  alignItems: 'center', // Alinear contenido
                                                  paddingVertical: 12, // Ajuste de padding vertical para más espacio
                                                  paddingHorizontal: 16, // Ajuste de padding horizontal para más espacio
                                                  borderRadius: 10, // Bordes redondeados suaves
                                             }}
                                        >
                                             {/* Ícono de mapa */}
                                             <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />

                                             {/* Texto estilizado con margen y ajustes de flex */}
                                             <TextStyled
                                                  className="font-semibold"
                                                  style={{
                                                       color: '#ffffff', // Texto blanco para buen contraste
                                                       fontSize: 16, // Tamaño moderado
                                                       fontWeight: '500',
                                                       marginLeft: 10, // Espacio entre el ícono y el texto
                                                       flexShrink: 1, // Evitar que el texto se corte
                                                  }}
                                             >
                                                  {table.Nombre}
                                             </TextStyled>
                                        </TouchableOpacityStyled>



                                   ))
                              ) : (
                                   <TextStyled className="text-lg text-gray-600">
                                        No hay tablas disponibles.
                                   </TextStyled>
                              )
                         )}
                    </AnimatedViewStyled>

               </Plantilla >
          </ScrollView>
     );
};

export default OperacionesPadron;
