import React, { useState } from "react";
import { withExpoSnack } from "nativewind";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { styled } from "nativewind";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import {
  AntDesign,
  FontAwesome6,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";
import { ImageBackground } from "react-native";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TextStyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const PressableStyled = styled(Pressable);

const SignUp = () => {
  const router = useRouter();
  const { register } = useAuth()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",

    name: "",
    surname: "",
  });

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    const { email, password, name, surname } = form;
    if (!email || !password || !name || !surname) {
      Alert.alert("Registro", "Por favor rellena todos los campos.");
      return;
    }
    setLoading(true);
    let response = await register(email, password, name, surname);
    setLoading(false);
    console.log("got result:", response);
    if (!response.success) {
      Alert.alert("Registro", response.msg);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/login/back-registro.png')}
      resizeMode="cover"
      style={{ flex: 1, justifyContent: 'center', paddingHorizontal: wp(5) }} 
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ViewStyled className="flex-1 justify-center items-center">
          <ViewStyled className="bg-white/40 rounded-2xl p-6 mx-auto w-full max-w-md backdrop-blur-xl border-2 border-white">

            <StatusBar style="dark" />
            <ViewStyled className="flex-1 justify-center space-y-6">


              <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                <TextStyled
                  style={{ fontSize: hp(3.5) }}
                  className="font-bold tracking-wider text-center text-neutral-800"
                >
                  Registro
                </TextStyled>

                {[

                  { placeholder: "Nombre", icon: <FontAwesome6 name="circle-user" size={hp(2.5)} color="gray" />, name: "name" },
                  { placeholder: "Apellidos", icon: <FontAwesome6 name="circle-user" size={hp(2.5)} color="gray" />, name: "surname" },
                  { placeholder: "Correo Electrónico", icon: <Octicons name="mail" size={hp(2.5)} color="gray" />, name: "email" },
                  { placeholder: "Contraseña", icon: <MaterialIcons name="password" size={hp(2.5)} color="gray" />, name: "password", secureTextEntry: true },
                ].map((input, index) => (
                  <ViewStyled
                    key={index}
                    style={{ height: hp(6), paddingVertical: hp(0.8) }}
                    className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md"
                  >
                    {input.icon}
                    <TextStyledInput
                      onChangeText={(value) => handleChange(input.name, value)}
                      style={{
                        fontSize: hp(2),
                        textAlignVertical: 'center',
                        paddingVertical: 0,
                        marginTop: hp(0.3),
                      }}
                      className="flex-1 font-medium text-neutral-800"
                      placeholder={input.placeholder}
                      placeholderTextColor="#172554"
                      secureTextEntry={input.secureTextEntry}
                    />
                  </ViewStyled>
                ))}

                <ViewStyled>
                  {loading ? (
                    <ViewStyled className="flex-row justify-center">
                      <Loading size={hp(6)} />
                    </ViewStyled>
                  ) : (
                    <StyledTouchableOpacity
                      onPress={handleRegister}
                      style={{ height: hp(6) }}
                      className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md"
                    >
                      <TextStyled
                        style={{ fontSize: hp(2.2) }}
                        className="text-white font-bold tracking-wider"
                      >
                        Registrarse
                      </TextStyled>
                    </StyledTouchableOpacity>
                  )}
                </ViewStyled>

                <ViewStyled className="flex-row justify-center">
                  <TextStyled
                    style={{ fontSize: hp(1.6) }}
                    className="font-semibold bg-darkBlue"
                  >
                    ¿Ya tienes cuenta?
                  </TextStyled>
                  <PressableStyled onPress={() => router.push("signIn")}>
                    <TextStyled
                      style={{ fontSize: hp(1.6) }}
                      className="font-semibold text-violet-950 ml-2"
                    >
                      Iniciar Sesión
                    </TextStyled>
                  </PressableStyled>
                </ViewStyled>
              </ViewStyled>
            </ViewStyled>
          </ViewStyled>
        </ViewStyled>
      </ScrollView>
    </ImageBackground>
  );
};

export default withExpoSnack(SignUp);
