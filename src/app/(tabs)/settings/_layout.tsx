import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function SettingsLayout() {
    const { theme } = useUnistyles();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerTitleStyle: theme.typography.presets.h3,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Ajustes' }} />
        </Stack>
    );
}
