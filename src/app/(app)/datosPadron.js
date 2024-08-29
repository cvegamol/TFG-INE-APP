import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, Alert, Modal, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { BarChart, LineChart, StackedBarChart, PieChart } from 'react-native-chart-kit';
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
    const [htmlContent, setHtmlContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [chartData, setChartData] = useState(null); // Para almacenar los datos del gráfico
    const [isChartModalVisible, setIsChartModalVisible] = useState(false); // Para controlar la visibilidad del modal de gráficos
    const { tabla, series, periodicidades, valores } = useLocalSearchParams();

    const seriesObj = useMemo(() => JSON.parse(series), [series]);
    const periodicidadesObj = useMemo(() => JSON.parse(periodicidades), [periodicidades]);
    const tablaObj = JSON.parse(tabla);
    const valoresObj = useMemo(() => JSON.parse(valores), [valores]);

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

    const handleVariableSelection = (valor) => {
        const newSelectedVariables = { ...selectedVariables };

        if (newSelectedVariables[valor.Id]) {
            // Si ya está seleccionado, eliminar la selección
            delete newSelectedVariables[valor.Id];
        } else {
            // Si no está seleccionado, agregar la selección completa
            newSelectedVariables[valor.Id] = valor;
        }

        // Contar cuántas categorías tienen múltiples selecciones
        let multiSelectCategoriesCount = 0;
        const variableSelectionCounts = {};

        // Contar valores seleccionados por cada variable
        for (const selectedVal in newSelectedVariables) {
            const selectedVariable = newSelectedVariables[selectedVal]?.Variable?.Id;
            if (selectedVariable) {
                if (!variableSelectionCounts[selectedVariable]) {
                    variableSelectionCounts[selectedVariable] = 0;
                }
                variableSelectionCounts[selectedVariable]++;
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

        // Contar valores seleccionados por cada variable
        const variableSelectionCounts = {};
        for (const selectedVal in selectedVariables) {
            const selectedVariable = selectedVariables[selectedVal]?.Variable?.Id;
            if (selectedVariable) {
                if (!variableSelectionCounts[selectedVariable]) {
                    variableSelectionCounts[selectedVariable] = 0;
                }
                variableSelectionCounts[selectedVariable]++;
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
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        fromZero: true,
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
            // Construimos la URL para poder obtener las series de las variables-valores seleccionados
            const url_base = `https://servicios.ine.es/wstempus/js/ES/SERIES_TABLA/${tablaObj.Id}?`;
            const parametros_url = Object.entries(selectedVariables)
                .flatMap(([variableId, objeto]) =>
                    `tv=${objeto.Variable.Id}:${objeto.Id}`
                )
                .join('&');
            const url_final = url_base + parametros_url;

            console.log('URL Final:', url_final);
            // Obtenemos las series 
            const seriesJson = await fetch(url_final);
            const series_variables = await seriesJson.json();
            // Por último tenemos que obtener los datos de las series
            const datos = await Promise.all(
                series_variables.map(async (serie) => {
                    const datosSerie = await Promise.all(
                        Object.entries(selectedPeriods).map(async ([fechaKey, dateObj]) => {
                            const { ano, mes, dia } = dateObj;
                            const formattedDate = `${ano}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}`;
                            console.log('Fecha:', formattedDate);

                            try {
                                const response = await fetch(`https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}`);
                                console.log(`Url:https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}`);

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
            console.log(JSON.stringify(datos, null, 2));
            let labels = [];
            let datasets = [];

            if (xAxis === 'Periodo') {
                // Generar etiquetas basadas en los periodos seleccionados
                labels = Object.keys(selectedPeriods).map((key) => {
                    const { ano, mes, dia } = selectedPeriods[key];
                    return `${dia}/${mes}/${ano}`;
                });

                // Crear los datasets iniciales
                datasets = datos.map((serieObj, index) => {
                    const matchedVariable = Object.values(selectedVariables).find(variable => serieObj.serie.includes(variable.Nombre));
                    if (matchedVariable) {
                        return {
                            label: serieObj.serie,
                            data: serieObj.datos.map(datoObj => datoObj.valor),
                            color: `rgba(${index * 50}, ${100 + index * 50}, ${200 - index * 50}, 1)`,
                        };
                    }
                    return null;
                }).filter(dataset => dataset !== null);

                // Reorganizar los datasets para agrupar por serie
                let reorganizedDatasets = [];

                // Suponiendo que cada 'data' dentro de datasets tiene la misma longitud
                for (let i = 0; i < datasets[0].data.length; i++) {
                    let newDataArray = datasets.map(dataset => dataset.data[i]);
                    reorganizedDatasets.push(newDataArray);
                }

                // Ahora, reemplazamos los datasets originales con los reorganizados
                datasets = reorganizedDatasets.map((data, index) => {
                    return {
                        label: `Serie ${index + 1}`, // Aquí puedes reemplazar por un nombre más específico si lo deseas
                        data: data,
                        backgroundColor: `rgba(${index * 50}, ${100 + index * 50}, ${200 - index * 50}, 1)`,
                    };
                });

                console.log("Labels:", labels);
                console.log("Reorganized Datasets:", datasets.map(dataset => dataset.data));

            } else {
                // Si el eje X es otra variable (como Sexo, Edad, etc.)

                labels = valoresObj[xAxis]
                    .filter(valor => selectedVariables[valor.Id])
                    .map((valor) => valor.Nombre);

                datasets = labels.map((label) => {
                    // Filtra los datos para obtener solo aquellos que coinciden con el label actual
                    const dataset = datos.map(serieObj => {
                        // Verificamos si la serie actual contiene el nombre de la etiqueta completa
                        if (serieObj.serie.includes(label)) {
                            // Buscamos los valores correspondientes a la etiqueta en la serie actual
                            const valores = serieObj.datos.map(dato => dato.valor);
                            console.log(`Valores para ${label}:`, valores);
                            return valores; // Retornamos los valores correspondientes
                        }
                        return null; // Retorna null si la condición no se cumple
                    }).filter(data => data !== null); // Filtra los valores nulos

                    // Aplanamos el array para tener una estructura plana si es necesario
                    const flatDataset = dataset.flat();

                    // Verificamos que todos los valores sean válidos y no null
                    if (flatDataset.every(value => value !== null && value !== undefined)) {
                        return {
                            label: label,
                            data: flatDataset,
                            color: () => `rgba(${index * 50}, ${100 + index * 50}, ${200 - index * 50}, 1)`,
                        };
                    } else {
                        console.error(`Dataset inválido para la serie: ${label} con labels: ${labels}`, flatDataset);
                        return null;
                    }
                }).filter(dataset => dataset !== null);

                console.log("Labels:", labels);
                console.log("Datasets:", datasets);
            }

            const chartData = {
                labels: labels,
                datasets: datasets.map(dataset => ({
                    data: sortDataset(dataset.data),
                    color: dataset.color,
                })),
            };
            console.log("Labels:", labels);
            console.log("Datasets:", datasets.map(dataset => dataset.data));
            setChartData(chartData);
            setIsChartModalVisible(true);
        } catch (error) {
            console.error('Error generando el gráfico:', error);
        }
    };


    const renderChart = () => {
        if (!chartData) {
            return <TextStyled className="text-center mt-4">Seleccione variables y periodos para generar el gráfico.</TextStyled>;
        }

        switch (chartType) {
            case 'bar':
                return (
                    <BarChart
                        data={chartData}
                        width={width - 32}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero={true}
                    />
                );
            case 'horizontalBar':
                return (
                    <BarChart
                        data={chartData}
                        width={width - 32}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero={true}
                        horizontal={true}
                    />
                );
            case 'stackedBar':
                return (
                    <StackedBarChart
                        data={chartData}
                        width={width - 32}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero={true}
                    />
                );
            case 'pie':
                return (
                    <PieChart
                        data={chartData.datasets.map((dataset, index) => ({
                            name: dataset.label,
                            population: dataset.data.reduce((a, b) => a + b, 0),
                            color: dataset.color(1),
                            legendFontColor: "#7F7F7F",
                            legendFontSize: 15
                        }))}
                        width={width - 32}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                    />
                );
            default:
                return (
                    <LineChart
                        data={chartData}
                        width={width - 32}
                        height={220}
                        yAxisLabel=""
                        chartConfig={chartConfig}
                        verticalLabelRotation={30}
                        fromZero={true}
                    />
                );
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
                                            checked={selectedVariables[valor.Id] || false}
                                            onPress={() => handleVariableSelection(valor)}
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
                                onValueChange={(itemValue) => setChartType(itemValue)}
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
