import React, { useEffect, useState } from 'react';
import { SectionList, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const Padron = () => {
  const [dataPeriodica, setDataPeriodica] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const obtenerDatosOperaciones = async () => {
      try {
        // const estadisticaPadronContinuoNP = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/188`);
        // const cifrasPoblacionMunicipios = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/22`);
        // const residentesEspaExtranjeros = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/230`);
        // const variacionesResidenciales = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/202`);
        const estadisticaPadronContinuoNP = await fetch(`http://192.168.103.97:3000/operaciones/getOperationById/188`);
        const cifrasPoblacionMunicipios = await fetch(`http://192.168.103.97:3000/operaciones/getOperationById/22`);
        const residentesEspaExtranjeros = await fetch(`http://192.168.103.97:3000/operaciones/getOperationById/230`);
        const variacionesResidenciales = await fetch(`http://192.168.103.97:3000/operaciones/getOperationById/202`);

        const datosPadron = await estadisticaPadronContinuoNP.json();
        const datosCifras = await cifrasPoblacionMunicipios.json();
        const datosResidentes = await residentesEspaExtranjeros.json();
        const datosVariaciones = await variacionesResidenciales.json();

        const nuevosDatos = [
          { Nombre: datosPadron[0].Nombre, Id: datosPadron[0].Id },
          { Nombre: datosVariaciones[0].Nombre, Id: datosVariaciones[0].Id }
        ];

        const datosPeriodicos = [
          { Nombre: datosCifras[0].Nombre, Id: datosCifras[0].Id },
          { Nombre: datosResidentes[0].Nombre, Id: datosResidentes[0].Id }
        ];

        setDataPeriodica(datosPeriodicos);
        setData(nuevosDatos);
      } catch (error) {
        console.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerDatosOperaciones();
  }, []);

  const handlePress = (id, nombre) => {
    router.push({
      pathname: 'operacionesPadron',
      params: { id, nombre },
    });
  };

  return (
    <Plantilla>
      <TextStyled className="text-3xl font-bold text-center text-gray-800 my-4">
        Operaciones Estadísticas sobre el Padrón
      </TextStyled>

      {isLoading ? (
        <ViewStyled className="flex-1 justify-center items-center">
          <Loading size={hp(6)} />
          <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
        </ViewStyled>
      ) : (
        <SectionList
          sections={[
            { title: 'Operaciones estadísticas sin periodicidad establecida', data: data },
            { title: 'Operaciones estadísticas elaboradas de forma periódica', data: dataPeriodica }
          ]}
          renderItem={({ item }) => (
            <TouchableOpacityStyled
              className="p-4 bg-white rounded-md shadow-md my-2 mx-4"
              onPress={() => handlePress(item.Id, item.Nombre)}
            >
              <TextStyled className="text-lg text-gray-700">{item.Nombre}</TextStyled>
            </TouchableOpacityStyled>
          )}
          renderSectionHeader={({ section }) => (
            <TextStyled className="text-xl font-semibold text-gray-900 bg-gray-200 p-2">
              {section.title}
            </TextStyled>
          )}
          keyExtractor={item => `basicListEntry-${item.Id}`}
        />
      )}
    </Plantilla>
  );
};

export default Padron;
