import React from "react";
import { withExpoSnack } from "nativewind";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { FontAwesome6 } from "@expo/vector-icons";

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ImageStyled = styled(Image);
const TouchableOpacityStyled = styled(TouchableOpacity);

const HomeHeader = () => {
  const openSidebar = () => {
    // Lógica para abrir la sidebar
    console.log("Sidebar abierta");
  };
  return (
    <ViewStyled className="flex-row items-center justify-between p-4 bg-primary w-full">
      <TouchableOpacityStyled
        className="p-2"
        onPress={openSidebar}
      ></TouchableOpacityStyled>
      <TextStyled className="text-textPrimary text-lg font-bold md:text-xl">
        DEMOGRAFÍA ESPAÑA
      </TextStyled>
      <ImageStyled
        source={require("../assets/images/logo/logo.png")} // Reemplaza con la URL de tu logo
        className="w-8 h-8 md:w-10 md:h-10"
      />
    </ViewStyled>
  );
};

export default withExpoSnack(HomeHeader);
