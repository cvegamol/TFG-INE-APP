import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CifrasPadron from './cifrasMunicipios';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Mock de useRouter y useLocalSearchParams
jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
     useLocalSearchParams: jest.fn(),
}));

// Mock de fetch para simular los datos de la API
global.fetch = jest.fn((url) => {
     if (url.includes('getOperationById')) {
          return Promise.resolve({
               json: () => Promise.resolve([{ Id: 1, Nombre: 'Cifras Población Municipios' }]),
          });
     }
     return Promise.reject(new Error('API not found'));
});

describe('CifrasPadron Component', () => {
     const mockPush = jest.fn();

     beforeEach(() => {
          jest.clearAllMocks();
          useRouter.mockReturnValue({
               push: mockPush,
          });
          useLocalSearchParams.mockReturnValue({ id: 1 });
     });

     it('debe mostrar el texto "Cifras Oficiales de Población" al cargarse', async () => {
          const { getByText } = render(<CifrasPadron />);

          await waitFor(() => {
               expect(getByText('Cifras Oficiales de Población')).toBeTruthy();
          });
     });

     it('debe mostrar un mensaje de "Cargando..." mientras los datos se están cargando', async () => {
          const { getByText } = render(<CifrasPadron />);

          expect(getByText('Cargando...')).toBeTruthy();
     });

     it('debe cargar y mostrar los datos después de la carga', async () => {
          const { getByText } = render(<CifrasPadron />);

          await waitFor(() => {
               expect(getByText('Cifras oficiales de población de los municipios')).toBeTruthy();
          });
     });

     it('debe navegar a la pantalla de "municipios" cuando se presiona el primer botón', async () => {
          const { getByText } = render(<CifrasPadron />);

          const button = await waitFor(() => getByText('Cifras oficiales de población de los municipios'));
          fireEvent.press(button);

          expect(mockPush).toHaveBeenCalledWith({
               pathname: 'municipios',
               params: { id: 1, nombre: 'Cifras Población Municipios' },
          });
     });

     it('debe navegar a la pantalla de "operacionesPadron" cuando se presiona el segundo botón', async () => {
          const { getByText } = render(<CifrasPadron />);

          const button = await waitFor(() => getByText('Tablas de las Cifras oficiales de población'));
          fireEvent.press(button);

          expect(mockPush).toHaveBeenCalledWith({
               pathname: 'operacionesPadron',
               params: { id: 1, nombre: 'Cifras Población Municipios' },
          });
     });


});
