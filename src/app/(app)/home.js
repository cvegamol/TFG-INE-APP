import React, { useEffect, useState } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, Button, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import ResponsiveTable from '../../components/ResponsiveTable';  // Asegúrate de tener la ruta correcta

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ButtonStyled = styled(Button);

const Home = () => {
  const [estadisticaContinua, setEstadisticaContinua] = useState(null);
  const [chartDatosTotal, setChartDatosTotal] = useState([]);
  const [datosTotal, setDatosTotal] = useState(null);
  const [datosTotalVarianza, setDatosTotalVarianza] = useState(null);
  const [chartDatosTotalVarianza, setChartDatosTotalVarianza] = useState([]);
  const [chartDatosHombre, setChartDatosHombre] = useState([]);
  const [datosHombre, setDatosHombre] = useState(null);
  const [chartDatosHombreVarianza, setChartDatosHombreVarianza] = useState([]);
  const [datosHombreVarianza, setDatosHombreVarianza] = useState(null);
  const [chartDatosMujer, setChartDatosMujer] = useState([]);
  const [datosMujer, setDatosMujer] = useState(null);
  const [chartDatosMujerVarianza, setChartDatosMujerVarianza] = useState([]);
  const [datosMujerVarianza, setDatosMujerVarianza] = useState(null);
  const [chartDatosExtranjeros, setChartDatosExtranjeros] = useState([]);
  const [datosExtranjeros, setDatosExtranjeros] = useState(null);
  const [chartDatosExtranjerosVarianza, setChartDatosExtranjerosVarianza] = useState([]);
  const [datosExtranjerosVarianza, setDatosExtranjerosVarianza] = useState(null);
  const [tablaDatos, setTablaDatos] = useState([]);

  useEffect(() => {
    const obtenerDatosInicio = async () => {
      try {
        const estadisticaContinuaResponse = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/450`);
        const estadisticaContinua = await estadisticaContinuaResponse.json();
        setEstadisticaContinua(estadisticaContinua[0]);

        const datos_total = await obtenerDatosSerie('ECP320');
        setDatosTotal(datos_total);
        const chartDatosTotal = getDatosForChart(datos_total);
        setChartDatosTotal(chartDatosTotal);

        const datos_total_varianza = await obtenerDatosSerie('ECP329329');
        setDatosTotalVarianza(datos_total_varianza);
        const chartDatosTotalVarianza = getDatosForChart(datos_total_varianza);
        setChartDatosTotalVarianza(chartDatosTotalVarianza);

        const datos_hombre = await obtenerDatosSerie('ECP4960');
        setDatosHombre(datos_hombre);
        const chartDatosHombre = getDatosForChart(datos_hombre);
        setChartDatosHombre(chartDatosHombre);

        const datos_hombre_varianza = await obtenerDatosSerie('ECP329330');
        setDatosHombreVarianza(datos_hombre_varianza);
        const chartDatosHombreVarianza = getDatosForChart(datos_hombre_varianza);
        setChartDatosHombreVarianza(chartDatosHombreVarianza);

        const datos_mujer = await obtenerDatosSerie('ECP4959');
        setDatosMujer(datos_mujer);
        const chartDatosMujer = getDatosForChart(datos_mujer);
        setChartDatosMujer(chartDatosMujer);

        const datos_mujer_varianza = await obtenerDatosSerie('ECP329331');
        setDatosMujerVarianza(datos_mujer_varianza);
        const chartDatosMujerVarianza = getDatosForChart(datos_mujer_varianza);
        setChartDatosMujerVarianza(chartDatosMujerVarianza);

        const datos_extranjero = await obtenerDatosSerie('ECP701');
        setDatosExtranjeros(datos_extranjero);
        const chartDatosExtranjero = getDatosForChart(datos_extranjero);
        setChartDatosExtranjeros(chartDatosExtranjero);

        const datos_extranjero_varianza = await obtenerDatosSerie('ECP329332');
        setDatosExtranjerosVarianza(datos_extranjero_varianza);
        const chartDatosExtranjerosVarianza = getDatosForChart(datos_extranjero_varianza);
        setChartDatosExtranjerosVarianza(chartDatosExtranjerosVarianza);

        // Transforming the data to an array of arrays format
        const formattedTableData = [
          ['Total', datos_total ? datos_total[datos_total.length - 1].Valor : 'N/A', datos_total_varianza ? datos_total_varianza[datos_total_varianza.length - 1].Valor : 'N/A'],
          ['Hombre', datos_hombre ? datos_hombre[datos_hombre.length - 1].Valor : 'N/A', datos_hombre_varianza ? datos_hombre_varianza[datos_hombre_varianza.length - 1].Valor : 'N/A'],
          ['Mujer', datos_mujer ? datos_mujer[datos_mujer.length - 1].Valor : 'N/A', datos_mujer_varianza ? datos_mujer_varianza[datos_mujer_varianza.length - 1].Valor : 'N/A'],
          ['Extranjeros', datos_extranjero ? datos_extranjero[datos_extranjero.length - 1].Valor : 'N/A', datos_extranjero_varianza ? datos_extranjero_varianza[datos_extranjero_varianza.length - 1].Valor : 'N/A'],
        ];

        console.log('Formatted Table Data:', formattedTableData); // Debugging log
        setTablaDatos(formattedTableData);
      } catch (error) {
        console.error(error.message);
      }
    };

    const obtenerDatosSerie = async (cod) => {
      try {
        const fecha = 9; // Ajusta la fecha si es necesario
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

    function getDatosForChart(datos) {
      return datos.map(dato => ({
        label: dato.fechaFormateada,
        value: parseFloat(dato.Valor.toFixed(2)),
      }));
    }

    obtenerDatosInicio();
  }, []);

  return (
    <Plantilla>
      <ViewStyled className='bg-red flex-1'>
        <Text style={styles.h1}>Esta es una página de ejemplo</Text>
      </ViewStyled>
      <ViewStyled className='flex-1 m-1  items-center'>
        {estadisticaContinua && (
          <TextStyled className="text-xl font-bold text-gray-700">
            Últimos Datos:  <TextStyled className='text-xl/4 text-gray-400'>
              {estadisticaContinua.Nombre}:
              {datosTotal && datosTotal.length > 0 && ` ${datosTotal[datosTotal.length - 1].fechaFormateada}`}
            </TextStyled>
          </TextStyled>
        )}

        <ResponsiveTable
          headers={['', 'Valor', 'Varianza']}
          data={tablaDatos}
        />

      </ViewStyled>
    </Plantilla>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 8,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  cellText: {
    fontSize: 16,
  },
  headerText: {
    fontWeight: 'bold',
  },
});

export default withExpoSnack(Home);