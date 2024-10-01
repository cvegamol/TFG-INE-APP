import React from "react";
import { View, ScrollView } from "react-native";
import { G, Rect, Svg, Text } from "react-native-svg";
import AbstractChart from "../AbstractChart";

class StackedBarChart extends AbstractChart {
  static defaultProps = {
    onDataPointClick: () => { },
    formatXLabel: (xLabel) => xLabel,
  };

  // Ajustamos el ancho de las barras para que sean más finas
  getDynamicBarWidth = (dataLength, chartWidth, paddingRight) => {
    const availableBarSpace = chartWidth - paddingRight * 2;
    const maxBarWidth = availableBarSpace / dataLength;
    const minBarWidth = 10; // Definimos un ancho mínimo para las barras
    return Math.max(minBarWidth, Math.min(maxBarWidth, 40)); // Aumentamos el ancho máximo permitido a 40
  };

  getBarRadius = (ret, x) => {
    return this.props.chartConfig.barRadius && ret.length === x.length - 1
      ? this.props.chartConfig.barRadius
      : 0;
  };

  renderBars = ({
    data,
    width,
    height,
    paddingTop,
    paddingRight,
    border,
    colors,
    stackedBar = false,
    verticalLabelsHeightPercentage,
  }) => {
    const barWidth = this.getDynamicBarWidth(data.length, width, paddingRight);
    const ret = [];

    return data.map((x, i) => {
      let h = 0;
      let st = paddingTop;
      const barsAreaHeight = height * verticalLabelsHeightPercentage;

      const sum = this.props.percentile ? x.reduce((a, b) => a + b, 0) : border;

      for (let z = 0; z < x.length; z++) {
        h = barsAreaHeight * (x[z] / sum);
        const y = barsAreaHeight - h + st;
        const xC = paddingRight + (i * (width - paddingRight)) / data.length + barWidth / 2;

        ret.push(
          <Rect
            key={Math.random()}
            x={xC - barWidth / 2} // Ajustamos para centrar las barras
            y={y}
            rx={this.getBarRadius(ret, x)}
            ry={this.getBarRadius(ret, x)}
            width={barWidth}
            height={h}
            fill={colors[z]}
            onPressIn={() => {
              this.props.onDataPointClick({
                index: i,
                value: x[z],
                datasetIndex: z,
                label: this.props.data.labels[i],
                datasetLabel: this.props.data.legend[z],
              });
            }}
          />
        );

        st -= h;
      }

      return ret;
    });
  };

  renderLegend = ({ legend, colors, width, height }) =>
    legend.map((x, i) => {
      return (
        <G key={Math.random()}>
          <Rect
            width="16px"
            height="16px"
            fill={colors[i]}
            rx={8}
            ry={8}
            x={width * 0.71}
            y={height * 0.7 - i * 50}
          />
          <Text
            x={width * 0.78}
            y={height * 0.76 - i * 50}
            {...this.getPropsForLabels()}
          >
            {x}
          </Text>
        </G>
      );
    });

  render() {
    const paddingTop = 15;
    const paddingRight = 60; // Ajustamos para reducir el margen lateral
    const extraRightPadding = 30; // Añadimos este margen adicional al final para evitar corte

    const {
      width, // Ancho pasado como prop
      height,
      style = {},
      data,
      withHorizontalLabels = true,
      withVerticalLabels = true,
      segments = 4,
      decimalPlaces,
      percentile = false,
      verticalLabelsHeightPercentage = 0.75,
      formatYLabel = (yLabel) => yLabel,
      formatXLabel = (xLabel) => xLabel,
      hideLegend = false,
    } = this.props;

    const { borderRadius = 0 } = style;
    let border = 0;

    // Calcular el valor máximo de la suma de las barras
    let max = 0;
    for (let i = 0; i < data.data.length; i++) {
      const actual = data.data[i].reduce((pv, cv) => pv + cv, 0);
      if (actual > max) {
        max = actual;
      }
    }

    border = max;

    const showLegend = !hideLegend && data.legend && data.legend.length !== 0;
    const stackedBar = showLegend;

    // Cálculo dinámico para que sea responsive y permita espacio para el último valor
    const calculatedWidth = Math.max(width, data.labels.length * 60) + extraRightPadding;

    return (
      <ScrollView horizontal={true}>
        <View style={style}>
          <Svg height={height} width={calculatedWidth}>
            {this.renderDefs({
              width: calculatedWidth,
              height,
              ...this.props.chartConfig,
            })}
            <Rect
              width="100%"
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill="url(#backgroundGradient)"
            />

            <G>
              {this.renderHorizontalLines({
                width: calculatedWidth,
                height,
                count: segments,
                paddingTop,
                verticalLabelsHeightPercentage,
              })}
            </G>
            <G>
              {withHorizontalLabels
                ? this.renderHorizontalLabels({
                  width: calculatedWidth,
                  height,
                  count: segments,
                  data: [0, border],
                  paddingTop,
                  paddingRight,
                  decimalPlaces,
                  verticalLabelsHeightPercentage,
                  formatYLabel,
                })
                : null}
            </G>
            <G>
              {withVerticalLabels
                ? this.renderVerticalLabels({
                  width: calculatedWidth,
                  height,
                  labels: data.labels,
                  paddingRight: paddingRight + 12,
                  stackedBar,
                  paddingTop,
                  horizontalOffset: (this.getDynamicBarWidth(data.labels.length, calculatedWidth, paddingRight) / 2),
                  verticalLabelRotation: 270, // Rotación de 270 grados
                  verticalLabelsHeightPercentage,
                  formatXLabel,
                })
                : null}
            </G>
            <G>
              {this.renderBars({
                width: calculatedWidth,
                height,
                data: data.data,
                border,
                colors: this.props.data.barColors,
                paddingTop,
                paddingRight,
                stackedBar,
                verticalLabelsHeightPercentage,
              })}
            </G>
            {showLegend &&
              this.renderLegend({
                width: calculatedWidth,
                height,
                legend: data.legend,
                colors: this.props.data.barColors,
              })}
          </Svg>
        </View>
      </ScrollView>
    );
  }
}

export default StackedBarChart;
