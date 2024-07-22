import React from 'react';
import { View, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { styled } from 'nativewind';

// Obtener el ancho de la pantalla
const { width } = Dimensions.get('window');
const MARGIN = 16; // Márgenes a los lados de la tabla

const ViewStyled = styled(View);

const ResponsiveTable = ({ headers, data }) => {
  // Calcular el ancho total disponible (75% del ancho de la pantalla menos márgenes)
  const availableWidth = width *0.85 - 2 * MARGIN;

  // Calcular el número de columnas y el ancho máximo permitido por columna
  const numColumns = headers.length;
  const columnWidth = availableWidth / numColumns;

  return (
    <ViewStyled className='bg-white items-center' style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollView}>
        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
          {/* Renderizar el encabezado con el estilo de ancho de columna */}
          <Row
            data={headers}
            style={styles.head}
            textStyle={styles.text}
            widthArr={headers.map(() => columnWidth)}
          />
          {/* Renderizar las filas con el estilo de ancho de columna */}
          {data.map((row, index) => (
            <Row
              key={index}
              data={row}
              style={styles.row}
              textStyle={styles.text}
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
});

export default ResponsiveTable;
