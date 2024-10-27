import React, { useEffect, useState } from 'react';
import { Animated, SectionList, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);
const TextInputStyled = styled(TextInput);

const OperacionesDisponibles = () => {
     const [data, setData] = useState([]);
     const [filteredData, setFilteredData] = useState([]); // Nueva lista de datos filtrados
     const [isLoading, setIsLoading] = useState(true);
     const [searchText, setSearchText] = useState(''); // Estado para el texto de búsqueda
     const router = useRouter();
     const fadeAnim = useState(new Animated.Value(0))[0];

     useEffect(() => {
          let isMounted = true;
          const iniciarAnimacion = () => {
               fadeAnim.setValue(0);
               Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
               }).start();
          };

          iniciarAnimacion();

          const obtenerDatosOperaciones = async () => {
               try {
                    const operacionesDisponibles = await fetch(`https://servicios.ine.es/wstempus/js/ES/OPERACIONES_DISPONIBLES`);

                    if (!isMounted) return;

                    const datosOperacionesDisponibles = await operacionesDisponibles.json();

                    const nuevosDatos = datosOperacionesDisponibles.map((operacion) => ({
                         Nombre: operacion.Nombre,
                         Id: operacion.Id,
                    }));

                    setData(nuevosDatos);
                    setFilteredData(nuevosDatos); // Inicializar filteredData con todos los datos
               } catch (error) {
                    if (isMounted) {
                         console.error(error.message);
                    }
               } finally {
                    if (isMounted) {
                         setIsLoading(false);
                    }
               }
          };

          obtenerDatosOperaciones();

          return () => {
               isMounted = false;
          };
     }, [fadeAnim]);

     const handlePress = (id, nombre) => {
          router.push({
               pathname: 'operacionesPadron',
               params: { id, nombre },
          });
     };

     // Filtrar operaciones basadas en el texto de búsqueda
     const handleSearch = (text) => {
          setSearchText(text);
          if (text === '') {
               setFilteredData(data); // Mostrar todas las operaciones si el texto de búsqueda está vacío
          } else {
               const filtered = data.filter((item) =>
                    item.Nombre.toLowerCase().includes(text.toLowerCase())
               );
               setFilteredData(filtered);
          }
     };

     const clearSearch = () => {
          setSearchText('');
          setFilteredData(data); // Restaurar todas las operaciones
     };

     // Array de colores para las tarjetas
     const cardColors = ['bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700'];

     return (
          <Plantilla>
               <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
                    <TextStyled className="text-3xl font-bold text-center text-teal-800 my-4">
                         Operaciones INE
                    </TextStyled>
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
                         A continuación, se presentan todas las operaciones estadísticas disponibles en la API del INE, sin ningún tipo de filtrado específico. Estas operaciones permiten consultar datos y generar gráficos para facilitar la comprensión de la información.
                    </TextStyled>

                    <TextStyled
                         className="text-base text-gray-700 mb-4 px-3"
                         style={{
                              textAlign: 'justify',
                         }}
                    >
                         Selecciona una operación para explorar las tablas correspondientes. Cada tabla contiene variables y valores específicos que podrás utilizar para realizar consultas detalladas según tus necesidades.
                    </TextStyled>

                    {/* Input de búsqueda con ícono */}


                    <View
                         style={{
                              borderBottomColor: '#2d3748',
                              borderBottomWidth: 3,
                              marginVertical: 0,
                              marginBottom: 12,
                         }}
                    />

                    <ViewStyled
                         className="relative mx-4 mb-4">
                         <TextInputStyled
                              className="flex-1 p-2 pr-10 bg-gray-200 rounded-lg"
                              placeholder="Buscar operación..."
                              value={searchText}
                              onChangeText={handleSearch}
                              keyboardType="default"
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
                    </ViewStyled>

                    {isLoading ? (
                         <ViewStyled className="flex-1 justify-center items-center">
                              <Loading size={hp(6)} />
                              <TextStyled className="text-lg text-teal-500 mt-2">Cargando...</TextStyled>
                         </ViewStyled>
                    ) : (
                         <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                              <SectionList
                                   sections={[{ title: 'Operaciones Disponibles de la API del INE', data: filteredData }]}
                                   scrollEnabled={false} // Deshabilitar el scroll del SectionList
                                   renderItem={({ item, index }) => (
                                        <TouchableOpacityStyled
                                             className="p-4 bg-teal-100 rounded-lg shadow-md mb-4 mx-4 hover:bg-teal-300 hover:shadow-lg transition duration-300 ease-in-out"
                                             onPress={() => handlePress(item.Id, item.Nombre)}
                                             activeOpacity={0.6}
                                        >
                                             <TextStyled className="text-lg text-gray-700">{item.Nombre}</TextStyled>
                                        </TouchableOpacityStyled>
                                   )}
                                   renderSectionHeader={({ section }) => (
                                        <View
                                             style={{
                                                  backgroundColor: '#38b2ac',
                                                  paddingVertical: 8,
                                                  paddingHorizontal: 16,
                                                  borderRadius: 8,
                                                  marginBottom: 6,
                                                  marginHorizontal: 4,
                                             }}
                                        >
                                             <TextStyled
                                                  className="text-xl font-semibold text-white"
                                                  style={{
                                                       fontSize: 18,
                                                       fontWeight: 'bold',
                                                  }}
                                             >
                                                  {section.title}
                                             </TextStyled>
                                        </View>
                                   )}
                                   keyExtractor={(item) => `basicListEntry-${item.Id}`}
                              />
                         </Animated.View>
                    )}
               </ScrollView>
          </Plantilla>
     );
};

export default OperacionesDisponibles;
