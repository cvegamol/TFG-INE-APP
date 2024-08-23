import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, Dimensions, Alert } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams } from 'expo-router';
import Loading from '../../components/Loading';
import { Button } from 'react-native-elements';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

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
    const { tabla, series, periodicidades, valores } = useLocalSearchParams();

    const seriesObj = useMemo(() => JSON.parse(series), [series]);
    const periodicidadesObj = useMemo(() => JSON.parse(periodicidades), [periodicidades]);
    const tablaObj = JSON.parse(tabla);
    const valoresObj = useMemo(() => JSON.parse(valores), [valores]);

    useEffect(() => {
        const obtenerDatos = async () => {
            try {
                const datos = await Promise.all(
                    seriesObj.map(async (serie) => {
                        const datosSerie = await Promise.all(
                            Object.keys(periodicidadesObj).map(async (fechaKey) => {
                                const { ano, mes, dia } = periodicidadesObj[fechaKey];
                                const formattedDate = `${ano}${mes.toString().padStart(2, '0')}${dia.toString().padStart(2, '0')}`;

                                console.log(formattedDate);
                                console.log(serie.COD);

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
            } catch (error) {
                console.error('Error al obtener las variables:', error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const generateHtmlContent = (datos) => {
            let tableRows = '';

            datos.forEach((serieObj) => {
                let row = `<tr><td style="padding: 8px; border: 1px solid #ddd;">${serieObj.serie}</td>`;
                serieObj.datos.forEach((datoObj) => {
                    row += `<td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}</td>`;
                });
                row += '</tr>';
                tableRows += row;
            });

            const tableHeaders = Object.keys(periodicidadesObj).map((fechaKey) => {
                return `<th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">${formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia)}</th>`;
            }).join('');

            const html = `
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
                        </style>
                    </head>
                    <body>
                        <h2 style="text-align: center;">${tablaObj.Nombre}</h2>
                        <table>
                            <tr>
                                <th style="padding: 8px; border: 1px solid #ddd; background-color: #4CAF50; color: white;">Serie</th>
                                ${tableHeaders}
                            </tr>
                            ${tableRows}
                        </table>
                    </body>
                </html>
            `;

            setHtmlContent(html);
        };

        obtenerDatos().then(() => {
            generateHtmlContent(datosSeries);
        });
    }, [seriesObj, periodicidadesObj]);

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

    const firstColumnWidth = width * 0.5;  // 50% del ancho de la pantalla para la primera columna
    const otherColumnFixedWidth = 150;  // Ancho fijo para cada columna de fecha
    const paddingEnd = 20;  // Añadir un pequeño margen al final

    const totalTableWidth = firstColumnWidth + (Object.keys(periodicidadesObj).length * otherColumnFixedWidth) + paddingEnd;

    const generatePDF = async () => {
        if (!htmlContent) {
            Alert.alert('Error', 'El contenido del PDF aún no está listo.');
            return;
        }

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            const pdfName = `${FileSystem.documentDirectory}${tablaObj.Nombre}.pdf`;
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
            <Button title="Compartir PDF" onPress={generatePDF} />
        </Plantilla>
    );
};

export default SeriesTabla;
