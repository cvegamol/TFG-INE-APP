import React, { useState } from "react";
import { withExpoSnack } from "nativewind";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { styled } from "nativewind";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useAuth } from "../context/authContext"; // Asegúrate de que la ruta sea correcta

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const TextStyledInput = styled(TextInput);

const ResetPassword = () => {
    const router = useRouter();
    const { resetPassword } = useAuth(); // Utilizar el resetPassword del contexto
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null); // Estado para mostrar mensajes de éxito o error

    const handleResetPassword = async () => {
        const response = await resetPassword(email);
        if (response.success) {
            setMessage("Se ha enviado un correo para restablecer tu contraseña.");
            // Redirigir al usuario a la ruta de inicio de sesión
            router.push('signIn');
        } else {
            setMessage(response.msg || "Ha ocurrido un error. Inténtalo de nuevo.");
        }
    };

    return (
        <ViewStyled className="flex-1 justify-center items-center">

            <ViewStyled className="space-y-6 w-full max-w-sm items-center justify-center px-4">

                <TextStyled
                    style={{ fontSize: hp(3.5) }}
                    className="font-bold tracking-wider text-center text-neutral-800"
                >
                    Recuperar Contraseña
                </TextStyled>

                <ViewStyled
                    style={{ height: hp(6), paddingVertical: hp(0.8) }}
                    className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl w-full"
                >
                    <TextStyledInput
                        onChangeText={setEmail}
                        value={email}
                        style={{ fontSize: hp(2) }}
                        className="flex-1 font-medium text-neutral-800"
                        placeholder="Correo Electrónico"
                        placeholderTextColor="#172554"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </ViewStyled>

                <StyledTouchableOpacity
                    onPress={handleResetPassword}
                    style={{ height: hp(6) }}
                    className="bg-stone-800 rounded-xl justify-center items-center w-full"
                >
                    <TextStyled
                        style={{ fontSize: hp(2.2) }}
                        className="text-white font-bold tracking-wider"
                    >
                        Enviar Correo
                    </TextStyled>
                </StyledTouchableOpacity>

                {message && (
                    <TextStyled
                        style={{ fontSize: hp(2) }}
                        className="text-center text-neutral-800 mt-4"
                    >
                        {message}
                    </TextStyled>
                )}
            </ViewStyled>

        </ViewStyled>
    );
};

export default withExpoSnack(ResetPassword);
