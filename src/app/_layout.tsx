import { useEffect, useRef } from 'react';
import { Appearance } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { UnistylesRuntime } from 'react-native-unistyles';
import { Rubik_900Black, Rubik_700Bold } from '@expo-google-fonts/rubik';
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DatabaseProvider } from '@/context/DatabaseContext';

export default function RootLayout() {
    const initialized = useRef(false);
    if (!initialized.current) {
        const scheme = Appearance.getColorScheme();
        const theme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
        console.log('[Theme] RootLayout initial setTheme:', theme);
        UnistylesRuntime.setTheme(theme);
        initialized.current = true;
    }

    const [fontsLoaded] = useFonts({
        Rubik_900Black,
        Rubik_700Bold,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <DatabaseProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </DatabaseProvider>
    );
}
