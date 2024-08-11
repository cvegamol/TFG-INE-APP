import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import ResponsiveTable from '../../components/ResponsiveTable';
import { LineChart } from 'react-native-chart-kit';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const Home = () => {
  const [estadisticaContinua, setEstadisticaContinua] = useState(null);
  const [chartData, setChartData] = useState([]);  
  const [tablaDatos, setTablaDatos] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 1 }); 

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  useEffect(() => {
    const obtenerDatosInicio = async () => {
      try {
        const estadisticaContinuaResponse = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/450`);
        const estadisticaContinua = await estadisticaContinuaResponse.json();
        setEstadisticaContinua(estadisticaContinua[0]);

        const datos_total = await obtenerDatosSerie('ECP320');
        const datos_total_varianza = await obtenerDatosSerie('ECP329329');
        const datos_hombre = await obtenerDatosSerie('ECP4960');
        const datos_hombre_varianza = await obtenerDatosSerie('ECP329330');
        const datos_mujer = await obtenerDatosSerie('ECP4959');
        const datos_mujer_varianza = await obtenerDatosSerie('ECP329331');
        const datos_extranjero = await obtenerDatosSerie('ECP701');
        const datos_extranjero_varianza = await obtenerDatosSerie('ECP329332');

       
        const formattedTableData = [
          [
            { label: 'Total', value: 'Total' },
            { label: 'Valor Total', value: datos_total[datos_total.length - 1]?.Valor, chartData: getDatosForChart(datos_total) },
            { label: 'Varianza Total', value: datos_total_varianza[datos_total_varianza.length - 1]?.Valor, chartData: getDatosForChart(datos_total_varianza) }
          ],
          [
            { label: 'Hombre', value: 'Hombre' },
            { label: 'Valor Hombre', value: datos_hombre[datos_hombre.length - 1]?.Valor, chartData: getDatosForChart(datos_hombre) },
            { label: 'Varianza Hombre', value: datos_hombre_varianza[datos_hombre_varianza.length - 1]?.Valor, chartData: getDatosForChart(datos_hombre_varianza) }
          ],
          [
            { label: 'Mujer', value: 'Mujer' },
            { label: 'Valor Mujer', value: datos_mujer[datos_mujer.length - 1]?.Valor, chartData: getDatosForChart(datos_mujer) },
            { label: 'Varianza Mujer', value: datos_mujer_varianza[datos_mujer_varianza.length - 1]?.Valor, chartData: getDatosForChart(datos_mujer_varianza) }
          ],
          [
            { label: 'Extranjeros', value: 'Extranjeros' },
            { label: 'Valor Extranjeros', value: datos_extranjero[datos_extranjero.length - 1]?.Valor, chartData: getDatosForChart(datos_extranjero) },
            { label: 'Varianza Extranjeros', value: datos_extranjero_varianza[datos_extranjero_varianza.length - 1]?.Valor, chartData: getDatosForChart(datos_extranjero_varianza) }
          ]
        ];

        setTablaDatos(formattedTableData);

       
        setChartData(getDatosForChart(datos_total));
      } catch (error) {
        console.error(error.message);
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
        </ViewStyled>
      </ScrollView>
    </Plantilla>
  );
};

export default Home;
