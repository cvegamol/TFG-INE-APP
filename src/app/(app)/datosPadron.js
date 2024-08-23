import React, { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';
import Plantilla from '../../components/Plantilla';
import { useLocalSearchParams } from 'expo-router';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);

const SeriesTabla = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [datosSeries, setDatosSeries] = useState([]);
    const { tabla, series, periodicidades, valores } = useLocalSearchParams();

    const seriesObj = useMemo(() => JSON.parse(series), [series]);
    const periodicidadesObj = useMemo(() => JSON.parse(periodicidades), [periodicidades]);
    const tablaObj = useMemo(() => JSON.parse(tabla), [tabla]);
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
                                
                                console.log(formattedDate)
                                console.log(serie.COD)

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

        obtenerDatos();
    }, [seriesObj, periodicidadesObj]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Plantilla>
            <ScrollViewStyled>
                <ViewStyled>
                    <ViewStyled style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TextStyled style={{ width: wp('30%'), fontWeight: 'bold' }}>Serie</TextStyled>
                        {Object.keys(periodicidadesObj).map((fechaKey, idx) => (
                            <TextStyled key={idx} style={{ width: wp('20%'), fontWeight: 'bold' }}>
                                {fechaKey}
                            </TextStyled>
                        ))}
                    </ViewStyled>

                    {datosSeries.map((serieObj, index) => (
                        <ViewStyled key={index} style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <TextStyled style={{ width: wp('30%'), fontWeight: 'bold' }}>{serieObj.serie}</TextStyled>
                            {serieObj.datos.map((datoObj, idx) => (
                                <TextStyled key={idx} style={{ width: wp('20%') }}>
                                    {datoObj.valor}
                                </TextStyled>
                            ))}
                        </ViewStyled>
                    ))}
                </ViewStyled>
            </ScrollViewStyled>
        </Plantilla>
    );
};

export default SeriesTabla;
