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

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TextStyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const PressableStyled = styled(Pressable);

const SignUp = () => {
  const router = useRouter();
  const {register} =useAuth()
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
    if (!email || !password  || !name || !surname) {
      Alert.alert("Registro", "Por favor rellena todos los campos.");
      return;
    }
    // Handle the register logic here
    setLoading(true);
    let response = await register(email, password, name, surname);
    setLoading(false);
    console.log("got result:",response);
    if(!response.success){
      Alert.alert("Registro", response.msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ViewStyled className="flex-1 bg-white p-4">
        <StatusBar style="dark" />
        <ViewStyled className="flex-1 justify-center space-y-6">
          <ViewStyled className="items-center">
            <Image
              style={{ height: hp(25), width: wp(70) }}
              resizeMode="contain"
              source={require("../assets/images/login/register.png")}
            />
          </ViewStyled>

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
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-medium text-neutral-800"
                  placeholder={input.placeholder}
                  placeholderTextColor="gray"
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
                  className="bg-indigo-600 rounded-xl justify-center items-center mx-auto w-full max-w-md"
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
                className="font-semibold text-neutral-500"
              >
                ¿Ya tienes cuenta?
              </TextStyled>
              <PressableStyled onPress={() => router.push("signIn")}>
                <TextStyled
                  style={{ fontSize: hp(1.6) }}
                  className="font-semibold text-indigo-600 ml-2"
                >
                  Iniciar Sesión
                </TextStyled>
              </PressableStyled>
            </ViewStyled>
          </ViewStyled>
        </ViewStyled>
      </ViewStyled>
    </ScrollView>
  );
};

export default withExpoSnack(SignUp);
