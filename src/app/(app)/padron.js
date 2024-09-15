import React, { useEffect, useState } from 'react';
import { Animated, SectionList, View, Text, TouchableOpacity } from 'react-native';
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
  const fadeAnim = useState(new Animated.Value(0))[0]; // Aseguramos que la animación siempre sea reiniciada

  useEffect(() => {
    let isMounted = true;  // Control para saber si el componente está montado

    const iniciarAnimacion = () => {
      fadeAnim.setValue(0); // Reinicia la animación
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

    iniciarAnimacion(); // Llamamos a la animación

    const obtenerDatosOperaciones = async () => {
      try {
        const estadisticaPadronContinuoNP = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/188`);
        const cifrasPoblacionMunicipios = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/22`);
        const residentesEspaExtranjeros = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/230`);
        const variacionesResidenciales = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/202`);

        if (!isMounted) return; // Verificamos si el componente sigue montado

        const datosPadron = await estadisticaPadronContinuoNP.json();
        const datosCifras = await cifrasPoblacionMunicipios.json();
        const datosResidentes = await residentesEspaExtranjeros.json();
        const datosVariaciones = await variacionesResidenciales.json();
        console.log('Cifras', cifrasPoblacionMunicipios)
        const nuevosDatos = [
          { Nombre: datosPadron[0].Nombre, Id: datosPadron[0].Id, Url: '' },
          { Nombre: datosVariaciones[0].Nombre, Id: datosVariaciones[0].Id, Url: '' },
        ];

        const datosPeriodicos = [
          { Nombre: datosCifras[0].Nombre, Id: datosCifras[0].Id, Url: 'datosCifras' },
          { Nombre: datosResidentes[0].Nombre, Id: datosResidentes[0].Id, Url: '' },
        ];

        setDataPeriodica(datosPeriodicos);
        setData(nuevosDatos);
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

    // Cleanup: se ejecuta cuando el componente se desmonta
    return () => {
      isMounted = false;
    };
  }, [fadeAnim]); // Agregamos `fadeAnim` como dependencia para asegurarnos de que se reinicie cada vez

  const handlePress = (id, nombre, url) => {
    if (url === 'datosCifras') {
      router.push({
        pathname: 'cifrasMunicipios',
        params: { id, nombre },
      });
    } else {
      router.push({
        pathname: 'operacionesPadron',
        params: { id, nombre },
      });
    }
  };

  return (
    <Plantilla>
      <TextStyled className="text-3xl font-bold text-center text-teal-800 my-4">
        Operaciones Estadísticas sobre el Padrón
      </TextStyled>
      {isLoading ? (
        <ViewStyled className="flex-1 justify-center items-center">
          <Loading size={hp(6)} />
          <TextStyled className="text-lg text-teal-500 mt-2">Cargando...</TextStyled>
        </ViewStyled>
      ) : (
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          <SectionList
            sections={[
              { title: 'Operaciones estadísticas sin periodicidad establecida', data: data },
              { title: 'Operaciones estadísticas elaboradas de forma periódica', data: dataPeriodica }
            ]}
            renderItem={({ item }) => (
              <TouchableOpacityStyled
                className="p-4 bg-white rounded-md shadow-md my-2 mx-4 hover:bg-teal-100 active:bg-teal-200"
                onPress={() => handlePress(item.Id, item.Nombre, item.Url)}
                activeOpacity={0.6}
              >
                <TextStyled className="text-lg text-gray-700">{item.Nombre}</TextStyled>
              </TouchableOpacityStyled>
            )}
            renderSectionHeader={({ section }) => (
              <TextStyled className="text-xl font-semibold text-white bg-teal-700 p-2">
                {section.title}
              </TextStyled>
            )}
            keyExtractor={item => `basicListEntry-${item.Id}`}
          />
        </Animated.View>
      )}
    </Plantilla>
  );
};

export default Padron;
