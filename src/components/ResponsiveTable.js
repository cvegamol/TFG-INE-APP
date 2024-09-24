import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { styled } from 'nativewind';

const { width } = Dimensions.get('window');
const MARGIN = 16;

const ViewStyled = styled(View);

const ResponsiveTable = ({ headers, data, selectedCell, onCellPress, fontSize, responsive }) => {
  const numColumns = headers.length;

  // Calcular anchos de columna
  const availableWidth = width * 0.85 - 2 * MARGIN;
  const columnWidth = availableWidth / numColumns;
  const columnWidths = headers.map(() => columnWidth);

  // Si responsive es true, recalcular los anchos basados en el contenido más ancho
  let adjustedColumnWidths = columnWidths;
  if (responsive) {
    // Calcular la longitud máxima de texto por columna
    const maxTextLengthPerColumn = headers.map(header => header.length);

    data.forEach(row => {
      row.forEach((cell, colIndex) => {
        const textLength = String(cell.value).length;
        if (textLength > maxTextLengthPerColumn[colIndex]) {
          maxTextLengthPerColumn[colIndex] = textLength;
        }
      });
    });

    // Calcular anchos de columna basados en la longitud del texto
    const charWidth = fontSize ? fontSize * 0.6 : 10; // Aproximar ancho de carácter
    const padding = 20;

    adjustedColumnWidths = maxTextLengthPerColumn.map(length => length * charWidth + padding);
  }

  const styles = createStyles(fontSize);

  return (
    <ViewStyled className="items-center" style={styles.container}>
      <ScrollView horizontal={responsive || false}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#08373b' }}>
          {/* Fila de encabezado */}
          <Row
            data={headers.map((header, index) => (
              <Text key={index} style={[styles.text, styles.headerText]}>
                {header}
              </Text>
            ))}
            style={styles.head}
            widthArr={adjustedColumnWidths}
          />
          {/* Filas de datos */}
          {data.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              data={row.map((cell, colIndex) => {
                const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
                const cellStyle = [
                  {
                    width: adjustedColumnWidths[colIndex],
                    height: 40,
                    borderRightWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#08373b',
                  },
                  isSelected && styles.selectedCell,
                ];

                if (colIndex === 0) {
                  // Primera columna en negrita y no clickeable
                  return (
                    <View key={colIndex} style={cellStyle}>
                      <Text style={[styles.text, styles.boldText]}>{cell.value}</Text>
                    </View>
                  );
                } else {
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      onPress={() => onCellPress(rowIndex, colIndex, cell)}
                      style={cellStyle}
                    >
                      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text style={styles.text}>{cell.value}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
              })}
              style={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}
              widthArr={adjustedColumnWidths}
            />
          ))}
        </Table>
      </ScrollView>
    </ViewStyled>
  );
};

const createStyles = (fontSize) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingHorizontal: MARGIN,
    },
    head: {
      height: 40,
      backgroundColor: '#0c4a4e',
      flexDirection: 'row',
    },
    rowEven: {
      height: 40,
      flexDirection: 'row',
      backgroundColor: '#d1e7e8',
    },
    rowOdd: {
      height: 40,
      flexDirection: 'row',
      backgroundColor: '#f1f8ff',
    },
    text: {
      margin: 6,
      textAlign: 'center',
      color: '#000',
      ...(fontSize && { fontSize }),
    },
    boldText: {
      fontWeight: 'bold',
      color: '#000',
      ...(fontSize && { fontSize }),
    },
    headerText: {
      fontWeight: 'bold',
      color: '#ffffff',
      ...(fontSize && { fontSize }),
    },
    selectedCell: {
      backgroundColor: '#ffcccb',
    },
  });

export default ResponsiveTable;
