import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import OperacionesPadron from './operacionesPadron';
import fetchMock from 'jest-fetch-mock';
import { useRouter, useLocalSearchParams } from 'expo-router';

fetchMock.enableMocks();

jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
     useLocalSearchParams: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('OperacionesPadron Component', () => {
     beforeEach(() => {
          fetch.resetMocks();
          useRouter.mockReturnValue({ push: jest.fn() });
          useLocalSearchParams.mockReturnValue({ id: '1', nombre: 'Operación Mock' });
     });

     it('debe mostrar el texto "Operación" con el nombre correcto', async () => {
          const { getByText } = render(<OperacionesPadron />);

          await waitFor(() => {
               expect(getByText('Operación: Operación Mock')).toBeTruthy();
          });
     });

     it('debe mostrar el mensaje "Cargando..." mientras los datos se están cargando', () => {
          const { getByText } = render(<OperacionesPadron />);

          expect(getByText('Cargando...')).toBeTruthy();
     });

     it('debe cargar y mostrar las tablas disponibles después de la carga', async () => {
          const tablasMock = [
               { Nombre: 'Tabla 1', Id: '1' },
               { Nombre: 'Tabla 2', Id: '2' },
          ];

          fetch.mockResponses(
               [JSON.stringify([]), { status: 200 }],
               [JSON.stringify(tablasMock), { status: 200 }]
          );

          const { getByText } = render(<OperacionesPadron />);

          await act(async () => {
               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(getByText('Tabla 2')).toBeTruthy();
               });
          });
     });

     it('debe filtrar las tablas cuando se ingresa texto en el campo de búsqueda', async () => {
          const tablasMock = [
               { Nombre: 'Tabla 1', Id: '1' },
               { Nombre: 'Tabla 2', Id: '2' },
          ];

          fetch.mockResponses(
               [JSON.stringify([]), { status: 200 }], // Mock de series vacío
               [JSON.stringify(tablasMock), { status: 200 }] // Mock de tablas
          );

          const { getByPlaceholderText, getByText } = render(<OperacionesPadron />);

          await act(async () => {
               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(getByText('Tabla 2')).toBeTruthy();
               });

               fireEvent.changeText(getByPlaceholderText('Buscar tabla...'), 'Tabla 1');

               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(() => getByText('Tabla 2')).toThrow('Unable to find an element with text: Tabla 2');
               });
          });
     });

     it('debe limpiar el texto de búsqueda y mostrar todas las tablas cuando se presiona el botón de cancelar', async () => {
          const tablasMock = [
               { Nombre: 'Tabla 1', Id: '1' },
               { Nombre: 'Tabla 2', Id: '2' },
          ];

          fetch.mockResponses(
               [JSON.stringify([]), { status: 200 }], // Mock de series vacío
               [JSON.stringify(tablasMock), { status: 200 }] // Mock de tablas
          );

          const { getByPlaceholderText, getByText, getByTestId } = render(<OperacionesPadron />);

          await act(async () => {
               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(getByText('Tabla 2')).toBeTruthy();
               });

               fireEvent.changeText(getByPlaceholderText('Buscar tabla...'), 'Tabla 1');

               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(() => getByText('Tabla 2')).toThrow('Unable to find an element with text: Tabla 2');
               });

               const cancelButton = getByTestId('clear-search-button');
               fireEvent.press(cancelButton);

               await waitFor(() => {
                    expect(getByText('Tabla 1')).toBeTruthy();
                    expect(getByText('Tabla 2')).toBeTruthy();
               });
          });
     });
});
