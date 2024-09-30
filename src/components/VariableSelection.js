import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';



import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';


const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ScrollViewStyled = styled(ScrollView);
const VariableSelection = ({ variable, valoresVariables, selecciones = [], handleSelectionChange, handleSelectAll }) => {
    const totalValores = valoresVariables?.length || 0;
    const seleccionados = selecciones.length || 0;
    const allSelected = seleccionados === totalValores && totalValores > 0;

    return (
        <ViewStyled className="mb-6 p-4 bg-white rounded-lg shadow-lg"
            style={{ borderBottomWidth: 2, borderBottomColor: '#D1D5DB' }}>
            <ViewStyled className="flex-1">
                <ViewStyled className="flex-row justify-between items-center mb-2">
                    <TextStyled className="text-lg font-semibold text-gray-700 ">
                        {variable.Nombre}
                    </TextStyled>
                    <TouchableOpacity onPress={() => handleSelectAll(variable.Id)}>
                        <Icon
                            name={allSelected ? "checkbox-outline" : "square-outline"}
                            size={24}
                            color="gray"
                        />
                    </TouchableOpacity>
                </ViewStyled>

                <ScrollViewStyled className="max-h-40" nestedScrollEnabled={true}>
                    {valoresVariables?.map((valor) => (
                        <ViewStyled key={valor.Id} className="flex-row items-center">
                            <CheckBox
                                checked={selecciones.includes(valor)}
                                onPress={() => handleSelectionChange(variable.Id, valor)}
                                checkedColor="#00695c"
                            />
                            <TextStyled
                                className="ml-2 flex-1 text-gray-700"
                                numberOfLines={3}
                                ellipsizeMode="tail"
                            >{valor.Nombre}</TextStyled>
                        </ViewStyled>
                    ))}
                </ScrollViewStyled>
                <ViewStyled className="flex-row justify-between mt-2">
                    <TextStyled className="text-sm text-gray-600">
                        Seleccionados: {seleccionados}
                    </TextStyled>
                    <TextStyled className="text-sm text-gray-600">
                        Total: {totalValores}
                    </TextStyled>
                </ViewStyled>
            </ViewStyled>
        </ViewStyled>
    );
};


export default VariableSelection;