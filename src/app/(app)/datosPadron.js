import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, Alert, Modal, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
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

const { width } = Dimensions.get('window');

const SeriesTabla = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [datosSeries, setDatosSeries] = useState([]);
    const [htmlContent, setHtmlContent] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const { tabla, series, periodicidades, valores } = useLocalSearchParams();

    const seriesObj = useMemo(() => JSON.parse(series), [series]);
    const periodicidadesObj = useMemo(() => JSON.parse(periodicidades), [periodicidades]);
    const tablaObj = JSON.parse(tabla);
    const valoresObj = useMemo(() => JSON.parse(valores), [valores]);

    const formatFecha = (ano, mes, dia) => {
        const meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        return `${dia} de ${meses[mes - 1]} de ${ano}`;
    };

    const formatNumero = (numero) => {
        const num = parseFloat(numero);
        return num % 1 === 0 ? num.toLocaleString('es-ES') : num.toLocaleString('es-ES', { minimumFractionDigits: 1 });
    };
     const firstColumnWidth = width * 0.5;
    const otherColumnFixedWidth = 150;
    const paddingEnd = 20;

    const totalTableWidth = firstColumnWidth + (Object.keys(periodicidadesObj).length * otherColumnFixedWidth) + paddingEnd;

    const generateHtmlContentPaginated = (datos, maxColumnsPerPage = 2, maxRowsPerPage = 10) => {
        const pages = [];
        const numColumns = Object.keys(periodicidadesObj).length;

        for (let colStart = 0; colStart < numColumns; colStart += maxColumnsPerPage) {
            const colEnd = Math.min(colStart + maxColumnsPerPage, numColumns);

            let tableRows = '';

            datos.forEach((serieObj, rowIndex) => {
                if (rowIndex % maxRowsPerPage === 0 && rowIndex !== 0) {
                    // Nueva página cuando se supera el número máximo de filas
                    pages.push(`
                        <table>
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
                        <div style="page-break-after: always;"></div>
                    `);
                    tableRows = '';
                }

                let row = `<tr><td style="padding: 8px; border: 1px solid #ddd;">${serieObj.serie}</td>`;
                serieObj.datos.slice(colStart, colEnd).forEach((datoObj) => {
                    row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}</td>`;
                });
                row += '</tr>';
                tableRows += row;
            });

            pages.push(`
                <table>
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
            `);
        }

        setHtmlContent(`
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
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
                    <h2 style="text-align: center;">${tablaObj.Nombre}</h2>
                    ${pages.join('<div class="page-break"></div>')}
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
        const headers = ['Serie', ...Object.keys(periodicidadesObj).map((fechaKey) => formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia))];
        const data = datosSeries.map((serieObj) => {
            const fila = [serieObj.serie];
            serieObj.datos.forEach((datoObj) => {
                fila.push(datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor);
            });
            return fila;
        });

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const workbook = XLSX.utils.book_new();
        const sheetName = tablaObj.Nombre.slice(0, 31);  // Truncar el nombre si excede 31 caracteres
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.${extension}`;
        const excelData = XLSX.write(workbook, { type: 'base64', bookType: extension });

        await FileSystem.writeAsStringAsync(excelFileUri, excelData, {
            encoding: FileSystem.EncodingType.Base64,
        });

        await shareAsync(excelFileUri);
    };

    const generateCSV = async (delimiter = ',') => {
        const headers = ['Serie', ...Object.keys(periodicidadesObj).map((fechaKey) => formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia))];
        const csvContent = [
            headers.join(delimiter),
            ...datosSeries.map((serieObj) => {
                const fila = [serieObj.serie];
                serieObj.datos.forEach((datoObj) => {
                    fila.push(datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor);
                });
                return fila.join(delimiter);
            })
        ].join('\n');

        const csvFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.csv`;
        await FileSystem.writeAsStringAsync(csvFileUri, csvContent);
        await shareAsync(csvFileUri);
    };

    const generateJson = async () => {
        const headers = ['Serie', ...Object.keys(periodicidadesObj).map((fechaKey) => formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia))];
        const jsonContent = JSON.stringify({
            headers,
            data: datosSeries.map((serieObj) => {
                return {
                    Serie: serieObj.serie,
                    Datos: serieObj.datos.map(datoObj => datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor)
                };
            })
        });

        const jsonFileUri = `${FileSystem.documentDirectory}${tablaObj.Id}.json`;
        await FileSystem.writeAsStringAsync(jsonFileUri, jsonContent);
        await shareAsync(jsonFileUri);
    };

    const generatePlainText = async (delimiter = '\t') => {
        const headers = ['Serie', ...Object.keys(periodicidadesObj).map((fechaKey) => formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia))];
        const plainTextContent = [
            headers.join(delimiter),
            ...datosSeries.map((serieObj) => {
                const fila = [serieObj.serie];
                serieObj.datos.forEach((datoObj) => {
                    fila.push(datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor);
                });
                return fila.join(delimiter);
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
                        <ViewStyled style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <TextStyled style={{
                                width: firstColumnWidth,
                                fontWeight: 'bold',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                            }}>
                                Serie
                            </TextStyled>
                            {Object.keys(periodicidadesObj).map((fechaKey, idx) => (
                                <TextStyled key={idx} style={{
                                    width: otherColumnFixedWidth,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    backgroundColor: '#4CAF50',
                                    color: '#fff',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    padding: 10,
                                }}>
                                    {formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}
                                </TextStyled>
                            ))}
                        </ViewStyled>

                        {datosSeries.map((serieObj, index) => (
                            <ViewStyled key={index} style={{ flexDirection: 'row', marginBottom: 10, backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
                                <TextStyled style={{
                                    width: firstColumnWidth,
                                    fontWeight: 'bold',
                                    borderWidth: 1,
                                    borderColor: '#ccc',
                                    padding: 10,
                                }}>
                                    {serieObj.serie}
                                </TextStyled>
                                {serieObj.datos.map((datoObj, idx) => (
                                    <TextStyled key={idx} style={{
                                        width: otherColumnFixedWidth,
                                        textAlign: 'center',
                                        borderWidth: 1,
                                        borderColor: '#ccc',
                                        padding: 10,
                                    }}>
                                        {datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}
                                    </TextStyled>
                                ))}
                            </ViewStyled>
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                        <TextStyled style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, textAlign: 'center' }}>Seleccionar formato de exportación</TextStyled>
                        <ScrollView style={{ maxHeight: 300 }}>
                            {['PDF', 'Excel (XLS)', 'Excel (XLSX)', 'CSV (,)', 'CSV (Tab)', 'JSON', 'Texto Plano (,)', 'Texto Plano (Tab)', 'Texto Plano (;)'].map((format) => (
                                <TouchableOpacity key={format} onPress={() => handleFormatSelection(format)}>
                                    <TextStyled style={{ padding: 10, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                        {format}
                                    </TextStyled>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Cancelar" onPress={() => setModalVisible(false)} buttonStyle={{ marginTop: 10 }} />
                    </View>
                </View>
            </Modal>
        </Plantilla>
    );
};

export default SeriesTabla;
