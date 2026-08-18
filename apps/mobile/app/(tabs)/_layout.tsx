import { Tabs } from 'expo-router';
import { useTheme } from 'styled-components/native';

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        tabBarStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.accentGold,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="characters/index" options={{ title: 'Characters' }} />
      <Tabs.Screen name="films/index" options={{ title: 'Films' }} />
      <Tabs.Screen name="starships/index" options={{ title: 'Starships' }} />
      <Tabs.Screen name="vehicles/index" options={{ title: 'Vehicles' }} />
      <Tabs.Screen name="planets/index" options={{ title: 'Planets' }} />
    </Tabs>
  );
}
