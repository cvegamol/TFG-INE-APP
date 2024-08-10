import React from "react";
import { withExpoSnack } from "nativewind";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { styled } from "nativewind";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const Welcome = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/login/backgroundInicio.png')}
        resizeMode="cover"
        style={{ flex: 1, justifyContent: 'center', paddingHorizontal: wp(5) }} 
      >
        <ViewStyled className="items-center mb-8 px-4">
          <TextStyled className="text-4xl text-black font-bold mb-4 text-center break-all">
            Datos Demográficos de España
          </TextStyled>
          <TextStyled className="text-xl text-black text-center">
            Todo lo que necesitas saber sobre la población española.
          </TextStyled>
        </ViewStyled>

        <ViewStyled className="space-y-4">
          <StyledTouchableOpacity
            onPress={() => router.push("signIn")}
            style={{ height: hp(6) }}
            className="bg-stone-800 rounded-xl justify-center items-center mx-auto w-full max-w-md"
            activeOpacity={0.7}
          >
            <TextStyled
              style={{ fontSize: hp(2.2) }}
              className="text-white font-bold tracking-wider"
            >
              Iniciar Sesión
            </TextStyled>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            onPress={() => router.push("signUp")}
            style={{ height: hp(6) }}
            className="bg-violet-950 text-white rounded-xl justify-center items-center mx-auto w-full max-w-md"
            activeOpacity={0.7}
          >
            <TextStyled
              style={{ fontSize: hp(2.2) }}
              className="text-white  font-bold tracking-wider"
            >
              Registrarse
            </TextStyled>
          </StyledTouchableOpacity>
        </ViewStyled>
      </ImageBackground>
    </View>
  );
};

export default withExpoSnack(Welcome);
