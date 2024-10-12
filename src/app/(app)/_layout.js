import { Stack, usePathname } from 'expo-router';
import { useSearchParams } from 'expo-router';
export default function Layout() {
  const pathname = usePathname();
  console.log("Ruta actual:", pathname);

  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: 'Inicio', headerBackVisible: false }} />
      <Stack.Screen name="padron" options={{ title: 'Padrón', headerBackVisible: true }} />
      <Stack.Screen name="cifrasPoblacion" options={{ title: 'Cifras de población y Censos demográficos', headerBackVisible: true }} />
      <Stack.Screen name="operacionesDisponibles" options={{ title: 'Operaciones Disponibles', headerBackVisible: true, }} />

      <Stack.Screen
        name="operacionesPadron"
        options={({ route }) => {
          return {
            title: route.params?.nombre || 'Detalle de Operación',
          };
        }}
      />
      <Stack.Screen
        name="perfil"
        options={({ route }) => {
          return {
            title: 'Perfil',
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
        name="fenomenosDemograficos"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasPadronContinuo"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="variacionesResidenciales"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasMigracionesCambiosResidencia"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasMatrimonios"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasNacimientos"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasDefunciones"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasAdquisiciones"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="indicadoresDemograficos"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="tablasMortalidad"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estimacionDefunciones"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />

      <Stack.Screen
        name="estadisticasMigraciones"

        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />

      <Stack.Screen
        name="residentesExtranjero"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="cifrasP"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="estadisticasContinuaPoblacion"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="proyeccionesPoblacion"
        options={({ route }) => {
          return {
            title: route.params?.nombre || '',
          };
        }}
      />
      <Stack.Screen
        name="proyeccionesHogares"
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
