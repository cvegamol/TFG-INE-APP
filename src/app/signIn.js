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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Loading from "../components/Loading";
import { useAuth } from "../context/authContext";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TextStyledInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const PressableStyled = styled(Pressable);

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const {login} =useAuth()
  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async () => {
    const { email, password } = form;
    if (!email || !password) {
      Alert.alert("Login", "Por favor rellena los campos.");
      return;
    }
    setLoading(true);
    // Handle the login logic here
    const response = await login(email,password);

    setLoading(false);
    if(!response.success){
      Alert.alert('Sign in',response.msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ViewStyled className="flex-1 bg-white p-4">
          <StatusBar style="dark" />
          <ViewStyled className="flex-1 justify-center space-y-6">
            <ViewStyled className="items-center">
              <Image
                style={{ height: hp(25), width: wp(70) }}
                resizeMode="contain"
                source={require("../assets/images/login/login.png")}
              />
            </ViewStyled>

            <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
              <TextStyled
                style={{ fontSize: hp(3.5) }}
                className="font-bold tracking-wider text-center text-neutral-800"
              >
                Login
              </TextStyled>

              <ViewStyled
                style={{ height: hp(6), paddingVertical: hp(0.8) }}
                className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md"
              >
                <Octicons name="mail" size={hp(2.5)} color="gray" />
                <TextStyledInput
                  onChangeText={(value) => handleChange("email", value)}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-medium text-neutral-800"
                  placeholder="Correo Electrónico"
                  placeholderTextColor="gray"
                />
              </ViewStyled>

              <ViewStyled className="space-y-2">
                <ViewStyled
                  style={{ height: hp(6), paddingVertical: hp(0.8) }}
                  className="flex-row gap-3 px-4 bg-gray-200 items-center rounded-2xl mx-auto w-full max-w-md"
                >
                  <MaterialIcons name="password" size={hp(2.5)} color="gray" />
                  <TextStyledInput
                    onChangeText={(value) => handleChange("password", value)}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-medium text-neutral-800"
                    placeholder="Contraseña"
                    placeholderTextColor="gray"
                    secureTextEntry
                  />
                </ViewStyled>
                <TextStyled
                  style={{ fontSize: hp(1.6) }}
                  className="font-semibold text-right text-neutral-500"
                >
                  ¿Olvidaste tu contraseña?
                </TextStyled>
              </ViewStyled>

              {/* Submit button Login */}
              <ViewStyled>
                {loading ? (
                  <ViewStyled className="flex-row justify-center">
                    <Loading size={hp(6)} />
                  </ViewStyled>
                ) : (
                  <StyledTouchableOpacity
                    onPress={handleLogin}
                    style={{ height: hp(6) }}
                    className="bg-indigo-600 rounded-xl justify-center items-center mx-auto w-full max-w-md"
                  >
                    <TextStyled
                      style={{ fontSize: hp(2.2) }}
                      className="text-white font-bold tracking-wider"
                    >
                      Login
                    </TextStyled>
                  </StyledTouchableOpacity>
                )}
              </ViewStyled>

              {/* Sign up text */}
              <ViewStyled className="flex-row justify-center">
                <TextStyled
                  style={{ fontSize: hp(1.6) }}
                  className="font-semibold text-neutral-500"
                >
                  ¿No tienes cuenta?
                </TextStyled>
                <PressableStyled onPress={() => router.push("signUp")}>
                  <TextStyled
                    style={{ fontSize: hp(1.6) }}
                    className="font-semibold text-indigo-600 ml-2"
                  >
                    Regístrate
                  </TextStyled>
                </PressableStyled>
              </ViewStyled>
            </ViewStyled>
          </ViewStyled>
        </ViewStyled>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withExpoSnack(SignIn);