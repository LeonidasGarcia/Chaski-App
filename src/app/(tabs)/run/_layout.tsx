import { Stack } from 'expo-router';
import { useAppTheme } from '@/lib/useAppTheme';

export default function RunLayout() {
    const theme = useAppTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerTitleStyle: theme.typography.presets.h3,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Correr' }} />
        </Stack>
    );
}
