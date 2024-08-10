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
  ImageBackground,
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
  const { login } = useAuth()
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
    
    const response = await login(email, password);

    setLoading(false);
    if (!response.success) {
      Alert.alert('Sign in', response.msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require('../assets/images/login/back-login.png')}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: wp(5) }}  
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <ViewStyled className="flex-1 justify-center items-center">
            <ViewStyled className="bg-white/30 rounded-2xl p-6 mx-auto w-full max-w-md backdrop-blur-xl border-2 border-white ">
              <StatusBar style="dark" />
              <ViewStyled className="flex-1 justify-center space-y-6">


                <ViewStyled className="space-y-6 mx-auto w-full max-w-md">
                  <TextStyled
                    style={{ fontSize: hp(3.5) }}
                    className="font-bold tracking-wider text-center text-neutral-800"
                  >
                    Iniciar Sesión
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
                      placeholderTextColor="#172554"
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
                        className="flex-1 font-medium "
                        placeholder="Contraseña"
                        placeholderTextColor="#172554"
                        secureTextEntry
                      />
                    </ViewStyled>
                    <TextStyled
                      style={{ fontSize: hp(1.6) }}
                      className="font-semibold text-right bg-darkBlue"
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
                        className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md"
                      >
                        <TextStyled
                          style={{ fontSize: hp(2.2) }}
                          className="text-white font-bold tracking-wider"
                        >
                          Iniciar Sesión
                        </TextStyled>
                      </StyledTouchableOpacity>
                    )}
                  </ViewStyled>

                  {/* Sign up text */}
                  <ViewStyled className="flex-row justify-center">
                    <TextStyled
                      style={{ fontSize: hp(1.6) }}
                      className="font-semibold bg-darkBlue"
                    >
                      ¿No tienes cuenta?
                    </TextStyled>
                    <PressableStyled onPress={() => router.push("signUp")}>
                      <TextStyled
                        style={{ fontSize: hp(1.6) }}
                        className="font-semibold text-violet-950 ml-2"
                      >
                        Regístrate
                      </TextStyled>
                    </PressableStyled>
                  </ViewStyled>
                </ViewStyled>
              </ViewStyled>
            </ViewStyled>
          </ViewStyled>
        </ScrollView>
      </ImageBackground>

    </KeyboardAvoidingView>
  );
};


export default withExpoSnack(SignIn);