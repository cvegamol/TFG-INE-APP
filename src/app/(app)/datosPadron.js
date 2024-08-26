import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, Alert, Modal, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import ModalComponent from '../../components/ModalComponent';
import { useLocalSearchParams } from 'expo-router';
import Loading from '../../components/Loading';
import { Button } from 'react-native-elements';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as XLSX from 'xlsx';
import { AntDesign } from '@expo/vector-icons';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';

const { width } = Dimensions.get('window');

const DatosSeries = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [datosSeries, setDatosSeries] = useState([]);
    const [htmlContent, setHtmlContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
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
            let currentPageContent = ''; // Variable para almacenar el contenido de la página actual

            datos.forEach((serieObj, rowIndex) => {
                if (rowIndex % maxRowsPerPage === 0 && rowIndex !== 0) {
                    // Nueva página cuando se supera el número máximo de filas
                    currentPageContent += `
                    <div class="content">
                        <table style="margin-bottom: 20px; border: 1px solid #ddd;">
                            <tr>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Serie</th>
                                ${Object.keys(periodicidadesObj).slice(colStart, colEnd).map((fechaKey) => `
                                    <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">
                                        ${formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}
                                    </th>
                                `).join('')}
                            </tr>
                            ${tableRows}
                        </table>
                    </div>
                    <div class="page-break"></div>
                `;

                    pages.push(currentPageContent); // Añadir el contenido de la página actual al array de páginas
                    currentPageContent = ''; // Reiniciar el contenido de la página para la próxima
                    tableRows = ''; // Reiniciar las filas de la tabla para la próxima página
                }

                let row = `<tr><td style="padding: 8px; border: 1px solid #ddd;">${serieObj.serie}</td>`;
                serieObj.datos.slice(colStart, colEnd).forEach((datoObj) => {
                    row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}</td>`;
                });
                row += '</tr>';
                tableRows += row;
            });

            // Añadir la última tabla de la página actual
            if (tableRows) {
                currentPageContent += `
                <div class="content">
                    <table style="margin-bottom: 20px; border: 1px solid #ddd;">
                        <tr>
                            <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Serie</th>
                            ${Object.keys(periodicidadesObj).slice(colStart, colEnd).map((fechaKey) => `
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">
                                    ${formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}
                                </th>
                            `).join('')}
                        </tr>
                        ${tableRows}
                    </table>
                </div>
            `;
                pages.push(currentPageContent); // Añadir el contenido final de la página
            }
        }

        setHtmlContent(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                    }
                    .content {
                        margin: 20px; /* Márgenes laterales y superior/inferior */
                        padding: 10px; /* Relleno dentro del contenido */
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border: 1px solid #ddd; /* Borde de la tabla */
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
        </html>
    `);
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
                                    const response = await fetch(`https://servicios.ine.es/wstempus/js/ES/DATOS_SERIE/${serie.COD}?date=${formattedDate}`);

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
                <TextStyled className="text-lg font-bold text-gray-800 text-center">
                    {tablaObj.Nombre}
                </TextStyled>
            </ViewStyled>
            <ScrollViewStyled contentContainerStyle={{ flexGrow: 1 }}>
                <ScrollViewStyled horizontal contentContainerStyle={{ width: Math.max(totalTableWidth, width) }}>
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
        </Plantilla>
    );
};

export default DatosSeries;
