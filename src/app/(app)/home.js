import React, { useEffect } from 'react';
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

  

  useEffect(() => {
    const obtenerEscalas= async () => {
      try {
        // Realizar la solicitud al servidor para obtener los detalles del producto con el ID proporcionado
        
        const response = await fetch('http://192.168.1.13:3000/escalas');
        const jsonData = await response.json();
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del producto");
        }
        console.log(jsonData);
      } catch (error) {
        console.error(error.message);
        // Puedes manejar el error de alguna manera, por ejemplo, mostrando un mensaje al usuario
      }
    };

    // Llamar a la función para obtener los detalles del producto al cargar el componente
    obtenerEscalas();
  });
  

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
