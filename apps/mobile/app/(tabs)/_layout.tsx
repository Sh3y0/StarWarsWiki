import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import { CATEGORY_UI } from '@/constants/categories';
import type { CatalogCategory } from '@/types/catalog';

const TAB_ICONS = {
  people: { on: 'people', off: 'people-outline' },
  film: { on: 'film', off: 'film-outline' },
  rocket: { on: 'rocket', off: 'rocket-outline' },
  car: { on: 'car', off: 'car-outline' },
  planet: { on: 'planet', off: 'planet-outline' },
} as const;

const TAB_SCREENS: { name: `${CatalogCategory}/index`; category: CatalogCategory }[] = [
  { name: 'characters/index', category: 'characters' },
  { name: 'films/index', category: 'films' },
  { name: 'starships/index', category: 'starships' },
  { name: 'vehicles/index', category: 'vehicles' },
  { name: 'planets/index', category: 'planets' },
];

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { letterSpacing: 1.2, fontWeight: '700' },
        headerTitle: 'STAR WARS EXPLORER',
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.accentCyan,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {TAB_SCREENS.map(({ name, category }) => {
        const ui = CATEGORY_UI[category];
        return (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              tabBarLabel: ui.tabLabel,
              tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                  name={focused ? TAB_ICONS[ui.tabIcon].on : TAB_ICONS[ui.tabIcon].off}
                  size={size}
                  color={color}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
