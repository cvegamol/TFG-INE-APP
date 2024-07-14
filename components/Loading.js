import React from 'react';
import { View } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';

export default function Loading({ size }) {
  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <AnimatedLottieView
        style={{ flex: 1 }}
        source={require('../assets/images/animations/load.json')}
        autoPlay
        loop
      />
    </View>
  );
}
