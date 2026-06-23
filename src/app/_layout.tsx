import { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { Rubik_900Black, Rubik_700Bold } from '@expo-google-fonts/rubik';
import {
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DatabaseProvider } from '@/context/DatabaseContext';

export default function RootLayout() {
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
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </Stack>
        </DatabaseProvider>
    );
}
