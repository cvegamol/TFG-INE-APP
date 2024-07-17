import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';

import { styled } from 'nativewind';
import { ActivityIndicator } from 'react-native';

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
