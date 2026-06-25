import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOnboardingGuard } from '@/features/onboarding/guards/useOnboardingGuard';
import { useApplyThemePreference } from '@/features/settings/hooks/useApplyThemePreference';
import { useAppTheme } from '@/lib/useAppTheme';

export default function TabLayout() {
    useOnboardingGuard();
    useApplyThemePreference();
    const theme = useAppTheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textTertiary,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Perfil',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="run"
                options={{
                    title: 'Correr',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'map' : 'map-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'settings' : 'settings-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
