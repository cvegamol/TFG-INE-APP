import { Text } from "react-native";
import { View } from "react-native";
import { styled } from "nativewind";

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const TableRow = ({ serieObj, firstColumnWidth, otherColumnFixedWidth, index, formatNumero }) => {
    return (
        <ViewStyled
            key={index}
            style={{
                flexDirection: 'row',
                marginBottom: 10,
                backgroundColor: index % 2 === 0 ? '#EDEDE9' : '#D5BDAF',  // Alternar entre tonos teal más claros
            }}
        >
            <TextStyled style={{
                width: firstColumnWidth,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                color: '#000',  // Texto negro
            }}>
                {serieObj.serie}  {/* Primera columna */}
            </TextStyled>

            {/* Aplicar los datos de la fila */}
            {serieObj.datos.map((datoObj, idx) => (
                <TextStyled
                    key={`${serieObj.serie}-${idx}`}  // Clave única basada en serieObj
                    style={{
                        width: otherColumnFixedWidth,
                        textAlign: 'center',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        color: '#000',  // Texto negro
                        backgroundColor: 'transparent',  // Mantener transparente para heredar el fondo de la fila
                    }}
                >
                    {datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}
                </TextStyled>
            ))}
        </ViewStyled>
    );
};

export default TableRow;
