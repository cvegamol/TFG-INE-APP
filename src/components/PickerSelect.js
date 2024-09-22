import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { styled } from 'nativewind';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const PickerSelect = ({ label, selectedValue, onValueChange, options }) => {
     return (
          <ViewStyled className="mb-4">
               <TextStyled className="text-gray-700 mb-2 font-semibold">{label}</TextStyled>
               <RNPickerSelect
                    onValueChange={onValueChange}
                    items={options}
                    value={selectedValue}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false} // Desactiva el estilo predeterminado de Android
                    placeholder={{ label: 'Seleccionar...', value: null }}
               />
          </ViewStyled>
     );
};

// Estilos personalizados
const pickerSelectStyles = StyleSheet.create({
     inputIOS: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          color: 'black',
          backgroundColor: '#f0f0f0',
          paddingRight: 30, // Para el icono de flecha
     },
     inputAndroid: {
          fontSize: 16,
          paddingVertical: 12,
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: 'gray',
          borderRadius: 8,
          color: 'black',
          backgroundColor: '#f0f0f0',
          paddingRight: 30, // Para el icono de flecha
     },
});

export default PickerSelect;
