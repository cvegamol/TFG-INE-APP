import React from "react";
import { View, ScrollView } from "react-native";
import {
     Defs,
     G,
     LinearGradient,
     Rect,
     Stop,
     Svg,
     Text
} from "react-native-svg";

import AbstractChart from "../AbstractChart";

const barWidth = 32;
const barSpacing = 8; // Espacio entre las barras del mismo label

class BarChart extends AbstractChart {
     getBarPercentage = () => {
          const { barPercentage = 1 } = this.props.chartConfig;
          return barPercentage;
     };

     // Función para calcular la altura de la barra usando el valor máximo de todos los datasets
     calcBaseHeightDef = (value, maxDatasetValue, height) => {
          if (maxDatasetValue === 0 || isNaN(maxDatasetValue)) return 0; // Evita divisiones por 0

          const heightRatio = value / maxDatasetValue;
          return heightRatio * height;
     };

     getDynamicBarWidth = (dataLength, chartWidth, paddingRight) => {
          const availableBarSpace = chartWidth - paddingRight * 2;
          const maxBarWidth = availableBarSpace / dataLength;
          const minBarWidth = 10; // Definimos un ancho mínimo para las barras
          return Math.max(minBarWidth, Math.min(maxBarWidth, 40)); // Ajustamos el ancho máximo
     };

     handleBarClick = (datasetIndex, valueIndex, value) => {
          if (this.props.onDataPointClick) {
               this.props.onDataPointClick({
                    datasetIndex,
                    valueIndex,
                    value
               });
          }
     };

     renderBars = ({
          data,
          width,
          height,
          paddingTop,
          paddingRight,
          barRadius,
          withCustomBarColorFromData
     }) => {
          const numberOfDataSets = data.datasets.length; // Cantidad de datasets
          const totalLabels = data.labels.length; // Número de etiquetas
          const barWidth = this.getDynamicBarWidth(totalLabels, width, paddingRight); // Cálculo dinámico del ancho de las barras

          // Obtener el valor máximo entre todos los datasets
          const getMaxValue = (datasets) => {
               let maxValue = 0;

               datasets.forEach(dataset => {
                    if (Array.isArray(dataset.data)) {
                         const datasetMax = Math.max(...dataset.data); // Asegúrate de que dataset.data sea un array
                         if (datasetMax > maxValue) {
                              maxValue = datasetMax;
                         }
                    } else {
                         console.error("dataset.data no es un array:", dataset.data);
                    }
               });

               return maxValue;
          };

          const maxDatasetValue = getMaxValue(data.datasets); // Valor máximo entre todos los datasets

          // Recorremos los datasets y valores dentro de cada dataset
          return data.datasets.map((dataset, datasetIndex) => {
               return dataset.data.map((value, valueIndex) => {
                    const validValue = value !== undefined && value !== null ? value : 0;

                    // Calcular la altura de la barra basado en maxDatasetValue
                    const barHeight = this.calcBaseHeightDef(validValue, maxDatasetValue, height);

                    if (isNaN(barHeight) || barHeight === undefined) {
                         console.error(`Altura de la barra es NaN o undefined para el dataset ${datasetIndex}, valor ${valueIndex}`);
                         return null;
                    }

                    const xOffset = paddingRight + (datasetIndex * (width - paddingRight)) / totalLabels + valueIndex * barWidth;

                    return (
                         <Rect
                              key={`${datasetIndex}-${valueIndex}`}
                              x={xOffset} // Posicionamos la barra horizontalmente
                              y={((barHeight > 0 ? height - barHeight : height) / 4) * 3 + paddingTop}
                              rx={barRadius} // Borde redondeado
                              width={barWidth} // Ancho de la barra
                              height={(Math.abs(barHeight) / 4) * 3} // Altura de la barra
                              fill={withCustomBarColorFromData ? `url(#customColor_${datasetIndex}_${valueIndex})` : dataset.color(1)}
                              onPress={() => this.handleBarClick(datasetIndex, valueIndex, validValue)} // Añadir evento de click
                         />
                    );
               });
          });
     };

