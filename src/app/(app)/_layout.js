// app/(app)/_layout.js
import { Stack } from 'expo-router';

import Plantilla from '../../components/Plantilla';
export default function Layout() {
  return (
    <Stack >
      <Stack.Screen name="home" options={{ title: 'Nombre del Header' }} />
    </Stack>
  );
}
