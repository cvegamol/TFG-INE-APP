import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignIn from './signIn'; // Asegúrate de que la ruta es correcta
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

describe('SignIn Component', () => {
     const mockLogin = jest.fn();
     const mockPush = jest.fn();

     beforeEach(() => {
          // Resetear los mocks antes de cada prueba
          jest.clearAllMocks();

          // Configurar los mocks
          useAuth.mockReturnValue({
               login: mockLogin,
          });

          useRouter.mockReturnValue({
               push: mockPush,
          });
     });

     it('debe renderizar correctamente', () => {
          const { getByTestId } = render(<SignIn />);
          expect(getByTestId('signin-title')).toBeTruthy();
     });

     it('debe mostrar una alerta si faltan campos', () => {
          const alertSpy = jest.spyOn(Alert, 'alert');

          const { getByTestId } = render(<SignIn />);
          fireEvent.press(getByTestId('signin-button'));

          expect(alertSpy).toHaveBeenCalledWith('Login', 'Por favor rellena los campos.');
     });

     it('debe llamar a login con los datos correctos', async () => {
          mockLogin.mockResolvedValue({ success: true });

          const { getByPlaceholderText, getByTestId } = render(<SignIn />);

          fireEvent.changeText(getByPlaceholderText('Correo Electrónico'), 'test@example.com');
          fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

          fireEvent.press(getByTestId('signin-button'));

          await waitFor(() => {
               expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
          });
     });

     it('debe mostrar una alerta si el login falla', async () => {
          mockLogin.mockResolvedValue({ success: false, msg: 'Error en el login' });
          const alertSpy = jest.spyOn(Alert, 'alert');

          const { getByPlaceholderText, getByTestId } = render(<SignIn />);

          fireEvent.changeText(getByPlaceholderText('Correo Electrónico'), 'test@example.com');
          fireEvent.changeText(getByPlaceholderText('Contraseña'), 'password123');

          fireEvent.press(getByTestId('signin-button'));

          await waitFor(() => {
               expect(mockLogin).toHaveBeenCalled();
               expect(alertSpy).toHaveBeenCalledWith('Sign in', 'Error en el login');
          });
     });

     it('debe navegar a la pantalla de registro cuando se presiona "Regístrate"', () => {
          const { getByText } = render(<SignIn />);

          fireEvent.press(getByText('Regístrate'));

          expect(mockPush).toHaveBeenCalledWith('signUp');
     });

     it('debe navegar a la pantalla de recuperación de contraseña cuando se presiona "Recuperala"', () => {
          const { getByText } = render(<SignIn />);

          fireEvent.press(getByText('Recuperala'));

          expect(mockPush).toHaveBeenCalledWith('resetPassword');
     });
});
