import { Stack } from 'expo-router';
import { useUnistyles } from 'react-native-unistyles';

export default function ProfileLayout() {
    const { theme } = useUnistyles();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: theme.colors.background },
                headerTintColor: theme.colors.text,
                headerTitleStyle: theme.typography.presets.h3,
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Perfil' }} />
            <Stack.Screen name="edit" options={{ title: 'Editar perfil' }} />
        </Stack>
    );
}
