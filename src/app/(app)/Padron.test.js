import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Padron from './padron';
import { useRouter } from 'expo-router';

// Mock de useRouter
jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
}));

describe('Padron Component', () => {
     const mockPush = jest.fn();

     beforeEach(() => {
          jest.clearAllMocks();

          useRouter.mockReturnValue({
               push: mockPush,
          });
     });

     it('debe renderizar el componente correctamente', async () => {
          const { getByText } = render(<Padron />);

          await waitFor(() => {
               expect(getByText('Operaciones Estadísticas sobre el Padrón')).toBeTruthy();
          });
     });

     it('debe mostrar el estado de carga inicialmente', () => {
          const { getByText } = render(<Padron />);
          expect(getByText('Cargando...')).toBeTruthy();
     });

     it('debe cargar y mostrar las operaciones estadísticas después de la carga', async () => {
          const { getByText } = render(<Padron />);

          await waitFor(() => {
               expect(getByText('Operaciones estadísticas sin periodicidad establecida')).toBeTruthy();
               expect(getByText('Operaciones estadísticas elaboradas de forma periódica')).toBeTruthy();
          });
     });

     it('debe navegar a la pantalla correspondiente al presionar una operación estadística', async () => {
          const { getByText } = render(<Padron />);


          await waitFor(() => {
               expect(getByText('Operaciones estadísticas sin periodicidad establecida')).toBeTruthy();
          });

          const operationButton = getByText('Nombre de la Operación 1');
          fireEvent.press(operationButton);

          expect(mockPush).toHaveBeenCalledWith({
               pathname: 'estadisticasPadronContinuo', // Reemplaza con la ruta correcta
               params: { id: expect.any(Number), nombre: 'Nombre de la Operación 1' },
          });
     });

     it('debe manejar correctamente el estado de error en caso de falla en la carga de datos', async () => {
          // Simular un error en la carga de datos
          global.fetch = jest.fn(() =>
               Promise.reject(new Error('Error al obtener datos'))
          );

          const { getByText } = render(<Padron />);

          await waitFor(() => {

               expect(getByText('Error al cargar los datos')).toBeTruthy();
          });
     });
});
