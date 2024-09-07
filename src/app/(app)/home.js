import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import ResponsiveTable from '../../components/ResponsiveTable';
import { BarChart, LineChart } from 'react-native-chart-kit';
import Loading from '../../components/Loading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const Home = () => {
  const [estadisticaContinua, setEstadisticaContinua] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tablaDatos, setTablaDatos] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 1 });
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el loading

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  useEffect(() => {
    const obtenerDatosInicio = async () => {
      try {
        // Coloca aquí todas las llamadas a APIs
        //const estadisticaContinuaResponse = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/450`);
        const estadisticaContinuaResponse = await fetch(`http://192.168.103.97:3000/operaciones/getOperationById/450`);
        const estadisticaContinua = await estadisticaContinuaResponse.json();
        setEstadisticaContinua(estadisticaContinua[0]);

        const series = await Promise.all([
          obtenerDatosSerie('ECP320'),
          obtenerDatosSerie('ECP329329'),
          obtenerDatosSerie('ECP4960'),
          obtenerDatosSerie('ECP329330'),
          obtenerDatosSerie('ECP4959'),
          obtenerDatosSerie('ECP329331'),
          obtenerDatosSerie('ECP701'),
          obtenerDatosSerie('ECP329332'),
        ]);

        const formattedTableData = [
          [
            { label: 'Total', value: 'Total' },
            { label: 'Valor Total', value: series[0][series[0].length - 1]?.Valor, chartData: getDatosForChart(series[0]) },
            { label: 'Varianza Total', value: series[1][series[1].length - 1]?.Valor, chartData: getDatosForChart(series[1]) }
          ],
          [
            { label: 'Hombre', value: 'Hombre' },
            { label: 'Valor Hombre', value: series[2][series[2].length - 1]?.Valor, chartData: getDatosForChart(series[2]) },
            { label: 'Varianza Hombre', value: series[3][series[3].length - 1]?.Valor, chartData: getDatosForChart(series[3]) }
          ],
          [
            { label: 'Mujer', value: 'Mujer' },
            { label: 'Valor Mujer', value: series[4][series[4].length - 1]?.Valor, chartData: getDatosForChart(series[4]) },
            { label: 'Varianza Mujer', value: series[5][series[5].length - 1]?.Valor, chartData: getDatosForChart(series[5]) }
          ],
          [
            { label: 'Extranjeros', value: 'Extranjeros' },
            { label: 'Valor Extranjeros', value: series[6][series[6].length - 1]?.Valor, chartData: getDatosForChart(series[6]) },
            { label: 'Varianza Extranjeros', value: series[7][series[7].length - 1]?.Valor, chartData: getDatosForChart(series[7]) }
          ]
        ];

        setTablaDatos(formattedTableData);
        setChartData(getDatosForChart(series[0]));
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false); // Desactiva el loading después de obtener los datos
      }
    };

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

        return datosMapeados;
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
        throw error;
      }
    };

    const getDatosForChart = (datos) => {
      return datos.map(dato => {
        const fechaObjeto = new Date(dato.Fecha);
        const opcionesFormato = { month: 'short', year: 'numeric' };
        const fechaFormateada = fechaObjeto.toLocaleDateString('es-ES', opcionesFormato);

        return {
          label: fechaFormateada,
          value: parseFloat(dato.Valor.toFixed(2)),
        };
      });
    };

    obtenerDatosInicio();
  }, []);

  const formatYAxisValue = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    } else {
      return value.toString();
    }
  };

  const handleCellPress = (rowIndex, colIndex, cellData) => {
    if (colIndex > 0 && cellData.chartData) {
      setSelectedCell({ row: rowIndex, col: colIndex });
      setChartData(cellData.chartData);
    }
  };

  return (
    <Plantilla>
      <ScrollView vertical>
        <ViewStyled className='flex-1 m-1 items-center'>
          {isLoading ? (
            <ViewStyled className="flex-1 justify-center items-center">
              <Loading size={hp(6)} />
              <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
            </ViewStyled>
          ) : (
            <>
              {estadisticaContinua && (
                <TextStyled className="text-xl font-bold text-gray-700">
                  Últimos Datos: <TextStyled className='text-xl/4 text-gray-400'>
                    {estadisticaContinua.Nombre}:
                    {chartData && chartData.length > 0 && ` ${chartData[chartData.length - 1].label}`}
                  </TextStyled>
                </TextStyled>
              )}

              <ResponsiveTable
                headers={['', 'Valor', 'Varianza']}
                data={tablaDatos}
                selectedCell={selectedCell}
                onCellPress={handleCellPress}
              />

              <ScrollView horizontal>
                {chartData.length > 0 && (
                  <LineChart
                    data={{
                      labels: chartData.map(dato => dato.label),
                      datasets: [
                        {
                          data: chartData.map(dato => dato.value),
                        },
                      ],
                    }}
                    width={chartWidth}
                    height={300}
                    yAxisLabel=""
                    yAxisSuffix=""
                    yAxisInterval={1}
                    formatYLabel={formatYAxisValue}
                    chartConfig={{
                      backgroundColor: '#f0f0f0',
                      backgroundGradientFrom: '#d3d3d3',
                      backgroundGradientTo: '#a9a9a9',
                      decimalPlaces: 2,
                      color: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: '#999',
                      },
                    }}
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                    }}
                    horizontalLabelRotation={0}
                    verticalLabelRotation={275}
                    xLabelsOffset={33}
                  />
                )}
              </ScrollView>
            </>
          )}
        </ViewStyled>
        <LineChart
          data={{
            labels: ["January", "February"],
            datasets: [
              {
                data: [10000, 15000, 20000], // Primer valor para cada mes
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Rojo
              },
              {
                data: [11000, 35000, 40000], // Segundo valor para cada mes
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Azul
              }
            ]
          }}
          width={Dimensions.get("window").width} // from react-native
          height={220}

          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          fromZero={true}
        />
        <BarChart
          data={{
            labels: ["January", "February"],
            datasets: [
              {
                data: [10000, 15000, 20000], // Primer valor para cada mes
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Rojo
              },
              {
                data: [30000, 35000, 40000], // Segundo valor para cada mes
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Azul
              }
            ]
          }}
          width={Dimensions.get("window").width - 16} // Ancho de la gráfica
          height={220} // Altura de la gráfica
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // Número de decimales
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            barPercentage: 0.5, // Ajusta este valor para controlar el ancho de las barras y su superposición
            useShadowColorFromDataset: false, // Desactiva sombras si es necesario
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
          withHorizontalLabels={false} // Opcional: remueve etiquetas horizontales para un look más limpio
        />
      </ScrollView>
    </Plantilla>
  );
};

export default Home;
