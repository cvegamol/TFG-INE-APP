import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, View, Text, Animated, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';

import { useLocalSearchParams, useRouter } from 'expo-router';
import VariableSelection from '../../components/VariableSelection';
import PeriodicidadSelection from '../../components/PeriodicidadesSelection';

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

    // Nuevo estado para guardar el número de series y datos
    const [numSeries, setNumSeries] = useState(0);
    const [numDatos, setNumDatos] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pressAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        const obtenerDatos = async () => {
            try {
                console.log('Id de mi etabla', tablaObj.Id)
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

                let periodicidadData;

                // Verificar si FK_Periodicidad está definido
                if (tablaObj.FK_Periodicidad) {
                    // Consultar la API usando FK_Periodicidad
                    const periodicidadJson = await fetch(`https://servicios.ine.es/wstempus/js/ES/PERIODICIDAD/${tablaObj.FK_Periodicidad}`);

                    if (!periodicidadJson.ok) {
                        console.error('Error al obtener la periodicidad con FK_Periodicidad.');
                        return; // Manejar el error según sea necesario
                    }

                    periodicidadData = await periodicidadJson.json();
                } else if (tablaObj.T3_Periodicidad) {
                    // Usar T3_Periodicidad como respaldo
                    periodicidadData = { Codigo: tablaObj.T3_Periodicidad }; // Crea un objeto con solo el código

                    // Aquí puedes manejar directamente el caso en que no se consulta la API
                } else {
                    console.error('No se encontró un código de periodicidad válido.');
                    return; // Salir si no hay códigos válidos
                }

                // Continuar con la lógica
                console.log('Periodicidad', periodicidadData);
                console.log('Tabla', tablaObj, tablaObj.Anyo_Periodo_ini, tablaObj.FechaRef_fin);

                const date = new Date(tablaObj.Ultima_Modificacion);
                const periodicidades = generarPeriodicidades(periodicidadData.Codigo, tablaObj.Anyo_Periodo_ini, date);
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
        console.log('Ano de inicio', anoInicio, 'Ano de fin', anoFin)
        const startYear = parseInt(anoInicio, 10);
        const endYear = anoFin && !isNaN(parseInt(anoFin, 10))
            ? parseInt(anoFin, 10)
            : new Date().getFullYear();
        console.log(tipoPeriodicidad)
        if (tipoPeriodicidad !== 'Al Detalle' && (isNaN(startYear) || isNaN(endYear) || startYear > endYear)) {
            console.error('Años de inicio o fin inválidos.');
            return [];
        }
        console.log('Tipo de periodocidad', tipoPeriodicidad)
        switch (tipoPeriodicidad) {

            case 'A':
                for (let year = startYear; year <= endYear; year++) {
                    periodicidades.push({
                        dia: 1,
                        mes: 1,
                        ano: year
                    });
                }
                break;
            case 'W':
                for (let year = startYear; year <= endYear; year++) {
                    // Determinar si el año es bisiesto
                    const esBisiesto = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                    const totalWeeks = 52 + (new Date(year, 11, 31).getDay() === 4 || (esBisiesto && new Date(year, 11, 31).getDay() === 3) ? 1 : 0);

                    for (let week = 1; week <= totalWeeks; week++) {
                        // Calcular la fecha de inicio y fin de la semana
                        const firstDayOfYear = new Date(year, 0, 1);
                        const startOfWeek = new Date(firstDayOfYear.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
                        const endOfWeek = new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000);

                        // Formatear las fechas como YYYYMMDD
                        const formatFecha = (date) => `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
                        const valor = `${formatFecha(startOfWeek)}:${formatFecha(endOfWeek)}`;

                        periodicidades.push({
                            semana: week,
                            ano: year,
                            etiqueta: `${year}SM${week < 10 ? '0' : ''}${week}`,
                            valor: valor
                        });
                    }
                }
                break;

            case 'Q':
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

            case 'M':
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
            case 'N':
            case 'Al Detalle':
                // Obtener el último año (por ejemplo, usando el año actual)
                const lastYear = new Date().getFullYear();

                // Solo añadir los meses del último año
                for (let mes = 1; mes <= 12; mes++) {
                    periodicidades.push({
                        dia: 1,
                        mes: mes,
                        ano: lastYear
                    });
                }
                console.log('Prueba', periodicidades)
                break;

            case 'S':
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

    const calcularSeriesYDatos = () => {
        let series = 1;
        let datos = 0;

        Object.values(selecciones).forEach(variableSelecciones => {
            if (variableSelecciones.length > 0) {
                series *= variableSelecciones.length;
            }
        });

        const periodicidadesSeleccionadas = Object.keys(seleccionesPeriodicidades).length;
        if (series > 0 && periodicidadesSeleccionadas > 0) {
            datos = series * periodicidadesSeleccionadas;
        } else {
            series = 0;
        }

        setNumSeries(series);
        setNumDatos(datos);
    };

    useEffect(() => {
        calcularSeriesYDatos();
    }, [selecciones, seleccionesPeriodicidades]);

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
            const key = periodo.etiqueta ? periodo.etiqueta : `${periodo.dia}-${periodo.mes}-${periodo.ano}`;
            if (prevState[key]) {
                const { [key]: _, ...rest } = prevState;
                return rest;
            } else {
                return { ...prevState, [key]: periodo };
            }
        });
    };

    const handleConsultar = async () => {
        const url_base = `https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/${tablaObj.Id}?`;

        const parametros_url = Object.entries(selecciones)
            .flatMap(([variableId, valores]) =>
                valores.map(valor => `tv=${valor.Variable.Id}:${valor.Id}`)
            )
            .join('&');
        console.log(parametros_url);
        const url_final = url_base + parametros_url;
        console.log(url_final);

        try {
            const seriesJson = await fetch(url_final);
            const series = await seriesJson.json();

            // Filtrar series duplicadas
            const uniqueSeries = [];
            const seenCodes = new Set();

            for (const serie of series) {
                if (!seenCodes.has(serie.COD)) {
                    seenCodes.add(serie.COD);
                    uniqueSeries.push(serie);
                }
            }

            console.log('SeroesPadron, numero de series>', uniqueSeries.length);

            router.push({
                pathname: 'datosPadron',
                params: {
                    tabla: JSON.stringify(tablaObj),
                    series: JSON.stringify(uniqueSeries),
                    periodicidades: JSON.stringify(seleccionesPeriodicidades),
                    valores: JSON.stringify(selecciones),
                },
            });
        } catch (error) {
            console.error('Error fetching series:', error);
        }
    };

    return (
        <Plantilla>
            <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                <ViewStyled className="p-4">

                    <Animated.View style={{ opacity: fadeAnim }}>
                        <TextStyled className="text-2xl text-teal-700 mb-6 font-bold flex items-center">
                            Tabla: {tablaObj.Nombre}
                        </TextStyled>
                    </Animated.View>

                    <TextStyled className="text-sm text-gray-800 mb-4">
                        En esta vista, puedes seleccionar las variables y las periodicidades para consultar los datos disponibles de la tabla seleccionada. Esto te permitirá personalizar tu consulta y visualizar solo los datos que te interesan.
                    </TextStyled>

                    <TextStyled className="text-sm text-gray-800 mb-4">
                        <TextStyled className="font-bold">¿Cómo funciona?</TextStyled> Primero, selecciona los valores correspondientes a cada variable que te interese. Puedes elegir más de un valor por variable.
                    </TextStyled>

                    <TextStyled className="text-sm text-gray-800 mb-4">
                        Luego, selecciona las periodicidades en las que deseas visualizar los datos. El número de series y datos resultantes se calculará automáticamente en función de las selecciones que hayas hecho.
                    </TextStyled>

                    <TextStyled className="text-sm text-gray-800 mb-4">
                        Una vez que hayas realizado tus selecciones, puedes presionar el botón "Consultar Selección" para obtener los resultados filtrados de acuerdo a tus preferencias.
                    </TextStyled>

                    {isLoading ? (
                        <ViewStyled className="flex-1 justify-center items-center mt-4">
                            <TextStyled className="text-lg text-teal-500 mt-2">
                                Cargando...
                            </TextStyled>
                        </ViewStyled>
                    ) : (
                        <>
                            {variables.map((variable) => (
                                <VariableSelection
                                    key={variable.Id}
                                    variable={variable}
                                    valoresVariables={valoresVariables[variable.Id]}
                                    selecciones={selecciones[variable.Id] || []}
                                    handleSelectionChange={handleSelectionChange}
                                    handleSelectAll={handleSelectAll}
                                    className="bg-gray-100 shadow-md rounded-lg mb-4 p-4"
                                />
                            ))}

                            {periodicidad.length > 0 && (
                                <PeriodicidadSelection
                                    periodicidad={periodicidad}
                                    seleccionesPeriodicidades={seleccionesPeriodicidades}
                                    handleSelectionChangePeriodicidad={handleSelectionChangePeriodicidad}
                                    handleSelectAllPeriodicidades={handleSelectAllPeriodicidades}
                                    formatDate={formatDate}
                                    className="bg-gray-100 shadow-md rounded-lg mb-4 p-4"
                                />
                            )}

                            {/* Mostrar el número de series y datos */}
                            <TextStyled className="text-sm text-teal-700 mb-4">
                                Número de series: <TextStyled className="font-bold">{numSeries}</TextStyled> y Número de datos: <TextStyled className="font-bold">{numDatos}</TextStyled>
                            </TextStyled>


                            <TouchableOpacity
                                onPress={handleConsultar}
                                style={{
                                    backgroundColor: '#00695c',
                                    borderRadius: 15,
                                    padding: 15,
                                    alignItems: 'center',
                                    marginVertical: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    transform: [{ scale: pressAnim }]
                                }}
                                disabled={numSeries === 0 || Object.keys(seleccionesPeriodicidades).length === 0}
                                onPressIn={() => Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true }).start()}
                                onPressOut={() => Animated.spring(pressAnim, { toValue: 1, useNativeDriver: true }).start()}
                            >
                                <TextStyled className="text-white font-bold">
                                    Consultar Selección
                                </TextStyled>
                            </TouchableOpacity>
                        </>
                    )}
                </ViewStyled>
            </ScrollViewStyled>
        </Plantilla>
    );
};

export default SeriesTabla;