     renderColors = ({ data, flatColor }) => {
          return data.datasets.map((dataset, index) => (
               <Defs key={dataset.key ?? index}>
                    {dataset.colors?.map((color, colorIndex) => {
                         const highOpacityColor = color(1.0);
                         const lowOpacityColor = color(0.1);

                         return (
                              <LinearGradient
                                   id={`customColor_${index}_${colorIndex}`}
                                   key={`${index}_${colorIndex}`}
                                   x1={0}
                                   y1={0}
                                   x2={0}
                                   y2={1}
                              >
                                   <Stop offset="0" stopColor={highOpacityColor} stopOpacity="1" />
                                   {flatColor ? (
                                        <Stop offset="1" stopColor={highOpacityColor} stopOpacity="1" />
                                   ) : (
                                        <Stop offset="1" stopColor={lowOpacityColor} stopOpacity="0" />
                                   )}
                              </LinearGradient>
                         );
                    })}
               </Defs>
          ));
     };

     renderValuesOnTopOfBars = ({
          data,
          width,
          height,
          paddingTop,
          paddingRight
     }) => {
          const numberOfDataSets = data.datasets.length;
          const maxDatasetValue = Math.max(...data.datasets.map(dataset => Math.max(...dataset.data)));

          return data.labels.map((label, i) => {
               return data.datasets.map((dataset, j) => {
                    const barHeight = this.calcBaseHeightDef(dataset.data[i], maxDatasetValue, height);
                    const individualBarWidth = (barWidth * this.getBarPercentage()) / numberOfDataSets;
                    const xOffset =
                         paddingRight +
                         (i * (width - paddingRight)) / data.labels.length +
                         j * individualBarWidth;

                    return (
                         <Text
                              key={`${i}-${j}`}
                              x={xOffset + individualBarWidth / 2}
                              y={((height - barHeight) / 4) * 3 + paddingTop - 1}
                              fill={this.props.chartConfig.color(0.6)}
                              fontSize="12"
                              textAnchor="middle"
                         >
                              {dataset.data[i]}
                         </Text>
                    );
               });
          });
     };

     render() {
          const {
               width,
               height,
               data,
               style = {},
               withHorizontalLabels = true,
               withVerticalLabels = true,
               verticalLabelRotation = 0,
               horizontalLabelRotation = 0,
               withInnerLines = true,
               showBarTops = true,
               withCustomBarColorFromData = false,
               showValuesOnTopOfBars = false,
               flatColor = false,
               segments = 4
          } = this.props;

          const { borderRadius = 0, paddingTop = 16, paddingRight = 64 } = style;

          const numberOfDataSets = data.datasets.length;
          const totalLabels = data.labels.length;
          const barWidth = this.getDynamicBarWidth(totalLabels, width, paddingRight); // Calcular ancho dinámico de barras
          const extraRightPadding = 30; // Margen adicional

          // Calcular el ancho total, asegurando que haya espacio para todas las barras
          const calculatedWidth = Math.max(width, totalLabels * barWidth * numberOfDataSets) + extraRightPadding;

          return (
               <View style={style}>
                    <ScrollView horizontal={true}>
                         <Svg height={height} width={calculatedWidth}>
                              <Rect width="100%" height={height} rx={borderRadius} ry={borderRadius} fill="white" />
                              <G>
                                   {withInnerLines ? this.renderHorizontalLines({ width: calculatedWidth, height, count: segments, paddingTop }) : null}
                              </G>
                              <G>
                                   {withHorizontalLabels
                                        ? this.renderHorizontalLabels({
                                             width: calculatedWidth,
                                             height,
                                             count: segments,
                                             data: data.datasets[0].data,
                                             paddingTop: paddingTop,
                                             paddingRight: paddingRight,

                                        })
                                        : null}
                              </G>
                              <G>
                                   {withVerticalLabels
                                        ? this.renderVerticalLabels({
                                             width: calculatedWidth,
                                             height,
                                             labels: data.labels,
                                             paddingRight: paddingRight,
                                             paddingTop: paddingTop,
                                             horizontalOffset: barWidth / 2
                                        })
                                        : null}
                              </G>
                              <G>
                                   {this.renderBars({
                                        data: data,
                                        width: calculatedWidth,
                                        height: height,
                                        paddingTop: paddingTop,
                                        paddingRight: paddingRight,
                                        withCustomBarColorFromData: withCustomBarColorFromData
                                   })}
                              </G>
                              {showValuesOnTopOfBars && this.renderValuesOnTopOfBars({ data, width: calculatedWidth, height, paddingTop, paddingRight })}
                         </Svg>
                    </ScrollView>
               </View>
          );
     }
}

export default BarChart;
