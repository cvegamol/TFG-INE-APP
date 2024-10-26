import { Stack, usePathname } from 'expo-router';

export default function Layout() {
  const pathname = usePathname();
  console.log("Ruta actual:", pathname);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#065f5b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },

      }}
    >
      <Stack.Screen
        name="home"
        options={{
          title: 'Inicio',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'left',
          headerTitleContainerStyle: {
            marginLeft: 60,
          },
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="padron" options={{ title: 'Padrón' }} />
      <Stack.Screen name="cifrasPoblacion" options={{ title: 'Cifras de población y Censos demográficos' }} />
      <Stack.Screen name="operacionesDisponibles" options={{ title: 'Operaciones Disponibles' }} />

      <Stack.Screen
        name="operacionesPadron"
        options={({ route }) => ({
          title: route.params?.nombre || 'Detalle de Operación',
        })}
      />
      <Stack.Screen
        name="perfil"
        options={{
          title: 'Perfil',
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: 'Cambiar Contraseña',
        }}
      />
      <Stack.Screen
        name="gestionUsuarios"
        options={{
          title: 'Gestión de Usuarios',
        }}
      />
      <Stack.Screen
        name="cifrasMunicipios"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="fenomenosDemograficos"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasPadronContinuo"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="variacionesResidenciales"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasMigracionesCambiosResidencia"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasMatrimonios"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasNacimientos"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasDefunciones"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasAdquisiciones"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="indicadoresDemograficos"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="tablasMortalidad"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estimacionDefunciones"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasMigraciones"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="residentesExtranjero"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="cifrasP"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="estadisticasContinuaPoblacion"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="proyeccionesPoblacion"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="proyeccionesHogares"
        options={({ route }) => ({
          title: route.params?.nombre || '',
        })}
      />
      <Stack.Screen
        name="municipios"
        options={{
          title: 'Ciudades de España',
        }}
      />
      <Stack.Screen
        name="seriesPadron"
        options={{
          title: 'Variables y Periodicidades',
        }}
      />
      <Stack.Screen
        name="datosPadron"
        options={{ title: 'Tablas y Gráficas ' }}
      />
      <Stack.Screen
        name="verMas/[userId]"
        options={{ title: 'Ver más detalles' }}
      />
      <Stack.Screen
        name="modificar/[userId]"
        options={{ title: 'Modificar Usuario' }}
      />
      <Stack.Screen
        name="addUsuario"
        options={{ title: 'Añadir Usuario' }}
      />
      <Stack.Screen
        name="informesUsuarios"
        options={{ title: 'Informes de la Aplicación' }}
      />
    </Stack>
  );
}
