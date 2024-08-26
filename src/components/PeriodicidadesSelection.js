import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';



import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';


const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const PeriodicidadSelection = ({ periodicidad, seleccionesPeriodicidades, handleSelectionChangePeriodicidad, handleSelectAllPeriodicidades, formatDate }) => {
    return (
        <ViewStyled className="mb-6 p-4 bg-white rounded-lg shadow-lg"
            style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}>
            <ViewStyled className="flex-1">
                <ViewStyled className="flex-row justify-between items-center mb-2">
                    <TextStyled className="text-lg font-semibold text-gray-700">
                        Periodicidades
                    </TextStyled>
                    <TouchableOpacity onPress={handleSelectAllPeriodicidades}>
                        <Icon
                            name={Object.keys(seleccionesPeriodicidades).length === periodicidad.length ? "checkbox-outline" : "square-outline"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </ViewStyled>
                <ScrollViewStyled className="max-h-40" nestedScrollEnabled={true}>
                    {periodicidad.map((p) => (
                        <ViewStyled key={`${p.dia}-${p.mes}-${p.ano}`} className="flex-row items-center">
                            <CheckBox
                                checked={!!seleccionesPeriodicidades[`${p.dia}-${p.mes}-${p.ano}`]}
                                onPress={() => handleSelectionChangePeriodicidad(p)}
                            />
                            <TextStyled className="ml-2">{formatDate(p.dia, p.mes, p.ano)}</TextStyled>
                        </ViewStyled>
                    ))}
                </ScrollViewStyled>
                <ViewStyled className="flex-row justify-between mt-2">
                    <TextStyled className="text-sm text-gray-600">
                        Seleccionadas: {Object.keys(seleccionesPeriodicidades).length}
                    </TextStyled>
                    <TextStyled className="text-sm text-gray-600">
                        Total: {periodicidad.length}
                    </TextStyled>
                </ViewStyled>
            </ViewStyled>
        </ViewStyled>
    );
};


export default PeriodicidadSelection;