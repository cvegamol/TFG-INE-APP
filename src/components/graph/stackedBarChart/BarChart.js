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

class BarChart extends AbstractChart {
     getBarPercentage = () => {
          const { barPercentage = 1 } = this.props.chartConfig;
          return barPercentage;
     };

     // Función para calcular la altura de la barra
     calcHeight1 = (value, allData, height) => {
          const maxValue = Math.max(...allData.filter(v => v !== undefined && v !== null)); // Excluir valores undefined/null
          if (maxValue === 0 || isNaN(maxValue)) return 0; // Evita NaN y divisiones por 0

          const heightRatio = value / maxValue;
          return heightRatio * height;
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
          const numberOfDataSets = data.datasets.length; // Cantidad de datasets (número de barras por etiqueta)
          const totalLabels = data.labels.length; // Número de etiquetas (como "Almería", "Araba/Álava", etc.)
          const barFullWidth = barWidth * this.getBarPercentage(); // Ancho completo de una barra
          const baseHeight = this.calcBaseHeight(data.datasets[0].data, height); // Altura base para la primera serie

          // Recorremos los datasets, ya que cada dataset representa un grupo de valores asociados a un label.
          return data.datasets.map((dataset, datasetIndex) => {
               const label = data.labels[datasetIndex]; // Tomamos el label correspondiente a este dataset
               console.log(`\nDataset ${datasetIndex}, Label: ${label}`); // Log para el dataset actual

               // Ahora iteramos sobre los valores dentro de este dataset
               return dataset.data.map((value, valueIndex) => {
                    console.log(`Valor ${valueIndex} del dataset ${datasetIndex} para el label ${label}:`, value);

                    // Verificar si el valor es válido; si es indefinido, usar 0
                    const validValue = value !== undefined && value !== null ? value : 0;

                    // Calcular la altura de la barra
                    const barHeight = this.calcHeight(validValue, dataset.data, height);
                    console.log('Altura de la barra', barHeight);

                    if (isNaN(barHeight) || barHeight === undefined) {
                         console.error(`Altura de la barra es NaN o undefined para el dataset ${datasetIndex}, label ${label}, valor ${valueIndex}`);
                         return null;
                    }

                    // Calcular el ancho de cada barra (ajustado por dataset y porcentaje de barra)
                    const individualBarWidth = (barFullWidth) / dataset.data.length;

                    // Calcular el desplazamiento en X para cada barra
                    const xOffset =
                         paddingRight +
                         (datasetIndex * (width - paddingRight)) / totalLabels + // Posición de la etiqueta en el eje X
                         valueIndex * individualBarWidth; // Offset para las barras dentro del dataset

                    console.log(`X Offset (Dataset ${datasetIndex}, Label ${label}, Valor ${valueIndex}):`, xOffset);

                    return (
                         <Rect
                              key={`${datasetIndex}-${valueIndex}`}
                              x={xOffset}  // Posicionamos la barra horizontalmente
                              y={
                                   ((barHeight > 0 ? baseHeight - barHeight : baseHeight) / 4) * 3 + // Posición vertical
                                   paddingTop
                              }
                              rx={barRadius}  // Borde redondeado
                              width={individualBarWidth}  // Ancho de la barra
                              height={(Math.abs(barHeight) / 4) * 3}  // Altura de la barra
                              fill={
                                   withCustomBarColorFromData
                                        ? `url(#customColor_${datasetIndex}_${valueIndex})`
                                        : dataset.color(1)  // Aplicamos el color de la barra
                              }
                         />
                    );
               });
          });
     };









