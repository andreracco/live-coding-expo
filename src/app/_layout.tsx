import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { EntriesProvider } from '../context/EntriesContext';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <EntriesProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Log', tabBarIcon: () => <Text>📋</Text> }}
        />
        <Tabs.Screen
          name="analysis"
          options={{ title: 'Analysis', tabBarIcon: () => <Text>📈</Text> }}
        />
      </Tabs>
    </EntriesProvider>
  );
}
