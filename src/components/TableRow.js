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
            }}
        >
            {/* Primera columna con su propio fondo */}
            <TextStyled style={{
                width: firstColumnWidth,
                fontWeight: 'bold',
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                color: '#000',
                backgroundColor: index % 2 === 0 ? '#EDEDE9' : '#D5BDAF',  // Aplicar el fondo aquí en lugar de en la fila
            }}>
                {serieObj.serie}
            </TextStyled>

            {/* Otras columnas con el mismo patrón de fondo */}
            {serieObj.datos.map((datoObj, idx) => (
                <TextStyled
                    key={`${serieObj.serie}-${idx}`}
                    style={{
                        width: otherColumnFixedWidth,
                        textAlign: 'center',
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 10,
                        color: '#000',
                        backgroundColor: index % 2 === 0 ? '#EDEDE9' : '#D5BDAF',  // Aplicar el mismo fondo a las demás columnas
                    }}
                >
                    {datoObj.valor !== 'N/A' ? formatNumero(datoObj.valor) : datoObj.valor}
                </TextStyled>
            ))}
        </ViewStyled>
    );
};

export default TableRow;
