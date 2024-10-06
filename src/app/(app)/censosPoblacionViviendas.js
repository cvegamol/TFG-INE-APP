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

const CensosPoblacionViviendas = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
     const [operacion, setOperacion] = useState(null);
     const [tablasVisitadas, setTablasVisitadas] = useState([]);

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
          propsForLabels: {
               fontSize: 10, // Cambia el tamaño de la fuente del eje Y aquí
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
          console.log('Valor', value)
          return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
     };

     useEffect(() => {
          let isMounted = true;
          const obtenerDatos = async () => {
               try {
                    console.log('Id', id)
                    const operacion = await fetch(
                         `http://192.168.1.13:3000/operaciones/getOperationById/${id}`
                         //`http://192.168.128.97:3000/operaciones/getOperationById/${id}`

                    );
                    const datos = await operacion.json();
                    if (isMounted) {
                         setOperacion(datos);
                    }
                    console.log('ID', id)
                    const series = await Promise.all([
                         obtenerDatosSerie('CENSO1568062'),
                         obtenerDatosSerie('CENSO1568067'),

                         obtenerDatosSerie('CENSO1568063'),
                         obtenerDatosSerie('CENSO1568068'),

                         obtenerDatosSerie('CENSO1568064'),
                         obtenerDatosSerie('CENSO1568069'),

                         obtenerDatosSerie('CENSO1568065'),
                         obtenerDatosSerie('CENSO1568070'),

                         obtenerDatosSerie('CENSO1568066'),
                         obtenerDatosSerie('CENSO1568071'),

                         obtenerDatosSerie('CENSO1568072'),

                    ]);


                    const formattedTableData = [
                         [
                              { label: 'Población Total', value: 'Población Total' },
                              {
                                   label: 'Valor',
                                   value: series[0]?.datos?.length ? formatNumber(series[0].datos[series[0].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[0]?.datos?.length ? getDatosForChart(series[0].datos, series[0].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: series[1]?.datos?.length ? formatNumber(series[1].datos[series[1].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[1]?.datos?.length ? getDatosForChart(series[1].datos, series[1].nombreSerie) : [],
                              },

                         ],
                         [
                              { label: 'Españoles', value: 'Españoles' },
                              {
                                   label: 'Valor',
                                   value: series[2]?.datos?.length ? formatNumber(series[2].datos[series[2].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[2]?.datos?.length ? getDatosForChart(series[2].datos, series[2].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: series[3]?.datos?.length ? formatNumber(series[3].datos[series[3].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[3]?.datos?.length ? getDatosForChart(series[3].datos, series[3].nombreSerie) : [],
                              },

                         ],
                         [
                              { label: 'Extranjeros', value: 'Extranjeros' },
                              {
                                   label: 'Valor',
                                   value: series[4]?.datos?.length ? formatNumber(series[4].datos[series[4].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[4]?.datos?.length ? getDatosForChart(series[4].datos, series[4].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: series[5]?.datos?.length ? formatNumber(series[5].datos[series[5].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[5]?.datos?.length ? getDatosForChart(series[5].datos, series[5].nombreSerie) : [],
                              },

                         ],
                         [
                              { label: 'Nacidos en España', value: 'Nacidos en España' },
                              {
                                   label: 'Valor',
                                   value: series[6]?.datos?.length ? formatNumber(series[6].datos[series[6].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[6]?.datos?.length ? getDatosForChart(series[6].datos, series[6].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: series[7]?.datos?.length ? formatNumber(series[7].datos[series[7].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[7]?.datos?.length ? getDatosForChart(series[7].datos, series[7].nombreSerie) : [],
                              },

                         ],
                         [
                              { label: 'Nacidos en el extranjero', value: 'Nacidos en el extranjero' },
                              {
                                   label: 'Valor',
                                   value: series[8]?.datos?.length ? formatNumber(series[8].datos[series[8].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[8]?.datos?.length ? getDatosForChart(series[8].datos, series[8].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: series[9]?.datos?.length ? formatNumber(series[9].datos[series[9].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[9]?.datos?.length ? getDatosForChart(series[9].datos, series[9].nombreSerie) : [],
                              },

                         ],
                         [
                              { label: 'Tasa de dependencia de las personas mayores	', value: 'Tasa de dependencia de las personas mayores	' },
                              {
                                   label: 'Valor',
                                   value: series[8]?.datos?.length ? formatNumber(series[10].datos[series[10].datos.length - 1]?.Valor) : 'N/A',
                                   chartData: series[8]?.datos?.length ? getDatosForChart(series[10].datos, series[10].nombreSerie) : [],
                              },
                              {
                                   label: 'Variación Anual',
                                   value: 'N/A',
                                   chartData: [],
                              },

                         ],

                    ];

                    setTablaDatos(formattedTableData);
                    setChartData(getDatosForChart(series[0].datos, series[0].nombreSerie));

                    const tablasMasVisitadas = [
                         [{ Nombre: 'Tablas de mortalidad por sexo, edad, funciones y año.' }, { Id: 36700 }, { fechaFin: 2038 }],
                         [{ Nombre: 'Tasa de Mortalidad Infantil por sexo y año' }, { Id: 36658 }, { fechaFin: 2073 }],
                         [{ Nombre: 'Población residente por fecha, sexo, grupo de edad y país de nacimiento.' }, { Id: 56937 }, { fechaFin: 2073 }],
                         [{ Nombre: 'Tablas de Mortalidad proyectadas 2024-2073: Esperanza de Vida por edad y sexo.' }, { Id: 36775 }, { fechaFin: 2073 }],


                    ];
                    setTablasVisitadas(tablasMasVisitadas);


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
                    console.log('dato', dato)
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
                                        {operacion[0].Nombre}
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

                                   <TouchableOpacityStyled
                                        className="flex-row items-center p-4 bg-white rounded-xl shadow-lg my-3 mx-5 border-[1]"
                                        style={{
                                             borderColor: '#065f5b', // Color teal-600
                                        }}
                                        onPress={() =>
                                             handlePressCifras(
                                                  operacion[0].Id,
                                                  operacion[0].Nombre
                                             )
                                        }
                                   >
                                        <Ionicons name="stats-chart-outline" size={24} color="#065f5b" />
                                        <TextStyled className="text-lg font-semibold ml-2" style={{ color: '#065f5b' }}>
                                             Tablas del {operacion[0].Nombre}
                                        </TextStyled>
                                   </TouchableOpacityStyled>

                                   {/*Tabla que muestra los datos*/}

                                   {/* Nombre de la gráfica */}
                                   <TextStyled className="text-xl font-semibold text-teal-700 mb-4 text-center">

                                        Censo de población anual - Año 2023
                                   </TextStyled>


                                   <ResponsiveTable
                                        headers={['', 'Valor', 'Variación anual']}
                                        data={tablaDatos}
                                        selectedCell={selectedCell}
                                        onCellPress={handleCellPress}
                                        fontSize={10} // Ajusta el tamaño de fuente de toda la tabla
                                        responsive={true}
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
                                                            <TextStyled className="font-semibold">A partir de la publicación de los Censos de Población y Viviendas 2021,</TextStyled> se produce un cambio de paradigma en las estadísticas demográficas. La metodología empleada en el censo de 2021, basada por primera vez en la explotación de registros administrativos, permite reproducir cada año el proceso para obtener la información censal.
                                                            {'\n\n'}
                                                            Así, el censo deja de ser una publicación decenal, como ha venido ocurriendo ininterrumpidamente desde 1857, basada en la información recopilada mediante entrevistas a los hogares, y se inaugura un nuevo sistema censal basado en fuentes administrativas que permite disponer de censos de población cada año y de censos de viviendas, previsiblemente, cada tres o cuatro años.
                                                            {'\n\n'}
                                                            La operación "Censo de población" se publica a finales de cada año y ofrece información muy detallada en el territorio, hasta el nivel de sección censal, de las principales características demográficas de la población residente a 1 de enero de ese mismo año. Posteriormente, en el segundo trimestre del año siguiente, se incorpora el resto de información censal (educativa, laboral, migratoria...).
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

export default CensosPoblacionViviendas;
