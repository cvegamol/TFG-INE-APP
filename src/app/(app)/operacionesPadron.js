import React, { useEffect, useState } from 'react';
import { ScrollView, Animated, Text, TouchableOpacity, TextInput, Button } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AnimatedViewStyled = styled(Animated.View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);
const TextInputStyled = styled(TextInput);
const ButtonStyled = styled(Button);

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
          <Plantilla>
               <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-50">
                    <AnimatedViewStyled style={{ opacity: fadeAnim }} className="p-6 bg-white rounded-lg mx-4 my-6">
                         <TextStyled className="text-2xl font-extrabold text-center text-teal-800 mb-6">
                              Operación: {nombre}
                         </TextStyled>

                         <TextStyled className="text-2xl font-semibold text-gray-800 mt-6 mb-4">
                              Tablas Disponibles:
                         </TextStyled>

                         {/* Input de búsqueda */}
                         <TextInputStyled
                              className="p-2 border  rounded-lg mb-4"
                              placeholder="Buscar tabla..."
                              value={searchText}
                              onChangeText={handleSearch}
                              keyboardType="default" // Asegúrate que los props son correctos para Android
                         />

                         {/* Botón para limpiar búsqueda */}
                         {searchText !== '' && (
                              <TouchableOpacityStyled
                                   className="bg-teal-500 rounded-lg p-2 mb-4"
                                   onPress={clearSearch}
                              >
                                   <TextStyled className="text-white text-center">Limpiar Búsqueda</TextStyled>
                              </TouchableOpacityStyled>
                         )}

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
                                             className="p-4 bg-teal-300 rounded-lg my-3"
                                             onPress={() => handlePress(table)}
                                        >
                                             <TextStyled className="text-lg text-teal-800 font-semibold">
                                                  {table.Nombre} - {table.Id} - {table.Anyo_Periodo_ini} - {table.FechaRef_fin}
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
               </ScrollView>
          </Plantilla>
     );
};

export default OperacionesPadron;
