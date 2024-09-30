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

  // Definir la altura de la celda, con mayor altura si es responsive
  const cellHeight = responsive ? 50 : 40;

  const columnWidths = headers.map(() => columnWidth);

  const styles = createStyles(fontSize, cellHeight);

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
            widthArr={columnWidths}
          />
          {/* Filas de datos */}
          {data.map((row, rowIndex) => (
            <Row
              key={rowIndex}
              data={row.map((cell, colIndex) => {
                const isSelected = selectedCell.row === rowIndex && selectedCell.col === colIndex;
                const cellStyle = [
                  {
                    width: columnWidths[colIndex],
                    height: cellHeight,
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
              widthArr={columnWidths}
            />
          ))}
        </Table>
      </ScrollView>
    </ViewStyled>
  );
};

const createStyles = (fontSize, cellHeight) =>
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
      height: cellHeight,
      flexDirection: 'row',
      backgroundColor: '#d1e7e8',
    },
    rowOdd: {
      height: cellHeight,
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
