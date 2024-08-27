import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ButtonGroup, CheckBox } from 'react-native-elements';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const ChartComponent = ({ seriesData, periodicidades }) => {
    const [chartType, setChartType] = useState(0); // 0: Barras, 1: Barras Horizontales, 2: Lineal
    const [selectedSeries, setSelectedSeries] = useState(
        seriesData.reduce((acc, serie) => {
            acc[serie.serie] = true; // Marcar todas las series por defecto
            return acc;
        }, {})
    );

    const screenWidth = Dimensions.get("window").width;

    // Filtrar los datos según las series seleccionadas
    const filteredData = {
        labels: Object.keys(periodicidades).map(key =>
            `${periodicidades[key].dia}/${periodicidades[key].mes}/${periodicidades[key].ano}`
        ),
        datasets: seriesData
            .filter(serie => selectedSeries[serie.serie])
            .map(serie => ({
                data: serie.datos.map(dato => parseFloat(dato.valor) || 0),
                label: serie.serie
            }))
    };

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16,
        },
    };

    const handleSelectionChange = (serie) => {
        setSelectedSeries(prevState => ({
            ...prevState,
            [serie]: !prevState[serie]
        }));
    };

    const renderChart = () => {
        switch (chartType) {
            case 0:
                return <BarChart data={filteredData} width={screenWidth} height={220} chartConfig={chartConfig} />;
            case 1:
                return <BarChart data={filteredData} width={screenWidth} height={220} chartConfig={chartConfig} horizontal />;
            case 2:
                return <LineChart data={filteredData} width={screenWidth} height={220} chartConfig={chartConfig} />;
            default:
                return null;
        }
    };

    return (
        <ScrollView>
            <ButtonGroup
                onPress={setChartType}
                selectedIndex={chartType}
                buttons={['Barras', 'Barras Horizontales', 'Lineal']}
                containerStyle={{ marginBottom: 20 }}
            />
            <Text style={{ fontSize: 16, marginBottom: 10 }}>Selecciona las series a incluir en la gráfica:</Text>
            {seriesData.map(serie => (
                <CheckBox
                    key={serie.serie}
                    title={serie.serie}
                    checked={selectedSeries[serie.serie]}
                    onPress={() => handleSelectionChange(serie.serie)}
                />
            ))}
            {renderChart()}
        </ScrollView>
    );
};

export default ChartComponent;