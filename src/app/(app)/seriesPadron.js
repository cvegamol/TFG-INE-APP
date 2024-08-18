import React, { useEffect, useState } from 'react';
import { ScrollView ,View,Text} from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const SeriesTabla = () => {
    const router = useRouter();
    const { id, nombre } = useLocalSearchParams();
    const [variables, setVariables] = useState([]);
    const [valoresVariables, setValoresVariables] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
               
                const variablesJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/GRUPOS_TABLA/${id}`);
                if (!variablesJson.ok) {
                    throw new Error('Error al obtener las variables');
                }

                const variablesText = await variablesJson.text();
                if (!variablesText) {
                    throw new Error('Respuesta vacía al obtener las variables');
                }

                const variablesData = JSON.parse(variablesText);

                const valoresPromises = variablesData.map(async (variable) => {
                    const idv = variable.Id;
                    
                    const valoresJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/VALORES_GRUPOSTABLA/${id}/${idv}`);
                    if (!valoresJson.ok) {
                        throw new Error(`Error al obtener los valores para la variable ${variable.COD}`);
                    }

                    const valoresText = await valoresJson.text();
                    if (!valoresText) {
                        throw new Error(`Respuesta vacía al obtener los valores para la variable ${variable.COD}`);
                    }

                    const valoresData = JSON.parse(valoresText);
                    
                    return { [variable.Id]: valoresData };
                });

                setVariables(variablesData);

                const valoresResult = await Promise.all(valoresPromises);
                const valoresMap = valoresResult.reduce((acc, curr) => {
                    return { ...acc, ...curr };
                }, {});
               
                setValoresVariables(valoresMap);

            } catch (error) {
                console.error('Error al obtener las variables:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        obtenerDatos();
    }, [id]);

    return (
       <Plantilla>
            <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                <ViewStyled className="p-4">
                    <TextStyled className="text-2xl font-bold text-gray-800 mb-4">Detalle de la Operación</TextStyled>
                    <TextStyled className="text-xl text-gray-600 mb-2">ID: {id}</TextStyled>
                    <TextStyled className="text-xl text-gray-600 mb-4">Nombre: {nombre}</TextStyled>

                    {isLoading ? (
                        <ViewStyled className="flex-1 justify-center items-center mt-4">
                            <Loading size={hp(6)} />
                            <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
                        </ViewStyled>
                    ) : (
                        variables.map((variable) => (
                            <ViewStyled
                                key={variable.Id}
                                className="mb-6 p-4 bg-white rounded-lg shadow-lg"
                                style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}  // Aplicando estilo directamente
                            >
                                <TextStyled className="text-lg font-semibold text-gray-700 mb-2">
                                    {variable.Nombre}
                                </TextStyled>
                                <ScrollViewStyled
                                    className="max-h-40"
                                    nestedScrollEnabled={true}
                                >
                                    {valoresVariables[variable.Id]?.map((valor) => (
                                        <TextStyled
                                            key={valor.Id}
                                            className="text-base text-gray-600 ml-2 py-1"
                                        >
                                            {valor.Nombre}
                                        </TextStyled>
                                    ))}
                                </ScrollViewStyled>
                            </ViewStyled>
                        ))
                    )}
                </ViewStyled>
            </ScrollViewStyled>
        </Plantilla>
    );
};

export default SeriesTabla;
