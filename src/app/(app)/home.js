import React, { useEffect } from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text, Button } from 'react-native';
import { styled } from 'nativewind';

import Plantilla from '../../components/Plantilla';

const ViewStyled = styled(View);
const TextStyled = styled(Text);
const ButtonStyled = styled(Button);

const Home = () => {
  

  useEffect(() => {
    const obtenerEscalas = async () => {
      try {
        const response = await fetch('http://192.168.1.13:3000/escalas');
        const jsonData = await response.json();
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
       
      } catch (error) {
        console.error(error.message);
      }
    };

    obtenerEscalas();
  }, []);

  return (
    <Plantilla>
      <ViewStyled className='bg-red flex-1'>
        <TextStyled className='text-white'>Esta es una passaágina de ejemplo</TextStyled>
      </ViewStyled>
      
    </Plantilla>
  );
};

export default withExpoSnack(Home);
