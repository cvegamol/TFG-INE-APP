export const Dataset = {
  /** The data corresponding to the x-axis label. */
  data: [],

  /** A function returning the color of the stroke given an input opacity value. */
  color: undefined,

  /** A function returning array of the colors of the stroke given an input opacity value for each data value. */
  colors: undefined,

  /** The width of the stroke. Defaults to 2. */
  strokeWidth: 2,

  /** A boolean indicating whether to render dots for this line */
  withDots: true,

  /** Override of LineChart's withScrollableDot property just for this dataset */
  withScrollableDot: undefined,

  /** Unique key **/
  key: undefined,

  /** Stroke Dash Array */
  strokeDashArray: undefined,

  /** Stroke Dash Offset */
  strokeDashOffset: undefined
};

export const ChartData = {
  /** The x-axis labels */
  labels: [],
  datasets: []
};

export const ChartConfig = {
  backgroundColor: undefined,
  /**
   * Defines the first color in the linear gradient of a chart's background
   */
  backgroundGradientFrom: undefined,
  /**
   * Defines the first color opacity in the linear gradient of a chart's background
   */
  backgroundGradientFromOpacity: undefined,
  /**
   * Defines the second color in the linear gradient of a chart's background
   */
  backgroundGradientTo: undefined,
  /**
   * Defines the second color opacity in the linear gradient of a chart's background
   */
  backgroundGradientToOpacity: undefined,
  /**
   * Defines the previous options to maintain backwards compatibility
   */
  fillShadowGradient: undefined,
  fillShadowGradientOpacity: undefined,
  /**
   * Defines the first color in the linear gradient of the area under data
   */
  fillShadowGradientFrom: undefined,
  /**
   * Defines the first color opacity in the linear gradient of the area under data
   */
  fillShadowGradientFromOpacity: undefined,
  /**
   * Defines the first color offset in the linear gradient of the area under data
   */
  fillShadowGradientFromOffset: undefined,
  /**
   * Defines the second color in the linear gradient of the area under data
   */
  fillShadowGradientTo: undefined,
  /**
   * Defines the second color opacity in the linear gradient of the area under data
   */
  fillShadowGradientToOpacity: undefined,
  /**
   * Defines the second color offset in the linear gradient of the area under data
   */
  fillShadowGradientToOffset: undefined,
  /**
   * Defines the option to use color from dataset to each chart data
   */
  useShadowColorFromDataset: false,
  /**
   * Defines the base color function that is used to calculate colors of labels and sectors used in a chart
   */
  color: undefined,
  /**
   * Defines the function that is used to calculate the color of the labels used in a chart.
   */
  labelColor: undefined,
  /**
   * Defines the base stroke width in a chart
   */
  strokeWidth: 2,
  /**
   * Defines the percent (0-1) of the available width each bar width in a chart
   */
  barPercentage: 1,
  barRadius: 0,
  /**
   * Override styles of the background lines, refer to react-native-svg's Line documentation
   */
  propsForBackgroundLines: {},
  /**
   * Override styles of the labels, refer to react-native-svg's Text documentation
   */
  propsForLabels: {},
  /**
   * Override styles of vertical labels, refer to react-native-svg's Text documentation
   */
  propsForVerticalLabels: {},

  /**
   * Override styles of horizontal labels, refer to react-native-svg's Text documentation
   */
  propsForHorizontalLabels: {},
  /**
   * Override styles of the dots, refer to react-native-svg's Text documentation
   */
  propsForDots: {},
  decimalPlaces: 2,
  style: {},

  /**
   * Define stroke line join type
   */
  linejoinType: "miter",

  /**
   * Define fill color for scrollable dot
   */
  scrollableDotFill: undefined,

  /**
   * Define stroke color for scrollable dot
   */
  scrollableDotStrokeColor: undefined,

  /**
   * Define stroke width for scrollable dot
   */
  scrollableDotStrokeWidth: undefined,

  /**
   * Define radius for scrollable dot
   */
  scrollableDotRadius: undefined,

  /**
   * Override style for additional info view upper scrollable dot
   */
  scrollableInfoViewStyle: {},

  /**
   * Override text style for additional info view upper scrollable dot
   */
  scrollableInfoTextStyle: {},
  scrollableInfoTextDecorator: undefined,

  /**
   * Set Info View offset
   */
  scrollableInfoOffset: undefined,

  /**
   * Set Info View size
   */
  scrollableInfoSize: undefined
};

export const Size = {
  width: 0,
  height: 0
};

export const PartialBy = (obj, keys) => {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }
  keys.forEach((key) => {
    if (result.hasOwnProperty(key)) {
      result[key] = undefined;
    }
  });
  return result;
};