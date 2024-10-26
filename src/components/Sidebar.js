import React, { useRef, useState, useEffect } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { styled } from 'nativewind';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const Sidebar = ({ toggleSidebar }) => {
  const { logout, rol } = useAuth();
  const router = useRouter();
  const [sidebarAnim] = useState(new Animated.Value(-250));
  const [buttonScale] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.spring(sidebarAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogOut = async () => {
    await logout();
    router.push("welcome");
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) > 20 && gestureState.dx < 0,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          Animated.timing(sidebarAnim, {
            toValue: -250,
            duration: 300,
            useNativeDriver: true,
          }).start(() => toggleSidebar());
        }
      },
    })
  ).current;

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      className="w-64 h-full bg-teal-800 pt-12 pl-4 pr-4 flex justify-between"
      style={{ transform: [{ translateX: sidebarAnim }] }}
      {...panResponder.panHandlers}
    >
      <View className="flex-1">
        <TouchableOpacityStyled
          onPress={() => router.replace('home')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          className="flex-row items-center"
        >
          <Ionicons name="home-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Animated.Text className="text-base text-white my-2">Home</Animated.Text>
        </TouchableOpacityStyled>

        <TouchableOpacityStyled
          onPress={() => { router.push('home'); setTimeout(() => router.push('padron'), 100); }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          className="flex-row items-center"
        >
          <FontAwesome5 name="users" size={18} color="white" style={{ marginRight: 8 }} />
          <Animated.Text className="text-base text-white my-2">Padrón</Animated.Text>
        </TouchableOpacityStyled>

        <TouchableOpacityStyled
          onPress={() => { router.push('home'); setTimeout(() => router.push('cifrasPoblacion'), 100); }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          className="flex-row items-center"
        >
          <Ionicons name="stats-chart" size={20} color="white" style={{ marginRight: 8 }} />
          <Animated.Text className="text-base text-white my-2">Cifras de población</Animated.Text>
        </TouchableOpacityStyled>

        <TouchableOpacityStyled
          onPress={() => { router.push('home'); setTimeout(() => router.push('fenomenosDemograficos'), 100); }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          className="flex-row items-center"
        >
          <FontAwesome5 name="chart-bar" size={18} color="white" style={{ marginRight: 8 }} />
          <Animated.Text className="text-base text-white my-2">Fenómenos Demográficos</Animated.Text>
        </TouchableOpacityStyled>



        <TouchableOpacityStyled
          onPress={() => { router.push('home'); setTimeout(() => router.push('perfil'), 100); }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
          className="flex-row items-center"
        >
          <Ionicons name="person-outline" size={20} color="white" style={{ marginRight: 8 }} />
          <Animated.Text className="text-base text-white my-2">Perfil</Animated.Text>
        </TouchableOpacityStyled>

        {rol === 'admin' && (
          <TouchableOpacityStyled
            onPress={() => { router.push('home'); setTimeout(() => router.push('gestionUsuarios'), 100); }}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            className="flex-row items-center"
          >
            <Ionicons name="settings" size={20} color="white" style={{ marginRight: 8 }} />
            <Animated.Text className="text-base text-white my-2">Gestión de Usuarios</Animated.Text>
          </TouchableOpacityStyled>
        )}
      </View>



      {/* SignOut alineado a la derecha */}
      <View className="mb-6 flex items-end pr-4">
        <TouchableOpacityStyled
          onPress={handleLogOut}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Ionicons name="log-out-outline" size={28} color="white" />
        </TouchableOpacityStyled>
      </View>
    </Animated.View>
  );
};

export default withExpoSnack(Sidebar);
