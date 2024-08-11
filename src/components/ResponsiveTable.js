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
    <ViewStyled className='bg-white items-center' style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          {/* Primera fila en negrita */}
          <Row
            data={headers.map(header => (
              <Text style={[styles.text, styles.boldText]}>{header}</Text>
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
              style={styles.row}
              widthArr={headers.map(() => columnWidth)}
            />
          ))}
        </Table>
      </ScrollView>
    </ViewStyled>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: MARGIN,
  },
  scrollView: {
    alignItems: 'flex-start',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    flexDirection: 'row',
  },
  row: {
    height: 40,
    flexDirection: 'row',
  },
  text: {
    margin: 6,
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  selectedCell: {
    backgroundColor: 'yellow',
  },
});

export default ResponsiveTable;
