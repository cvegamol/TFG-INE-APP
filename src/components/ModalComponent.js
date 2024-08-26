
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Modal } from "react-native";
import { Button } from "react-native-elements";
import { styled } from "nativewind";

const TextStyled = styled(Text);
const ModalComponent = ({ modalVisible, setModalVisible, handleFormatSelection }) => {
    const formats = [
        'PDF', 'Excel (XLS)', 'Excel (XLSX)', 'CSV (,)', 'CSV (Tab)',
        'JSON', 'Texto Plano (,)', 'Texto Plano (Tab)', 'Texto Plano (;)'
    ];

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <View style={{ width: 300, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                    <TextStyled style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, textAlign: 'center' }}>
                        Seleccionar formato de exportación
                    </TextStyled>
                    <ScrollView style={{ maxHeight: 300 }}>
                        {formats.map((format) => (
                            <TouchableOpacity key={format} onPress={() => handleFormatSelection(format)}>
                                <TextStyled style={{ padding: 10, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                    {format}
                                </TextStyled>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} buttonStyle={{ marginTop: 10 }} />
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;