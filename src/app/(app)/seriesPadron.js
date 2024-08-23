import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Loading from '../../components/Loading';
import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);

const formatDate = (dia, mes, ano) => {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return `${dia} de ${months[mes - 1]} de ${ano}`;
};

const SeriesTabla = () => {
    const router = useRouter();
    const { tabla } = useLocalSearchParams();

    const tablaObj = JSON.parse(tabla);
    const [variables, setVariables] = useState([]);
    const [periodicidad, setPeriodicidad] = useState([]);
    const [valoresVariables, setValoresVariables] = useState({});
    const [selecciones, setSelecciones] = useState({});
    const [seleccionesPeriodicidades, setSeleccionesPeriodicidades] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const variablesJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/GRUPOS_TABLA/${tablaObj.Id}`);
                if (!variablesJson.ok) {
                    throw new Error('Error al obtener las variables');
                }

                const variablesText = await variablesJson.text();
                const variablesData = JSON.parse(variablesText);

                const valoresPromises = variablesData.map(async (variable) => {
                    const idv = variable.Id;
                    const valoresJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/VALORES_GRUPOSTABLA/${tablaObj.Id}/${idv}?det=2&tip=A`);
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

                const periodicidadJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/PERIODICIDAD/${tablaObj.FK_Periodicidad}`);
                const periodicidadData = await periodicidadJson.json();
                const periodicidades = generarPeriodicidades(periodicidadData.Codigo, tablaObj.Anyo_Periodo_ini, tablaObj.FechaRef_fin);
                setPeriodicidad(periodicidades);
            } catch (error) {
                console.error('Error al obtener las variables:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        obtenerDatos();
    }, [tablaObj.Id]);

    const generarPeriodicidades = (tipoPeriodicidad, anoInicio, anoFin = new Date().getFullYear()) => {
        const periodicidades = [];
        const startYear = parseInt(anoInicio, 10);
        const endYear = anoFin && !isNaN(parseInt(anoFin, 10))
            ? parseInt(anoFin, 10)
            : new Date().getFullYear();

        if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
            console.error('Años de inicio o fin inválidos.');
            return [];
        }

        switch (tipoPeriodicidad) {
            case 'A': // Anual
                for (let year = startYear; year <= endYear; year++) {
                    periodicidades.push({
                        dia: 1,
                        mes: 1,
                        ano: year
                    });
                }
                break;

            case 'Q': // Trimestral
                for (let year = startYear; year <= endYear; year++) {
                    for (let trimestre = 1; trimestre <= 4; trimestre++) {
                        let mes = (trimestre - 1) * 3 + 1;
                        periodicidades.push({
                            dia: 1,
                            mes: mes,
                            ano: year
                        });
                    }
                }
                break;

            case 'M': // Mensual
                for (let year = startYear; year <= endYear; year++) {
                    for (let mes = 1; mes <= 12; mes++) {
                        periodicidades.push({
                            dia: 1,
                            mes: mes,
                            ano: year
                        });
                    }
                }
                break;

            case 'S': // Semestral
                for (let year = startYear; year <= endYear; year++) {
                    for (let semestre = 1; semestre <= 2; semestre++) {
                        let mes = (semestre - 1) * 6 + 1;
                        periodicidades.push({
                            dia: 1,
                            mes: mes,
                            ano: year
                        });
                    }
                }
                break;

            default:
                console.warn('Tipo de periodicidad no soportado');
                break;
        }

        return periodicidades;
    };

    const handleSelectionChange = (variableId, valor) => {
        setSelecciones(prevState => {
            const selectedValues = prevState[variableId] || [];
            if (selectedValues.includes(valor)) {
                return {
                    ...prevState,
                    [variableId]: selectedValues.filter(v => v !== valor)
                };
            } else {
                return {
                    ...prevState,
                    [variableId]: [...selectedValues, valor]
                };
            }
        });
    };

    const handleSelectAll = (variableId) => {
        const allValues = valoresVariables[variableId] || [];
        setSelecciones(prevState => {
            const selectedValues = prevState[variableId] || [];
            const isAllSelected = selectedValues.length === allValues.length;

            return {
                ...prevState,
                [variableId]: isAllSelected ? [] : allValues
            };
        });
    };

    const handleSelectAllPeriodicidades = () => {
        const allPeriodicidades = periodicidad.reduce((acc, p) => {
            acc[`${p.dia}-${p.mes}-${p.ano}`] = p;
            return acc;
        }, {});
        setSeleccionesPeriodicidades(prevState => {
            const selectedValues = Object.keys(prevState).length === periodicidad.length;
            return selectedValues ? {} : allPeriodicidades;
        });
    };

    const handleSelectionChangePeriodicidad = (periodo) => {
        setSeleccionesPeriodicidades(prevState => {
            const key = `${periodo.dia}-${periodo.mes}-${periodo.ano}`;
            if (prevState[key]) {
                const { [key]: _, ...rest } = prevState;
                return rest;
            } else {
                return { ...prevState, [key]: periodo };
            }
        });
    };

    const handleConsultar = async () => {
        console.log('Selecciones:', selecciones);
        console.log('Periodicidades Seleccionadas:', seleccionesPeriodicidades);
        const url_base = `https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/${tablaObj.Id}?`;

        const parametros_url = Object.entries(selecciones)
            .flatMap(([variableId, valores]) =>
                valores.map(valor => `tv=${valor.Variable.Id}:${valor.Id}`)
            )
            .join('&');

        const url_final = url_base + parametros_url;

        console.log('URL Final:', url_final);
        const seriesJson = await fetch(url_final);
        const series = await seriesJson.json();
        console.log(series.length);
        console.log(seleccionesPeriodicidades)
    };

    return (
        <Plantilla>
            <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                <ViewStyled className="p-4">
                    <TextStyled className="text-2xl font-bold text-gray-800 mb-4">Detalle de la Operación</TextStyled>
                    <TextStyled className="text-xl text-gray-600 mb-2">ID: {tablaObj.Id}</TextStyled>
                    <TextStyled className="text-xl text-gray-600 mb-4">Nombre: {tablaObj.Nombre}</TextStyled>

                    {isLoading ? (
                        <ViewStyled className="flex-1 justify-center items-center mt-4">
                            <Loading size={hp(6)} />
                            <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
                        </ViewStyled>
                    ) : (
                        <>
                            {/* Sección de Variables */}
                            {variables.map((variable) => {
                                const totalValores = valoresVariables[variable.Id]?.length || 0;
                                const seleccionados = selecciones[variable.Id]?.length || 0;
                                const allSelected = seleccionados === totalValores && totalValores > 0;

                                return (
                                    <ViewStyled
                                        key={variable.Id}
                                        className="mb-6 p-4 bg-white rounded-lg shadow-lg"
                                        style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}
                                    >
                                        <ViewStyled className="flex-1">
                                            <ViewStyled className="flex-row justify-between items-center mb-2">
                                                <TextStyled className="text-lg font-semibold text-gray-700">
                                                    {variable.Nombre}
                                                </TextStyled>
                                                <TouchableOpacity onPress={() => handleSelectAll(variable.Id)}>
                                                    <Icon
                                                        name={allSelected ? "checkbox-outline" : "square-outline"}
                                                        size={24}
                                                        color="gray"
                                                    />
                                                </TouchableOpacity>
                                            </ViewStyled>

                                            <ScrollViewStyled
                                                className="max-h-40"
                                                nestedScrollEnabled={true}
                                            >
                                                {valoresVariables[variable.Id]?.map((valor) => (
                                                    <ViewStyled key={valor.Id} className="flex-row items-center">
                                                        <CheckBox
                                                            checked={selecciones[variable.Id]?.includes(valor)}
                                                            onPress={() => handleSelectionChange(variable.Id, valor)}
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

                                    </ViewStyled>
                                );
                            })}

                            {/* Sección de Periodicidades */}
                            {periodicidad.length > 0 && (
                                <ViewStyled className="mb-6 p-4 bg-white rounded-lg shadow-lg"
                                    style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}>
                                    <ViewStyled className="flex-1">
                                        <ViewStyled className="flex-row justify-between items-center mb-2">
                                            <TextStyled className="text-lg font-semibold text-gray-700">
                                                Periodicidades
                                            </TextStyled>
                                            <TouchableOpacity onPress={handleSelectAllPeriodicidades}>
                                                <Icon
                                                    name={Object.keys(seleccionesPeriodicidades).length === periodicidad.length ? "checkbox-outline" : "square-outline"}
                                                    size={24}
                                                    color="gray"
                                                />
                                            </TouchableOpacity>
                                        </ViewStyled>
                                        <ScrollViewStyled
                                            className="max-h-40"
                                            nestedScrollEnabled={true}
                                        >
                                            {periodicidad.map((p) => (
                                                <ViewStyled key={`${p.dia}-${p.mes}-${p.ano}`} className="flex-row items-center">
                                                    <CheckBox
                                                        checked={!!seleccionesPeriodicidades[`${p.dia}-${p.mes}-${p.ano}`]}
                                                        onPress={() => handleSelectionChangePeriodicidad(p)}
                                                    />
                                                    <TextStyled className="ml-2">{formatDate(p.dia, p.mes, p.ano)}</TextStyled>
                                                </ViewStyled>
                                            ))}
                                        </ScrollViewStyled>
                                        <ViewStyled className="flex-row justify-between mt-2">
                                            <TextStyled className="text-sm text-gray-600">
                                                Seleccionadas: {Object.keys(seleccionesPeriodicidades).length}
                                            </TextStyled>
                                            <TextStyled className="text-sm text-gray-600">
                                                Total: {periodicidad.length}
                                            </TextStyled>
                                        </ViewStyled>
                                    </ViewStyled>
                                </ViewStyled>
                            )}

                            <Button
                                title="Consultar Selección"
                                onPress={handleConsultar}
                            />
                        </>
                    )}
                </ViewStyled>
            </ScrollViewStyled>
        </Plantilla>
    );
};

export default SeriesTabla;
