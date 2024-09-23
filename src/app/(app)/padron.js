import React, { useEffect, useState } from 'react';
import { Animated, SectionList, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const Padron = () => {
  const [dataPeriodica, setDataPeriodica] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const estadisticaPadronContinuoNP = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/188`);
        const cifrasPoblacionMunicipios = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/22`);
        const residentesEspaExtranjeros = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/230`);
        const variacionesResidenciales = await fetch(`http://192.168.1.13:3000/operaciones/getOperationById/202`);

        if (!isMounted) return;

        const datosPadron = await estadisticaPadronContinuoNP.json();
        const datosCifras = await cifrasPoblacionMunicipios.json();
        const datosResidentes = await residentesEspaExtranjeros.json();
        const datosVariaciones = await variacionesResidenciales.json();

        const nuevosDatos = [
          { Nombre: datosPadron[0].Nombre, Id: datosPadron[0].Id, Url: 'estadisticasPadronContinuo' },
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

    return () => {
      isMounted = false;
    };
  }, [fadeAnim]);

  const handlePress = (id, nombre, url) => {
    if (url === 'datosCifras') {
      router.push({
        pathname: 'cifrasMunicipios',
        params: { id, nombre },
      });
    } else if (url == 'estadisticasPadronContinuo') {
      router.push({
        pathname: 'estadisticasPadronContinuo',
        params: { id, nombre },
      });
    } else {
      router.push({
        pathname: 'operacionesPadron',
        params: { id, nombre },
      });
    }
  };

  // Array de colores para las tarjetas
  const cardColors = ['bg-teal-200', 'bg-teal-300', 'bg-teal-400', 'bg-teal-500', 'bg-teal-600', 'bg-teal-700'];

  return (
    <Plantilla>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <TextStyled className="text-3xl font-bold text-center text-teal-800 my-4">
          Operaciones Estadísticas sobre el Padrón
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
          A continuación, se muestran las operaciones estadísticas relacionadas con el padrón. Estas operaciones contienen información detallada organizada en tablas, cada una de las cuales abarca diferentes variables y valores.
        </TextStyled>

        <TextStyled
          className="text-base text-gray-700 mb-4 px-3"
          style={{
            textAlign: 'justify',
          }}
        >
          Puedes seleccionar una operación para acceder a las tablas disponibles. Al elegir una tabla, podrás explorar las variables y valores que te permitirán consultar datos específicos según tus necesidades.
        </TextStyled>
        <View
          style={{
            borderBottomColor: '#2d3748', // Gris claro acorde con tu estilo
            borderBottomWidth: 3,
            marginVertical: 0,
            marginBottom: 12 // Espacio entre el separador y los textos
          }}
        />

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
              scrollEnabled={false} // Deshabilitar el scroll del SectionList
              renderItem={({ item, index }) => (
                <TouchableOpacityStyled
                  className={`p-4 ${cardColors[index % cardColors.length]} rounded-md shadow-md my-2 mx-4 hover:bg-teal-100 active:bg-teal-200`}
                  onPress={() => handlePress(item.Id, item.Nombre, item.Url)}
                  activeOpacity={0.6}
                >
                  <TextStyled className="text-lg text-gray-700">{item.Nombre}</TextStyled>
                </TouchableOpacityStyled>
              )}

              renderSectionHeader={({ section }) => (
                <View
                  style={{
                    backgroundColor: '#38b2ac', // Tono teal oscuro para el título
                    paddingVertical: 8, // Espacio vertical
                    paddingHorizontal: 16, // Espacio horizontal
                    borderRadius: 8, // Bordes redondeados suaves
                    marginBottom: 6, // Separación del contenido
                    marginHorizontal: 4, // Espacio horizontal dentro del contenedor
                  }}
                >
                  <TextStyled
                    className="text-xl font-semibold text-white"
                    style={{
                      fontSize: 18, // Tamaño moderado
                      fontWeight: 'bold',
                    }}
                  >
                    {section.title}
                  </TextStyled>
                </View>
              )}

              keyExtractor={item => `basicListEntry-${item.Id}`}
            />
          </Animated.View>
        )}
      </ScrollView>
    </Plantilla>
  );
};

export default Padron;
