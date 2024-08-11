import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';
import { LogBox } from 'react-native';

import { styled } from 'nativewind';
import { ActivityIndicator } from 'react-native';
LogBox.ignoreLogs([
  'Warning: Failed prop type: Invalid prop `textStyle` of type `array` supplied to `Cell`, expected `object`.'
]);
const StyledView = styled(View);
const StyledText = styled(Text);

const App = () => {
    return (
      <StyledView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="gray"/>
      </StyledView>
    );
};

export default withExpoSnack(App);
