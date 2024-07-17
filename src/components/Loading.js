import React from 'react';
import { View, Text } from 'react-native';
import AnimatedLottieView from 'lottie-react-native';

export default function Loading({ size }) {
  let animationSource;

  try {
    animationSource = require('../assets/images/animations/load.json');
  } catch (error) {
    console.error("Failed to load animation:", error);
    return <Text>Error loading animation</Text>;
  }

  if (!animationSource) {
    return <Text>Animation source is undefined</Text>;
  }

  return (
    <View style={{ height: size, aspectRatio: 1 }}>
      <AnimatedLottieView
        style={{ flex: 1 }}
        source={animationSource}
        autoPlay
        loop
      />
    </View>
  );
}
