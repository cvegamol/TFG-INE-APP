import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';

import { styled } from 'nativewind';
import { Stack } from 'expo-router';

const StyledView = styled(View);
const StyledText = styled(Text);


const _layout=() => {
  return (
   <Stack />
  )
}

export default withExpoSnack(_layout);
