import React from 'react';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const AdjustablePicker = ({ selectedValue, onValueChange, options, label }) => {
     const { width } = Dimensions.get('window');

     // Estilos ajustados según el sistema operativo
     const pickerStyles = Platform.select({
          ios: {
               height: 40, // Ajuste de altura para iOS
               width: width * 0.85, // Ajusta el ancho al 85% de la pantalla
          },
          android: {
               height: 50,
               width: width * 0.9, // Ajusta el ancho al 90% de la pantalla en Android
          },
     });

     return (


          <Picker
               selectedValue={selectedValue}
               style={[styles.picker, pickerStyles]} // Combina estilos base con los ajustados
               onValueChange={onValueChange}
          >
               {options.map((option) => (
                    <Picker.Item key={option.value} label={option.label} value={option.value} />
               ))}
          </Picker>

     );
};

const styles = StyleSheet.create({
     picker: {
          backgroundColor: '#f0f0f0', // Fondo gris claro para el Picker
          borderRadius: 8, // Bordes redondeados
     },
});

export default AdjustablePicker;
