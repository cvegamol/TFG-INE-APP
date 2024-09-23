import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { styled } from 'nativewind';

const { width } = Dimensions.get('window');
const MARGIN = 16;

const ViewStyled = styled(View);

const ResponsiveTable = ({ headers, data, selectedCell, onCellPress }) => {
  const availableWidth = width * 0.85 - 2 * MARGIN;
  const numColumns = headers.length;
  const columnWidth = availableWidth / numColumns;

  return (
    <ViewStyled className='items-center' style={styles.container}>

      <Table borderStyle={{ borderWidth: 2, borderColor: '#08373b' }}>
        {/* Primera fila en teal oscuro */}
        <Row
          data={headers.map(header => (
            <Text style={[styles.text, styles.headerText]}>{header}</Text>
          ))}
          style={styles.head}
          widthArr={headers.map(() => columnWidth)}
        />
        {data.map((row, rowIndex) => (
          <Row
            key={rowIndex}
            data={row.map((cell, colIndex) => (
              colIndex === 0 ? ( // Primera columna en negrita y no es clickeable
                <View key={colIndex} style={{ width: columnWidth, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[styles.text, styles.boldText]}>{cell.value}</Text>
                </View>
              ) : (
                <TouchableOpacity
                  key={colIndex}
                  onPress={() => onCellPress(rowIndex, colIndex, cell)}
                  style={[
                    { flex: 1 },
                    selectedCell.row === rowIndex && selectedCell.col === colIndex && styles.selectedCell
                  ]}
                >
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.text}>{cell.value}</Text>
                  </View>
                </TouchableOpacity>
              )
            ))}
            style={rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd}
            widthArr={headers.map(() => columnWidth)}
          />
        ))}
      </Table>

    </ViewStyled>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: MARGIN,
  },
  head: {
    height: 40,
    backgroundColor: '#0c4a4e', // Teal oscuro
    flexDirection: 'row',
  },
  rowEven: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#d1e7e8', // Fila par - Teal claro
  },
  rowOdd: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#f1f8ff', // Fila impar - Gris claro
  },
  text: {
    margin: 6,
    textAlign: 'center',
    color: '#000', // Texto en negro
  },
  boldText: {
    fontWeight: 'bold',
    color: '#000', // Texto en negro para la primera columna
  },
  headerText: {
    fontWeight: 'bold',
    color: '#ffffff', // Texto blanco para la cabecera
  },
  selectedCell: {
    backgroundColor: '#ffcccb', // Celda seleccionada en teal claro
  },
});

export default ResponsiveTable;
