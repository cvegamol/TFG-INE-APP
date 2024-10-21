import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Padron from './padron';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
}));

global.fetch = jest.fn((url) => {
     if (url.includes('getOperationById/188')) {
          return Promise.resolve({
               json: () => Promise.resolve([{ Id: 188, Nombre: 'Estadísticas Padrón Continuo' }]),
          });
     }
     if (url.includes('getOperationById/22')) {
          return Promise.resolve({
               json: () => Promise.resolve([{ Id: 22, Nombre: 'Cifras Población Municipios' }]),
          });
     }
     return Promise.reject(new Error('API not found'));
});

describe('Padron Component', () => {
     const mockPush = jest.fn();

     beforeEach(() => {
          jest.clearAllMocks();
          useRouter.mockReturnValue({
               push: mockPush,
          });
     });

     it('debe mostrar el texto "Operaciones Estadísticas sobre el Padrón"', () => {
          const { getByText } = render(<Padron />);
          expect(getByText('Operaciones Estadísticas sobre el Padrón')).toBeTruthy();
     });

     it('debe mostrar un mensaje de "Cargando..." mientras los datos están cargando', async () => {
          const { getByText } = render(<Padron />);
          expect(getByText('Cargando...')).toBeTruthy();
     });



     it('debe mostrar las operaciones estadísticas sin periodicidad establecida', async () => {
          const { getByText } = render(<Padron />);

          await waitFor(() => {
               expect(getByText('Operaciones estadísticas sin periodicidad establecida')).toBeTruthy();
          });
     });

     it('debe mostrar las operaciones estadísticas elaboradas de forma periódica', async () => {
          const { getByText } = render(<Padron />);

          await waitFor(() => {
               expect(getByText('Operaciones estadísticas elaboradas de forma periódica')).toBeTruthy();
          });
     });
});
