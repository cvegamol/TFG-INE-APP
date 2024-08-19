import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons'; // Asegúrate de tener esta importación
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
    const [selecciones, setSelecciones] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const variablesJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/GRUPOS_TABLA/${id}`);
                if (!variablesJson.ok) {
                    throw new Error('Error al obtener las variables');
                }

                const variablesText = await variablesJson.text();
                const variablesData = JSON.parse(variablesText);

                const valoresPromises = variablesData.map(async (variable) => {
                    const idv = variable.Id;

                    const valoresJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/VALORES_GRUPOSTABLA/${id}/${idv}?det=2&tip=A`);
                    if (!valoresJson.ok) {
                        throw new Error(`Error al obtener los valores para la variable ${variable.COD}`);
                    }

                    const valoresText = await valoresJson.text();
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

    const handleSelectionChange = (variableId, valorId) => {
        setSelecciones(prevState => {
            const selectedValues = prevState[variableId] || [];
            if (selectedValues.includes(valorId)) {
                return {
                    ...prevState,
                    [variableId]: selectedValues.filter(v => v !== valorId)
                };
            } else {
                return {
                    ...prevState,
                    [variableId]: [...selectedValues, valorId]
                };
            }
        });
    };

    const handleSelectAll = (variableId) => {
        const allValues = valoresVariables[variableId]?.map(valor => valor.Id) || [];
        setSelecciones(prevState => {
            const selectedValues = prevState[variableId] || [];
            const isAllSelected = selectedValues.length === allValues.length;

            return {
                ...prevState,
                [variableId]: isAllSelected ? [] : allValues
            };
        });
    };

    const handleConsultar = () => {
        console.log('Selecciones:', selecciones);
        // Lógica para consultar los datos basados en las selecciones.
    };

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
                        variables.map((variable) => {
                            const totalValores = valoresVariables[variable.Id]?.length || 0;
                            const seleccionados = selecciones[variable.Id]?.length || 0;
                            const allSelected = seleccionados === totalValores && totalValores > 0;

                            return (
                                <ViewStyled
                                    key={variable.Id}
                                    className="mb-6 p-4 bg-white rounded-lg shadow-lg flex-row justify-between"
                                    style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}
                                >
                                    <ViewStyled className="flex-1">
                                        <TextStyled className="text-lg font-semibold text-gray-700 mb-2">
                                            {variable.Nombre}
                                        </TextStyled>
                                        <ScrollViewStyled
                                            className="max-h-40 mt-2"
                                            nestedScrollEnabled={true}
                                        >
                                            {valoresVariables[variable.Id]?.map((valor) => (
                                                <ViewStyled key={valor.Id} className="flex-row items-center ">
                                                    <CheckBox
                                                        checked={selecciones[variable.Id]?.includes(valor.Id)}
                                                        onPress={() => handleSelectionChange(variable.Id, valor.Id)}
                                                    />
                                                    <TextStyled className="ml-2">{valor.Nombre}</TextStyled> 
                                                </ViewStyled>
                                            ))}
                                        </ScrollViewStyled>
                                        <ViewStyled className="flex-row justify-between mt-2">
                                            <TextStyled className="text-sm text-gray-600">
                                                Seleccionados: {seleccionados}
                                            </TextStyled>
                                            <TextStyled className="text-sm text-gray-600">
                                                Total: {totalValores}
                                            </TextStyled>
                                        </ViewStyled>
                                    </ViewStyled>
                                    <TouchableOpacity onPress={() => handleSelectAll(variable.Id)}>
                                        <Icon 
                                            name={allSelected ? "checkbox-outline" : "square-outline"} 
                                            size={24} 
                                            color="gray" 
                                        />
                                    </TouchableOpacity>
                                </ViewStyled>
                            );
                        })
                    )}

                    <Button
                        title="Consultar Selección"
                        onPress={handleConsultar}
                    />
                </ViewStyled>
            </ScrollViewStyled>
        </Plantilla>
    );
};

export default SeriesTabla;