     renderColors = ({
          data,
          flatColor
     }) => {
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
          const baseHeight = this.calcBaseHeight(data.datasets[0].data, height); // Calculamos el baseHeight para la primera serie

          return data.labels.map((label, i) => {
               return data.datasets.map((dataset, j) => {
                    const barHeight = this.calcHeight(dataset.data[i], dataset.data, height);
                    const individualBarWidth = (barWidth * this.getBarPercentage()) / numberOfDataSets; // Ajustamos el ancho de cada barra
                    const xOffset =
                         paddingRight +
                         (i * (width - paddingRight)) / data.labels.length +
                         j * individualBarWidth; // Ajustamos el offset de cada barra dentro de un label

                    const renderLabel = (value) => {
                         if (this.props.chartConfig.formatTopBarValue) {
                              return this.props.chartConfig.formatTopBarValue(value);
                         } else {
                              return value;
                         }
                    };

                    return (
                         <Text
                              key={`${i}-${j}`}
                              x={xOffset + individualBarWidth / 2}
                              y={((baseHeight - barHeight) / 4) * 3 + paddingTop - 1}
                              fill={this.props.chartConfig.color(0.6)}
                              fontSize="12"
                              textAnchor="middle"
                         >
                              {renderLabel(dataset.data[i])}
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

          const config = {
               width,
               height,
               verticalLabelRotation,
               horizontalLabelRotation,
               barRadius:
                    (this.props.chartConfig && this.props.chartConfig.barRadius) || 0,
               decimalPlaces:
                    (this.props.chartConfig && this.props.chartConfig.decimalPlaces) ?? 2,
               formatYLabel:
                    (this.props.chartConfig && this.props.chartConfig.formatYLabel) ||
                    function (label) {
                         return label;
                    },
               formatXLabel:
                    (this.props.chartConfig && this.props.chartConfig.formatXLabel) ||
                    function (label) {
                         return label;
                    }
          };

          const numberOfDataSets = data.datasets.length; // Cantidad de datasets (número de barras por etiqueta)
          const totalLabels = data.labels.length; // Número de etiquetas (como "Mujeres", "Hombres", etc.)
          const barFullWidth = barWidth * this.getBarPercentage(); // Ancho completo de una barra

          const calculatedWidth = Math.max(width, totalLabels * barFullWidth * numberOfDataSets);


          console.log('Width', calculatedWidth)
          return (
               <View style={style}>
                    <ScrollView horizontal={true}>
                         <Svg height={height} width={calculatedWidth}>
                              {this.renderDefs({
                                   ...config,
                                   ...this.props.chartConfig
                              })}
                              {this.renderColors({
                                   ...this.props.chartConfig,
                                   flatColor: flatColor,
                                   data: this.props.data
                              })}
                              <Rect
                                   width="100%"
                                   height={height}
                                   rx={borderRadius}
                                   ry={borderRadius}
                                   fill="url(#backgroundGradient)"
                              />
                              <G>
                                   {withInnerLines
                                        ? this.renderHorizontalLines({
                                             ...config,
                                             count: segments,
                                             paddingTop
                                        })
                                        : null}
                              </G>
                              <G>
                                   {withHorizontalLabels
                                        ? this.renderHorizontalLabels({
                                             ...config,
                                             count: segments,
                                             data: data.datasets[0].data,
                                             paddingTop: paddingTop,
                                             paddingRight: paddingRight
                                        })
                                        : null}
                              </G>
                              <G>
                                   {withVerticalLabels
                                        ? this.renderVerticalLabels({
                                             ...config,
                                             labels: data.labels,
                                             paddingRight: paddingRight,
                                             paddingTop: paddingTop,
                                             horizontalOffset: barWidth * this.getBarPercentage()
                                        })
                                        : null}
                              </G>
                              <G>
                                   {this.renderBars({
                                        ...config,
                                        data: data,
                                        paddingTop: paddingTop,
                                        paddingRight: paddingRight,
                                        withCustomBarColorFromData: withCustomBarColorFromData
                                   })}
                              </G>
                              <G>
                                   {showValuesOnTopOfBars &&
                                        this.renderValuesOnTopOfBars({
                                             ...config,
                                             data: data,
                                             paddingTop: paddingTop,
                                             paddingRight: paddingRight
                                        })}
                              </G>
                         </Svg>
                    </ScrollView>
               </View>
          );
     }
}

export default BarChart;
