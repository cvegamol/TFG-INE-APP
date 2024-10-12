import React, { useRef, useState, useEffect } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { styled } from 'nativewind';
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const TouchableOpacityStyled = styled(TouchableOpacity);

const Sidebar = ({ toggleSidebar }) => {
  const { logout, rol } = useAuth();
  const router = useRouter();
  const [sidebarAnim] = useState(new Animated.Value(-250)); // Posición inicial fuera de pantalla
  const [buttonScale] = useState(new Animated.Value(1)); // Escala inicial de los botones

  useEffect(() => {
    // Animación de entrada del sidebarç
    console.log("Usuario rol", rol)
    Animated.spring(sidebarAnim, {
      toValue: 0, // Posición dentro de la pantalla
      useNativeDriver: true,
    }).start();
  }, []);

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
          Animated.timing(sidebarAnim, {
            toValue: -250, // Oculta el sidebar
            duration: 300,
            useNativeDriver: true,
          }).start(() => toggleSidebar());
        }
      },
    })
  ).current;

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 1.1, // Escala ligeramente mayor al hacer presión
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1, // Vuelve a la escala original
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      className="w-64 h-full bg-teal-700 pt-12 pl-4 flex justify-between"
      style={{ transform: [{ translateX: sidebarAnim }] }} // Sidebar se desliza desde la izquierda
      {...panResponder.panHandlers}
    >
      <View className="flex-1">
        <TouchableOpacityStyled
          onPress={() => router.replace('home')}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }} // Animación de escala en botones
          >
            Home
          </Animated.Text>
        </TouchableOpacityStyled>
        <TouchableOpacityStyled
          onPress={() => {
            router.push('home');  // Siempre ir al home primero
            setTimeout(() => {
              router.push('padron');  // Después ir al padrón (o a la pantalla deseada)
            }, 100);  // Un pequeño retraso para asegurarse de que el home se renderice antes de la siguiente navegación
          }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }}
          >
            Padrón
          </Animated.Text>
        </TouchableOpacityStyled>

        <TouchableOpacityStyled
          onPress={() => {
            router.push('home');  // Primero ir al home
            setTimeout(() => {
              router.push('cifrasPoblacion');  // Después ir a Cifras de población
            }, 100);  // Retraso mínimo para asegurar la navegación
          }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }}
          >
            Cifras de población y Censos demográficos
          </Animated.Text>
        </TouchableOpacityStyled>

        <TouchableOpacityStyled
          onPress={() => {
            router.push('home');  // Navegar primero a home
            setTimeout(() => {
              router.push('fenomenosDemograficos');  // Después ir a Fenómenos Demográficos
            }, 100);  // Retraso mínimo para asegurar la navegación
          }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }}
          >
            Fenomenos Demograficos
          </Animated.Text>
        </TouchableOpacityStyled>

        {rol === 'admin' && (
          <TouchableOpacityStyled
            onPress={() => {
              router.push('home');  // Navegar primero a home
              setTimeout(() => {
                router.push('gestionUsuarios'); // Después ir a Perfil
              }, 100);  // Retraso mínimo para asegurar la navegación
            }}

            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Animated.Text
              className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
              style={{ transform: [{ scale: buttonScale }] }}
            >
              Gestión de Usuarios
            </Animated.Text>
          </TouchableOpacityStyled>
        )}


        <TouchableOpacityStyled
          onPress={() => {
            router.push('home');  // Navegar primero a home
            setTimeout(() => {
              router.push('perfil');  // Después ir a Perfil
            }, 100);  // Retraso mínimo para asegurar la navegación
          }}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-teal-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }}
          >
            Perfil
          </Animated.Text>
        </TouchableOpacityStyled>
      </View>

      {/* SignOut abajo a la izquierda */}
      <View className="mb-6">
        <TouchableOpacityStyled
          onPress={handleLogOut}
          onPressIn={handleButtonPressIn}
          onPressOut={handleButtonPressOut}
        >
          <Animated.Text
            className="text-lg text-white my-2 hover:bg-red-600 p-2 rounded transition-all duration-200 ease-in-out"
            style={{ transform: [{ scale: buttonScale }] }}
          >
            SignOut
          </Animated.Text>
        </TouchableOpacityStyled>


      </View>
    </Animated.View>
  );
};

export default withExpoSnack(Sidebar);
