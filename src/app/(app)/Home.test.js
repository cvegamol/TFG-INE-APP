import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Home from './home';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'expo-router';

// Mock de useAuth
jest.mock('../../context/authContext', () => ({
     useAuth: jest.fn(),
}));

// Mock de useRouter
jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
}));

describe('Home Component', () => {
     const mockPush = jest.fn();

     beforeEach(() => {
          jest.clearAllMocks();

          // Configuración del mock para el router y useAuth
          useRouter.mockReturnValue({
               push: mockPush,
          });

          useAuth.mockReturnValue({
               rol: 'admin',
          });
     });


     it('debe navegar a la pantalla del padrón al presionar el botón Padrón', async () => {
          const { getByText } = render(<Home />);

          await waitFor(() => {
               fireEvent.press(getByText('Padrón'));
          });

          expect(mockPush).toHaveBeenCalledWith('padron');
     });
     it('debe navegar a la pantalla del padrón al presionar el botón Padrón', async () => {
          const { getByText } = render(<Home />);

          // Esperar a que el botón de Padrón esté disponible después de la carga
          const padronButton = await waitFor(() => getByText('Padrón'));

          fireEvent.press(padronButton);
          expect(mockPush).toHaveBeenCalledWith('padron');
     });

     it('debe navegar a la pantalla de Fenómenos Demográficos al presionar el botón Fenómenos Demográficos', async () => {
          const { getByText } = render(<Home />);

          // Esperar a que el botón de Fenómenos Demográficos esté disponible después de la carga
          const fenomenosButton = await waitFor(() => getByText('Fenómenos Demográficos'));

          fireEvent.press(fenomenosButton);
          expect(mockPush).toHaveBeenCalledWith('fenomenosDemograficos');
     });

     it('debe navegar a la pantalla de Cifras de Población al presionar el botón Cifras de Población', async () => {
          const { getByText } = render(<Home />);

          // Esperar a que el botón de Cifras de Población esté disponible después de la carga
          const cifrasButton = await waitFor(() => getByText('Cifras de Población'));

          fireEvent.press(cifrasButton);
          expect(mockPush).toHaveBeenCalledWith('cifrasPoblacion');
     });

     it('debe mostrar la opción de Gestión de Usuarios para admin', async () => {
          const { getByText } = render(<Home />);

          await waitFor(() => {
               expect(getByText('Gestión de Usuarios')).toBeTruthy();
          });
     });

     it('debe mostrar el gráfico de datos después de la carga', async () => {
          const { getByText } = render(<Home />);

          await waitFor(() => {
               expect(getByText('Últimos Datos: Estadística Continua de Población: jul 2024')).toBeTruthy();
          }, { timeout: 3000 });
     });

     it('debe manejar el cambio de celdas y actualizar el gráfico', async () => {
          const { getByText } = render(<Home />);

          await waitFor(() => {
               fireEvent.press(getByText('Valor'));
          });

          await waitFor(() => {
               expect(getByText('Últimos Datos: Estadística Continua de Población: jul 2024')).toBeTruthy();
          }, { timeout: 3000 });
     });
});
