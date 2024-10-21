import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignUp from './signUp'; // Asegúrate de que la ruta es correcta
import { useAuth } from '../context/authContext';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';

// Mock de useAuth
jest.mock('../context/authContext', () => ({
     useAuth: jest.fn(),
}));

// Mock de useRouter
jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
}));

describe('SignUp Component', () => {
     const mockRegister = jest.fn();
     const mockPush = jest.fn();

     beforeEach(() => {
          // Resetear los mocks antes de cada prueba
          jest.clearAllMocks();

          // Configurar los mocks
          useAuth.mockReturnValue({
               register: mockRegister,
          });

          useRouter.mockReturnValue({
               push: mockPush,
          });
     });

     it('debe renderizar correctamente', () => {
          const { getByText } = render(<SignUp />);
          expect(getByText('Registro')).toBeTruthy();
     });

     it('debe mostrar una alerta si faltan campos', () => {
          const alertSpy = jest.spyOn(Alert, 'alert');

          const { getByText } = render(<SignUp />);
          fireEvent.press(getByText('Registrarse'));

          expect(alertSpy).toHaveBeenCalledWith('Registro', 'Por favor rellena todos los campos.');
     });

     it('debe llamar a register con los datos correctos', async () => {
          mockRegister.mockResolvedValue({ success: true });

          const { getByPlaceholderText, getByText } = render(<SignUp />);

          fireEvent.changeText(getByPlaceholderText('Nombre'), 'Juan');
          fireEvent.changeText(getByPlaceholderText('Apellidos'), 'Pérez');
          fireEvent.changeText(getByPlaceholderText('Correo Electrónico'), 'juan@example.com');
          fireEvent.changeText(getByPlaceholderText('Contraseña'), '123456');

          fireEvent.press(getByText('Registrarse'));

          await waitFor(() => {
               expect(mockRegister).toHaveBeenCalledWith(
                    'juan@example.com',
                    '123456',
                    'Juan',
                    'Pérez'
               );
          });
     });

     it('debe mostrar una alerta si el registro falla', async () => {
          mockRegister.mockResolvedValue({ success: false, msg: 'Error en el registro' });
          const alertSpy = jest.spyOn(Alert, 'alert');

          const { getByPlaceholderText, getByText } = render(<SignUp />);

          fireEvent.changeText(getByPlaceholderText('Nombre'), 'Juan');
          fireEvent.changeText(getByPlaceholderText('Apellidos'), 'Pérez');
          fireEvent.changeText(getByPlaceholderText('Correo Electrónico'), 'juan@example.com');
          fireEvent.changeText(getByPlaceholderText('Contraseña'), '123456');

          fireEvent.press(getByText('Registrarse'));

          await waitFor(() => {
               expect(mockRegister).toHaveBeenCalled();
               expect(alertSpy).toHaveBeenCalledWith('Registro', 'Error en el registro');
          });
     });

     it('debe navegar a Iniciar Sesión cuando se presiona el texto', () => {
          const { getByText } = render(<SignUp />);

          fireEvent.press(getByText('Iniciar Sesión'));

          expect(mockPush).toHaveBeenCalledWith('signIn');
     });
});
