import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, Alert, Modal, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import StackedBarChart from '../../components/graph/stackedBarChart/StackedBarChart';
import PieChart from '../../components/graph/stackedBarChart/PieChart';
import LineChart from '../../components/graph/stackedBarChart/line-chart/LineChart';
import BarChart from '../../components/graph/stackedBarChart/BarChart';
import { CheckBox, Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';
import Plantilla from '../../components/Plantilla';
import ModalComponent from '../../components/ModalComponent';
import Loading from '../../components/Loading';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as XLSX from 'xlsx';
import { AntDesign } from '@expo/vector-icons';


const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);

const { width } = Dimensions.get('window');

const DatosSeries = () => {
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'chart'
    const [selectedVariables, setSelectedVariables] = useState({});
    const [selectedPeriods, setSelectedPeriods] = useState({});
    const [chartType, setChartType] = useState('bar'); // 'bar', 'line'
    const [xAxis, setXAxis] = useState('Periodo'); // Eje X dinámico, por defecto es Periodo
    const [isLoading, setIsLoading] = useState(true);
    const [datosSeries, setDatosSeries] = useState([]);
    const [leyenda, setLeyenda] = useState([]);
    const [htmlContent, setHtmlContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [chartData, setChartData] = useState(null); // Para almacenar los datos del gráfico
    const [isChartModalVisible, setIsChartModalVisible] = useState(false); // Para controlar la visibilidad del modal de gráficos
    const { tabla, series, periodicidades, valores } = useLocalSearchParams();
    const [scale, setScale] = useState(1)
    const seriesObj = useMemo(() => JSON.parse(series), [series]);
    const periodicidadesObj = useMemo(() => JSON.parse(periodicidades), [periodicidades]);
    const tablaObj = JSON.parse(tabla);
    const valoresObj = useMemo(() => JSON.parse(valores), [valores]);
    const noPeriodSelected = Object.keys(selectedPeriods).length === 0;
    const allVariablesSelected = Object.keys(valoresObj).every(variableId =>
        valoresObj[variableId].some(valor => selectedVariables[valor.Id])
    );
    // Contar cuántas variables tienen múltiples valores seleccionados (incluyendo periodicidad)
    const multiSelectedVariablesCount = Object.keys(valoresObj).filter(variableId =>
        valoresObj[variableId].filter(valor => selectedVariables[valor.Id]).length > 1
    ).length;

    // Contar si la periodicidad tiene múltiples valores seleccionados
    const multiSelectedPeriodsCount = Object.keys(selectedPeriods).length > 1;

    // Sumar las variables que tienen múltiples valores seleccionados y la periodicidad
    const multiSelectCount = multiSelectedVariablesCount + (multiSelectedPeriodsCount ? 1 : 0);

    // Condición para habilitar el gráfico circular: solo una "variable" (variables o periodicidad) puede tener múltiples valores
    const isPieChartDisabled = multiSelectCount > 1;

    // Función para manejar la selección del tipo de gráfico
    const handleChartTypeChange = (itemValue) => {
        if (itemValue === 'pie' && isPieChartDisabled) {
            Alert.alert(
                'Restricción',
                'Ha seleccionado más de una variable con varios valores. Solo puede seleccionar este gráfico con una sola variable con varios valores.'
            );
            return;
        }
        setLeyenda([]);//Restablecemos la leyenda
        setChartData(null); // Restablecer los datos del gráfico
        setIsChartModalVisible(false); // Cerrar el modal de gráficos

        setChartType(itemValue); // Cambia el tipo de gráfico si se cumplen las condiciones
    };

    const seriesColors = [
        'rgba(255, 99, 132, 0.8)',  // Rojo
        'rgba(54, 162, 235, 0.8)',  // Azul
        'rgba(75, 192, 192, 0.8)',  // Verde
        'rgba(153, 102, 255, 0.8)', // Morado
        'rgba(255, 159, 64, 0.8)',  // Naranja
        'rgba(255, 205, 86, 0.8)',  // Amarillo
    ];

    const formatFecha = (ano, mes, dia, exportFormat = false) => {
        if (exportFormat) {
            return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
        } else {
            const meses = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
            ];
            return `${dia} de ${meses[mes - 1]} de ${ano}`;
        }
    };

    const formatNumero = (numero) => {
        const num = parseFloat(numero);
        return num % 1 === 0 ? num.toLocaleString('es-ES') : num.toLocaleString('es-ES', { minimumFractionDigits: 1 });
    };

    const firstColumnWidth = width * 0.5;
    const otherColumnFixedWidth = 150;
    const paddingEnd = 20;

    const totalTableWidth = firstColumnWidth + (Object.keys(periodicidadesObj).length * otherColumnFixedWidth) + paddingEnd;

    const generateHtmlContentPaginated = (datos, maxColumnsPerPage = 2, maxRowsPerPage = 16) => {
        const pages = [];
        const numColumns = Object.keys(periodicidadesObj).length;

        for (let colStart = 0; colStart < numColumns; colStart += maxColumnsPerPage) {
            const colEnd = Math.min(colStart + maxColumnsPerPage, numColumns);

            let tableRows = '';
            let currentPageContent = '';

            datos.forEach((serieObj, rowIndex) => {
                if (rowIndex % maxRowsPerPage === 0 && rowIndex !== 0) {
                    currentPageContent +=
                        `<div class="content">
                        <table style="margin-bottom: 20px; border: 1px solid #ddd;">
                            <tr>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Serie</th>
                                ${Object.keys(periodicidadesObj).slice(colStart, colEnd).map((fechaKey) =>
                            `<th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">
                                        ${formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}
                                    </th>`
                        ).join('')}
                            </tr>
                            ${tableRows}
                        </table>
                    </div>
                    <div class="page-break"></div>`;

                    pages.push(currentPageContent);
                    currentPageContent = '';
                    tableRows = '';
                }

                let row = `<tr><td style="padding: 8px; border: 1px solid #ddd;">${serieObj.serie}</td>`;
                serieObj.datos.slice(colStart, colEnd).forEach((datoObj) => {
                    row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}</td>`;
                });
                row += '</tr>';
                tableRows += row;
            });

            if (tableRows) {
                currentPageContent +=
                    `<div class="content">
                    <table style="margin-bottom: 20px; border: 1px solid #ddd;">
                        <tr>
                            <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Serie</th>
                            ${Object.keys(periodicidadesObj).slice(colStart, colEnd).map((fechaKey) =>
                        `<th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">
                                    ${formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}
                                </th>`
                    ).join('')}
                        </tr>
                        ${tableRows}
                    </table>
                </div>`;
                pages.push(currentPageContent);
            }
        }

        setHtmlContent(
            `<html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        .content {
                            margin: 20px; 
                            padding: 10px; 
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            border: 1px solid #ddd; 
                        }
                        th, td {
                            padding: 8px;
                            border: 1px solid #ddd;
                            text-align: left;
                        }
                        .page-break {
                            page-break-after: always;
                        }
                    </style>
                </head>
                <body>
                    ${pages.join('')}
                </body>
            </html>`
        );
    };

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const datos = await Promise.all(
                    seriesObj.map(async (serie) => {
                        const datosSerie = await Promise.all(
                            Object.keys(periodicidadesObj).map(async (fechaKey) => {
                                const { ano, mes, dia } = periodicidadesObj[fechaKey];
                                const formattedDate = `${ano}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}`;

                                try {
                                    const response = await fetch(`https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}&tip=M`);

                                    if (!response.ok) {
                                        console.error(`Error en la solicitud para la fecha ${fechaKey}: ${response.statusText}`);
                                        return { fecha: fechaKey, valor: 'N/A' };
                                    }

                                    const textResponse = await response.text();

                                    if (!textResponse) {
                                        console.warn(`Respuesta vacía para la fecha ${fechaKey}`);
                                        return { fecha: fechaKey, valor: 'N/A' };
                                    }

                                    const data = JSON.parse(textResponse);

                                    if (data?.Data?.length > 0) {
                                        return { fecha: fechaKey, valor: data.Data[0].Valor };
                                    } else {
                                        return { fecha: fechaKey, valor: 'N/A' };
                                    }
                                } catch (error) {
                                    console.error(`Error al obtener datos para la fecha ${fechaKey}:`, error.message);
                                    return { fecha: fechaKey, valor: 'N/A' };
                                }
                            })
                        );
                        return { serie: serie.Nombre, datos: datosSerie };
                    })
                );
                setDatosSeries(datos);
                generateHtmlContentPaginated(datos);
            } catch (error) {
                console.error('Error al obtener las variables:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        obtenerDatos();
    }, [seriesObj, periodicidadesObj]);

    const toggleViewMode = () => {
        setViewMode(viewMode === 'table' ? 'chart' : 'table');
    };

    const handleVariableSelection = (valor, variableId) => {
        const newSelectedVariables = { ...selectedVariables };

        if (newSelectedVariables[valor.Id]) {
            // Si ya está seleccionado, eliminar la selección
            delete newSelectedVariables[valor.Id];
        } else {
            // Si no está seleccionado, agregar la selección completa
            newSelectedVariables[valor.Id] = {
                ...valor,
                variableId, // También almacenamos variableId para uso futuro si es necesario
            };
        }

        // Contar cuántas categorías tienen múltiples selecciones
        let multiSelectCategoriesCount = 0;
        const variableSelectionCounts = {};

        // Contar valores seleccionados por cada variable usando variableId
        for (const selectedVal in newSelectedVariables) {
            const selectedVariableId = newSelectedVariables[selectedVal]?.variableId;
            if (selectedVariableId) {
                if (!variableSelectionCounts[selectedVariableId]) {
                    variableSelectionCounts[selectedVariableId] = 0;
                }
                variableSelectionCounts[selectedVariableId]++;
            }
        }

        // Contar cuántas variables tienen más de un valor seleccionado
        for (const count in variableSelectionCounts) {
            if (variableSelectionCounts[count] > 1) {
                multiSelectCategoriesCount++;
            }
        }

        // Contar las selecciones de periodicidades
        const selectedPeriodCount = Object.keys(selectedPeriods).filter((key) => selectedPeriods[key]).length;
        if (selectedPeriodCount > 1) {
            multiSelectCategoriesCount++;
        }

        // Aplicar la restricción de solo permitir múltiples selecciones en dos categorías
        if (multiSelectCategoriesCount > 2) {
            Alert.alert('Restricción', 'Solo se pueden seleccionar múltiples valores en dos categorías (variables o periodicidades).');
            return;
        }
        console.log(newSelectedVariables);
        setSelectedVariables(newSelectedVariables);
    };

    const handlePeriodSelection = (periodKey) => {
        const periodObj = periodicidadesObj[periodKey];
        if (!periodObj) {
            console.warn(`Periodo no encontrado para la clave ${periodKey}`);
            return;
        }

        // Verificar si el periodo ya está seleccionado
        const isSelected = selectedPeriods[periodKey] !== undefined;

        // Crear un nuevo objeto con las periodicidades seleccionadas
        const newSelectedPeriods = {
            ...selectedPeriods,
            [periodKey]: isSelected ? undefined : periodObj // Almacenar siempre el objeto periodObj o eliminarlo si está seleccionado
        };

        // Filtrar los valores undefined que podrían haberse generado
        const filteredSelectedPeriods = Object.fromEntries(
            Object.entries(newSelectedPeriods).filter(([key, value]) => value !== undefined)
        );

        // Contar cuántas categorías tienen múltiples selecciones
        let multiSelectCategoriesCount = 0;

        // Contar valores seleccionados por cada variable usando variableId
        const variableSelectionCounts = {};
        for (const selectedVal in selectedVariables) {
            const selectedVariableId = selectedVariables[selectedVal]?.variableId;
            if (selectedVariableId) {
                if (!variableSelectionCounts[selectedVariableId]) {
                    variableSelectionCounts[selectedVariableId] = 0;
                }
                variableSelectionCounts[selectedVariableId]++;
            }
        }

        // Contar cuántas variables tienen más de un valor seleccionado
        for (const count in variableSelectionCounts) {
            if (variableSelectionCounts[count] > 1) {
                multiSelectCategoriesCount++;
            }
        }

        // Contar las selecciones de periodicidades
        const selectedPeriodCount = Object.keys(filteredSelectedPeriods).length;
        if (selectedPeriodCount > 1) {
            multiSelectCategoriesCount++;
        }

        // Aplicar la restricción de solo permitir múltiples selecciones en dos categorías
        if (multiSelectCategoriesCount > 2) {
            Alert.alert('Restricción', 'Solo se pueden seleccionar múltiples valores en dos categorías (variables o periodicidades).');
            return;
        }

        setSelectedPeriods(filteredSelectedPeriods);
    };


    const chartConfig = {
        strokeWidth: 2,
        backgroundGradientFrom: '#f7f7f7',
        backgroundGradientTo: '#f7f7f7',
        propsForBackgroundLines: {
            stroke: '#000',
            strokeWidth: 1,
        },
        propsForHorizontalLabels: {
            fontSize: 10,
            fill: '#000',
        },
        propsForLabels: {
            fill: '#000',
        },
        color: (opacity = 1, index) => seriesColors[index % seriesColors.length],

        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },

        decimalPlaces: 0,

    };




    const sortDataset = (dataset) => {
        return dataset.sort((a, b) => {
            if (a < b) return -1;
            if (a > b) return 1;
            return 0;
        });
    };



    const generateChart = async () => {
        try {
            if (noPeriodSelected) {
                Alert.alert('Advertencia', 'Debe seleccionar al menos una periodicidad para generar el gráfico.');
                return;
            }
            else if (!allVariablesSelected) {
                Alert.alert('Advertencia', 'Debe seleccionar al menos un valor para cada variable.');
            }

            const url_base = `https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/${tablaObj.Id}?`;
            const parametros_url = Object.entries(selectedVariables)
                .flatMap(([variableId, objeto]) =>
                    `tv=${objeto.Variable.Id}:${objeto.Id}`
                )
                .join('&');
            const url_final = url_base + parametros_url;

            console.log('URL Final:', url_final);

            const seriesJson = await fetch(url_final);
            const series_variables = await seriesJson.json();

            const datos = await Promise.all(
                series_variables.map(async (serie) => {
                    const datosSerie = await Promise.all(
                        Object.entries(selectedPeriods).map(async ([fechaKey, dateObj]) => {
                            const { ano, mes, dia } = dateObj;
                            const formattedDate = `${ano}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}`;
                            console.log('Fecha:', formattedDate);

                            try {
                                const response = await fetch(`https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}&tip=M`);
                                console.log(`Url:https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}&tip=M`);

                                if (!response.ok) {
                                    console.error(`Error en la solicitud para la fecha ${fechaKey}: ${response.statusText}`);
                                    return { fecha: formattedDate, valor: 'N/A', variables: [] };
                                }

                                const textResponse = await response.text();

                                if (!textResponse) {
                                    console.warn(`Respuesta vacía para la fecha ${fechaKey}`);
                                    return { fecha: formattedDate, valor: 'N/A' };
                                }

                                const data = JSON.parse(textResponse);
                                console.log('asadasda', data)
                                if (data?.Data?.length > 0) {
                                    return { fecha: formattedDate, valor: data.Data[0].Valor, variables: data.MetaData };
                                } else {
                                    return { fecha: formattedDate, valor: 'N/A', variables: [] };
                                }
                            } catch (error) {
                                console.error(`Error al obtener datos para la fecha ${fechaKey}:`, error.message);
                                return { fecha: formattedDate, valor: 'N/A', variables: [] };
                            }
                        })
                    );
                    return { serie: serie.Nombre, datos: datosSerie };
                })
            );

            console.log('Datos finales:', JSON.stringify(datos, null, 2));


            let labels = [];
            let datasets = [];

            if (xAxis === 'Periodo') {
                // Generar etiquetas basadas en los periodos seleccionados
                labels = Object.keys(selectedPeriods).map((key) => {
                    const { ano, mes, dia } = selectedPeriods[key];
                    return `${dia}/${mes}/${ano}`;
                });
                console.log('PPPPPP', labels);

                let groupedDatasets = {};

                datos.forEach((serieObj) => {
                    serieObj.datos.forEach((datoObj) => {
                        // Convertir la fecha del dato al formato "d/m/yyyy"
                        const year = datoObj.fecha.slice(0, 4);  // Extrae los primeros 4 caracteres para el año
                        const month = parseInt(datoObj.fecha.slice(4, 6), 10); // Convierte el mes a número para evitar ceros iniciales
                        const day = parseInt(datoObj.fecha.slice(6, 8), 10);   // Convierte el día a número para evitar ceros iniciales

                        const formattedDate = `${day}/${month}/${year}`;
                        console.log('Fecha formateada de los datos:', formattedDate);

                        // Verificar si la fecha formateada coincide con alguna de las etiquetas generadas (labels)
                        if (labels.includes(formattedDate)) {
                            console.log(`Fecha ${formattedDate} encontrada en labels, agregando al dataset.`);

                            // Si existe, agrupar los datos por fecha
                            if (!groupedDatasets[formattedDate]) {
                                groupedDatasets[formattedDate] = {
                                    label: formattedDate,
                                    data: []
                                };
                            }

                            groupedDatasets[formattedDate].data.push({
                                value: datoObj.valor,
                                fecha: datoObj.fecha,
                                serie: serieObj.serie,
                                color: seriesColors[Object.keys(groupedDatasets).length % seriesColors.length],
                                variables: datoObj.variables
                            });
                        } else {
                            console.log(`Fecha ${formattedDate} no encontrada en labels`);
                        }
                    });
                });

                // Convertir el objeto a un array de datasets
                datasets = Object.values(groupedDatasets);
                //labels = Object.keys(groupedDatasets);
                console.log("Final Labels (después de agrupar):", labels);
                console.log("Final Datasets (después de agrupar):", datasets);
            }

            else {
                // Si el eje X es otra variable (como Sexo, Edad, etc.)
                labels = valoresObj[xAxis]
                    .filter(valor => selectedVariables[valor.Id])
                    .map((valor) => valor.Nombre);

                datasets = labels.map((label) => {
                    const dataset = datos.map(serieObj => {
                        if (serieObj.datos.some(dato =>
                            dato.variables.slice(0, -2).some(variable => variable.Nombre.includes(label))
                        )) {
                            const valoresConFecha = serieObj.datos.map(dato => ({
                                value: dato.valor,
                                fecha: dato.fecha,
                                serie: serieObj.serie,
                                variables: dato.variables,
                                label: label
                            }));
                            return valoresConFecha;
                        }
                        return null;
                    }).filter(data => data !== null);

                    const flatDataset = dataset.flat();

                    if (flatDataset.every(item => item.value !== null && item.value !== undefined)) {
                        return {
                            label: label,
                            data: flatDataset,
                        };
                    } else {
                        console.error(`Dataset inválido para la serie: ${label} con labels: ${labels}`, flatDataset);
                        return null;
                    }
                }).filter(dataset => dataset !== null);

                console.log("Labels:", labels);
                console.log("Datasets:", datasets);
            }
            let leyendaArray = [];  // Inicializar como un array vacío
            const variablesNoEje = Object.entries(selectedVariables).filter(([key]) => key !== xAxis);
            const periodosNoEje = Object.entries(selectedPeriods).filter(([key]) => key !== xAxis);

            const variableConMasDeUnaSeleccion = variablesNoEje.find(([, valor]) => valor.length > 1);
            const periodoConMasDeUnaSeleccion = periodosNoEje.length > 1;

            if (!periodoConMasDeUnaSeleccion && variableConMasDeUnaSeleccion) {
                // Filtrar valores que ya están en las etiquetas (labels)
                leyendaArray = variablesNoEje
                    .map(([_, valor]) => valor.Nombre)
                    .filter(nombre => !labels.includes(nombre));
            } else if (periodoConMasDeUnaSeleccion) {
                leyendaArray = periodosNoEje
                    .map(([key, _]) => {
                        const { ano, mes, dia } = selectedPeriods[key];
                        const nombrePeriodo = `${dia}/${mes}/${ano}`;
                        return nombrePeriodo;
                    })
                    .filter(nombre => !labels.includes(nombre)); // Filtrar los nombres que ya están en las etiquetas
            } else {
                leyendaArray = variablesNoEje
                    .map(([_, valor]) => valor.Nombre)
                    .filter(nombre => !labels.includes(nombre)); // Filtrar los nombres que ya están en las etiquetas
            }

            setLeyenda(leyendaArray);

            console.log(leyenda)


            console.log("Final Dataset:", { labels, datasets });

            if (chartType === 'line') {
                // Reestructuración de datasets para el formato correcto
                let reorganizedDatasets = [];

                if (datasets.length > 0) {
                    // Determinamos la longitud de los datos de la primera serie
                    const dataLength = datasets[0].data.length;

                    for (let i = 0; i < dataLength; i++) {
                        let newDataArray = datasets.map((dataset, datasetIndex) => ({
                            value: dataset.data[i].value, // Extraer el valor
                            fecha: dataset.data[i].fecha, // Mantener la fecha formateada
                            serie: dataset.data[i].serie, // Mantener el nombre de la serie
                            color: seriesColors[datasetIndex % seriesColors.length], // Asignar color basado en el índice
                        }));

                        reorganizedDatasets.push({
                            data: newDataArray, // Guardar el array completo con objetos
                        });
                    }
                }

                // Configuramos el chartData con los datasets reorganizados
                const chartData = {
                    labels: labels,
                    datasets: reorganizedDatasets.map((dataset, datasetIndex) => ({
                        data: dataset.data.map(item => item.value), // Extraer solo los valores para el gráfico
                        originalData: dataset.data, // Guardar los objetos completos para acceder a ellos en el click
                        color: (opacity = 1, index) => {
                            const color = dataset.data[index] && dataset.data[index].color;
                            return color ? color : seriesColors[datasetIndex % seriesColors.length]; // Usar el color del dataset o un color por defecto
                        },
                    })),
                };

                console.log("Labels:", labels);
                console.log("Reorganized Datasets:", reorganizedDatasets);
                setChartData(chartData);
                console.log(chartData);
                const scale = determineScale(chartData.datasets.flatMap(dataset => dataset.data));
                setScale(scale);
                setIsChartModalVisible(true);

            } else if (chartType === 'stackedBar') {
                // Para stackedBar no reestructuramos, simplemente agregamos la información necesaria
                console.log('Labels antes de chartData:', labels);

                if (labels.length === 0) {
                    console.warn('Labels está vacío. Verifica la lógica de agrupación de períodos.');
                    return;
                }
                const chartData = {

                    labels: labels,
                    datasets: datasets.map((dataset, datasetIndex) => {
                        console.log(`Procesando dataset ${dataset.label} (Índice: ${datasetIndex})`); // Log para cada dataset

                        const processedData = dataset.data.map((d, dataIndex) => {
                            console.log(`  - Procesando dato ${dataIndex + 1}:`, {
                                value: d.value,
                                fecha: d.fecha,
                                serie: d.serie
                            }); // Log para cada dato en el dataset

                            // Identificar la variable que no está en el label exterior
                            const variablesNotInLabel = d.variables.filter(variable => !labels.includes(variable.Nombre));
                            const additionalLabel = variablesNotInLabel.map(variable => variable.Nombre).join(", ");

                            return {
                                value: d.value,
                                fecha: d.fecha,  // Agregando la fecha
                                serie: d.serie,   // Agregando el nombre de la serie
                                label: `${dataset.label} (${additionalLabel})` // Combinar el label exterior con la variable adicional
                            };
                        });

                        return {
                            label: dataset.label,
                            data: processedData,
                            originalData: dataset.data,  // Mantener los datos originales para acceder a la fecha y la serie
                            color: (opacity = 1) => seriesColors[datasetIndex % seriesColors.length]  // Asigna un color a cada serie
                        };
                    })
                };

                setChartData(chartData);

                const datasetSums = chartData.datasets.map(dataset =>
                    dataset.data.reduce((sum, datum) => {
                        const value = parseFloat(datum.value);
                        if (isNaN(value)) {
                            console.warn(`Valor inválido encontrado: ${datum.value} en serie ${datum.serie} y fecha ${datum.fecha}`);
                            return sum;  // Ignorar valores no numéricos
                        }
                        return sum + value;
                    }, 0)
                );

                console.log('Suma de los datasets:', datasetSums);

                // Ahora toma el valor más grande para determinar la escala
                const maxSum = Math.max(...datasetSums);

                console.log('Valor máximo entre los datasets:', maxSum);

                const scale = determineScale([maxSum]);

                console.log('Escala determinada:', scale);
                console.log(scale)
                setScale(scale);
                setIsChartModalVisible(true);
            } else if (chartType === 'pie') {

                console.log("Labels/Pie:", labels);
                console.log("Datasets/Pie:", datasets);
                // Reorganizar datos para el gráfico de pie
                let pieData;
                if (xAxis === 'Periodo') {
                    pieData = datasets.map((datasetObj, index) => {
                        console.log('ah', datasetObj.label);  // Verifica qué hay dentro de datasetObj

                        return datasetObj.data.map((dataObj) => {
                            console.log(dataObj.serie)
                            // Accedemos a cada campo dentro de 'data' de cada datasetObj
                            return {
                                name: datasetObj.label,  // Usamos el label del dataset para el nombre
                                value: parseFloat(dataObj.value),  // Accedemos a 'value' dentro de dataObj
                                color: dataObj.color,  // Accedemos a 'color' dentro de dataObj
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 12,
                                fecha: dataObj.fecha,  // Accedemos a 'fecha' dentro de dataObj
                                serieName: dataObj.serie  // Accedemos a 'serie' dentro de dataObj
                            };
                        });
                    }).flat();

                } else {
                    pieData = datos.map((serieObj, index) => {
                        return serieObj.datos.map((datoObj) => {
                            console.log(serieObj)
                            return {
                                name: datasets[index].label,  // Aquí asignamos el nombre de la serie correctamente
                                value: parseFloat(datoObj.valor),  // Asegurarnos de que el valor sea un número
                                color: seriesColors[index % seriesColors.length],
                                legendFontColor: "#7F7F7F",
                                legendFontSize: 12,
                                fecha: datoObj.fecha,
                                serieName: serieObj.serie // También asignamos correctamente el nombre de la serie
                            };
                        });
                    }).flat();

                }


                console.log("Datos para gráfico circular:", pieData);

                setChartData(pieData);
                setIsChartModalVisible(true);
            }
            else if (chartType === 'bar') {
                console.log("Labels/Bar:", labels);
                console.log("Datasets/Bar:", datasets);

                // Reestructuramos los datos manteniendo la información adicional (serie, fecha) en el mismo formato
                const reorganizedDatasets = datasets.map((dataset, datasetIndex) => {
                    if (!dataset || !dataset.data) {
                        console.error(`El dataset en el índice ${datasetIndex} no tiene datos`);
                        return null;
                    }

                    return {
                        data: dataset.data.map((d, dataIndex) => {
                            return {
                                value: parseFloat(d.value), // Asegurarse de que el valor sea numérico
                                fecha: d.fecha, // Mantener la fecha
                                serie: d.serie, // Mantener el nombre de la serie
                                color: seriesColors[datasetIndex % seriesColors.length] // Asignar color basado en el índice
                            };
                        }),
                    };
                }).filter(dataset => dataset !== null); // Filtrar datasets vacíos

                // Configuramos los datos del gráfico manteniendo el formato original
                const chartData = {
                    labels: labels, // Las etiquetas para el eje X
                    datasets: reorganizedDatasets.map((dataset, datasetIndex) => ({
                        data: dataset.data.map(item => item.value), // Solo pasamos los valores para el gráfico
                        originalData: dataset.data, // Guardamos los datos originales para acceder a ellos en el click (fecha, serie, etc.)
                        color: () => seriesColors[datasetIndex % seriesColors.length], // Asignar el color correspondiente
                        strokeWidth: 2 // Grosor de las barras
                    }))
                };

                console.log('Datos transformados para BarChart:', chartData);
                const scale = determineScale(chartData.datasets.flatMap(dataset => dataset.data));
                console.log('Escala', scale);

                // Configurar los datos del gráfico
                setChartData(chartData);
                setScale(scale);
                setIsChartModalVisible(true);
            }


        } catch (error) {
            console.error('Error generando el gráfico:', error);
        }
    };

    const truncateLabel = (label, maxLength = 8) => {
        return label.length > maxLength ? `${label.slice(0, maxLength)}...` : label;
    };
    const determineScale = (data) => {
        const maxValue = Math.max(...data.map(d => Math.abs(d)));
        if (maxValue >= 1.0e9) {
            return 1.0e9; // Escala en miles de millones (Billions)
        } else if (maxValue >= 1.0e6) {
            return 1.0e6; // Escala en millones (Millions)
        } else if (maxValue >= 1.0e3) {
            return 1.0e3; // Escala en miles (Thousands)
        } else {
            return 1; // Sin escala (valores pequeños)
        }
    };


    const formatYLabel = (value, scale) => {
        console.log('Format', value, scale)
        switch (scale) {
            case 1.0e9:
                console.log('Format', `${(value / 1.0e9).toFixed(1)}B`)
                return `${(value / 1.0e9).toFixed(1)}B`;
            case 1.0e6:
                console.log('Format', `${(value / 1.0e6).toFixed(1)}M`)

                return `${(value / 1.0e6).toFixed(1)}M`;
            case 1.0e3:
                return `${(value / 1.0e3).toFixed(1)}k`;
            default:
                return value.toString();
        }
    };
    const handleBarPress = (datum) => {
        const formattedValue = new Intl.NumberFormat('es-ES').format(datum.value);
        const formattedDate = `${datum.fecha.slice(6, 8)}/${datum.fecha.slice(4, 6)}/${datum.fecha.slice(0, 4)}`;



        Alert.alert(
            'Información del segmento',
            `Serie: ${datum.serie}\nFecha: ${formattedDate}\nValor: ${formattedValue}`,
            [{ text: 'OK' }]
        );
    };

    const renderStackedBarChart = () => {
        return (
            <StackedBarChart
                style={{
                    marginVertical: 8,
                    borderRadius: 10,
                }}
                data={{
                    labels: chartData.labels,
                    legend: leyenda,
                    data: chartData.datasets.map(dataset => dataset.data.map(d => d.value)),
                    barColors: seriesColors,
                }}
                width={Dimensions.get("window").width * 0.83}
                height={320}
                formatYLabel={(value) => formatYLabel(value, scale)}
                formatXLabel={(label) => truncateLabel(label)}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    showValuesOnTopOfBars: false, // Asegúrate de que no se muestren los valores sobre las barras
                    verticalLabelRotation: 270,
                    // Rotación de las etiquetas del eje X a 270 grados
                }}
                xLabelsOffset={30}
                hideLegend={true}
                onDataPointClick={(datum) => {
                    const { datasetIndex, index } = datum;
                    const clickedData = chartData.datasets[index].originalData[datasetIndex];

                    if (clickedData) {
                        handleBarPress(clickedData);
                    } else {
                        console.error('No se encontraron datos originales para el punto clicado.');
                    }
                }}
            />
        );
    };

    const handlePieSegmentClick = (dataPoint) => {
        const { index } = dataPoint;  // Desestructuramos el índice del segmento

        // Acceder al dato original a partir del índice del segmento
        const clickedData = chartData[index];  // chartData es el array completo de pieData

        // Desestructurar las propiedades del objeto original
        const { value, fecha, color, serieName } = clickedData;

        // Formatear el valor para que se vea de manera clara en el Alert
        const formattedValue = new Intl.NumberFormat('es-ES').format(value);

        // Formatear la fecha
        const formattedDate = `${fecha.slice(6, 8)}/${fecha.slice(4, 6)}/${fecha.slice(0, 4)}`;

        // Mostrar un Alert con la información completa del segmento seleccionado
        Alert.alert(
            'Segmento seleccionado',
            `Serie: ${serieName}\nFecha: ${formattedDate}\nValor: ${formattedValue}`,
            [{ text: 'OK' }]
        );
    };
    const renderPieChart = () => {
        return (
            <PieChart
                data={chartData}
                accessor={"value"}  // Ajusta el nombre del campo con el valor numérico
                width={Dimensions.get("window").width * 0.83} // Ajustar al 85% del ancho de la pantalla
                height={320}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: '#eff3ff',
                    backgroundGradientTo: '#efefef',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,  // Añade esta línea

                }}
                onDataPointClick={handlePieSegmentClick}
                hasLegend={false}  // Desactivar la leyenda
                center={[Dimensions.get("window").width * 0.15, 0]}

            />
        );
    };
    const renderBarChart = () => {
        if (!chartData) {
            return <TextStyled className="text-center mt-4">No hay datos para mostrar.</TextStyled>;
        }
        // console.log('aaaa', chartData.labels)
        // const transformedData = {
        //     labels: chartData.labels,
        //     datasets: chartData.datasets.map(dataset => ({
        //         data: dataset.originalData.map(original => original.value),
        //         color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Color de la serie
        //         strokeWidth: 2, // Grosor de la línea del gráfico
        //     })),
        // };

        console.log('Chart Data', chartData)

        return (
            <BarChart
                data={chartData}
                fromZero={true}
                width={Dimensions.get("window").width * 0.83}
                formatYLabel={(value) => formatYLabel(value, scale)}
                height={320}
                chartConfig={{
                    backgroundGradientFrom: '#f7f7f7',
                    backgroundGradientTo: '#f7f7f7',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                    decimalPlaces: 0,
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 10,
                }}
                onDataPointClick={handleDataPointClick} // Pasamos la función para manejar el click
            />

        );
    };

    const handleDataPointClick = (data) => {
        const { value, datasetIndex, valueIndex } = data;
        console.log('AAa', chartData)

        const pointClicked = chartData.datasets[datasetIndex].originalData[valueIndex];
        const fecha = pointClicked.fecha;
        const serie = pointClicked.serie;

        const formattedValue = new Intl.NumberFormat('es-ES').format(value);

        // Formatear la fecha
        const formattedDate = `${fecha.slice(6, 8)}/${fecha.slice(4, 6)}/${fecha.slice(0, 4)}`;

        console.log(pointClicked)
        // Mostrar un alert con el valor de la barra pulsada
        Alert.alert(
            "Valor de la barra",
            `Serie: ${serie}\nFecha: ${formattedDate}\nValor: ${formattedValue}`,
        );
    };



    const renderChart = () => {
        if (!chartData) {
            return <TextStyled className="text-center mt-4">Seleccione variables y periodos para generar el gráfico.</TextStyled>;
        }


        switch (chartType) {
            case 'line':
                return (
                    <LineChart
                        data={chartData}
                        width={Dimensions.get("window").width * 0.83} // Ajustar al 85% del ancho de la pantalla
                        height={320}
                        yLabelsOffset={5}
                        chartConfig={chartConfig}
                        bezier
                        fromZero={true}
                        horizontalLabelRotation={0}
                        verticalLabelRotation={270}
                        xLabelsOffset={30}
                        formatXLabel={(label) => truncateLabel(label)}
                        style={{
                            marginVertical: 8,
                            borderRadius: 10,
                            paddingRight: 40,


                        }}
                        formatYLabel={(value) => formatYLabel(value, scale)}
                        onDataPointClick={(data) => {
                            console.log('Data Point Clicked:', data);

                            const { dataset, index } = data;

                            if (!dataset || index === undefined) {
                                console.error('Dataset o index no encontrado');
                                return;
                            }

                            const clickedData = dataset.originalData[index]; // Acceder a los datos originales

                            if (!clickedData) {
                                console.error('No se encontraron datos originales para el punto clicado.');
                                return;
                            }

                            const serieName = clickedData.serie;
                            const formattedDate = `${clickedData.fecha.slice(6, 8)}/${clickedData.fecha.slice(4, 6)}/${clickedData.fecha.slice(0, 4)}`;

                            const formattedValue = new Intl.NumberFormat('es-ES').format(clickedData.value);


                            Alert.alert(
                                'Información del punto',
                                `Serie: ${serieName}\nFecha: ${formattedDate}\nValor: ${formattedValue}`,
                                [{ text: 'OK' }]
                            );
                        }}
                    />
                );
            case 'stackedBar':
                return renderStackedBarChart();
            case 'pie':
                return renderPieChart();
            case 'bar':
                return renderBarChart();
        }
    };







    const renderView = () => {
        if (viewMode === 'table') {
            return (
                <ViewStyled>
                    <ScrollViewStyled horizontal contentContainerStyle={{ width: Math.max(totalTableWidth, width) }}>
                        <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                            <ViewStyled style={{ padding: 10 }}>
                                <TableHeader
                                    firstColumnWidth={firstColumnWidth}
                                    periodicidadesObj={periodicidadesObj}
                                    otherColumnFixedWidth={otherColumnFixedWidth}
                                    formatFecha={formatFecha}
                                />
                                {datosSeries.map((serieObj, index) => (
                                    <TableRow
                                        key={index}
                                        serieObj={serieObj}
                                        firstColumnWidth={firstColumnWidth}
                                        otherColumnFixedWidth={otherColumnFixedWidth}
                                        index={index}
                                        formatNumero={formatNumero}
                                    />
                                ))}
                            </ViewStyled>
                        </ScrollViewStyled>
                    </ScrollViewStyled>
                </ViewStyled>
            );
        } else {
            return (
                <ScrollViewStyled className="p-4">
                    <ViewStyled>
                        <ViewStyled className="mb-4">
                            <TextStyled className="font-bold mb-2">Seleccionar variables...</TextStyled>

                            {Object.keys(valoresObj).map((variableId) => (
                                <ViewStyled key={variableId}>
                                    <TextStyled className="font-bold">{valoresObj[variableId][0]?.Variable?.Nombre}</TextStyled>
                                    {valoresObj[variableId].map((valor) => (
                                        <CheckBox
                                            key={valor.Id}
                                            title={valor.Nombre}
                                            checked={Boolean(selectedVariables[valor.Id])}  // Comprobamos si el valor está en selectedVariables
                                            onPress={() => handleVariableSelection(valor, variableId)}  // Pasamos variableId y valor
                                        />
                                    ))}
                                </ViewStyled>
                            ))}
                        </ViewStyled>


                        <ViewStyled className="mb-4">
                            <TextStyled className="font-bold mb-2">Seleccione los periodos:</TextStyled>
                            {Object.keys(periodicidadesObj).map((periodKey) => (
                                <CheckBox
                                    key={periodKey}
                                    title={`${periodicidadesObj[periodKey].dia}/${periodicidadesObj[periodKey].mes}/${periodicidadesObj[periodKey].ano}`}
                                    checked={selectedPeriods[periodKey] || false}
                                    onPress={() => handlePeriodSelection(periodKey)}
                                />
                            ))}
                        </ViewStyled>

                        <ViewStyled className="mb-4">
                            <TextStyled className="font-bold mb-2">Formato del gráfico</TextStyled>
                            <TextStyled>Eje horizontal:</TextStyled>
                            <Picker
                                selectedValue={xAxis}
                                style={{ height: 50, width: 200 }}
                                onValueChange={(itemValue) => setXAxis(itemValue)}
                            >
                                <Picker.Item label="Periodo" value="Periodo" />
                                {Object.keys(valoresObj).map((variableId) => (
                                    <Picker.Item key={variableId} label={valoresObj[variableId][0]?.Variable?.Nombre} value={variableId} />
                                ))}
                            </Picker>

                            <TextStyled>Tipo de gráfico:</TextStyled>
                            <Picker
                                selectedValue={chartType}
                                style={{ height: 50, width: 200 }}
                                onValueChange={handleChartTypeChange}  // Usamos la función para manejar la selección del tipo de gráfico
                            >
                                <Picker.Item label="Líneas" value="line" />
                                <Picker.Item label="Barras verticales" value="bar" />
                                <Picker.Item label="Barras horizontales" value="horizontalBar" />
                                <Picker.Item label="Barras Apiladas" value="stackedBar" />
                                <Picker.Item label="Barras Horizontales Apiladas" value="stackedHorizontalBar" />
                                <Picker.Item label="Circular" value="pie" />
                            </Picker>

                            <Button title="Generar Gráfico" onPress={generateChart} />
                        </ViewStyled>
                    </ViewStyled>
                </ScrollViewStyled>
            );
        }
    };

    const generatePDF = async () => {
        if (!htmlContent) {
            Alert.alert('Error', 'El contenido del PDF aún no está listo.');
            return;
        }

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            const pdfName = `${FileSystem.documentDirectory}${tablaObj.Id}.pdf`;
            await FileSystem.moveAsync({
                from: uri,
                to: pdfName,
            });
            await shareAsync(pdfName);
            Alert.alert('PDF guardado', `PDF guardado en: ${pdfName}`);
        } catch (error) {
            console.error('Error al generar PDF:', error);
            Alert.alert('Error', 'Hubo un problema al generar el PDF');
        }
    };

    const generateExcel = async (extension = 'xlsx') => {
        const headers = ['Serie', 'Periodo', 'Valor'];
        const data = [];

        datosSeries.forEach((serieObj) => {
            serieObj.datos.forEach((datoObj) => {
                data.push([serieObj.serie, formatFecha(periodicidadesObj[datoObj.fecha].ano, periodicidadesObj[datoObj.fecha].mes, periodicidadesObj[datoObj.fecha].dia, true), datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor]);
            });
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        const sheetName = tablaObj.Nombre.slice(0, 31);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.${extension}`;
        const excelData = XLSX.write(workbook, { type: 'base64', bookType: extension });

        await FileSystem.writeAsStringAsync(excelFileUri, excelData, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await shareAsync(excelFileUri);
    };

    const generateCSV = async (delimiter = ',') => {
        const headers = ['Serie', 'Periodo', 'Valor'];
        const csvContent = [
            headers.join(delimiter),
            ...datosSeries.flatMap((serieObj) => {
                return serieObj.datos.map((datoObj) => {
                    return [
                        serieObj.serie,
                        formatFecha(periodicidadesObj[datoObj.fecha].ano, periodicidadesObj[datoObj.fecha].mes, periodicidadesObj[datoObj.fecha].dia, true),
                        datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor
                    ].join(delimiter);
                });
            })
        ].join('\n');

        const csvFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.csv`;
        await FileSystem.writeAsStringAsync(csvFileUri, csvContent);
        await shareAsync(csvFileUri);
    };

    const generateJson = async () => {
        const jsonContent = JSON.stringify(datosSeries.flatMap((serieObj) => {
            return serieObj.datos.map((datoObj) => {
                return {
                    Serie: serieObj.serie,
                    Periodo: formatFecha(periodicidadesObj[datoObj.fecha].ano, periodicidadesObj[datoObj.fecha].mes, periodicidadesObj[datoObj.fecha].dia, true),
                    Valor: datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor
                };
            });
        }), null, 2);

        const jsonFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.json`;
        await FileSystem.writeAsStringAsync(jsonFileUri, jsonContent);
        await shareAsync(jsonFileUri);
    };

    const generatePlainText = async (delimiter = '\t') => {
        const headers = ['Serie', 'Periodo', 'Valor'];
        const plainTextContent = [
            headers.join(delimiter),
            ...datosSeries.flatMap((serieObj) => {
                return serieObj.datos.map((datoObj) => {
                    return [
                        serieObj.serie,
                        formatFecha(periodicidadesObj[datoObj.fecha].ano, periodicidadesObj[datoObj.fecha].mes, periodicidadesObj[datoObj.fecha].dia, true),
                        datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor
                    ].join(delimiter);
                });
            })
        ].join('\n');

        const plainTextFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.txt`;
        await FileSystem.writeAsStringAsync(plainTextFileUri, plainTextContent);
        await shareAsync(plainTextFileUri);
    };

    const onSharePress = () => {
        setModalVisible(true);
    };

    const handleFormatSelection = (format) => {
        setModalVisible(false);
        switch (format) {
            case 'PDF': generatePDF(); break;
            case 'Excel (XLS)': generateExcel('xls'); break;
            case 'Excel (XLSX)': generateExcel('xlsx'); break;
            case 'CSV (,)': generateCSV(','); break;
            case 'CSV (Tab)': generateCSV('\t'); break;
            case 'JSON': generateJson(); break;
            case 'Texto Plano (,)': generatePlainText(','); break;
            case 'Texto Plano (Tab)': generatePlainText('\t'); break;
            case 'Texto Plano (;)': generatePlainText(';'); break;
            default: break;
        }
    };

    if (isLoading) {
        return (
            <ViewStyled className="flex-1 justify-center items-center mt-4">
                <Loading size={50} />
                <TextStyled className="text-lg text-gray-500 mt-2">Cargando...</TextStyled>
            </ViewStyled>
        );
    }

    return (
        <Plantilla>
            <ViewStyled className="p-4 bg-gray-100 rounded-lg m-4 shadow-md">
                <ViewStyled className="flex-row justify-center">
                    <Button
                        title={viewMode === 'table' ? 'Ver Gráfico' : 'Ver Tabla'}
                        onPress={toggleViewMode}
                        buttonStyle={{ flex: 1, backgroundColor: '#4CAF50', marginBottom: 20 }}
                    />
                </ViewStyled>
                {renderView()}
            </ViewStyled>
            <Button
                icon={<AntDesign name="sharealt" size={24} color="black" />}
                title=" Compartir"
                onPress={onSharePress}
                buttonStyle={{ backgroundColor: '#4CAF50' }}
            />
            <ModalComponent
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                handleFormatSelection={handleFormatSelection}
            />

            {/* Modal para mostrar la gráfica */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isChartModalVisible}
                onRequestClose={() => setIsChartModalVisible(false)}
            >
                <ViewStyled className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <ViewStyled className="bg-white p-4 rounded-lg shadow-md w-11/12">
                        <TouchableOpacity onPress={() => setIsChartModalVisible(false)}>
                            <TextStyled className="text-right text-blue-500">Cerrar</TextStyled>
                        </TouchableOpacity>

                        {renderChart()}
                    </ViewStyled>
                </ViewStyled>
            </Modal>
        </Plantilla>
    );
};

export default DatosSeries;
