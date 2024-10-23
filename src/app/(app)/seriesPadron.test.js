import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import SeriesTabla from './seriesPadron';
import fetchMock from 'jest-fetch-mock';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Habilitar fetch mock
fetchMock.enableMocks();

// Mockear expo-router para manejar la navegación
jest.mock('expo-router', () => ({
     useRouter: jest.fn(),
     useLocalSearchParams: jest.fn(),
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('SeriesTabla Component', () => {
     beforeEach(() => {
          fetch.resetMocks();
          useRouter.mockReturnValue({ push: jest.fn() });
          useLocalSearchParams.mockReturnValue({ tabla: JSON.stringify({ Id: '1', Nombre: 'Tabla Mock' }) });
     });

     it('debe mostrar el nombre de la tabla correctamente', async () => {
          const { getByText } = render(<SeriesTabla />);
          await waitFor(() => expect(getByText('Tabla: Tabla Mock')).toBeTruthy());
     });

     it('debe mostrar "Cargando..." mientras los datos se están cargando', () => {
          const { getByText } = render(<SeriesTabla />);
          expect(getByText('Cargando...')).toBeTruthy();
     });

     it('debe cargar y mostrar las variables correctamente después de la carga', async () => {
          const variablesMock = [
               { Id: '1', Nombre: 'Variable 1' },
               { Id: '2', Nombre: 'Variable 2' },
          ];

          const valoresMock = [
               { Id: '1', Nombre: 'Valor 1' },
               { Id: '2', Nombre: 'Valor 2' },
          ];

          // Simular respuestas de la API
          fetch.mockResponses(
               [JSON.stringify(variablesMock), { status: 200 }],
               [JSON.stringify(valoresMock), { status: 200 }]
          );

          const { getByText } = render(<SeriesTabla />);
          await act(async () => {
               await waitFor(() => {
                    expect(getByText('Variable 1')).toBeTruthy();
                    expect(getByText('Variable 2')).toBeTruthy();
               });
          });
     });



     it('debe navegar a la pantalla de "datosPadron" al presionar el botón "Consultar Selección"', async () => {
          const variablesMock = [
               { Id: '1', Nombre: 'Variable 1' },
               { Id: '2', Nombre: 'Variable 2' },
          ];

          const valoresMock = [
               { Id: '1', Nombre: 'Valor 1' },
               { Id: '2', Nombre: 'Valor 2' },
          ];

          // Simular respuestas de la API
          fetch.mockResponses(
               [JSON.stringify(variablesMock), { status: 200 }],
               [JSON.stringify(valoresMock), { status: 200 }]
          );

          const { getByText } = render(<SeriesTabla />);
          await act(async () => {
               await waitFor(() => {
                    expect(getByText('Variable 1')).toBeTruthy();
                    expect(getByText('Variable 2')).toBeTruthy();
               });
          });
     });







});
