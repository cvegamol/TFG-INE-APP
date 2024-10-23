import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DatosSeries from './datosPadron'; // Cambia la ruta según sea necesario
import * as expoPrint from 'expo-print';
import * as sharing from 'expo-sharing';
import { fetch } from 'jest-fetch-mock';

// Mock de los módulos de terceros
jest.mock('expo-print', () => ({
     printToFileAsync: jest.fn(),
}));
jest.mock('expo-sharing', () => ({
     shareAsync: jest.fn(),
}));
jest.mock('expo-router', () => ({
     useLocalSearchParams: jest.fn(() => ({
          tabla: JSON.stringify({ Id: 1, Nombre: 'Tabla Mock' }),
          series: JSON.stringify([{ Id: '1', FK_Unidad: 'unidadMock' }]),
          periodicidades: JSON.stringify({}),
          valores: JSON.stringify({}),
     })),
}));

describe('DatosSeries Component', () => {
     beforeEach(() => {
          fetch.resetMocks();
     });

     it('debe renderizar correctamente el nombre de la tabla', () => {
          const { getByText } = render(<DatosSeries />);
          expect(getByText('Tabla Mock')).toBeTruthy();
     });

     it('debe mostrar el mensaje "Cargando..." mientras los datos están cargando', () => {
          const { getByText } = render(<DatosSeries />);
          expect(getByText('Cargando...')).toBeTruthy();
     });

     it('debe renderizar correctamente las variables después de cargarlas', async () => {
          fetch.mockResponseOnce(JSON.stringify([{ Id: '1', Nombre: 'Variable 1' }]));
          const { findByText } = render(<DatosSeries />);

          // Espera a que la variable cargue
          const variableElement = await findByText('Variable 1');
          expect(variableElement).toBeTruthy();
     });

     it('debe alternar entre la vista de tabla y gráfico', async () => {
          const { getByText } = render(<DatosSeries />);

          // Inicialmente, debe estar en la vista de tabla
          expect(getByText('Tabla')).toBeTruthy();

          // Cambia a la vista de gráfico
          fireEvent.press(getByText('Gráfico'));

          // Verifica que se muestra la opción de Gráfico
          expect(getByText('Gráfico')).toBeTruthy();
     });

     it('debe manejar la selección de variables y períodos', async () => {
          fetch.mockResponseOnce(JSON.stringify([{ Id: '1', Nombre: 'Variable 1' }]));
          const { findByText, getByText } = render(<DatosSeries />);

          const variableElement = await findByText('Variable 1');
          fireEvent.press(variableElement);

          expect(getByText('Variable 1')).toBeTruthy();
     });

     it('debe generar y compartir el archivo PDF correctamente', async () => {
          expoPrint.printToFileAsync.mockResolvedValueOnce({ uri: 'mock-uri' });
          sharing.shareAsync.mockResolvedValueOnce();

          const { getByText } = render(<DatosSeries />);

          const shareButton = getByText('Compartir');
          fireEvent.press(shareButton);

          await waitFor(() => {
               expect(expoPrint.printToFileAsync).toHaveBeenCalled();
               expect(sharing.shareAsync).toHaveBeenCalledWith('mock-uri', expect.any(Object));
          });
     });
});
