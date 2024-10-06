
import { Text } from "react-native";
import { View } from "react-native";

import { styled } from "nativewind";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TableHeader = ({ firstColumnWidth, periodicidadesObj, otherColumnFixedWidth, formatFecha }) => {
    return (
        <ViewStyled style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TextStyled style={{
                width: firstColumnWidth,
                fontWeight: 'bold',
                backgroundColor: '#0c4a4e',
                color: '#fff',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
            }}>
                Serie
            </TextStyled>
            {Object.keys(periodicidadesObj).map((fechaKey, idx) => {
                const valorMostrado = periodicidadesObj[fechaKey].etiqueta
                    ? periodicidadesObj[fechaKey].etiqueta
                    : formatFecha(periodicidadesObj[fechaKey].ano, periodicidadesObj[fechaKey].mes, periodicidadesObj[fechaKey].dia);

                console.log(`Valor mostrado para la clave ${fechaKey}:`, valorMostrado);

                return (
                    <TextStyled key={idx} style={{
                        width: otherColumnFixedWidth,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        backgroundColor: '#0c4a4e',
                        color: '#fff',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                    }}>
                        {valorMostrado}
                    </TextStyled>
                );
            })}
        </ViewStyled>
    );
};

export default TableHeader;