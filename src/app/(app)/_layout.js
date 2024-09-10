import { Stack, usePathname } from 'expo-router';
import { useSearchParams } from 'expo-router';
export default function Layout() {
  const pathname = usePathname();
  console.log("Ruta actual:", pathname);

  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Inicio' }} />
      <Stack.Screen name="padron" options={{ title: 'Padrón' }} />
      <Stack.Screen name="cifrasPoblacion" options={{ title: 'Cifras de población y Censos demográficos' }} />
      <Stack.Screen
        name="operacionesPadron"
        options={({ route }) => {
          return {
            title: route.params?.nombre || 'Detalle de Operación',
          };
        }}
      />
      <Stack.Screen
        name="cifrasMunicipios"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="municipios"
        options={({ route }) => {
          return {
            title: 'Ciudades de Espana',
          };
        }}
      />
      <Stack.Screen
        name="seriesPadron"
        options={({ route }) => {
          return {
            title: route.params?.tabla.Nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="datosPadron"
        options={{ title: 'Datos ' }}
      />
    </Stack>
  );
}
