
import {  Text } from "react-native";
import { View } from "react-native";

import { styled } from "nativewind";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TableRow= ({ serieObj, firstColumnWidth, otherColumnFixedWidth, index, formatNumero }) => {
    return (
        <ViewStyled style={{ flexDirection: 'row', marginBottom: 10, backgroundColor: index % 2 === 0 ? '#f2f2f2' : '#ffffff' }}>
            <TextStyled style={{
                width: firstColumnWidth,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
            }}>
                {serieObj.serie}
            </TextStyled>
            {serieObj.datos.map((datoObj, idx) => (
                <TextStyled key={idx} style={{
                    width: otherColumnFixedWidth,
                    textAlign: 'center',
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                }}>
                    {datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}
                </TextStyled>
            ))}
        </ViewStyled>
    );
};

export default TableRow;