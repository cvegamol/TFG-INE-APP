import Pie from "paths-js/pie";
import React from "react";
import { View } from "react-native";
import { G, Path, Rect, Svg, Text } from "react-native-svg";

import AbstractChart from "../AbstractChart";

class PieChart extends AbstractChart {
     static defaultProps = {
          onDataPointClick: () => { },  // Añade un valor predeterminado para onDataPointClick
     };

     render() {
          const {
               style = {},
               backgroundColor,
               absolute = false,
               hasLegend = true,
               avoidFalseZero = false
          } = this.props;

          const { borderRadius = 0 } = style;

          const chart = Pie({
               center: this.props.center || [0, 0],
               r: 0,
               R: this.props.height / 2.5,
               data: this.props.data,
               accessor: x => {
                    return x[this.props.accessor];
               }
          });

          const total = this.props.data.reduce((sum, item) => {
               return sum + item[this.props.accessor];
          }, 0);

          const slices = chart.curves.map((c, i) => {
               let value;

               if (absolute) {
                    value = c.item[this.props.accessor];
               } else {
                    if (total === 0) {
                         value = "0%";
                    } else {
                         const percentage = Math.round(
                              (100 / total) * c.item[this.props.accessor]
                         );
                         value = percentage + "%";
                         if (avoidFalseZero && percentage === 0) {
                              value = "<1%";
                         } else {
                              value = percentage + "%";
                         }
                    }
               }

               return (
                    <G key={Math.random()}>
                         {/* Cada porción del gráfico es un área clickeable */}
                         <Path
                              d={c.sector.path.print()}
                              fill={c.item.color}
                              onPressIn={() => {
                                   // Llamada a la función onDataPointClick al hacer clic en una porción del gráfico
                                   this.props.onDataPointClick({
                                        index: i,
                                        value: c.item[this.props.accessor],
                                        label: c.item.name,
                                        color: c.item.color
                                   });
                              }}
                         />
                         {hasLegend ? (
                              <Rect
                                   width="16px"
                                   height="16px"
                                   fill={c.item.color}
                                   rx={8}
                                   ry={8}
                                   x={this.props.width / 2.5 - 24}
                                   y={
                                        -(this.props.height / 2.5) +
                                        ((this.props.height * 0.8) / this.props.data.length) * i +
                                        12
                                   }
                              />
                         ) : null}
                         {hasLegend ? (
                              <Text
                                   fill={c.item.legendFontColor}
                                   fontSize={c.item.legendFontSize}
                                   fontFamily={c.item.legendFontFamily}
                                   x={this.props.width / 2.5}
                                   y={
                                        -(this.props.height / 2.5) +
                                        ((this.props.height * 0.8) / this.props.data.length) * i +
                                        12 * 2
                                   }
                              >
                                   {`${value} ${c.item.name}`}
                              </Text>
                         ) : null}
                    </G>
               );
          });

          return (
               <View
                    style={{
                         width: this.props.width,
                         height: this.props.height,
                         padding: 0,
                         ...style
                    }}
               >
                    <Svg width={this.props.width} height={this.props.height}>
                         <G>
                              {this.renderDefs({
                                   width: this.props.height,
                                   height: this.props.height,
                                   ...this.props.chartConfig
                              })}
                         </G>
                         <Rect
                              width="100%"
                              height={this.props.height}
                              rx={borderRadius}
                              ry={borderRadius}
                              fill={backgroundColor}
                         />
                         <G
                              x={
                                   this.props.width / 2 / 2 +
                                   Number(this.props.paddingLeft ? this.props.paddingLeft : 0)
                              }
                              y={this.props.height / 2}
                         >
                              {slices}
                         </G>
                    </Svg>
               </View>
          );
     }
}

export default PieChart;
