import React from "react";
import { Rect, Text } from "react-native-svg";

const CIRCLE_WIDTH = 16;
const PADDING_LEFT = 4;
const CHARACTER_WIDTH = 6;

export const LegendItem = (props) => {
     const { baseLegendItemX, index } = props;
     // Calculamos el centro del círculo y el texto para alinearlos correctamente.
     const centerAlignedCircle = props.legendOffset / 2 - CIRCLE_WIDTH / 2;
     const centerAlignedText = props.legendOffset * 0.65;
     const textLengthOffset = (props.legendText.length * CHARACTER_WIDTH) / 2;
     const legendItemNumber = index + 1;

     return (
          <>
               <Rect
                    width={CIRCLE_WIDTH}
                    height={CIRCLE_WIDTH}
                    fill={props.iconColor}
                    rx={8}
                    ry={8}
                    x={
                         baseLegendItemX * legendItemNumber - (CIRCLE_WIDTH + textLengthOffset)
                    }
                    y={centerAlignedCircle}
               />
               <Text
                    x={
                         baseLegendItemX * legendItemNumber + (PADDING_LEFT - textLengthOffset)
                    }
                    y={centerAlignedText}
                    {...props.labelProps}
               >
                    {props.legendText}
               </Text>
          </>
     );
};
