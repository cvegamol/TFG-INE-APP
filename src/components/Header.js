import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const ViewStyled = styled(View);
const TextStyled = styled(Text);

const Header = () => {
  return (
    <ViewStyled style={{ height: 64, paddingTop: 16, backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#d3d3d3', alignItems: 'center', justifyContent: 'center' }}>
      <TextStyled style={{ fontSize: 18, fontWeight: 'bold' }}>Demografía España</TextStyled>
    </ViewStyled>
  );
};

export default withExpoSnack(Header);
