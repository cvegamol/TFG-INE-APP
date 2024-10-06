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
import Icon from 'react-native-vector-icons/Ionicons'; // Importar íconos

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const TouchableOpacityStyled = styled(TouchableOpacity);
const ImageStyled = styled(Image);
const ImageBackgroundStyled = styled(ImageBackground);
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacityStyled);

const EstadisticaContinuaPoblacion = () => {
     const router = useRouter();
     const { id } = useLocalSearchParams();
     const [operacion, setOperacion] = useState(null);
     const [isLoading, setIsLoading] = useState(true);
     const [tablasVisitadas, setTablasVisitadas] = useState([]);
     const [scrollEnabled, setScrollEnabled] = useState(true); // Controla el scroll global
     const [scaleAnim] = useState(new Animated.Value(1)); // Inicializa el valor de la escala en 1

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
                         obtenerDatosSerie('ECP320'),
                         obtenerDatosSerie('ECP329329'),

                         obtenerDatosSerie('ECP319'),
                         obtenerDatosSerie('ECP329330'),

                         obtenerDatosSerie('ECP318'),
                         obtenerDatosSerie('ECP329331'),

                         obtenerDatosSerie('ECP701'),
                         obtenerDatosSerie('ECP329332'),


                    ]);


                    const formattedTableData = [
                         [
                              { label: 'Poblacion Total', value: 'Población total' },
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
                              { label: 'Hombres', value: 'Hombres' },
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
                              { label: 'Mujeres', value: 'Mujeres' },
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
                              { label: 'Extranjeros', value: 'Extranjeros' },
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
                         ]

                    ];

                    const tablasMasVisitadas = [
                         [{ Nombre: 'Población residente por fecha, sexo y edad (desde 1971).' }, { Id: 56934 }],
                         [{ Nombre: 'Población residente por fecha, sexo, grupo de edad y nacionalidad.' }, { Id: 56936 }],
                         [{ Nombre: 'Población residente por fecha, sexo, grupo de edad y país de nacimiento.' }, { Id: 56937 }],
                         [{ Nombre: 'Inmigración procedente del extranjero, por trimestre y nacionalidad (10 principales países).' }, { Id: 59011 }],
                         [{ Nombre: 'Emigración con destino al extranjero, por trimestre y nacionalidad (10 principales países).' }, { Id: 59014 }],

                    ];
                    setTablasVisitadas(tablasMasVisitadas);

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
     const handlePressOperacion = (id, nombre) => {
          router.push({
               pathname: 'operacionesPadron',
               params: { id, nombre },
          });
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

     const handlePress = async (id) => {
          try {
               const response = await fetch(
                    `http://192.168.1.13:3000/tablas/getTableById/${id}`

                    //`http://192.168.128.97:3000/tablas/getTableById/${id}`
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
                                             source={require('../../assets/images/login/header-cifras.png')}
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

                                   {/*Tabla que muestra los datos*/}

                                   {/* Nombre de la gráfica */}
                                   <TextStyled className="text-xl font-semibold text-teal-700 mb-4 text-center">
                                        Estadística Continua de Población (ECP). 1 de julio de 2024. Datos provisionales
                                   </TextStyled>

                                   {/* Introducción breve */}
                                   <TextStyled className="text-base text-gray-700 mb-4">
                                        En esta sección se presentan las cifras provisionales de población residente en España a fecha de 1 de julio de 2024.{"\n"}
                                        Los datos abarcan la población total, desglosada por sexo, edad y nacionalidad.{"\n"}
                                        Además, se incluyen las principales variaciones anuales, permitiendo analizar las tendencias de la población en este periodo.{"\n"}
                                        Es importante señalar que, debido al redondeo, la suma de las cifras desagregadas puede no coincidir exactamente con el total.
                                   </TextStyled>
                                   <ResponsiveTable
                                        headers={['', 'Valor', '	Variación Anual']}
                                        data={tablaDatos}
                                        selectedCell={selectedCell}
                                        onCellPress={handleCellPress}
                                        fontSize={12} // Ajusta el tamaño de fuente de toda la tabla

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
                                        Todas las Tablas de la Operación:
                                   </TextStyled>
                                   <TouchableOpacityStyled
                                        className="flex-row items-center p-4 bg-white rounded-xl shadow-lg my-3 mx-5 border-[1]"
                                        style={{
                                             borderColor: '#065f5b', // Color teal-600
                                        }}
                                        onPress={() =>
                                             handlePressOperacion(
                                                  operacion[0].Id,
                                                  operacion[0].Nombre
                                             )
                                        }
                                   >
                                        <Ionicons name="stats-chart-outline" size={24} color="#065f5b" />
                                        <TextStyled className="text-lg font-semibold ml-2" style={{ color: '#065f5b' }}>
                                             Tablas de {operacion[0].Nombre}
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
                                   <TextStyled className="text-xl font-semibold text-teal-700 mb-4 text-center">
                                        Tablas Más Consultadas
                                   </TextStyled>

                                   {tablasVisitadas.map((tabla, index) => {
                                        const nombreTabla = tabla[0].Nombre;
                                        const idTabla = tabla[1].Id;

                                        return (
                                             <TouchableOpacityStyled
                                                  key={index}
                                                  className="p-3 my-3 rounded-lg"
                                                  onPress={() => handlePress(idTabla)}
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
                                                  onPressIn={() => {
                                                       // Efecto de escala al presionar
                                                       Animated.timing(scaleAnim, {
                                                            toValue: 0.95,
                                                            duration: 150,
                                                            useNativeDriver: true,
                                                       }).start();
                                                  }}
                                                  onPressOut={() => {
                                                       // Vuelve al tamaño original
                                                       Animated.timing(scaleAnim, {
                                                            toValue: 1,
                                                            duration: 150,
                                                            useNativeDriver: true,
                                                       }).start();
                                                  }}
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
                                                       {nombreTabla}
                                                  </TextStyled>
                                             </TouchableOpacityStyled>
                                        );
                                   })}


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
                                                       source={require('../../assets/images/login/sabiasque-cifras.png')}
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
                                                            <TextStyled className="font-semibold">Sabías que...</TextStyled> La Estadística Continua de Población mide trimestralmente la población residente en España, desglosada por comunidad autónoma, provincia e isla, según sexo, edad, nacionalidad y lugar de nacimiento.{"\n\n"}
                                                            La serie poblacional comienza en 1971, con estimaciones hasta 2021 y datos directos desde 2021. Además, incluye el número de hogares desde 2021 y datos de flujos migratorios desde 2023.{"\n\n"}
                                                            Estos datos son usados como referencia oficial en todas las operaciones estadísticas del INE y a nivel internacional.
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

export default EstadisticaContinuaPoblacion;
