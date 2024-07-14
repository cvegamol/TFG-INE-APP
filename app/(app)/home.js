import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, Button } from 'react-native';

import { styled } from 'nativewind';
import { useAuth } from '../../context/authContext';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ButtonStyled = styled(Button)

const home=() => {
  const {logout} = useAuth()

  const hadleLogOut =async ()=>{
    await logout();
  }

  return (
    <ViewStyled className='flex-1'>
        <TextStyled className="text-slate-800">
         Home 
        </TextStyled>
        <ButtonStyled title="SignOut" onPress={hadleLogOut} />
    </ViewStyled>
  )
}

export default withExpoSnack(home);
