// Sidebar.js
import React, { useRef } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, TouchableOpacity, PanResponder } from 'react-native';
import { styled } from 'nativewind';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const Sidebar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    await logout();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && gestureState.dx < 0;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          toggleSidebar();
        }
      },
    })
  ).current;

  return (
    <ViewStyled className="w-64 h-full bg-primary pt-12 pl-4" {...panResponder.panHandlers}>
      <TouchableOpacityStyled onPress={() => router.replace('home')}>
        <TextStyled className="text-lg my-2">Home</TextStyled>
      </TouchableOpacityStyled>
      <TouchableOpacityStyled onPress={() => router.replace('padron')}>
        <TextStyled className="text-lg my-2">Padron</TextStyled>
      </TouchableOpacityStyled>
      <TouchableOpacityStyled onPress={handleLogOut}>
        <TextStyled className="text-lg my-2">SignOut</TextStyled>
      </TouchableOpacityStyled>
    </ViewStyled>
  );
};

export default withExpoSnack(Sidebar);
