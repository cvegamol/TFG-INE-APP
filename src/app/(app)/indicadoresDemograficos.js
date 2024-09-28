import React, { useEffect, useState } from 'react';
import { ScrollView, View, Dimensions, Text, TouchableOpacity, Image, Animated, ImageBackground, Alert } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
     widthPercentageToDP as wp,
     heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Ionicons } from '@expo/vector-icons';
import ResponsiveTable from '../../components/ResponsiveTable';
import LineChart from '../../components/graph/stackedBarChart/line-chart/LineChart';
import { Icon } from 'react-native-elements';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);
const ImageStyled = styled(Image);
const ImageBackgroundStyled = styled(ImageBackground);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacityStyled);

const IndicadoresDemograficos = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
     const [isExpanded, setIsExpanded] = useState(false);
     const [isExpanded2, setIsExpanded2] = useState(false);

     const [operacionPadron, setOperacionPadron] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [scrollEnabled, setScrollEnabled] = useState(true); // Controla el scroll global
     const chartConfig = {
          backgroundGradientFrom: "#e6fffa", // Fondo claro para el gráfico
          backgroundGradientTo: "#e6fffa", // Fondo claro uniforme
          decimalPlaces: 2, // Número de decimales en los valores
          color: (opacity = 1) => `rgba(12, 74, 78, ${opacity})`, // Color teal oscuro para las líneas
          labelColor: (opacity = 1) => `rgba(12, 74, 78, ${opacity})`, // Color teal para las etiquetas
          style: {
               borderRadius: 16,
          },
          propsForDots: {
               r: "4", // Tamaño de los puntos en la línea
               strokeWidth: "2", // Grosor del borde en los puntos
               stroke: "#065f5b", // Color del borde en los puntos
          },
          propsForBackgroundLines: {
               strokeWidth: 1,
               stroke: "#d3d3d3", // Líneas de fondo en gris claro
          },
     };
     // Estado y animación para la tarjeta volteable
     const [flipAnim] = useState(new Animated.Value(0));
     const [isFlipped, setIsFlipped] = useState(false);

     //Variables para la gráfica y la tabla
     const [chartData, setChartData] = useState([]);
     const [tablaDatos, setTablaDatos] = useState([]);
     const [selectedCell, setSelectedCell] = useState({ row: 0, col: 1 });

     // Función para formatear los números según el formato español
     const formatNumber = (value) => {
          return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
     };

     useEffect(() => {
          let isMounted = true;
          const obtenerDatos = async () => {
               try {
                    const estadisticaPadronContinuo = await fetch(
                         `http://192.168.1.13:3000/operaciones/getOperationById/${id}`
                    );
                    const datos = await estadisticaPadronContinuo.json();
                    if (isMounted) {
                         setOperacionPadron(datos);
                    }
                    console.log('ID', id)
                    const series = await Promise.all([
                         obtenerDatosSerie('IDB37106'),
                         obtenerDatosSerie('IDB344562'),

                         obtenerDatosSerie('IDB72160'),
                         obtenerDatosSerie('IDB344563'),

                         obtenerDatosSerie('IDB38611'),
                         obtenerDatosSerie('IDB344564'),

                         obtenerDatosSerie('IDB47797'),
                         obtenerDatosSerie('IDB344565'),

                         obtenerDatosSerie('IDB55717'),
                         obtenerDatosSerie('IDB344566'),

                         obtenerDatosSerie('IDB53772'),
                         obtenerDatosSerie('IDB344567'),

                         obtenerDatosSerie('IDB54190'),
                         obtenerDatosSerie('IDB344568'),


                    ]);

                    console.log(series);

                    const formattedTableData = [
                         [
                              { label: 'Tasa bruta de natalidad', value: 'Tasa bruta de natalidad' },
                              {
                                   label: 'Valor',
                                   value: series[0]?.datos?.length ? formatNumber(series[0].datos[series[0].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[0]?.datos?.length ? getDatosForChart(series[0].datos, series[0].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[1]?.datos?.length ? formatNumber(series[1].datos[series[1].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[1]?.datos?.length ? getDatosForChart(series[1].datos, series[1].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Indicador coyuntural de fecundidad', value: 'Indicador coyuntural de fecundidad' },
                              {
                                   label: 'Valor',
                                   value: series[2]?.datos?.length ? formatNumber(series[2].datos[series[2].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[2]?.datos?.length ? getDatosForChart(series[2].datos, series[2].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[3]?.datos?.length ? formatNumber(series[3].datos[series[3].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[3]?.datos?.length ? getDatosForChart(series[3].datos, series[3].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Edad media a la maternidad', value: 'Edad media a la maternidad' },
                              {
                                   label: 'Valor',
                                   value: series[4]?.datos?.length ? formatNumber(series[4].datos[series[4].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[4]?.datos?.length ? getDatosForChart(series[4].datos, series[4].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[5]?.datos?.length ? formatNumber(series[5].datos[series[5].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[5]?.datos?.length ? getDatosForChart(series[5].datos, series[5].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Tasa bruta de mortalidad', value: 'Tasa bruta de mortalidad' },
                              {
                                   label: 'Valor',
                                   value: series[6]?.datos?.length ? formatNumber(series[6].datos[series[6].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[6]?.datos?.length ? getDatosForChart(series[6].datos, series[6].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[7]?.datos?.length ? formatNumber(series[7].datos[series[7].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[7]?.datos?.length ? getDatosForChart(series[7].datos, series[7].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Tasa de mortalidad infantil (menores de un año)', value: 'Tasa de mortalidad infantil (menores de un año)' },
                              {
                                   label: 'Valor',
                                   value: series[8]?.datos?.length ? formatNumber(series[8].datos[series[8].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[8]?.datos?.length ? getDatosForChart(series[8].datos, series[8].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[9]?.datos?.length ? formatNumber(series[9].datos[series[9].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[9]?.datos?.length ? getDatosForChart(series[9].datos, series[9].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Esperanza de vida al nacimiento', value: 'Esperanza de vida al nacimiento' },
                              {
                                   label: 'Valor',
                                   value: series[10]?.datos?.length ? formatNumber(series[10].datos[series[10].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[10]?.datos?.length ? getDatosForChart(series[10].datos, series[10].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[11]?.datos?.length ? formatNumber(series[11].datos[series[11].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[11]?.datos?.length ? getDatosForChart(series[11].datos, series[11].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Tasa bruta de nupcialidad', value: 'Tasa bruta de nupcialidad' },
                              {
                                   label: 'Valor',
                                   value: series[12]?.datos?.length ? formatNumber(series[12].datos[series[12].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[12]?.datos?.length ? getDatosForChart(series[12].datos, series[12].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación anual',
                                   value: series[13]?.datos?.length ? formatNumber(series[13].datos[series[13].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[1131]?.datos?.length ? getDatosForChart(series[13].datos, series[13].nombreSerie) : [],
                              },
                         ],

                    ];

                    setTablaDatos(formattedTableData);
                    setChartData(getDatosForChart(series[0].datos, series[0].nombreSerie));

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

     const obtenerDatosSerie = async (cod) => {
          try {
               const fecha = 8;
               const url = `https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${cod}?nult=${fecha}`;
               const response = await fetch(url);

               if (!response.ok) {
                    throw new Error("Error al obtener los detalles del producto");
               }

               const jsonD = await response.json();
               const data = jsonD['Data'];
               const nombreSerie = jsonD['Nombre']; // Obtenemos el nombre de la serie

               const datosMapeados = data.map(dato => {
                    const fechaTimestamp = dato.Fecha / 1000;
                    const fechaObjeto = new Date(fechaTimestamp * 1000);
                    const fechaFormateada = fechaObjeto.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });

                    return {
                         ...dato,
                         fechaFormateada,
                         Fecha: fechaObjeto.toISOString(),
                    };
               });

               return { datos: datosMapeados, nombreSerie };
          } catch (error) {
               console.error("Error en la solicitud:", error.message);
               throw error;
          }
     };

     const getDatosForChart = (datos, nombreSerie) => {
          return datos.map(dato => {
               const fechaObjeto = new Date(dato.Fecha);
               const opcionesFormato = { month: 'short', year: 'numeric' };
               const fechaFormateada = fechaObjeto.toLocaleDateString('es-ES', opcionesFormato);

               return {
                    label: fechaFormateada,
                    value: parseFloat(dato.Valor.toFixed(2)),
                    serieName: nombreSerie, // Incluimos el nombre de la serie
               };
          });
     };
     const handleToggleExpand2 = () => {
          setIsExpanded2(!isExpanded2);
     };
     const handlePressTabla = async (id) => {
          try {
               const response = await fetch(
                    `http://192.168.1.13:3000/tablas/getTableById/${id}`
               );

               // Verifica si la respuesta es válida y tiene datos
               if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
               }

               const text = await response.json(); // Lee el contenido como JSON

               // Cambiar el id dentro del objeto text[0] sin afectar el original
               const tablaModificada = { ...text[0] }; // Aquí 'nuevoId' es el nuevo valor de ID


               // Navegar pasando la tabla modificada
               router.push({
                    pathname: 'seriesPadron',
                    params: { tabla: JSON.stringify(tablaModificada) }, // Pasar la tabla modificada
               });
          } catch (error) {
               console.error('Error al obtener la tabla:', error.message);
          }
     };
     const handlePress = (id, nombre) => {
          console.log('Id', id);
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

     const handleCellPress = (rowIndex, colIndex, cellData) => {
          if (colIndex > 0 && cellData.chartData) {
               setSelectedCell({ row: rowIndex, col: colIndex });
               setChartData(cellData.chartData);
          }
     };

     const truncateLabel = (label, maxLength = 8) => {
          return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
     };

     const formatYAxisValue = (value) => {
          if (value >= 1000000) {
               return `${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
               return `${(value / 1000).toFixed(1)}K`;
          } else {
               return value.toString();
          }
     };

     // Funciones para deshabilitar/habilitar el scroll global
     const handleTouchStart = () => {
          setScrollEnabled(false);
     };

     const handleTouchEnd = () => {
          setScrollEnabled(true);
     };
     const handleToggleExpand = () => {
          setIsExpanded(!isExpanded);
     };
     return (
          <Plantilla>
               {/* ScrollView global */}
               <ScrollViewStyled
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEnabled={scrollEnabled} // Controla si se permite el scroll
               >
                    <ViewStyled className="p-2">
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
                                             source={require('../../assets/images/login/imagen-fenomenosdemograficos.png')}
                                             style={{
                                                  width: '100%',
                                                  height: hp('25%'),
                                                  borderRadius: 12,
                                             }}
                                        />
                                   </ViewStyled>

                                   {/* Título */}
                                   <TextStyled className="text-3xl font-bold text-teal-800 mb-6 text-center">
                                        {operacionPadron[0].Nombre}
                                   </TextStyled>
                                   <ViewStyled
                                        style={{
                                             borderBottomWidth: 2, // Ancho del borde
                                             borderColor: '#065f5b', // Color del borde
                                             marginVertical: 16, // Margen vertical para separar el contenido
                                             width: '90%', // Ajuste de ancho
                                             alignSelf: 'center', // Centra el View
                                        }}
                                   />

                                   {/*Tabla que muestra los datos*/}

                                   {/* Nombre de la gráfica */}
                                   <TextStyled className="text-xl font-semibold text-teal-700 mb-4 text-center">

                                        Indicadores demográficos - Año 2022

                                   </TextStyled>

                                   {/* Introducción breve */}
                                   <TextStyled className="text-base text-gray-700 mb-4">
                                        La tabla presenta las adquisiciones de nacionalidad española en 2022, con el total de adquisiciones y las características de los nuevos ciudadanos. Los datos son obtenidos del Registro Civil y publicados por el INE.
                                   </TextStyled>
                                   <ResponsiveTable
                                        headers={['', 'Valor', 'Variación']}
                                        data={tablaDatos}
                                        selectedCell={selectedCell}
                                        onCellPress={handleCellPress}
                                        fontSize={12}
                                   />

                                   <LineChart
                                        data={{
                                             labels: chartData.map(dato => dato.label),
                                             datasets: [
                                                  {
                                                       data: chartData.map(dato => dato.value),
                                                  },
                                             ],
                                        }}
                                        width={Dimensions.get("window").width * 0.83} // Ajustar al 85% del ancho de la pantalla
                                        height={320}
                                        yLabelsOffset={6}
                                        chartConfig={chartConfig}
                                        bezier

                                        horizontalLabelRotation={0}
                                        verticalLabelRotation={270}
                                        xLabelsOffset={35}

                                        formatXLabel={(label) => truncateLabel(label)}
                                        style={{
                                             marginVertical: 8,
                                             borderRadius: 10,
                                             paddingRight: 40,
                                        }}
                                        formatYLabel={(value) => formatYAxisValue(value)}

                                        onDataPointClick={(data) => {
                                             const { value, index } = data;

                                             // Obtenemos el punto de datos correspondiente
                                             const dataPoint = chartData[index];

                                             if (!dataPoint) {
                                                  Alert.alert('Error', 'No se encontró información para este punto.');
                                                  return;
                                             }

                                             const label = dataPoint.label || 'Sin etiqueta';
                                             const serieName = dataPoint.serieName || 'Serie desconocida';

                                             // Formateamos el valor
                                             const formattedValue = new Intl.NumberFormat('es-ES').format(value);

                                             // Mostramos la alerta
                                             Alert.alert(
                                                  'Información del punto',
                                                  `Serie: ${serieName}\nFecha: ${label}\nValor: ${formattedValue}`,
                                                  [{ text: 'OK' }]
                                             );
                                        }}
                                   />

                                   {/* Barra de separación */}
                                   <ViewStyled
                                        style={{
                                             borderBottomWidth: 2, // Ancho del borde
                                             borderColor: '#065f5b', // Color del borde
                                             marginVertical: 16, // Margen vertical para separar el contenido
                                             width: '90%', // Ajuste de ancho
                                             alignSelf: 'center', // Centra el View
                                        }}
                                   />

                                   {/* Botón para consultar todas las tablas de la operación */}
                                   <TouchableOpacityStyled
                                        className="flex-row items-center p-4 bg-teal-600 rounded-xl shadow-lg my-3 mx-5 border-[1]"
                                        style={{
                                             borderColor: '#065f5b', // Color teal-600
                                        }}
                                        onPress={() =>
                                             handlePress(operacionPadron[0].Id, operacionPadron[0].Nombre)
                                        }
                                   >
                                        <Ionicons name="grid-outline" size={24} color="white" />
                                        <TextStyled className="text-lg font-semibold mx-2 text-white">
                                             Tablas de las {operacionPadron[0].Nombre}
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   <ViewStyled
                                        style={{
                                             borderBottomWidth: 2, // Ancho del borde
                                             borderColor: '#065f5b', // Color del borde
                                             marginVertical: 16, // Margen vertical para separar el contenido
                                             width: '90%', // Ajuste de ancho
                                             alignSelf: 'center', // Centra el View
                                        }}
                                   />
                                   <TextStyled className="text-xl font-semibold text-teal-700 mb-4 text-center">
                                        Tablas Más Consultadas
                                   </TextStyled>

                                   {/* Primer `TouchableOpacity` */}
                                   <TouchableOpacityStyled
                                        className="p-3 my-3 rounded-lg"
                                        onPress={() => handlePressTabla(1488)}
                                        style={{
                                             backgroundColor: '#38b2ac', // Tono teal atractivo
                                             shadowColor: '#000',
                                             shadowOffset: { width: 0, height: 2 },
                                             shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             elevation: 5, // Sombra para Android
                                             flexDirection: 'row',
                                             alignItems: 'center', // Alinear contenido
                                             paddingVertical: 14, // Ajuste de padding vertical para más espacio
                                             paddingHorizontal: 18, // Ajuste de padding horizontal para más espacio
                                             borderRadius: 12, // Bordes redondeados suaves
                                             transform: [{ scale: 1 }],
                                        }}
                                        activeOpacity={0.7}
                                   >
                                        <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />
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
                                             Proporción de personas mayores de cierta edad por provincia
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   <TouchableOpacityStyled
                                        className="p-3 my-3 rounded-lg"
                                        onPress={() => handlePressTabla(1433)}
                                        style={{
                                             backgroundColor: '#38b2ac', // Tono teal atractivo
                                             shadowColor: '#000',
                                             shadowOffset: { width: 0, height: 2 },
                                             shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             elevation: 5, // Sombra para Android
                                             flexDirection: 'row',
                                             alignItems: 'center', // Alinear contenido
                                             paddingVertical: 14, // Ajuste de padding vertical para más espacio
                                             paddingHorizontal: 18, // Ajuste de padding horizontal para más espacio
                                             borderRadius: 12, // Bordes redondeados suaves
                                             transform: [{ scale: 1 }],
                                        }}
                                        activeOpacity={0.7}
                                   >
                                        <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />
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
                                             Tasa de Natalidad por comunidad autónoma, según nacionalidad (española/extranjera) de la madre                                             </TextStyled>
                                   </TouchableOpacityStyled>

                                   <TouchableOpacityStyled
                                        className="p-3 my-3 rounded-lg"
                                        onPress={() => handlePressTabla(1414)}
                                        style={{
                                             backgroundColor: '#38b2ac', // Tono teal atractivo
                                             shadowColor: '#000',
                                             shadowOffset: { width: 0, height: 2 },
                                             shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             elevation: 5, // Sombra para Android
                                             flexDirection: 'row',
                                             alignItems: 'center', // Alinear contenido
                                             paddingVertical: 14, // Ajuste de padding vertical para más espacio
                                             paddingHorizontal: 18, // Ajuste de padding horizontal para más espacio
                                             borderRadius: 12, // Bordes redondeados suaves
                                             transform: [{ scale: 1 }],
                                        }}
                                        activeOpacity={0.7}
                                   >
                                        <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />
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
                                             Esperanza de Vida al Nacimiento según sexo
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   <TouchableOpacityStyled
                                        className="p-3 my-3 rounded-lg"
                                        onPress={() => handlePressTabla(30664)}
                                        style={{
                                             backgroundColor: '#38b2ac', // Tono teal atractivo
                                             shadowColor: '#000',
                                             shadowOffset: { width: 0, height: 2 },
                                             shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             elevation: 5, // Sombra para Android
                                             flexDirection: 'row',
                                             alignItems: 'center', // Alinear contenido
                                             paddingVertical: 14, // Ajuste de padding vertical para más espacio
                                             paddingHorizontal: 18, // Ajuste de padding horizontal para más espacio
                                             borderRadius: 12, // Bordes redondeados suaves
                                             transform: [{ scale: 1 }],
                                        }}
                                        activeOpacity={0.7}
                                   >
                                        <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />
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
                                             Tasa Bruta de Natalidad por municipio
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   <TouchableOpacityStyled
                                        className="p-3 my-3 rounded-lg"
                                        onPress={() => handlePressTabla(1470)}
                                        style={{
                                             backgroundColor: '#38b2ac', // Tono teal atractivo
                                             shadowColor: '#000',
                                             shadowOffset: { width: 0, height: 2 },
                                             shadowOpacity: 0.25,
                                             shadowRadius: 3.84,
                                             elevation: 5, // Sombra para Android
                                             flexDirection: 'row',
                                             alignItems: 'center', // Alinear contenido
                                             paddingVertical: 14, // Ajuste de padding vertical para más espacio
                                             paddingHorizontal: 18, // Ajuste de padding horizontal para más espacio
                                             borderRadius: 12, // Bordes redondeados suaves
                                             transform: [{ scale: 1 }],
                                        }}
                                        activeOpacity={0.7}
                                   >
                                        <Icon name="map" size={20} color="white" style={{ marginRight: 12 }} />
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
                                             Tasa Bruta de Natalidad por provincia
                                        </TextStyled>
                                   </TouchableOpacityStyled>


                                   {/* Barra de separación */}
                                   <ViewStyled
                                        style={{
                                             borderBottomWidth: 2, // Ancho del borde
                                             borderColor: '#065f5b', // Color del borde
                                             marginVertical: 16, // Margen vertical para separar el contenido
                                             width: '90%', // Ajuste de ancho
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
                                                       source={require('../../assets/images/login/descripcionfenomenos.png')}
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
                                                            <TextStyled className="font-semibold">Los Indicadores demográficos básicos</TextStyled> constituyen una colección de indicadores que resumen la evolución histórica de fenómenos demográficos en España, como natalidad, fecundidad, mortalidad, nupcialidad, divorcios, movimientos migratorios y la estructura de la población residente. Se calculan a partir de estadísticas de nacimientos, defunciones, matrimonios, nulidades, separaciones, divorcios y migraciones, así como de cifras de población.
                                                            {'\n\n'}
                                                            Estos indicadores se publican a nivel nacional, autonómico y provincial, desglosados por características demográficas como sexo, edad y nacionalidad. Las series de resultados comienzan en 1975; sin embargo, la desagregación por nacionalidad es desde 2002, los indicadores de divorcios desde 2005 y los de migración desde 2008.
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

export default IndicadoresDemograficos;