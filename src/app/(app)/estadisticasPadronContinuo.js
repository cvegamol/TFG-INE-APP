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

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);
const ImageStyled = styled(Image);
const ImageBackgroundStyled = styled(ImageBackground);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacityStyled);

const PadronContinuo = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
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
                         //`http://192.168.128.97:3000/operaciones/getOperationById/${id}`
                    );
                    const datos = await estadisticaPadronContinuo.json();
                    if (isMounted) {
                         setOperacionPadron(datos);
                    }
                    console.log('ID', id)
                    const series = await Promise.all([
                         obtenerDatosSerie('PC93037'),
                         obtenerDatosSerie('PC15030016'),
                         obtenerDatosSerie('PC98911'),
                         obtenerDatosSerie('PC15030017'),
                         obtenerDatosSerie('PC98908'),
                         obtenerDatosSerie('PC15030018'),
                    ]);

                    console.log(series);

                    const formattedTableData = [
                         [
                              { label: 'Total', value: 'Total' },
                              {
                                   label: 'Valor Total',
                                   value: series[0]?.datos?.length ? formatNumber(series[0].datos[series[0].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[0]?.datos?.length ? getDatosForChart(series[0].datos, series[0].nombreSerie) : [],
                              },
                              {
                                   label: 'Varianza Total',
                                   value: series[1]?.datos?.length ? formatNumber(series[1].datos[series[1].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[1]?.datos?.length ? getDatosForChart(series[1].datos, series[1].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Españoles', value: 'Españoles' },
                              {
                                   label: 'Valor Españoles',
                                   value: series[2]?.datos?.length ? formatNumber(series[2].datos[series[2].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[2]?.datos?.length ? getDatosForChart(series[2].datos, series[2].nombreSerie) : [],
                              },
                              {
                                   label: 'Varianza Españoles',
                                   value: series[3]?.datos?.length ? formatNumber(series[3].datos[series[3].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[3]?.datos?.length ? getDatosForChart(series[3].datos, series[3].nombreSerie) : [],
                              },
                         ],
                         [
                              { label: 'Extranjeros', value: 'Extranjeros' },
                              {
                                   label: 'Valor Extranjeros',
                                   value: series[4]?.datos?.length ? formatNumber(series[4].datos[series[4].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[4]?.datos?.length ? getDatosForChart(series[4].datos, series[4].nombreSerie) : [],
                              },
                              {
                                   label: 'Varianza Extranjeros',
                                   value: series[5]?.datos?.length ? formatNumber(series[5].datos[series[5].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[5]?.datos?.length ? getDatosForChart(series[5].datos, series[5].nombreSerie) : [],
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

     const handlePressCifras = (id, nombre) => {
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
                                             source={require('../../assets/images/login/imagen-padron.png')}
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
                                        Población inscrita en el padrón - Datos definitivos 01/01/2022
                                   </TextStyled>

                                   {/* Introducción breve */}
                                   <TextStyled className="text-base text-gray-700 mb-4">
                                        La tabla presenta los datos de la población inscrita en el padrón a fecha del 01/01/2022,
                                        desglosados entre el total de habitantes, ciudadanos españoles y extranjeros.{"\n"}
                                        La segunda columna muestra los valores totales, mientras que la tercera refleja la variación anual.{"\n"}
                                        Los datos corresponden a las cifras definitivas reportadas por el INE.{"\n"}
                                        Además, la gráfica ofrece una visualización de la evolución de estos datos en los últimos años.
                                   </TextStyled>
                                   <ResponsiveTable
                                        headers={['', 'Valor', 'Variación']}
                                        data={tablaDatos}
                                        selectedCell={selectedCell}
                                        onCellPress={handleCellPress}
                                        fontSize={10}
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
                                             handlePressCifras(operacionPadron[0].Id, operacionPadron[0].Nombre)
                                        }
                                   >
                                        <Ionicons name="grid-outline" size={24} color="white" />
                                        <TextStyled className="text-lg font-semibold mx-2 text-white">
                                             Tablas de las {operacionPadron[0].Nombre}
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
                                                            La Estadística del Padrón continuo se elabora a partir de la explotación exhaustiva de las variables básicas que contienen los ficheros padronales disponibles en el INE. Se ofrecen los datos de la población residente en España a 1 de enero de cada año, según lugar de residencia, sexo, edad, nacionalidad y lugar de nacimiento. Los datos de lugar de residencia se facilitan para distintos niveles de desagregación territorial: nacional, comunidades autónomas, provincias, municipios y secciones censales.
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

export default PadronContinuo;
